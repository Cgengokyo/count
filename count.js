(function () {
  const root = document.body;
  const countdownDiv = document.getElementById('countdown');
  const rgbDiv = document.getElementById('rgb-on');
  const rgbCheckbox = document.getElementById('switch');
  const msCheckbox = document.getElementById('ms-switch');
  const pageTitle = document.getElementById('page-title');
  const yearRoundTargets = document.querySelectorAll('[data-eiken-round]');
  const fullTitleTargets = document.querySelectorAll('[data-eiken-title]');
  const rgbTitle = document.querySelector('.switch-title.rgb');
  const msTitle = document.querySelector('.switch-title.ms');

  const units = ['days', 'hours', 'minutes', 'seconds'];
  const colors = [
    'color1', 'color2', 'color3', 'color4', 'color5',
    'color6', 'color7', 'color8', 'color9', 'color10',
    'color11', 'color12', 'color13', 'color14', 'color15',
    'color16', 'color17', 'color18', 'color19', 'color20'
  ];
  const storageKeys = {
    rgb: 'eikenCountdown.rgb',
    ms: 'eikenCountdown.ms'
  };

  let showCentiseconds = true;
  let countdownTimer = null;
  let colorTimer = null;
  let colorIndex = 0;

  function firstSundayInRange(year, monthIndex, startDay, endDay) {
    for (let day = startDay; day <= endDay; day += 1) {
      const date = new Date(year, monthIndex, day, 0, 0, 0, 0);
      if (date.getDay() === 0) {
        return date;
      }
    }

    return new Date(year, monthIndex, endDay, 0, 0, 0, 0);
  }

  function getSchedules(baseYear) {
    return [
      {
        fiscalYear: baseYear,
        round: 1,
        date: firstSundayInRange(baseYear, 4, 25, 31)
      },
      {
        fiscalYear: baseYear,
        round: 2,
        date: firstSundayInRange(baseYear, 9, 1, 7)
      },
      {
        fiscalYear: baseYear,
        round: 3,
        date: firstSundayInRange(baseYear + 1, 0, 18, 24)
      }
    ];
  }

  function getNextExam(now) {
    const currentYear = now.getFullYear();
    const schedules = [];

    for (let year = currentYear - 1; year <= currentYear + 1; year += 1) {
      schedules.push(...getSchedules(year));
    }

    schedules.sort((left, right) => left.date.getTime() - right.date.getTime());

    const next = schedules.find((item) => item.date.getTime() > now.getTime());
    return next || getSchedules(currentYear + 1)[0];
  }

  function updateTitle(now) {
    const nextExam = getNextExam(now);
    const title = `${nextExam.fiscalYear}年度第${nextExam.round}回 実用英語技能検定まで`;

    document.title = title;

    if (pageTitle && yearRoundTargets.length === 0 && fullTitleTargets.length === 0) {
      pageTitle.textContent = title;
    }

    yearRoundTargets.forEach((node) => {
      node.textContent = `${nextExam.fiscalYear}年度第${nextExam.round}回`;
    });

    fullTitleTargets.forEach((node) => {
      node.textContent = title;
    });

    return nextExam.date;
  }

  function getValueElem(container, unit) {
    return container ? container.querySelector(`[data-unit="${unit}"] .value`) : null;
  }

  function renderValues(container, values) {
    units.forEach((unit) => {
      const target = getValueElem(container, unit);
      if (target) {
        target.textContent = values[unit];
      }
    });
  }

  function tick() {
    const now = new Date();
    const targetDate = updateTitle(now);
    const diff = Math.max(0, targetDate.getTime() - now.getTime());

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    const centiseconds = Math.floor((diff % 1000) / 10);

    const values = {
      days: String(days),
      hours: String(hours),
      minutes: String(minutes),
      seconds: showCentiseconds
        ? `${seconds}.${String(centiseconds).padStart(2, '0')}`
        : String(seconds)
    };

    renderValues(countdownDiv, values);
    renderValues(rgbDiv, values);
  }

  function cycleColors() {
    if (!rgbDiv) {
      return;
    }

    const valueElems = rgbDiv.querySelectorAll('.value');
    valueElems.forEach((elem, offset) => {
      colors.forEach((color) => elem.classList.remove(color));
      elem.classList.add(colors[(colorIndex + offset) % colors.length]);
    });
    colorIndex = (colorIndex + 1) % colors.length;
  }

  function applyRgbState(isOn) {
    if (rgbCheckbox) {
      rgbCheckbox.checked = isOn;
      rgbCheckbox.setAttribute('aria-checked', isOn ? 'true' : 'false');
    }

    if (countdownDiv) {
      countdownDiv.style.display = isOn ? 'none' : 'grid';
    }

    if (rgbDiv) {
      rgbDiv.style.display = isOn ? 'grid' : 'none';
      rgbDiv.setAttribute('aria-hidden', isOn ? 'false' : 'true');
    }

    if (rgbTitle) {
      rgbTitle.textContent = isOn ? 'ON' : 'OFF';
    }
  }

  function applyMsState(isOn) {
    showCentiseconds = isOn;

    if (msCheckbox) {
      msCheckbox.checked = isOn;
      msCheckbox.setAttribute('aria-checked', isOn ? 'true' : 'false');
    }

    if (msTitle) {
      msTitle.textContent = isOn ? 'ON' : 'OFF';
    }

    tick();
  }

  function readStoredBool(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      if (value === null) {
        return fallback;
      }
      return value === '1';
    } catch (error) {
      return fallback;
    }
  }

  function writeStoredBool(key, value) {
    try {
      window.localStorage.setItem(key, value ? '1' : '0');
    } catch (error) {
      return;
    }
  }

  function startTimers() {
    if (!countdownTimer) {
      tick();
      countdownTimer = window.setInterval(tick, 50);
    }

    if (!colorTimer) {
      cycleColors();
      colorTimer = window.setInterval(cycleColors, 150);
    }
  }

  function stopTimers() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }

    if (colorTimer) {
      clearInterval(colorTimer);
      colorTimer = null;
    }
  }

  if (rgbCheckbox) {
    rgbCheckbox.addEventListener('change', () => {
      applyRgbState(rgbCheckbox.checked);
      writeStoredBool(storageKeys.rgb, rgbCheckbox.checked);
    });
  }

  if (msCheckbox) {
    msCheckbox.addEventListener('change', () => {
      applyMsState(msCheckbox.checked);
      writeStoredBool(storageKeys.ms, msCheckbox.checked);
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTimers();
    } else {
      startTimers();
    }
  });

  applyRgbState(readStoredBool(storageKeys.rgb, false));
  applyMsState(readStoredBool(storageKeys.ms, true));
  startTimers();

  window.addEventListener('beforeunload', stopTimers);
})();
