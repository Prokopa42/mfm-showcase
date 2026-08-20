(() => {
  const DEMO_STATES = {
    history: {
      all: {
        label: 'Все операции',
        accent: '#0749a9',
        summary: '11 операций · текущий цикл',
        fields: {
          'zone-2-label': '1 июля · расход',
          'zone-2-title': 'Оплата сервера · 10 000 ₽',
          'zone-2-meta': 'Рабочий кейс «Инфраструктура»',
          'zone-3-label': 'Эффекты операции',
          'zone-3-meta': 'Всего на руках −10 000 · рабочие −2 000 · к компенсации +8 000',
          'zone-4-label': 'Составная операция · 3 связанных движения',
          'zone-4-title': 'Перенос долга · 5 000 ₽',
          'zone-4-meta': 'Одна пользовательская строка, отмена целиком',
          'zone-5-left-label': 'Итоги периода',
          'zone-5-left-title': 'Доходы 120 000 ₽',
          'zone-5-left-meta': 'Расходы 42 700 ₽',
          'zone-5-right-label': 'Действие',
          'zone-5-right-title': 'Отменить',
          'zone-5-right-meta': 'С объяснением эффекта',
        },
      },
      month: {
        label: 'Операции за 30 дней',
        accent: '#fbbd5b',
        summary: '18 операций · 30 дней',
        fields: {
          'zone-2-label': '29 июня · доход',
          'zone-2-title': 'Зарплата пришла · 100 000 ₽',
          'zone-2-meta': 'Плановая дата 3 июля · новый цикл с 29 июня',
          'zone-3-label': 'Эффекты операции',
          'zone-3-meta': 'Всего на руках +100 000 · свои деньги +100 000 · доход +100 000',
          'zone-4-label': 'Ранняя зарплата · граница цикла перенесена',
          'zone-4-title': 'Плановая дата закрыта',
          'zone-4-meta': 'Следующая зарплата считается после 3 июля',
          'zone-5-left-label': 'Итоги 30 дней',
          'zone-5-left-title': 'Доходы 220 000 ₽',
          'zone-5-left-meta': 'Расходы 61 245 ₽',
          'zone-5-right-label': 'Действие',
          'zone-5-right-title': 'Открыть',
          'zone-5-right-meta': 'Карточку дохода',
        },
      },
      cycle: {
        label: 'Операции текущего цикла',
        accent: '#0749a9',
        summary: '11 операций · текущий цикл',
        fields: {
          'zone-2-label': '1 июля · в накопления',
          'zone-2-title': 'На отпуск · 6 000 ₽',
          'zone-2-meta': 'Перевод из своих денег',
          'zone-3-label': 'Эффекты операции',
          'zone-3-meta': 'Всего на руках −6 000 · свои деньги −6 000 · накопления +6 000',
          'zone-4-label': 'Сверка дня · 2 расчётные точки',
          'zone-4-title': 'Утро и вечер',
          'zone-4-meta': 'Расчётный вечер отделён от фактического',
          'zone-5-left-label': 'Итоги цикла',
          'zone-5-left-title': 'Доходы 120 000 ₽',
          'zone-5-left-meta': 'Расходы 42 700 ₽',
          'zone-5-right-label': 'Действие',
          'zone-5-right-title': 'Отменить',
          'zone-5-right-meta': 'Перевод целиком',
        },
      },
      debts: {
        label: 'Только долговые события',
        accent: '#d63031',
        summary: '4 долговых события · текущий цикл',
        fields: {
          'zone-2-label': '29 июня · получил в долг',
          'zone-2-title': 'Получил в долг · 3 000 ₽',
          'zone-2-meta': 'Долг «Ремонт»',
          'zone-3-label': 'Эффекты операции',
          'zone-3-meta': 'Всего на руках +3 000 · долг +3 000 · свободный расход без изменений',
          'zone-4-label': 'Составная операция · 2 связанных движения',
          'zone-4-title': 'Перенос долга · 5 000 ₽',
          'zone-4-meta': 'Один долг уменьшился, другой вырос · общий долг не изменился',
          'zone-5-left-label': 'Итоги долгов',
          'zone-5-left-title': 'Новых долгов 23 000 ₽',
          'zone-5-left-meta': 'Погашено 10 000 ₽',
          'zone-5-right-label': 'Действие',
          'zone-5-right-title': 'Отменить',
          'zone-5-right-meta': 'С восстановлением связей',
        },
      },
      work: {
        label: 'Только операции с рабочими деньгами',
        accent: '#c87900',
        summary: '5 рабочих операций · текущий цикл',
        fields: {
          'zone-2-label': '1 июля · рабочий расход',
          'zone-2-title': 'Оплата сервера · 10 000 ₽',
          'zone-2-meta': 'Кейс «Инфраструктура»',
          'zone-3-label': 'Эффекты операции',
          'zone-3-meta': 'Всего на руках −10 000 · рабочие −2 000 · к компенсации +8 000',
          'zone-4-label': 'Смешанная оплата · 2 источника',
          'zone-4-title': 'Рабочие 2 000 + свои 8 000 ₽',
          'zone-4-meta': 'Одна строка в дневнике · к компенсации 8 000 ₽',
          'zone-5-left-label': 'Итоги рабочих денег',
          'zone-5-left-title': 'Получено 30 000 ₽',
          'zone-5-left-meta': 'Потрачено 12 000 ₽',
          'zone-5-right-label': 'Действие',
          'zone-5-right-title': 'Отменить',
          'zone-5-right-meta': 'С объяснением обоих источников',
        },
      },
    },
    cycle: {
      payments: {
        label: 'Платежи',
        accent: '#0749a9',
        summary: '1 авг → 21 авг · день 11 из 20',
        fields: {
          'zone-3-label': 'Свободно до зарплаты',
          'zone-3-value': '50 000 ₽',
          'zone-3-meta': 'Можно сегодня 3 800 ₽ · 10 дней',
          'zone-4-label': 'Ось зарплатного цикла',
          'zone-4-meta': 'ЗП · 1 авг / сегодня / ЗП · 21 авг',
          'zone-5-label': 'Ближайший платёж',
          'zone-5-meta': 'Аренда · 14 авг · 35 000 ₽',
        },
      },
      debts: {
        label: 'Долги',
        accent: '#d63031',
        summary: '1 авг → 21 авг · долговой контур',
        fields: {
          'zone-3-label': 'Общий долг',
          'zone-3-value': '45 000 ₽',
          'zone-3-meta': 'Обычные долги 40 000 · перед подотчётом 5 000',
          'zone-4-label': 'Тренд долга',
          'zone-4-meta': 'Снижается на 8 400 ₽ / мес. · перенос не меняет общий долг',
          'zone-5-label': 'Ближайшее погашение',
          'zone-5-meta': 'Сергей · 14 авг · 10 000 ₽',
        },
      },
      accountable: {
        label: 'Подотчёт',
        accent: '#c87900',
        summary: 'Рабочие деньги · отдельно от личного лимита',
        fields: {
          'zone-3-label': 'Рабочие деньги у меня',
          'zone-3-value': '30 000 ₽',
          'zone-3-meta': 'Не входят в личный дневной лимит',
          'zone-4-label': 'Влияние на личный цикл',
          'zone-4-meta': 'К компенсации 7 000 · должен вернуть в подотчёт 5 000',
          'zone-5-label': 'Активный кейс',
          'zone-5-meta': 'Инфраструктура · осталось 18 000 ₽',
        },
      },
    },
    work: {
      overview: {
        label: 'Обзор рабочих денег',
        accent: '#c87900',
        summary: 'Рабочие деньги не входят в личный лимит',
        meter: 60,
        fields: {
          'zone-2-left-label': 'Рабочие деньги у меня',
          'zone-2-left-value': '30 000 ₽',
          'zone-2-right-label': 'Свои деньги',
          'zone-2-right-value': '50 000 ₽',
          'zone-3-label': 'Кейсы · 2',
          'zone-3-title': 'Инфраструктура · одобрено 50 000 ₽',
          'zone-3-meta': 'Получено 30 000 · осталось 18 000',
          'zone-4-label': 'Записать операцию',
          'zone-4-meta': 'Получил · потратил · вернул · компенсировал',
          'zone-5-label': 'Влияние на личный контур',
          'zone-5-value': 'К компенсации 7 000 ₽',
          'zone-5-meta': 'Должен вернуть в подотчёт 5 000 ₽',
        },
      },
      record: {
        label: 'Записать рабочую операцию',
        accent: '#fbbd5b',
        summary: 'Новая операция · черновик',
        meter: 36,
        fields: {
          'zone-2-left-label': 'Вид операции',
          'zone-2-left-value': 'Потратил',
          'zone-2-right-label': 'Сумма',
          'zone-2-right-value': '10 000 ₽',
          'zone-3-label': 'Рабочий кейс',
          'zone-3-title': 'Инфраструктура',
          'zone-3-meta': 'Доступно 18 000 ₽',
          'zone-4-label': 'Как оплачено',
          'zone-4-meta': 'Из рабочих 2 000 · своими 8 000',
          'zone-5-label': 'Эффект после записи',
          'zone-5-value': 'К компенсации +8 000 ₽',
          'zone-5-meta': 'Рабочие −2 000 · свои −8 000',
        },
      },
      cases: {
        label: 'Рабочие кейсы',
        accent: '#0749a9',
        summary: '2 активных кейса · 75 000 ₽ одобрено',
        meter: 60,
        fields: {
          'zone-2-left-label': 'Одобрено',
          'zone-2-left-value': '75 000 ₽',
          'zone-2-right-label': 'Получено',
          'zone-2-right-value': '45 000 ₽',
          'zone-3-label': 'Инфраструктура',
          'zone-3-title': 'Одобрено 50 000 ₽',
          'zone-3-meta': 'Получено 30 000 · потрачено 12 000 · на руках 18 000',
          'zone-4-label': 'Второй кейс',
          'zone-4-meta': 'Командировка · одобрено 25 000 · получено 15 000',
          'zone-5-label': 'Незакрытые обязательства',
          'zone-5-value': 'К компенсации 7 000 ₽',
          'zone-5-meta': 'Должен вернуть в подотчёт 5 000 ₽',
        },
      },
      history: {
        label: 'История рабочих операций',
        accent: '#d63031',
        summary: '5 операций · текущий цикл',
        meter: 40,
        fields: {
          'zone-2-left-label': 'Получено',
          'zone-2-left-value': '30 000 ₽',
          'zone-2-right-label': 'Потрачено',
          'zone-2-right-value': '12 000 ₽',
          'zone-3-label': '1 июля · расход',
          'zone-3-title': 'Оплата сервера · 10 000 ₽',
          'zone-3-meta': 'Рабочие 2 000 · свои 8 000',
          'zone-4-label': 'Эффекты операции',
          'zone-4-meta': 'Рабочие −2 000 · к компенсации +8 000',
          'zone-5-label': 'Итог',
          'zone-5-value': 'На руках 18 000 ₽',
          'zone-5-meta': 'К компенсации 7 000 · должен вернуть 5 000',
        },
      },
    },
    settings: {
      cycle: {
        label: 'Настройки цикла',
        accent: '#0749a9',
        summary: 'Неприменённых правок: 3',
        danger: true,
        fields: {
          'zone-3-label': 'Расчётные параметры · черновик',
          'zone-3-meta': 'Дата зарплаты · сегодня в делителе · Подушки',
          'zone-4-left-label': 'Учётная запись',
          'zone-4-left-title': 'Вошли как Prokopa',
          'zone-4-left-meta': 'Синхронизировано',
          'zone-4-right-label': 'Ключ устройства',
          'zone-4-right-title': 'Добавить',
          'zone-4-right-meta': 'Ещё один способ входа',
          'zone-5-label': 'Данные устройства',
          'zone-5-meta': 'Экспорт JSON · импорт JSON · локальные снимки · инварианты',
          'zone-6-label': 'Опасные действия',
          'zone-6-meta': 'Старт работы · полный сброс',
        },
      },
      money: {
        label: 'Настройки денег',
        accent: '#fbbd5b',
        summary: 'Без неприменённых правок',
        danger: false,
        fields: {
          'zone-3-label': 'Расчёт личных денег',
          'zone-3-meta': 'Всего на руках · рабочие деньги · свои деньги',
          'zone-4-left-label': 'Подушка',
          'zone-4-left-title': '5 000 ₽',
          'zone-4-left-meta': 'Резерв из свободных денег',
          'zone-4-right-label': 'Дневной лимит',
          'zone-4-right-title': 'Автоматически',
          'zone-4-right-meta': 'По дням до зарплаты',
          'zone-5-label': 'Долговые параметры',
          'zone-5-meta': 'Долговое обязательство · комиссия · перенос',
          'zone-6-label': 'Диагностика',
          'zone-6-meta': 'Проверить формулы · объяснить цифры',
        },
      },
      savings: {
        label: 'Настройки накоплений',
        accent: '#0749a9',
        summary: 'Неприменённых правок: 1',
        danger: true,
        fields: {
          'zone-3-label': 'Накопления · черновик',
          'zone-3-meta': 'Копилка · цели · плановые переводы',
          'zone-4-left-label': 'Копилка',
          'zone-4-left-title': '30 000 ₽',
          'zone-4-left-meta': 'Свободный конверт',
          'zone-4-right-label': 'Цели',
          'zone-4-right-title': '1 активная',
          'zone-4-right-meta': 'Отпуск · декабрь',
          'zone-5-label': 'Распределение',
          'zone-5-meta': 'Доли по целям · нераспределённый остаток',
          'zone-6-label': 'Сброс накоплений',
          'zone-6-meta': 'Только после явного подтверждения',
        },
      },
      categories: {
        label: 'Рубрики',
        accent: '#c87900',
        summary: 'Рубрики сохраняются сразу',
        danger: true,
        fields: {
          'zone-3-label': 'Рубрики расходов',
          'zone-3-meta': 'Еда · жильё · транспорт · сервисы',
          'zone-4-left-label': 'Личные рубрики',
          'zone-4-left-title': '12',
          'zone-4-left-meta': 'Используются в личных операциях',
          'zone-4-right-label': 'Рабочие рубрики',
          'zone-4-right-title': '6',
          'zone-4-right-meta': 'Только в режиме с рабочими деньгами',
          'zone-5-label': 'Классификация',
          'zone-5-meta': 'Рубрика видна в дневнике и аналитике',
          'zone-6-label': 'Удалить рубрику',
          'zone-6-meta': 'Только после замены в связанных операциях',
        },
      },
      data: {
        label: 'Данные и учётная запись',
        accent: '#d63031',
        summary: 'Синхронизировано',
        danger: true,
        fields: {
          'zone-3-label': 'Учётная запись',
          'zone-3-meta': 'Серверная копия · последняя синхронизация · ключ устройства',
          'zone-4-left-label': 'Учётная запись',
          'zone-4-left-title': 'Вошли как Prokopa',
          'zone-4-left-meta': 'Синхронизировано',
          'zone-4-right-label': 'Ключ устройства',
          'zone-4-right-title': 'Добавить',
          'zone-4-right-meta': 'Ещё один способ входа',
          'zone-5-label': 'Данные устройства',
          'zone-5-meta': 'Экспорт JSON · импорт JSON · локальные снимки · инварианты',
          'zone-6-label': 'Опасные действия',
          'zone-6-meta': 'Старт работы · полный сброс',
        },
      },
    },
  };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const applyState = (demo, stateName, options = {}) => {
    const demoName = demo.dataset.mfmDemo;
    const state = DEMO_STATES[demoName]?.[stateName];
    if (!state) return;

    const panel = demo.querySelector('[data-mfm-demo-panel]');
    const tabs = [...demo.querySelectorAll('[data-mfm-demo-tab]')];
    const activeTab = tabs.find((tab) => tab.dataset.mfmDemoState === stateName);
    if (!panel || !activeTab) return;

    demo.dataset.mfmDemoState = stateName;
    demo.style.setProperty('--mfm-map-accent', state.accent);
    panel.setAttribute('aria-labelledby', activeTab.id);

    tabs.forEach((tab) => {
      const selected = tab === activeTab;
      tab.classList.toggle('is-current', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    const summary = demo.querySelector('[data-mfm-demo-summary]');
    if (summary) summary.textContent = state.summary;

    Object.entries(state.fields).forEach(([fieldName, value]) => {
      const field = demo.querySelector(`[data-mfm-demo-field="${fieldName}"]`);
      if (field) field.textContent = value;
    });

    const meter = demo.querySelector('[data-mfm-demo-meter]');
    if (meter && Number.isFinite(state.meter)) meter.style.width = `${state.meter}%`;

    const dangerZone = demo.querySelector('[data-mfm-demo-danger]');
    if (dangerZone) dangerZone.classList.toggle('mfm-screen-zone--danger', Boolean(state.danger));

    const announcer = demo.querySelector('[data-mfm-demo-announcer]');
    if (announcer && options.announce) announcer.textContent = `${state.label}. ${state.summary}`;

    if (!options.initial && !reducedMotion.matches) {
      panel.classList.remove('is-changing');
      window.requestAnimationFrame(() => panel.classList.add('is-changing'));
    }
  };

  document.querySelectorAll('[data-mfm-demo]').forEach((demo) => {
    const demoName = demo.dataset.mfmDemo;
    const states = DEMO_STATES[demoName];
    if (!states) return;

    const panel = demo.querySelector('[data-mfm-demo-panel]');
    const tabs = [...demo.querySelectorAll('[data-mfm-demo-tab]')];
    if (!panel || tabs.length === 0) return;

    const announcer = document.createElement('span');
    announcer.className = 'mfm-sr-only';
    announcer.dataset.mfmDemoAnnouncer = '';
    announcer.setAttribute('aria-live', 'polite');
    demo.append(announcer);

    const activateTab = (tab, options = {}) => {
      const stateName = tab.dataset.mfmDemoState;
      if (!states[stateName]) return;
      applyState(demo, stateName, { announce: true });
      if (options.focus) tab.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activateTab(tab));
      tab.addEventListener('keydown', (event) => {
        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = tabs.length - 1;
        else return;
        event.preventDefault();
        activateTab(tabs[nextIndex], { focus: true });
      });
    });

    panel.addEventListener('animationend', () => panel.classList.remove('is-changing'));

    const initialTab = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
    applyState(demo, initialTab.dataset.mfmDemoState, { initial: true });
  });
})();
