import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baseUrlArgument = process.argv.find((argument) => argument.startsWith("--base-url="));
const baseUrl = baseUrlArgument?.slice("--base-url=".length).replace(/\/+$/, "");
const failures = [];
const localTargets = new Set();
const canonicalPilotStatus =
  "Ограниченный серверный пилот до пяти изолированных учёток поддерживается; доступ выдаётся вручную после рассмотрения заявки.";
const githubRepositoryUrl = "https://github.com/Prokopa42/mfm-showcase";

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if ([".git", "node_modules"].includes(entry.name)) return [];
    const absolute = join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function projectPath(absolute) {
  return relative(root, absolute).split(sep).join("/");
}

function fail(message) {
  failures.push(message);
}

function read(projectRelativePath) {
  const absolute = join(root, projectRelativePath);
  if (!existsSync(absolute)) {
    fail(`Отсутствует обязательный файл: ${projectRelativePath}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
}

const requiredHtml = [
  "index.html",
  "access.html",
  "status.html",
  "quick-start.html",
  "troubleshooting.html",
  "docs/today.html",
  "docs/cycle.html",
  "docs/payments.html",
  "docs/debts.html",
  "docs/work-money.html",
  "docs/savings.html",
  "docs/history.html",
  "docs/settings.html",
  "docs/glossary.html",
];

const annotatedScreens = new Map([
  ["docs/today.html", { namespace: "today", zones: 10 }],
  ["docs/cycle.html", { namespace: "cycle", zones: 5 }],
  ["docs/payments.html", { namespace: "payments", zones: 6 }],
  ["docs/debts.html", { namespace: "debts", zones: 4 }],
  ["docs/work-money.html", { namespace: "work-money", zones: 5 }],
  ["docs/savings.html", { namespace: "savings", zones: 5 }],
  ["docs/history.html", { namespace: "history", zones: 5 }],
  ["docs/settings.html", { namespace: "settings", zones: 6 }],
]);

for (const required of ["DOCS_MAINTENANCE.md", "ARCHITECTURE.md", "EDITIONS_AND_STATUS.md"]) read(required);

const htmlFiles = walk(root)
  .map(projectPath)
  .filter((path) => extname(path) === ".html")
  .sort();

for (const required of requiredHtml) {
  if (!htmlFiles.includes(required)) fail(`Нет обязательной HTML-страницы: ${required}`);
}

for (const [file, contract] of annotatedScreens) {
  const source = read(file);
  if (!source.includes('../assets/annotated-screen.css')) {
    fail(`${file}: не подключён общий стиль аннотированных экранов`);
  }
  if (!source.includes('data-mfm-annotated')) {
    fail(`${file}: нет аннотированного экрана`);
  }

  const zoneIds = [...source.matchAll(/\bid="зона-(\d+)"/g)].map((match) => Number(match[1]));
  const blockIds = [...source.matchAll(/\bid="блок-(\d+)"/g)].map((match) => Number(match[1]));
  const expected = Array.from({ length: contract.zones }, (_, index) => index + 1);
  if (zoneIds.join(',') !== expected.join(',')) {
    fail(`${file}: зоны должны идти 1..${contract.zones}, получено ${zoneIds.join(',') || 'ничего'}`);
  }
  if (blockIds.join(',') !== expected.join(',')) {
    fail(`${file}: разборы должны идти 1..${contract.zones}, получено ${blockIds.join(',') || 'ничего'}`);
  }

  for (const number of expected) {
    const pair = `${contract.namespace}-${number}`;
    const occurrences = [...source.matchAll(new RegExp(`data-mfm-pair="${pair}"`, 'g'))].length;
    if (occurrences < 2) {
      fail(`${file}: пара ${pair} должна явно связывать схему и разбор`);
    }
    if (!source.includes(`href="#блок-${number}"`) || !source.includes(`href="#зона-${number}"`)) {
      fail(`${file}: у пары ${pair} нет двусторонних ссылок`);
    }
  }
}

const idsByFile = new Map();
for (const file of htmlFiles) {
  const source = read(file);
  if (!/^<!doctype html>/i.test(source.trimStart())) fail(`${file}: нет HTML doctype`);
  if (!/<html\s+lang="ru"/i.test(source)) fail(`${file}: не задан lang="ru"`);
  if (!/<meta\s+name="viewport"/i.test(source)) fail(`${file}: нет мобильного viewport`);

  const githubLinks = [...source.matchAll(/<a\b[^>]*\bdata-github-link="(header|footer)"[^>]*>/g)]
    .map((match) => ({ position: match[1], tag: match[0] }));
  for (const position of ["header", "footer"]) {
    const links = githubLinks.filter((link) => link.position === position);
    if (links.length !== 1) {
      fail(`${file}: нужна ровно одна ссылка GitHub в ${position === "header" ? "шапке" : "подвале"}, найдено ${links.length}`);
      continue;
    }
    const { tag } = links[0];
    if (!tag.includes(`href="${githubRepositoryUrl}"`)) fail(`${file}: неверный адрес GitHub в ${position}`);
    if (!tag.includes('target="_blank"') || !tag.includes('rel="noopener"')) {
      fail(`${file}: внешняя ссылка GitHub в ${position} должна безопасно открываться в новой вкладке`);
    }
  }

  const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) fail(`${file}: повторяющиеся id: ${[...new Set(duplicates)].join(", ")}`);
  idsByFile.set(file, new Set(ids));
}

function resolveLocalReference(fromFile, value) {
  if (!value || /^(?:mailto:|tel:|data:|javascript:)/i.test(value)) return null;
  const resolved = new URL(value, `https://mfm-docs.invalid/${fromFile}`);
  if (resolved.hostname !== "mfm-docs.invalid") return null;
  const pathname = decodeURIComponent(resolved.pathname).replace(/^\/+/, "") || "index.html";
  const absolute = resolve(root, pathname);
  if (absolute !== root && !absolute.startsWith(`${root}${sep}`)) {
    fail(`${fromFile}: ссылка выходит за корень витрины: ${value}`);
    return null;
  }
  return { pathname, absolute, hash: decodeURIComponent(resolved.hash.slice(1)) };
}

for (const file of htmlFiles) {
  const source = read(file);
  const references = [...source.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const value of references) {
    const target = resolveLocalReference(file, value);
    if (!target) continue;
    if (!existsSync(target.absolute)) {
      fail(`${file}: не найден локальный адрес ${value} -> ${target.pathname}`);
      continue;
    }
    localTargets.add(target.pathname);
    if (target.hash && extname(target.pathname) === ".html") {
      const targetIds = idsByFile.get(target.pathname);
      if (!targetIds?.has(target.hash)) fail(`${file}: нет якоря ${value}`);
    }
  }
}

const statusFiles = [
  "README.md",
  "ARCHITECTURE.md",
  "EDITIONS_AND_STATUS.md",
  "index.html",
  "access.html",
  "status.html",
  "docs/settings.html",
];

for (const file of statusFiles) {
  const source = read(file);
  if (!source.includes(canonicalPilotStatus)) fail(`${file}: нет канонической формулировки серверного пилота`);
  if (!/заявк[а-яё\s]{0,24}не\s+созда[её]т\s+уч[её]тк[а-яё]*\s+автоматически/iu.test(source)) {
    fail(`${file}: не сказано, что заявка не создаёт учётку автоматически`);
  }
  if (!/(не\s+вид(?:ит|ят)\s+(?:данные\s+)?друг(?:ого|их|\s+друга)|не\s+вид(?:ит|ят)\s+чужие\s+данные|никто\s+не\s+видит\s+чужие\s+данные)/iu.test(source)) {
    fail(`${file}: не закреплена изоляция данных пользователей`);
  }
}

const allPublicText = [
  ...walk(root).filter((file) => [".html", ".md"].includes(extname(file))).map((file) => readFileSync(file, "utf8")),
].join("\n");

const stalePatterns = [
  /серверный пилот личного режима готовится/iu,
  /серверн[а-яё\s-]{0,30}пилот[а-яё\s-]{0,50}(?:готовится|планируется)/iu,
  /уч[её]тн[а-яё\s-]{0,30}(?:готовится|планируется)/iu,
];
for (const pattern of stalePatterns) {
  if (pattern.test(allPublicText)) fail(`Найдена устаревшая статусная формулировка: ${pattern}`);
}

const contentRules = [
  ["status.html", /общ(?:ий|его) кабинет организации/iu, "граница общего кабинета"],
  ["status.html", /бухгалтерск(?:ая|ой) систем/iu, "граница бухгалтерской системы"],
  ["status.html", /свободн(?:ая|ой) регистрац/iu, "граница публичной регистрации"],
  ["docs/today.html", /Следующая плановая зарплата не считается доступной до фактического получения/iu, "граница ожидаемой зарплаты"],
  ["quick-start.html", /ЗАРПЛАТА ПРИШЛА РАНЬШЕ/iu, "сценарий ранней зарплаты"],
  ["docs/payments.html", /Что делать, если зарплата пришла раньше/iu, "сценарий ранней зарплаты в платежах"],
  ["docs/debts.html", /получили[\s\S]{0,80}3&nbsp;000&nbsp;₽[\s\S]{0,120}погасили[\s\S]{0,80}10&nbsp;000&nbsp;₽[\s\S]{0,80}не переплата/iu, "пример долга 3 000 / 10 000"],
  ["docs/glossary.html", /Рабочие деньги[\s\S]{0,300}разделе «Подотчёт»/iu, "терминология Подотчёта"],
  ["README.md", /Wikmiks[\s\S]{0,180}ProKopa[\s\S]{0,180}не названия режимов/iu, "статус внутренних названий"],
  ["troubleshooting.html", /«Свободно до зарплаты»[\s\S]{0,100}не уходит в минус[\s\S]{0,160}«Свободно: 0»[\s\S]{0,120}«Не хватает X ₽»/iu, "канон нехватки"],
];
for (const [file, pattern, label] of contentRules) {
  if (!pattern.test(read(file))) fail(`${file}: не подтверждено правило «${label}»`);
}

const forbiddenTrackedPatterns = [
  /(^|\/)\.env(?:\.|$)/,
  /(^|\/)node_modules\//,
  /(^|\/)(?:src|prototype|server)\//,
  /\.(?:kdbx|sqlite|db|sql|zip|tgz|gz)$/i,
];
const trackedLikeFiles = walk(root).map(projectPath);
for (const file of trackedLikeFiles) {
  if (forbiddenTrackedPatterns.some((pattern) => pattern.test(file))) {
    fail(`В витрине найден недопустимый файл приложения или данных: ${file}`);
  }
}

if (baseUrl) {
  const targets = [...new Set([...requiredHtml, ...localTargets])].sort();
  for (const target of targets) {
    const response = await fetch(`${baseUrl}/${encodeURI(target)}`, { redirect: "follow" });
    if (!response.ok) fail(`HTTP ${response.status}: ${target}`);
  }
}

if (failures.length) {
  console.error(`Проверка витрины: FAIL (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const fingerprint = createHash("sha256")
  .update(htmlFiles.map((file) => `${file}\0${read(file)}`).join("\0"))
  .digest("hex")
  .slice(0, 16);
console.log(`Проверка витрины: PASS`);
console.log(`HTML-страниц: ${htmlFiles.length}`);
console.log(`Локальных адресов: ${localTargets.size}`);
console.log(`Отпечаток HTML: ${fingerprint}`);
if (baseUrl) console.log(`HTTP-проверка: ${baseUrl}`);
