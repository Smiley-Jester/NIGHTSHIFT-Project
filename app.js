(() => {
  'use strict';

  const STORE_KEY = 'nightshift-roadmap-v1';
  const LANGUAGE_KEY = 'nightshift-language-v3';
  const MAX_SESSIONS = 2000;
  const MAX_POM_HISTORY = 300;
  const PAGES = ['home', 'roadmap', 'tree', 'lessons', 'lesson-detail', 'study', 'reports', 'guide'];
  const LIMITS = { focusMinutes: [5, 90], shortBreakMinutes: [1, 30], longBreakMinutes: [5, 60], dailyGoalMinutes: [30, 360] };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // English is the default language; Persian is the secondary language.
  let currentLanguage = 'en';
  try { currentLanguage = localStorage.getItem(LANGUAGE_KEY) === 'fa' ? 'fa' : 'en'; } catch (_) { currentLanguage = 'en'; }

  // ---------- Language helpers ----------
  const isFa = () => currentLanguage === 'fa';
  const tr = (english, persian) => isFa() ? persian : english;
  const locale = () => isFa() ? 'fa-IR' : 'en-US';
  const faDigitMap = '۰۱۲۳۴۵۶۷۸۹';
  const toFaDigits = value => String(value).replace(/[0-9]/g, digit => faDigitMap[Number(digit)]);
  // Formats a pure number (or clock) for the active language.
  const num = value => isFa() ? toFaDigits(String(value).replace(/(\d)\.(\d)/g, '$1٫$2')) : String(value);
  // Localizes digits inside prose without touching technical terms such as "x86_64" or "Top 10".
  const loc = value => {
    const text = String(value ?? '');
    if (!isFa()) return text;
    return text.replace(/([A-Za-z][A-Za-z0-9_+.\-/]*(?: [A-Za-z0-9][A-Za-z0-9_+.\-/]*)*)|[0-9]+/g, (match, latin) => latin ? match : toFaDigits(match));
  };
  const percentText = value => isFa() ? `${num(value)}٪` : `${value}%`;

  // Text that lives in index.html.
  const STATIC_TEXT = {
    brandTag: ['Ethical security path', 'مسیر امنیت اخلاقی'],
    workspace: ['WORKSPACE', 'فضای کار'],
    home: ['Overview', 'نمای کلی'],
    roadmap: ['12-week roadmap', 'نقشه راه ۱۲ هفته‌ای'],
    tree: ['Skill tree', 'درخت مهارت'],
    lessons: ['Lessons library', 'کتابخانه درس‌ها'],
    study: ['Study room', 'اتاق مطالعه'],
    reports: ['Reports & progress', 'گزارش‌ها و پیشرفت'],
    guide: ['Learning guide', 'راهنمای یادگیری'],
    scopeTitle: ['Stay in scope', 'در محدوده مجاز بمان'],
    scopeText: ['Practice only where you have permission.', 'فقط در محیط‌هایی تمرین کن که برای آن‌ها اجازه داری.'],
    storage: ['LOCAL PROGRESS STORAGE', 'ذخیره محلی پیشرفت'],
    onDevice: ['ON DEVICE', 'روی همین دستگاه'],
    footerMotto: ['BUILT FOR CURIOUS MINDS · RUN SAFE · STAY SHARP', 'برای ذهن‌های کنجکاو · ایمن تمرین کن · هوشیار بمان'],
    version: ['VERSION 1.2', 'نسخه ۱٫۲'],
    privacy: ['YOUR DATA STAYS IN THIS BROWSER', 'داده‌های تو در همین مرورگر می‌مانند'],
    brandLabel: ['Nightshift home', 'صفحه اصلی نایت‌شیفت'],
    navLabel: ['Main navigation', 'ناوبری اصلی'],
    openMenu: ['Open menu', 'باز کردن منو'],
    closeMenu: ['Close menu', 'بستن منو'],
    chooseLanguage: ['Choose language', 'انتخاب زبان']
  };
  const CRUMBS = {
    home: ['OVERVIEW', 'نمای کلی'], roadmap: ['12-WEEK ROADMAP', 'نقشه راه ۱۲ هفته‌ای'], tree: ['SKILL TREE', 'درخت مهارت'],
    lessons: ['LESSONS LIBRARY', 'کتابخانه درس‌ها'], 'lesson-detail': ['LESSON DETAILS', 'جزئیات درس'], study: ['STUDY ROOM', 'اتاق مطالعه'],
    reports: ['REPORTS & PROGRESS', 'گزارش‌ها و پیشرفت'], guide: ['LEARNING GUIDE', 'راهنمای یادگیری']
  };
  const TREE_BRANCHES = [
    { title: 'Core foundations', subtitle: 'Operating systems, networking and scripting', faSubtitle: 'سیستم‌عامل، شبکه و اسکریپت‌نویسی', ids: ['linux-windows', 'networking', 'python'] },
    { title: 'Research & awareness', subtitle: 'OSINT, privacy and human factors', faSubtitle: 'OSINT، حریم خصوصی و عوامل انسانی', ids: ['osint-opsec', 'social-engineering'] },
    { title: 'Application security', subtitle: 'Web applications and APIs', faSubtitle: 'برنامه‌های وب و APIها', ids: ['web-security', 'api-security'] },
    { title: 'Assessment & validation', subtitle: 'Findings, evidence and safe validation', faSubtitle: 'یافته‌ها، شواهد و اعتبارسنجی ایمن', ids: ['vulnerability-assessment', 'exploitation'] },
    { title: 'Systems & specialist topics', subtitle: 'Permissions, AI, reverse engineering and cryptography', faSubtitle: 'مجوزها، هوش مصنوعی، مهندسی معکوس و رمزنگاری', ids: ['privilege-escalation', 'ai-security', 'reverse-engineering', 'cryptography'] },
    { title: 'Capstone', subtitle: 'Scope, assess, report and retest', faSubtitle: 'تعیین محدوده، ارزیابی، گزارش و بازآزمایی', ids: ['pentest-labs'] }
  ];

  // ---------- Curriculum access ----------
  const activeLessons = () => isFa() ? LESSONS : ENGLISH_LESSONS;
  const activeWeeks = () => isFa() ? WEEKS : ENGLISH_WEEKS;
  const lessonIds = () => ENGLISH_LESSONS.map(item => item.id);
  const isLessonId = id => lessonIds().includes(id);
  const lesson = id => activeLessons().find(item => item.id === id) || activeLessons()[0];
  const englishLesson = item => ENGLISH_LESSONS.find(source => source.id === item.id) || item;
  const lessonTitle = item => englishLesson(item).title;
  const lessonTitleHtml = item => `<span class="english-title" data-keep-en dir="ltr">${esc(lessonTitle(item))}</span>`;
  const weekTitle = week => (ENGLISH_WEEKS.find(source => source.week === week.week) || week).theme;

  // ---------- State ----------
  const defaultState = () => ({
    completed: [], notes: {}, lessonSeconds: {}, checklists: {}, studySessions: [], pomodoroHistory: [],
    pomodoro: null,
    stopwatch: { elapsedSeconds: 0, running: false, startedAt: null, lessonId: 'linux-windows' },
    settings: { focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15, dailyGoalMinutes: 120 }
  });
  const isObject = value => !!value && typeof value === 'object' && !Array.isArray(value);
  const seconds = value => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;

  // Accepts saved or imported data and returns a state that is safe to render.
  function normalizeState(saved) {
    const base = defaultState();
    if (!isObject(saved)) return base;
    const settings = { ...base.settings };
    Object.entries(LIMITS).forEach(([key, [min, max]]) => {
      const value = Number(saved.settings?.[key]);
      if (Number.isInteger(value) && value >= min && value <= max) settings[key] = value;
    });
    const lessonSeconds = {};
    if (isObject(saved.lessonSeconds)) Object.entries(saved.lessonSeconds).forEach(([id, value]) => { if (isLessonId(id)) lessonSeconds[id] = seconds(value); });
    const stopwatch = { ...base.stopwatch, ...(isObject(saved.stopwatch) ? saved.stopwatch : {}) };
    stopwatch.elapsedSeconds = seconds(stopwatch.elapsedSeconds);
    stopwatch.running = stopwatch.running === true && Number.isFinite(stopwatch.startedAt);
    if (!stopwatch.running) stopwatch.startedAt = null;
    if (!isLessonId(stopwatch.lessonId)) stopwatch.lessonId = base.stopwatch.lessonId;
    let pomodoro = isObject(saved.pomodoro) && ['focus', 'short', 'long'].includes(saved.pomodoro.mode) ? { ...saved.pomodoro } : null;
    if (pomodoro) {
      pomodoro.remainingSeconds = seconds(pomodoro.remainingSeconds);
      pomodoro.elapsedSeconds = seconds(pomodoro.elapsedSeconds);
      pomodoro.running = pomodoro.running === true && Number.isFinite(pomodoro.lastStartedAt);
      if (!pomodoro.running && pomodoro.status === 'running') pomodoro.status = 'paused';
      if (!isLessonId(pomodoro.lessonId)) pomodoro.lessonId = base.stopwatch.lessonId;
    }
    return {
      completed: Array.isArray(saved.completed) ? [...new Set(saved.completed.filter(isLessonId))] : [],
      notes: isObject(saved.notes) ? saved.notes : {},
      lessonSeconds,
      checklists: isObject(saved.checklists) ? saved.checklists : {},
      studySessions: Array.isArray(saved.studySessions) ? saved.studySessions.filter(isObject).map(item => ({ ...item, seconds: seconds(item.seconds) })) : [],
      pomodoroHistory: Array.isArray(saved.pomodoroHistory) ? saved.pomodoroHistory.filter(isObject) : [],
      pomodoro, stopwatch, settings
    };
  }
  function loadState() {
    try { return normalizeState(JSON.parse(localStorage.getItem(STORE_KEY) || 'null')); }
    catch (error) {
      console.warn('Nightshift local data could not be read; starting a fresh workspace.', error);
      return defaultState();
    }
  }
  let state = loadState();
  let currentPage = 'home';
  let selectedLesson = state.stopwatch.lessonId;
  let lessonQuery = '';
  let lessonFilter = 'all';
  let toastTimer = null;
  let storageWarningShown = false;

  function persist() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (error) {
      console.warn('Progress could not be saved in this browser.', error);
      if (!storageWarningShown) {
        storageWarningShown = true;
        showToast(tr('Progress could not be saved in this browser.', 'ذخیره پیشرفت در این مرورگر ممکن نشد.'));
      }
    }
  }

  // ---------- Formatting ----------
  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }
  const text = value => esc(loc(value));
  function safeUrl(url) {
    try { const parsed = new URL(url, window.location.href); return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : '#'; }
    catch { return '#'; }
  }
  const hoursFromSeconds = value => Math.max(0, value || 0) / 3600;
  const fmtHours = value => `${num(hoursFromSeconds(value).toFixed(1))} ${tr('h', 'ساعت')}`;
  const plannedHours = value => isFa() ? `${num(value)} ساعت` : `${value}h`;
  const pad = value => String(value).padStart(2, '0');
  function fmtClock(value) {
    const total = seconds(value);
    const h = Math.floor(total / 3600); const m = Math.floor((total % 3600) / 60); const s = total % 60;
    return num(h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`);
  }
  function fmtCountdown(value) {
    const total = seconds(value);
    return num(`${pad(Math.floor(total / 60))}:${pad(total % 60)}`);
  }
  function fmtDate(timestamp) {
    const date = new Date(timestamp);
    if (!timestamp || Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat(locale(), { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  }
  const priorityClass = priority => priority === 'Critical' ? 'critical' : priority === 'High' ? 'high' : 'specialist';
  function priorityLabel(priority) {
    const fa = { Critical: 'بحرانی', High: 'بالا', Specialist: 'تخصصی' }[priority] || priority;
    return isFa() ? `اولویت ${fa}` : `${priority} priority`;
  }
  const modeName = mode => ({ focus: tr('Focus session', 'جلسه تمرکز'), short: tr('Short break', 'استراحت کوتاه'), long: tr('Long break', 'استراحت طولانی') }[mode] || mode);
  const statusName = status => ({
    ready: tr('Ready', 'آماده'), running: tr('Running', 'در حال اجرا'), paused: tr('Paused', 'مکث‌شده'),
    completed: tr('Completed', 'تکمیل‌شده'), stopped: tr('Stopped', 'متوقف‌شده')
  }[status] || status);
  const sessionTypeName = type => ({
    Stopwatch: tr('Stopwatch', 'کرنومتر'), 'Pomodoro focus': tr('Pomodoro focus', 'تمرکز پومودورو'),
    'Pomodoro focus (stopped)': tr('Pomodoro focus (stopped)', 'تمرکز پومودورو (متوقف‌شده)')
  }[type] || type || '—');

  // ---------- Progress ----------
  const isComplete = id => state.completed.includes(id);
  const lessonSecondsFor = id => state.lessonSeconds[id] || 0;
  // Per-lesson totals are never trimmed, so they are the source of truth for course time.
  const totalLoggedSeconds = () => Object.values(state.lessonSeconds).reduce((sum, value) => sum + seconds(value), 0);
  const nextLesson = () => activeLessons().find(item => !isComplete(item.id)) || activeLessons()[0];
  const lessonStatus = id => isComplete(id) ? 'complete' : lessonSecondsFor(id) > 0 ? 'in-progress' : 'not-started';
  const lessonStatusLabel = id => ({
    complete: tr('Completed', 'تکمیل‌شده'), 'in-progress': tr('In progress', 'در حال انجام'), 'not-started': tr('Not started', 'شروع‌نشده')
  }[lessonStatus(id)]);
  const completionPercent = () => Math.round(state.completed.length / activeLessons().length * 100);
  const lessonPercent = item => Math.min(100, hoursFromSeconds(lessonSecondsFor(item.id)) / item.hours * 100);
  function streakDays() {
    const days = new Set(state.studySessions.filter(s => s.seconds > 0).map(s => new Date(s.timestamp).toDateString()));
    let count = 0; const cursor = new Date(); cursor.setHours(0, 0, 0, 0);
    if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
    while (days.has(cursor.toDateString())) { count++; cursor.setDate(cursor.getDate() - 1); }
    return count;
  }
  function xpPoints() {
    const noteXp = Object.values(state.notes).filter(v => String(v).trim().length > 20).length * 15;
    return state.completed.length * 100 + Math.floor(totalLoggedSeconds() / 1500) * 10 + noteXp;
  }
  // The week starts on Saturday in Persian and on Monday in English.
  function weeklyActivity() {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - ((start.getDay() + (isFa() ? 1 : 6)) % 7));
    const weekday = new Intl.DateTimeFormat(locale(), { weekday: 'short' });
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start); day.setDate(start.getDate() + i);
      const key = day.toDateString();
      const total = state.studySessions.filter(s => new Date(s.timestamp).toDateString() === key).reduce((sum, s) => sum + s.seconds, 0);
      return { label: weekday.format(day), seconds: total };
    });
  }
  const isWeekDone = week => week.modules.every(module => isComplete(module.id));
  const firstActiveWeek = () => activeWeeks().find(week => !isWeekDone(week))?.week ?? null;

  // ---------- Timers ----------
  const stopwatchSeconds = () => {
    const timer = state.stopwatch;
    if (!timer.running || !timer.startedAt) return timer.elapsedSeconds || 0;
    return (timer.elapsedSeconds || 0) + seconds((Date.now() - timer.startedAt) / 1000);
  };
  // Seconds since the Pomodoro was last started, never more than the time that was left.
  const pomodoroLive = () => {
    const timer = state.pomodoro;
    if (!timer || !timer.running || !timer.lastStartedAt) return 0;
    return Math.min(timer.remainingSeconds || 0, seconds((Date.now() - timer.lastStartedAt) / 1000));
  };
  const pomodoroRemaining = () => state.pomodoro ? Math.max(0, (state.pomodoro.remainingSeconds || 0) - pomodoroLive()) : 0;
  const pomodoroElapsed = () => state.pomodoro ? (state.pomodoro.elapsedSeconds || 0) + pomodoroLive() : 0;
  const pomodoroActive = () => !!state.pomodoro && (state.pomodoro.running || state.pomodoro.status === 'paused');
  const modeMinutes = mode => state.settings[{ focus: 'focusMinutes', short: 'shortBreakMinutes', long: 'longBreakMinutes' }[mode]];
  const readyPomodoro = mode => ({
    mode, remainingSeconds: modeMinutes(mode) * 60, elapsedSeconds: 0, running: false, lastStartedAt: null,
    startedAt: null, historyId: null, lessonId: studyLessonId(), status: 'ready'
  });
  // The lesson that the Study Room is currently attributing time to.
  function studyLessonId() {
    if (state.stopwatch.running || state.stopwatch.elapsedSeconds > 0) return state.stopwatch.lessonId;
    if (pomodoroActive()) return state.pomodoro.lessonId;
    return selectedLesson;
  }
  function addStudySession(session) {
    const duration = seconds(session.seconds);
    state.studySessions.push({ ...session, seconds: duration });
    state.lessonSeconds[session.lessonId] = lessonSecondsFor(session.lessonId) + duration;
    if (state.studySessions.length > MAX_SESSIONS) state.studySessions = state.studySessions.slice(-MAX_SESSIONS);
  }
  function startStopwatch() {
    if (state.pomodoro?.running) { showToast(tr('Pause the Pomodoro before starting the stopwatch.', 'پیش از شروع کرنومتر، پومودورو را متوقف کن.')); return; }
    if (state.stopwatch.running) return;
    state.stopwatch.lessonId = studyLessonId();
    state.stopwatch.running = true; state.stopwatch.startedAt = Date.now();
    persist(); updateLiveTimers();
  }
  function pauseStopwatch() {
    if (!state.stopwatch.running) return;
    state.stopwatch.elapsedSeconds = stopwatchSeconds();
    state.stopwatch.running = false; state.stopwatch.startedAt = null;
    persist(); updateLiveTimers();
  }
  function saveStopwatch() {
    const duration = stopwatchSeconds();
    if (duration < 1) { showToast(tr('Start the stopwatch before saving a session.', 'پیش از ذخیره جلسه، کرنومتر را شروع کن.')); return; }
    const id = state.stopwatch.lessonId;
    addStudySession({ type: 'Stopwatch', seconds: duration, lessonId: id, timestamp: Date.now() });
    state.stopwatch = { elapsedSeconds: 0, running: false, startedAt: null, lessonId: id };
    selectedLesson = id;
    persist(); refresh();
    showToast(tr(`${fmtClock(duration)} saved to ${lessonTitle(lesson(id))}.`, `${fmtClock(duration)} برای درس ${lessonTitle(lesson(id))} ذخیره شد.`));
  }
  function resetStopwatch() {
    if (stopwatchSeconds() > 0 && !window.confirm(tr('Discard this unsaved stopwatch time?', 'این زمان ذخیره‌نشده کرنومتر کنار گذاشته شود؟'))) return;
    state.stopwatch = { elapsedSeconds: 0, running: false, startedAt: null, lessonId: selectedLesson };
    persist(); refresh();
  }
  function setPomodoroMode(mode) {
    if (!['focus', 'short', 'long'].includes(mode)) return;
    if (state.pomodoro?.running) { showToast(tr('Pause or stop the active timer before switching modes.', 'پیش از تغییر حالت، تایمر فعال را مکث یا متوقف کن.')); return; }
    if (pomodoroActive()) {
      if (state.pomodoro.mode === mode) return;
      if (!window.confirm(tr('Switching modes will stop the paused timer. Its elapsed time stays in history. Continue?', 'تغییر حالت، تایمر مکث‌شده را متوقف می‌کند و زمان سپری‌شده در تاریخچه می‌ماند. ادامه می‌دهی؟'))) return;
      stopPomodoro();
    }
    state.pomodoro = readyPomodoro(mode);
    persist(); refresh();
  }
  function startPomodoro() {
    if (state.stopwatch.running) { showToast(tr('Pause the stopwatch before starting a Pomodoro.', 'پیش از شروع پومودورو، کرنومتر را متوقف کن.')); return; }
    if (state.pomodoro?.running) return;
    if (!state.pomodoro) state.pomodoro = readyPomodoro('focus');
    else if (state.pomodoro.status === 'completed' || state.pomodoro.remainingSeconds <= 0) state.pomodoro = readyPomodoro(state.pomodoro.mode);
    const timer = state.pomodoro;
    const now = Date.now();
    if (!timer.historyId) {
      timer.historyId = `p-${now}-${Math.random().toString(36).slice(2, 7)}`;
      timer.startedAt = now;
      timer.lessonId = studyLessonId();
      state.pomodoroHistory.push({ id: timer.historyId, mode: timer.mode, startedAt: now, plannedSeconds: timer.remainingSeconds, elapsedSeconds: 0, status: 'running', lessonId: timer.mode === 'focus' ? timer.lessonId : null });
      if (state.pomodoroHistory.length > MAX_POM_HISTORY) state.pomodoroHistory = state.pomodoroHistory.slice(-MAX_POM_HISTORY);
    }
    timer.lastStartedAt = now; timer.running = true; timer.status = 'running';
    updatePomHistory('running', timer.elapsedSeconds);
    persist(); refresh();
  }
  function updatePomHistory(status, elapsed) {
    const history = state.pomodoroHistory.find(item => item.id === state.pomodoro?.historyId);
    if (!history) return;
    history.status = status; history.elapsedSeconds = seconds(elapsed);
    if (status === 'completed' || status === 'stopped') history.finishedAt = Date.now();
  }
  function pausePomodoro() {
    const timer = state.pomodoro; if (!timer?.running) return;
    const remaining = pomodoroRemaining(); const elapsed = pomodoroElapsed();
    Object.assign(timer, { remainingSeconds: remaining, elapsedSeconds: elapsed, running: false, lastStartedAt: null, status: 'paused' });
    updatePomHistory('paused', elapsed); persist(); refresh();
  }
  function completePomodoro() {
    const timer = state.pomodoro; if (!timer?.running) return;
    Object.assign(timer, { elapsedSeconds: timer.elapsedSeconds + timer.remainingSeconds, remainingSeconds: 0, running: false, lastStartedAt: null, status: 'completed' });
    updatePomHistory('completed', timer.elapsedSeconds);
    if (timer.mode === 'focus' && timer.elapsedSeconds > 0) addStudySession({ type: 'Pomodoro focus', seconds: timer.elapsedSeconds, lessonId: timer.lessonId, timestamp: timer.startedAt || Date.now() });
    persist();
    if (['home', 'study', 'reports'].includes(currentPage)) refresh();
    showToast(timer.mode === 'focus' ? tr('Focus block complete. Take a short break.', 'بازه تمرکز تمام شد. کمی استراحت کن.') : tr('Break complete. Ready for the next block?', 'استراحت تمام شد. برای بازه بعدی آماده‌ای؟'));
  }
  // Only a running or paused timer can be stopped, so a finished block is never logged twice.
  function stopPomodoro() {
    if (!pomodoroActive()) return;
    const timer = state.pomodoro;
    const elapsed = pomodoroElapsed();
    updatePomHistory('stopped', elapsed);
    const logged = timer.mode === 'focus' && elapsed > 0;
    if (logged) addStudySession({ type: 'Pomodoro focus (stopped)', seconds: elapsed, lessonId: timer.lessonId, timestamp: timer.startedAt || Date.now() });
    state.pomodoro = null; persist(); refresh();
    showToast(logged ? tr(`${fmtClock(elapsed)} saved from the Pomodoro timer.`, `${fmtClock(elapsed)} از تایمر پومودورو ذخیره شد.`) : tr('Pomodoro stopped.', 'پومودورو متوقف شد.'));
  }
  function savePomodoroSettings() {
    const values = { focusMinutes: Number($('#focusMinutes')?.value), shortBreakMinutes: Number($('#shortMinutes')?.value), longBreakMinutes: Number($('#longMinutes')?.value) };
    const valid = Object.entries(values).every(([key, value]) => Number.isInteger(value) && value >= LIMITS[key][0] && value <= LIMITS[key][1]);
    if (!valid) { showToast(tr('Use focus 5–90, short break 1–30 and long break 5–60 minutes.', 'برای تمرکز ۵ تا ۹۰، استراحت کوتاه ۱ تا ۳۰ و استراحت طولانی ۵ تا ۶۰ دقیقه وارد کن.')); return; }
    if (state.pomodoro?.running) { showToast(tr('Pause the active timer before changing durations.', 'پیش از تغییر مدت زمان، تایمر فعال را متوقف کن.')); return; }
    Object.assign(state.settings, values);
    if (!pomodoroActive()) state.pomodoro = readyPomodoro(state.pomodoro?.mode || 'focus');
    persist(); refresh();
    showToast(tr('Pomodoro durations updated.', 'مدت زمان‌های پومودورو به‌روزرسانی شد.'));
  }
  function updateLiveTimers() {
    if (currentPage !== 'study') return;
    const sw = stopwatchSeconds();
    const timer = state.pomodoro;
    const setText = (selector, value) => { const el = $(selector); if (el && el.textContent !== value) el.textContent = value; };
    const setDisabled = (selector, value) => { const el = $(selector); if (el) el.disabled = value; };
    setText('#stopwatchDisplay', fmtClock(sw));
    setText('#stopwatchState', state.stopwatch.running ? statusName('running') : sw > 0 ? statusName('paused') : tr('Ready to start', 'آماده شروع'));
    setText('#pomodoroDisplay', fmtCountdown(timer ? pomodoroRemaining() : state.settings.focusMinutes * 60));
    setText('#pomodoroState', `${modeName(timer?.mode || 'focus')} · ${statusName(timer?.status || 'ready')}`);
    setText('#pomStart', timer?.running ? statusName('running') : timer?.status === 'paused' ? tr('Resume', 'ادامه') : timer?.status === 'completed' ? tr('Start next cycle', 'شروع چرخه بعدی') : (timer?.mode || 'focus') === 'focus' ? tr('Start focus', 'شروع تمرکز') : tr('Start break', 'شروع استراحت'));
    setDisabled('#swStart', state.stopwatch.running);
    setDisabled('#swPause', !state.stopwatch.running);
    setDisabled('#swSave', sw < 1);
    setDisabled('#swReset', sw < 1);
    setDisabled('#pomStart', !!timer?.running);
    setDisabled('#pomPause', !timer?.running);
    setDisabled('#pomStop', !pomodoroActive());
  }

  // ---------- Pages ----------
  function renderPageHead(eyebrow, title, description, action = '') {
    return `<div class="page-head"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${description}</p></div>${action ? `<div class="head-actions">${action}</div>` : ''}</div>`;
  }
  const panelHead = (title, description, extra = '', level = 'h3') => `<div class="panel-head"><div><${level}>${title}</${level}>${description ? `<p>${description}</p>` : ''}</div>${extra}</div>`;
  const statCard = (label, value, sub, symbol = '') => `<article class="card stat-card"><div class="stat-top"><span class="stat-label">${label}</span>${symbol ? `<span class="stat-symbol" aria-hidden="true">${symbol}</span>` : ''}</div><div class="stat-value">${value}</div><div class="stat-sub">${sub}</div></article>`;
  const unit = value => `<span class="stat-unit">${value}</span>`;
  function ring(percent) {
    const r = 48, circumference = 2 * Math.PI * r, offset = circumference - circumference * Math.max(0, Math.min(100, percent)) / 100;
    return `<div class="ring-wrap"><svg viewBox="0 0 110 110" role="img" aria-label="${tr(`${percent} percent of lessons completed`, `${num(percent)} درصد درس‌ها تکمیل شده`)}"><circle class="ring-bg" cx="55" cy="55" r="${r}"/><circle class="ring-fill" cx="55" cy="55" r="${r}" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/></svg><div class="ring-center"><strong>${percentText(percent)}</strong><small>${tr('LESSONS', 'درس‌ها')}</small></div></div>`;
  }
  function lessonRow(item, detail, side) {
    return `<div class="week-module"><div class="week-module-main"><strong>${lessonTitleHtml(item)}</strong><p>${detail}</p>${side.bar ? `<div class="lesson-progress"><span style="width:${lessonPercent(item)}%"></span></div>` : ''}</div>${side.html}</div>`;
  }

  function renderHome() {
    const logged = totalLoggedSeconds();
    const done = state.completed.length;
    const total = activeLessons().length;
    const next = nextLesson();
    const weekSeconds = weeklyActivity().reduce((sum, day) => sum + day.seconds, 0);
    const remainingWeek = num(Math.max(0, 12 - weekSeconds / 3600).toFixed(1));
    const goal = num(Math.round(state.settings.dailyGoalMinutes / 60 * 10) / 10);
    const nextThree = activeLessons().filter(item => !isComplete(item.id)).slice(0, 3);
    const started = activeLessons().filter(item => lessonStatus(item.id) === 'in-progress');
    const focusLessons = [...started, ...nextThree.filter(item => !started.includes(item))].slice(0, 3);
    const activeWeek = firstActiveWeek();
    return `<section class="hero reveal"><div class="hero-content"><div class="eyebrow">${tr('A 12-WEEK PRACTICE-LED CURRICULUM', 'برنامه آموزشی ۱۲ هفته‌ای مبتنی بر تمرین')}</div><h1>${tr('Build skills that', 'مهارت‌هایی بساز که')} <span>${tr('protect systems.', 'از سامانه‌ها محافظت کنند.')}</span></h1><p>${tr('A structured route from operating-system fundamentals to authorized security assessments. Learn the why, practice in dedicated labs, and keep evidence of what you can do.', 'مسیر آموزشی منسجم از مبانی سیستم‌عامل تا ارزیابی‌های امنیتی مجاز. دلیل هر موضوع را یاد بگیر، در آزمایشگاه‌های اختصاصی تمرین کن و شواهد توانایی‌هایت را ثبت کن.')}</p><div class="hero-actions"><button class="btn primary" data-action="open-lesson" data-id="${next.id}">${tr('Continue learning', 'ادامه یادگیری')} <span aria-hidden="true">${tr('↗', '↖')}</span></button><button class="btn ghost" data-nav="roadmap">${tr('Explore the roadmap', 'مرور نقشه راه')}</button></div></div><div class="hero-aside"><div class="label">${tr('TOTAL COURSE TIME', 'زمان کل دوره')}</div><div class="hero-hours"><strong>${num(COURSE_HOURS)}</strong><span>${tr('GUIDED HOURS', 'ساعت آموزش هدایت‌شده')}</span></div><div class="divider"></div><div class="hero-foot"><span>${tr('12 weeks', '۱۲ هفته')}</span><span>${tr('~2 h / day · 6 days / week', 'حدود ۲ ساعت در روز · ۶ روز در هفته')}</span></div></div></section>
      <section class="stat-grid">
        ${statCard(tr('TIME INVESTED', 'زمان صرف‌شده'), fmtHours(logged), tr(`of ${COURSE_HOURS} planned course hours`, `از ${num(COURSE_HOURS)} ساعت برنامه‌ریزی‌شده`), '◷')}
        ${statCard(tr('LESSONS COMPLETE', 'درس‌های تکمیل‌شده'), `${num(done)}${unit(`/ ${num(total)}`)}`, tr(`${completionPercent()}% of the learning modules`, `${percentText(completionPercent())} از بخش‌های آموزشی`), '✓')}
        ${statCard(tr('CURRENT STREAK', 'پیوستگی فعلی'), `${num(streakDays())}${unit(tr('days', 'روز'))}`, tr('Study activity on consecutive days', 'مطالعه در روزهای پیاپی'), '✳')}
        ${statCard(tr('EXPERIENCE POINTS', 'امتیاز تجربه'), xpPoints().toLocaleString(locale()), tr('From focus time, notes and completions', 'از زمان تمرکز، یادداشت‌ها و تکمیل درس‌ها'), '⌁')}
      </section>
      <section class="dashboard-grid">
        <article class="card card-pad">${panelHead(tr('Course progress', 'پیشرفت دوره'), tr('Completed lessons across the 12-week plan', 'درس‌های تکمیل‌شده در برنامه ۱۲ هفته‌ای'), '', 'h2')}<div class="progress-shell">${ring(completionPercent())}<div class="progress-copy"><h3>${done === total ? tr('All lessons completed', 'همه درس‌ها تکمیل شدند') : tr(`${total - done} lessons to go`, `${num(total - done)} درس باقی مانده`)}</h3><p>${tr('Record time in the Study Room. Mark a lesson complete when you can explain the concept and finish its practice tasks.', 'زمان را در اتاق مطالعه ثبت کن. وقتی بتوانی مفهوم را توضیح بدهی و تمرین‌ها را کامل کنی، درس را تکمیل‌شده علامت بزن.')}</p></div></div><div class="divider"></div>${panelHead(tr('Weekly rhythm', 'برنامه هفتگی'), tr('Choose a week to open its study plan', 'برای دیدن برنامه مطالعه، یک هفته را انتخاب کن'))}<div class="week-strip">${activeWeeks().map(week => `<button class="week-cell ${isWeekDone(week) ? 'done' : week.week === activeWeek ? 'current' : ''}" data-action="open-week" data-week="${week.week}" title="${tr('Week', 'هفته')} ${num(week.week)}: ${esc(weekTitle(week))}">${num(pad(week.week))}</button>`).join('')}</div><div class="week-legend"><span><i class="legend-dot"></i>${tr('Completed week', 'هفته تکمیل‌شده')}</span><span><i class="legend-dot current"></i>${tr('Current week', 'هفته فعلی')}</span><span><i class="legend-dot pending"></i>${tr('Upcoming week', 'هفته پیش‌رو')}</span></div></article>
        <article class="card card-pad">${panelHead(tr('Up next', 'مرحله بعدی'), tr('Open a lesson to continue', 'برای ادامه، یک درس را باز کن'), '', 'h2')}<div class="next-list">${nextThree.map(item => `<button class="next-row" data-action="open-lesson" data-id="${item.id}"><span class="next-num">${num(item.number)}</span><span class="next-info"><strong>${lessonTitleHtml(item)}</strong><small>${plannedHours(item.hours)} · ${priorityLabel(item.priority)}</small></span><span class="priority-dot ${priorityClass(item.priority)}"></span></button>`).join('') || `<div class="history-empty">${tr('Every lesson is complete.', 'همه درس‌ها تکمیل شده‌اند.')}</div>`}</div><div class="divider"></div><div class="callout"><span class="callout-icon" aria-hidden="true">✳</span><div><strong>${tr(`Daily target: ${goal} hours`, `هدف روزانه: ${goal} ساعت`)}</strong><p>${tr(`${remainingWeek} hours left in this week’s 12-hour baseline. Keep one day lighter for review.`, `${remainingWeek} ساعت از برنامه پایه ۱۲ ساعته این هفته باقی مانده است. یک روز را برای مرور سبک‌تر نگه دار.`)}</p></div></div></article>
      </section>
      <section class="card card-pad">${panelHead(tr('Lessons in focus', 'درس‌های در جریان'), tr('Logged time against the plan', 'زمان ثبت‌شده در مقایسه با برنامه'), `<button class="btn ghost small" data-nav="reports">${tr('View full report', 'مشاهده گزارش کامل')}</button>`, 'h2')}<div class="resource-list">${focusLessons.map(item => lessonRow(item, `${priorityLabel(item.priority)} · ${lessonStatusLabel(item.id)}`, { bar: true, html: `<div class="week-module-hours">${fmtHours(lessonSecondsFor(item.id))} / ${plannedHours(item.hours)}</div>` })).join('') || `<div class="history-empty">${tr('Every lesson is complete.', 'همه درس‌ها تکمیل شده‌اند.')}</div>`}</div></section>`;
  }

  function renderRoadmap() {
    const activeWeek = firstActiveWeek();
    const cards = activeWeeks().map(week => {
      const status = isWeekDone(week) ? `<span class="complete-banner">✓ ${tr('WEEK COMPLETED', 'هفته تکمیل شد')}</span>` : week.week === activeWeek ? `<span class="green">${tr('CURRENT FOCUS', 'تمرکز فعلی')}</span>` : tr('UPCOMING STUDY BLOCK', 'بخش مطالعاتی پیش‌رو');
      const modules = week.modules.map(module => {
        const item = lesson(module.id);
        return `<div class="week-module"><div class="week-module-main"><strong>${lessonTitleHtml(item)} <span class="muted">· ${plannedHours(module.hours)}</span></strong><p>${text(module.task)}</p></div><button class="btn ghost small" data-action="open-lesson" data-id="${item.id}">${tr('Lesson ↗', 'مشاهده درس ↖')}</button></div>`;
      }).join('');
      return `<article class="card week-card" id="week-${week.week}"><div class="week-top"><div class="week-no"><small>${tr('WEEK', 'هفته')}</small><b>${num(pad(week.week))}</b></div><div class="week-title"><h3><span class="english-title" data-keep-en dir="ltr">${esc(weekTitle(week))}</span></h3><p>${status}</p></div><div class="week-meta"><strong>${plannedHours(week.hours)}</strong>${tr('PLANNED', 'برنامه‌ریزی‌شده')}</div></div><div class="week-detail">${modules}<div class="checkpoint"><b>${tr('WEEKLY CHECKPOINT', 'نقطه ارزیابی هفتگی')}</b> · ${text(week.checkpoint)}</div></div></article>`;
    }).join('');
    return `${renderPageHead(tr('THE 12-WEEK PLAN', 'برنامه ۱۲ هفته‌ای'), tr('A path, not a playlist.', 'یک مسیر یادگیری، نه فهرستی بی‌پایان از ویدیوها.'), tr('Each week has a clear learning outcome, a realistic time budget and a checkpoint. The capstone runs in parallel from week 3 so your reporting skills grow alongside the technical work.', 'هر هفته هدف یادگیری روشن، زمان‌بندی واقع‌بینانه و نقطه ارزیابی مشخص دارد. پروژه پایانی از هفته سوم هم‌زمان پیش می‌رود تا مهارت گزارش‌نویسی نیز همراه با مهارت فنی رشد کند.'), `<button class="btn ghost" data-nav="lessons">${tr('Browse all lessons', 'مرور همه درس‌ها')}</button>`)}
      <div class="callout roadmap-callout"><span class="callout-icon" aria-hidden="true">◷</span><div><strong>${tr('140 guided hours · 12 weeks · roughly 12 hours per week', '۱۴۰ ساعت آموزش هدایت‌شده · ۱۲ هفته · حدود ۱۲ ساعت در هفته')}</strong><p>${tr('A practical baseline is 2 hours a day, 6 days a week. Some later weeks are heavier; split them across the week rather than cramming. Use the lighter day to review, rest or catch up.', 'برنامه پایه، روزی ۲ ساعت در ۶ روز هفته است. بعضی هفته‌های پایانی سنگین‌ترند؛ زمان آن‌ها را در طول هفته تقسیم کن. روز سبک‌تر را برای مرور، استراحت یا جبران عقب‌ماندگی بگذار.')}</p></div></div><div class="roadmap-list">${cards}</div>`;
  }

  function renderTree() {
    const completed = state.completed.length;
    const percent = completionPercent();
    const branches = TREE_BRANCHES.map((branch, index) => {
      const done = branch.ids.filter(isComplete).length;
      const leaves = branch.ids.map(id => {
        const item = lesson(id);
        const status = lessonStatus(id);
        const label = lessonStatusLabel(id);
        return `<button class="tree-leaf ${status === 'complete' ? 'is-done' : status === 'in-progress' ? 'is-started' : ''}" data-action="open-lesson" data-id="${id}" aria-label="${esc(lessonTitle(item))} — ${label}">
          <span class="tree-leaf-check" aria-hidden="true">${status === 'complete' ? '✓' : status === 'in-progress' ? '◐' : '○'}</span>
          <span class="tree-leaf-copy"><strong>${num(item.number)} · ${lessonTitleHtml(item)}</strong><small>${label} <i>·</i> ${plannedHours(item.hours)}</small></span>
          <span class="tree-leaf-arrow" aria-hidden="true">↗</span>
        </button>`;
      }).join('');
      return `<section class="tree-branch ${done === branch.ids.length ? 'branch-done' : ''}">
        <div class="tree-branch-head"><span class="tree-branch-index">${num(pad(index + 1))}</span><div class="tree-branch-title"><h3><span class="english-title" data-keep-en dir="ltr">${esc(branch.title)}</span></h3><p>${tr(branch.subtitle, branch.faSubtitle)}</p></div><div class="tree-branch-progress"><strong>${num(`${done}/${branch.ids.length}`)}</strong><small>${tr('DONE', 'تکمیل')}</small></div></div>
        <div class="tree-leaves">${leaves}</div>
      </section>`;
    }).join('');
    return `${renderPageHead(tr('YOUR LEARNING PATH', 'مسیر یادگیری تو'), tr('A living map of every lesson.', 'نقشه‌ای زنده از تمام درس‌ها.'), tr('Each leaf is one lesson. Open it, study it and mark it complete—the tree updates automatically from your saved lesson progress.', 'هر برگ یک درس است. آن را باز کن، مطالعه کن و پس از پایان علامت تکمیل بزن؛ درخت به‌صورت خودکار به‌روزرسانی می‌شود.'), `<button class="btn ghost" data-nav="lessons">${tr('Open lesson library', 'باز کردن کتابخانه درس‌ها')}</button>`)}
      <div class="tree-summary card"><div class="tree-summary-mark" aria-hidden="true">✳</div><div class="tree-summary-copy"><small>${tr('NIGHTSHIFT · SKILL TREE', 'نایت‌شیفت · درخت مهارت')}</small><strong><span class="english-title" data-keep-en dir="ltr">Ethical security foundations</span></strong><span>${num(`${completed} / ${activeLessons().length}`)} ${tr('lessons completed', 'درس تکمیل‌شده')}</span></div><div class="tree-summary-meter"><strong>${percentText(percent)}</strong><div class="mini-track"><span style="width:${percent}%"></span></div></div></div>
      <div class="tree-trunk"><div class="tree-trunk-line"></div><div class="tree-branches">${branches}</div></div>
      <p class="tree-footnote">${tr('Progress is stored in this browser. A lesson turns green as soon as you mark it complete in its lesson page.', 'پیشرفت در همین مرورگر ذخیره می‌شود. به‌محض تکمیل هر درس در صفحه خودش، برگ آن سبز می‌شود.')}</p>`;
  }

  function filteredLessons() {
    const query = lessonQuery.trim().toLowerCase();
    return activeLessons().filter(item => {
      const english = englishLesson(item);
      const haystack = [english.title, english.short, english.category, english.summary, item.short, item.category, item.summary].join(' ').toLowerCase();
      const status = lessonFilter === 'all' || lessonStatus(item.id) === lessonFilter;
      return status && (!query || haystack.includes(query));
    });
  }
  function lessonCards(visible) {
    return visible.map(item => `<article class="card lesson-card"><div class="lesson-card-top"><span class="lesson-number">${tr('MODULE', 'بخش')} ${num(item.number)}</span><span class="priority-tag ${priorityClass(item.priority)}">${priorityLabel(item.priority)}</span></div><h3>${lessonTitleHtml(item)}</h3><p class="lesson-short">${text(item.short)}</p><div class="lesson-card-bottom"><span class="lesson-hours">${plannedHours(item.hours)} ${tr('PLANNED', 'برنامه‌ریزی‌شده')}</span><span class="lesson-status ${isComplete(item.id) ? 'green' : ''}">${lessonStatusLabel(item.id)}</span></div><div class="lesson-progress"><span style="width:${lessonPercent(item)}%"></span></div><div class="lesson-card-action"><span class="tiny muted">${fmtHours(lessonSecondsFor(item.id))} ${tr('logged', 'ثبت‌شده')}</span><button class="btn ghost small" data-action="open-lesson" data-id="${item.id}">${tr('Open lesson ↗', 'باز کردن درس ↖')}</button></div></article>`).join('')
      || `<div class="empty-state lesson-empty">${tr('No modules match this search. Try another topic or reset the filter.', 'هیچ بخشی با این جست‌وجو پیدا نشد. موضوع دیگری را جست‌وجو کن یا فیلتر را پاک کن.')}</div>`;
  }
  const lessonCount = visible => tr(`${visible.length} of ${activeLessons().length} shown`, `${num(visible.length)} از ${num(activeLessons().length)} درس`);
  function renderLessons() {
    const visible = filteredLessons();
    const option = (value, label) => `<option value="${value}" ${lessonFilter === value ? 'selected' : ''}>${label}</option>`;
    const placeholder = tr('Search topics, skills or categories…', 'جست‌وجوی موضوع، مهارت یا دسته‌بندی…');
    return `${renderPageHead(tr('CURRICULUM LIBRARY', 'کتابخانه برنامه آموزشی'), tr('Fourteen skills. One coherent foundation.', 'چهارده مهارت؛ یک پایه منسجم.'), tr('Every module includes what it teaches, why it matters, requirements, expected outcomes, a video pick and a direct lab route.', 'هر بخش شامل محتوای آموزشی، اهمیت موضوع، پیش‌نیازها، نتیجه مورد انتظار، ویدیوی منتخب و مسیر مستقیم تمرین است.'))}
      <div class="filters"><label class="search-wrap"><span aria-hidden="true">⌕</span><input id="lessonSearch" type="search" placeholder="${placeholder}" aria-label="${placeholder}" value="${esc(lessonQuery)}" /></label><select class="filter-select" id="lessonFilter" aria-label="${tr('Filter lessons', 'فیلتر درس‌ها')}">${option('all', tr('All lessons', 'همه درس‌ها'))}${option('not-started', tr('Not started', 'شروع‌نشده'))}${option('in-progress', tr('In progress', 'در حال انجام'))}${option('complete', tr('Completed', 'تکمیل‌شده'))}</select><span class="tiny muted" id="lessonShown" aria-live="polite">${lessonCount(visible)}</span></div><div class="lesson-grid" id="lessonGrid">${lessonCards(visible)}</div>`;
  }

  function renderResource(item, englishItem = item) {
    const name = englishItem?.name || item?.name || tr('Learning resource', 'منبع یادگیری');
    const provider = englishItem?.provider || item?.provider || '';
    const url = englishItem?.url || item?.url;
    return `<div class="resource-item"><div class="resource-item-top"><div><strong data-keep-en dir="ltr">${esc(name)}</strong><small><span data-keep-en dir="ltr">${esc(provider)}</span>${provider ? ' · ' : ''}${text(item?.time || englishItem?.time || '')}</small></div><a class="resource-link" href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${tr('OPEN ↗', 'باز کردن ↖')}</a></div><p>${text(item?.note || englishItem?.note || '')}</p></div>`;
  }
  function renderVideoCard(localVideo, englishVideo, index) {
    if (!englishVideo) return '';
    const isReference = englishVideo.kind === 'reference';
    const kicker = isReference ? tr('SUPPLEMENTARY RESOURCE', 'منبع تکمیلی') : index === 0 ? tr('PRIMARY VIDEO', 'ویدیوی اصلی') : tr('SECOND VIDEO', 'ویدیوی دوم');
    const action = isReference ? tr('Open resource ↗', 'باز کردن منبع ↖') : tr('Watch video ↗', 'تماشای ویدیو ↖');
    const duration = localVideo?.duration || englishVideo.duration || '';
    const signal = localVideo?.signal ?? englishVideo.signal ?? '';
    const note = localVideo?.note || englishVideo.note || '';
    return `<article class="card video-card"><div class="card-kicker">${kicker}</div><h3><span data-keep-en dir="ltr">${esc(englishVideo.title)}</span></h3><div class="video-meta"><span data-keep-en dir="ltr">${esc(englishVideo.creator || '')}</span>${duration ? `<span>· ${text(duration)}</span>` : ''}${signal ? `<span>· ${text(signal)}</span>` : ''}</div><p>${text(note)}</p><div class="video-actions"><a class="btn ${index === 0 ? 'primary' : 'ghost'} small" href="${safeUrl(englishVideo.url)}" target="_blank" rel="noopener noreferrer">${action}</a></div></article>`;
  }
  function checklistData(id) {
    const record = LESSON_CHECKLISTS?.[id];
    const items = record?.[currentLanguage] || record?.en || [];
    const checked = Array.isArray(state.checklists?.[id]) ? state.checklists[id] : [];
    return { items, checked, done: items.reduce((total, _, i) => total + (checked[i] === true ? 1 : 0), 0) };
  }
  const checklistCount = record => `${num(`${record.done} / ${record.items.length}`)} ${tr('completed', 'تکمیل‌شده')}`;
  function renderLessonChecklist(item) {
    const record = checklistData(item.id);
    if (!record.items.length) return '';
    const percent = Math.round(record.done / record.items.length * 100);
    return `<div class="detail-section lesson-checklist"><div class="checklist-header"><div><h3>${tr('Lesson checklist', 'چک‌لیست درس')}</h3><p>${tr('Tick each item as you complete it. Progress is saved on this device.', 'پس از انجام هر مورد، آن را علامت بزن. پیشرفت در همین دستگاه ذخیره می‌شود.')}</p></div><strong class="checklist-count" id="checklistCount">${checklistCount(record)}</strong></div><div class="checklist-progress" id="checklistProgress"><span style="width:${percent}%"></span></div><div class="checklist-list">${record.items.map((label, index) => `<label class="checklist-row ${record.checked[index] === true ? 'done' : ''}"><input type="checkbox" data-checklist-lesson="${item.id}" data-checklist-index="${index}" ${record.checked[index] === true ? 'checked' : ''}><span>${text(label)}</span></label>`).join('')}</div></div>`;
  }
  function weeksLabel(weeks) {
    const consecutive = weeks.length > 2 && weeks.every((week, i) => i === 0 || week === weeks[i - 1] + 1);
    const value = consecutive ? `${weeks[0]}–${weeks[weeks.length - 1]}` : weeks.join(' / ');
    return `${weeks.length > 1 ? tr('WEEKS', 'هفته‌های') : tr('WEEK', 'هفته')} ${num(value)}`;
  }
  function renderLessonDetail() {
    const item = lesson(selectedLesson);
    const english = englishLesson(item);
    const logged = lessonSecondsFor(item.id);
    const complete = isComplete(item.id);
    const section = (title, body) => `<div class="detail-section"><h3>${title}</h3>${body}</div>`;
    const remaining = num(Math.max(0, item.hours - hoursFromSeconds(logged)).toFixed(1));
    return `<div class="lesson-detail-top"><button class="back-link" data-nav="lessons">${tr('← Back to lessons', '→ بازگشت به درس‌ها')}</button><span class="muted">/</span><span class="tiny mono muted">${tr('MODULE', 'بخش')} ${num(item.number)}</span></div>
      <div class="detail-grid">
        <header class="detail-main detail-intro"><div class="eyebrow">${text(item.category)} · ${text(item.level)}</div><h1>${lessonTitleHtml(item)}</h1><p class="lead">${text(item.summary)}</p><div class="detail-badges"><span class="priority-tag ${priorityClass(item.priority)}">${priorityLabel(item.priority)}</span><span class="pill">${plannedHours(item.hours)} ${tr('PLANNED', 'برنامه‌ریزی‌شده')}</span><span class="pill">${weeksLabel(item.weeks)}</span>${complete ? `<span class="status-tag complete">${tr('COMPLETED', 'تکمیل‌شده')}</span>` : ''}</div></header>
        <aside class="side-sticky">
          ${renderVideoCard(item.video, english.video, 0)}
          ${item.extraVideo && english.extraVideo ? renderVideoCard(item.extraVideo, english.extraVideo, 1) : ''}
          <article class="card card-pad">${panelHead(tr('Practice this lesson', 'تمرین این درس'), tr('Direct links to guided environments', 'پیوندهای مستقیم به محیط‌های آموزشی'), `<span class="pill">${tr('LABS', 'آزمایشگاه‌ها')}</span>`)}<div class="resource-list">${item.practice.map((resource, index) => renderResource(resource, english.practice[index])).join('')}</div><div class="subtle-rule">${tr('Some platforms may require a free account or a subscription for selected rooms. Check the room’s current access terms.', 'برخی پلتفرم‌ها برای اتاق‌های منتخب به حساب رایگان یا اشتراک نیاز دارند. شرایط دسترسی فعلی هر اتاق را بررسی کن.')}</div></article>
          <article class="card card-pad">${panelHead(tr('Your time on this module', 'زمان صرف‌شده برای این بخش'), tr('Time saved through the Study Room', 'زمان ثبت‌شده از طریق اتاق مطالعه'))}<div class="report-metric"><strong>${fmtHours(logged)}</strong><span>${tr(`of ${item.hours}h planned`, `از ${num(item.hours)} ساعت برنامه‌ریزی‌شده`)}</span></div><div class="mini-track"><span style="width:${lessonPercent(item)}%"></span></div><div class="tiny muted">${tr(`${remaining} hours remaining in the suggested budget.`, `${remaining} ساعت از زمان پیشنهادی باقی مانده است.`)}</div></article>
        </aside>
        <section class="detail-main detail-body">
          ${section(tr('What this lesson teaches', 'این درس چه چیزی آموزش می‌دهد'), `<p>${text(item.teaches)}</p>`)}
          ${section(tr('Why you should learn it', 'چرا یادگیری این موضوع مهم است'), `<p>${text(item.why)}</p>`)}
          ${section(tr('What you should be able to do afterwards', 'پس از پایان درس چه توانایی‌هایی خواهی داشت'), `<p>${text(item.outcome)}</p>`)}
          ${section(tr('Requirements before you start', 'پیش‌نیازهای شروع'), `<ul>${item.requirements.map(value => `<li>${text(value)}</li>`).join('')}</ul>`)}
          ${section(tr('Practice deliverable', 'خروجی تمرین'), `<div class="deliverable">${text(item.deliverable)}</div>`)}
          ${renderLessonChecklist(item)}
          ${section(tr('Your lesson notes', 'یادداشت‌های درس'), `<p class="notes-help">${tr('Capture discoveries, questions and the evidence you would include in a report.', 'یافته‌ها، پرسش‌ها و شواهدی را که در گزارش می‌آوری ثبت کن.')}</p><textarea class="notes-area" id="lessonNotes" dir="auto" data-note-id="${item.id}" aria-label="${tr('Your lesson notes', 'یادداشت‌های درس')}" placeholder="${tr('What did you understand? What needs another pass?', 'چه چیزی را یاد گرفتی؟ کدام بخش به مرور دوباره نیاز دارد؟')}">${esc(state.notes[item.id] || '')}</textarea><div class="tiny muted">${tr('Notes save locally as you type.', 'یادداشت‌ها هنگام نوشتن ذخیره می‌شوند.')}</div>`)}
          <div class="lesson-actions"><button class="btn ${complete ? 'ghost' : 'primary'}" data-action="toggle-complete" data-id="${item.id}">${complete ? tr('Mark as not complete', 'لغو تکمیل درس') : tr('Mark lesson complete ✓', 'درس را تکمیل‌شده علامت بزن ✓')}</button><button class="btn ghost" data-action="study-lesson" data-id="${item.id}">${tr('Open Study Room for this lesson', 'باز کردن اتاق مطالعه برای این درس')}</button></div>
        </section>
      </div>`;
  }

  function renderSessionHistory() {
    const sessions = state.studySessions.slice().reverse().slice(0, 10);
    if (!sessions.length) return `<div class="history-empty">${tr('No saved sessions yet. Start the stopwatch or a focus Pomodoro, then save or complete it.', 'هنوز جلسه‌ای ذخیره نشده است. کرنومتر یا پومودوروی تمرکز را شروع کن و سپس آن را ذخیره یا تکمیل کن.')}</div>`;
    return `<div class="table-wrap"><table class="history-table"><thead><tr><th>${tr('DATE', 'تاریخ')}</th><th>${tr('SESSION', 'جلسه')}</th><th>${tr('LESSON', 'درس')}</th><th>${tr('DURATION', 'مدت')}</th></tr></thead><tbody>${sessions.map(s => `<tr><td>${fmtDate(s.timestamp)}</td><td>${esc(sessionTypeName(s.type))}</td><td>${lessonTitleHtml(lesson(s.lessonId))}</td><td>${fmtClock(s.seconds)}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function renderPomodoroHistory() {
    const rows = state.pomodoroHistory.slice().reverse().slice(0, 12);
    if (!rows.length) return `<div class="history-empty">${tr('No Pomodoro sessions yet. Every start is recorded here on this device.', 'هنوز جلسه پومودورو ثبت نشده است. هر شروع در همین دستگاه ثبت می‌شود.')}</div>`;
    return `<div class="table-wrap"><table class="history-table"><thead><tr><th>${tr('STARTED', 'شروع')}</th><th>${tr('MODE', 'حالت')}</th><th class="col-optional">${tr('PLANNED', 'برنامه‌ریزی‌شده')}</th><th>${tr('STATUS', 'وضعیت')}</th></tr></thead><tbody>${rows.map(h => `<tr><td>${fmtDate(h.startedAt)}</td><td>${esc(modeName(h.mode || 'focus'))}</td><td class="col-optional">${fmtClock(h.plannedSeconds)}</td><td><span class="history-status ${h.status === 'completed' ? 'completed' : h.status === 'stopped' ? 'stopped' : ''}">${esc(statusName(h.status || 'running'))}</span></td></tr>`).join('')}</tbody></table></div>`;
  }
  function renderStudy() {
    const sw = state.stopwatch;
    const current = lesson(studyLessonId());
    const activeMode = state.pomodoro?.mode || 'focus';
    const options = activeLessons().map(item => `<option value="${item.id}" ${item.id === current.id ? 'selected' : ''}>${num(item.number)} · ${esc(lessonTitle(item))}</option>`).join('');
    const modeButton = (mode, label) => `<button class="btn ghost small mode-button ${activeMode === mode ? 'active' : ''}" aria-pressed="${activeMode === mode}" data-action="pom-mode" data-mode="${mode}">${label}</button>`;
    const setting = (id, label, key) => `<label>${label} <input type="number" inputmode="numeric" min="${LIMITS[key][0]}" max="${LIMITS[key][1]}" id="${id}" value="${state.settings[key]}" /> ${tr('min', 'دقیقه')}</label>`;
    return `${renderPageHead(tr('FOCUS TOOLS', 'ابزارهای تمرکز'), tr('Make focused time visible.', 'زمان تمرکزت را قابل مشاهده کن.'), tr('Use the stopwatch for flexible study blocks and the Pomodoro timer for repeatable focus cycles. Both attach time to a lesson and update your course totals.', 'از کرنومتر برای بازه‌های مطالعه دلخواه و از پومودورو برای چرخه‌های تمرکز استفاده کن. هر دو زمان را به یک درس اختصاص می‌دهند و مجموع دوره را به‌روزرسانی می‌کنند.'))}
      <div class="card card-pad study-lesson">${panelHead(tr('Current lesson', 'درس فعلی'), tr('Choose which module receives your tracked focus time.', 'انتخاب کن زمان تمرکز به کدام بخش اختصاص یابد.'))}<select class="filter-select" id="studyLessonSelect" aria-label="${tr('Current lesson', 'درس فعلی')}">${options}</select><span class="tiny muted">${plannedHours(current.hours)} ${tr('planned', 'برنامه‌ریزی‌شده')} · ${fmtHours(lessonSecondsFor(current.id))} ${tr('logged', 'ثبت‌شده')}</span></div>
      <div class="study-grid">
        <article class="card timer-card"><div class="timer-top"><div class="timer-title"><span class="timer-icon" aria-hidden="true">◷</span><div><h2>${tr('Stopwatch', 'کرنومتر')}</h2><small>${tr('Flexible study tracking', 'ثبت زمان مطالعه دلخواه')}</small></div></div></div><div class="timer-display" id="stopwatchDisplay" dir="ltr">${fmtClock(stopwatchSeconds())}</div><div class="timer-sub" id="stopwatchState"></div><div class="timer-controls"><button class="btn primary" id="swStart" data-action="sw-start">${tr('Start', 'شروع')}</button><button class="btn ghost" id="swPause" data-action="sw-pause">${tr('Pause', 'مکث')}</button><button class="btn ghost" id="swSave" data-action="sw-save">${tr('Save session', 'ذخیره جلسه')}</button><button class="btn danger" id="swReset" data-action="sw-reset">${tr('Reset', 'بازنشانی')}</button></div><div class="timer-foot"><span>${tr('Time is logged when saved', 'زمان هنگام ذخیره ثبت می‌شود')}</span>${sw.running || sw.elapsedSeconds > 0 ? `<span>${lessonTitleHtml(lesson(sw.lessonId))}</span>` : ''}</div></article>
        <article class="card timer-card"><div class="timer-top"><div class="timer-title"><span class="timer-icon" aria-hidden="true">✳</span><div><h2>${tr('Pomodoro', 'پومودورو')}</h2><small>${tr('Focus, then take a real break', 'تمرکز کن، سپس واقعاً استراحت کن')}</small></div></div></div><div class="timer-controls mode-row">${modeButton('focus', tr('Focus', 'تمرکز'))}${modeButton('short', tr('Short break', 'استراحت کوتاه'))}${modeButton('long', tr('Long break', 'استراحت طولانی'))}</div><div class="timer-display" id="pomodoroDisplay" dir="ltr"></div><div class="timer-sub" id="pomodoroState"></div><div class="timer-controls"><button class="btn primary" id="pomStart" data-action="pom-start"></button><button class="btn ghost" id="pomPause" data-action="pom-pause">${tr('Pause', 'مکث')}</button><button class="btn danger" id="pomStop" data-action="pom-stop">${tr('Stop & log', 'توقف و ثبت')}</button></div><div class="divider"></div><div class="timer-settings">${setting('focusMinutes', tr('Focus', 'تمرکز'), 'focusMinutes')}${setting('shortMinutes', tr('Short', 'کوتاه'), 'shortBreakMinutes')}${setting('longMinutes', tr('Long', 'طولانی'), 'longBreakMinutes')}<button class="btn ghost small" data-action="pom-settings">${tr('Apply', 'اعمال')}</button></div></article>
      </div>
      <section class="card card-pad timer-history">${panelHead(tr('Pomodoro start history', 'تاریخچه شروع پومودورو'), tr(`${state.pomodoroHistory.length} starts recorded`, `${num(state.pomodoroHistory.length)} شروع ثبت شده`), state.pomodoroHistory.length ? `<button class="btn ghost small" data-action="pom-clear">${tr('Clear history', 'پاک کردن تاریخچه')}</button>` : '')}${renderPomodoroHistory()}</section>
      <section class="card card-pad timer-history">${panelHead(tr('Recent study sessions', 'جلسه‌های مطالعه اخیر'), tr('Sessions saved into your course total.', 'جلسه‌هایی که در مجموع زمان دوره ذخیره شده‌اند.'))}${renderSessionHistory()}</section>`;
  }

  function renderReports() {
    const total = totalLoggedSeconds();
    const week = weeklyActivity(); const max = Math.max(1, ...week.map(day => day.seconds));
    const bar = (label, percent, value, title = '') => `<div class="bar-row"><span class="bar-label" ${title ? `title="${esc(title)}"` : ''}>${label}</span><div class="bar-track"><span style="width:${percent}%"></span></div><b>${value}</b></div>`;
    const weekBars = week.map(day => bar(day.label, Math.min(100, day.seconds / max * 100), fmtHours(day.seconds))).join('');
    const tracked = activeLessons().filter(item => lessonSecondsFor(item.id) > 0).sort((a, b) => lessonSecondsFor(b.id) - lessonSecondsFor(a.id)).slice(0, 8);
    const lessonBars = tracked.map(item => bar(lessonTitleHtml(item), lessonPercent(item), fmtHours(lessonSecondsFor(item.id)), lessonTitle(item))).join('')
      || `<div class="history-empty">${tr('Lessons appear here once you save study time.', 'پس از ذخیره زمان مطالعه، درس‌ها اینجا نمایش داده می‌شوند.')}</div>`;
    const complete = state.completed.length;
    const achievements = [
      { icon: '◷', name: tr('First focus block', 'اولین بازه تمرکز'), desc: tr('Complete your first saved session.', 'اولین جلسه ذخیره‌شده‌ات را تکمیل کن.'), ok: total > 0 },
      { icon: '✳', name: tr('Three-day rhythm', 'پیوستگی سه‌روزه'), desc: tr('Log study on three consecutive days.', 'در سه روز پیاپی زمان مطالعه ثبت کن.'), ok: streakDays() >= 3 },
      { icon: '▤', name: tr('First lesson done', 'اولین درس تکمیل‌شده'), desc: tr('Mark a module as complete.', 'یک بخش را تکمیل‌شده علامت بزن.'), ok: complete >= 1 },
      { icon: '⌁', name: tr('Notebook habit', 'عادت یادداشت‌برداری'), desc: tr('Write a lesson note longer than 20 characters.', 'برای یک درس یادداشتی بیش از ۲۰ نویسه بنویس.'), ok: Object.values(state.notes).some(v => String(v).trim().length > 20) },
      { icon: '◆', name: tr('Ten focus hours', 'ده ساعت تمرکز'), desc: tr('Accumulate ten tracked study hours.', 'مجموع زمان مطالعه را به ده ساعت برسان.'), ok: hoursFromSeconds(total) >= 10 },
      { icon: '⬡', name: tr('Halfway there', 'رسیدن به نیمه مسیر'), desc: tr('Complete seven modules.', 'هفت بخش را تکمیل کن.'), ok: complete >= 7 }
    ];
    const moduleRows = activeLessons().map(item => lessonRow(item, tr(`${fmtHours(lessonSecondsFor(item.id))} logged of ${item.hours}h planned`, `${fmtHours(lessonSecondsFor(item.id))} ثبت‌شده از ${num(item.hours)} ساعت`), { bar: false, html: `<span class="status-tag ${lessonStatus(item.id)}">${lessonStatusLabel(item.id)}</span>` })).join('');
    return `${renderPageHead(tr('YOUR LEARNING ANALYTICS', 'گزارش تحلیلی یادگیری'), tr('Progress you can prove.', 'پیشرفتی که می‌توانی نشان بدهی.'), tr('A private view of your course time, completed modules and daily activity. Export it when you want to keep a backup or review your learning.', 'نمایی خصوصی از زمان دوره، بخش‌های تکمیل‌شده و فعالیت روزانه. هر زمان خواستی از آن خروجی یا پشتیبان بگیر.'))}
      <div class="stat-grid">${statCard(tr('TOTAL STUDY TIME', 'مجموع زمان مطالعه'), fmtHours(total), tr(`${fmtHours(Math.max(0, COURSE_HOURS * 3600 - total))} remaining to course target`, `${fmtHours(Math.max(0, COURSE_HOURS * 3600 - total))} تا هدف دوره`))}${statCard(tr('MODULE COMPLETION', 'تکمیل بخش‌ها'), percentText(completionPercent()), tr(`${complete} of ${activeLessons().length} marked complete`, `${num(complete)} از ${num(activeLessons().length)} بخش تکمیل شده`))}${statCard(tr('POMODORO STARTS', 'دفعات شروع پومودورو'), num(state.pomodoroHistory.length), tr('Each start saved with a timestamp', 'هر شروع همراه با زمان ثبت می‌شود'))}${statCard(tr('CURRENT STREAK', 'پیوستگی فعلی'), `${num(streakDays())}${unit(tr('days', 'روز'))}`, tr('Days with saved study time', 'روزهای دارای زمان مطالعه'))}</div>
      <div class="report-grid"><article class="card report-card">${panelHead(tr('This week', 'این هفته'), tr('Hours recorded by day', 'ساعت‌های ثبت‌شده در هر روز'))}<div class="bar-chart">${weekBars}</div><div class="report-footnote">${tr('The baseline is about 12 hours per week. A steady rhythm is more useful than one exhausting catch-up day.', 'برنامه پایه حدود ۱۲ ساعت در هفته است. ریتم منظم از یک روز جبرانیِ فرساینده مفیدتر است.')}</div></article><article class="card report-card">${panelHead(tr('Time by lesson', 'زمان صرف‌شده برای هر درس'), tr('Up to eight modules with the most tracked time', 'حداکثر هشت بخش با بیشترین زمان ثبت‌شده'))}<div class="bar-chart lesson-chart">${lessonBars}</div><div class="report-footnote">${tr('Use the module target as a guide, not a stopwatch test. Move on when you can explain the topic and complete the practice task.', 'هدف زمانی هر بخش فقط راهنماست. وقتی بتوانی موضوع را توضیح بدهی و تمرین را کامل کنی، جلو برو.')}</div></article></div>
      <section class="card card-pad stacked">${panelHead(tr('Milestones', 'نقاط عطف'), tr('Small wins that reinforce consistent practice', 'موفقیت‌های کوچک برای تقویت تمرین مستمر'), `<span class="pill">${num(`${achievements.filter(a => a.ok).length} / ${achievements.length}`)} ${tr('UNLOCKED', 'فعال‌شده')}</span>`)}<div class="achievement-grid">${achievements.map(a => `<div class="achievement ${a.ok ? 'unlocked' : ''}"><span class="badge-icon" aria-hidden="true">${a.icon}</span><strong>${a.name} ${a.ok ? '✓' : ''}</strong><small>${a.desc}</small></div>`).join('')}</div></section>
      <section class="card card-pad stacked">${panelHead(tr('Module completion report', 'گزارش تکمیل بخش‌ها'), tr('Mark a module complete only after you can explain it and finish its lab practice.', 'فقط وقتی یک بخش را تکمیل‌شده علامت بزن که بتوانی آن را توضیح بدهی و تمرینش را تمام کنی.'))}<div class="resource-list">${moduleRows}</div></section>
      <section class="card card-pad stacked">${panelHead(tr('Your data', 'داده‌های تو'), tr('Everything is stored only in this browser. Back it up before moving to another device.', 'همه چیز فقط در همین مرورگر ذخیره می‌شود. پیش از تغییر دستگاه نسخه پشتیبان بگیر.'))}<div class="data-actions"><button class="btn primary" data-action="export-json">${tr('Backup data ↓', 'پشتیبان‌گیری ↓')}</button><button class="btn ghost" data-action="import-json">${tr('Restore backup ↑', 'بازیابی پشتیبان ↑')}</button><button class="btn ghost" data-action="export-csv">${tr('Export CSV ↓', 'خروجی CSV ↓')}</button><button class="btn danger" data-action="reset-all">${tr('Reset all progress', 'پاک کردن همه پیشرفت')}</button><input type="file" id="importFile" accept="application/json,.json" hidden></div></section>`;
  }

  function renderGuide() {
    const dailyHours = num((state.settings.dailyGoalMinutes / 60).toFixed(1));
    const routine = [
      [10, tr('Recall yesterday', 'مرور آموخته‌های دیروز'), tr('Close your notes and write what you remember. Then check what you missed.', 'یادداشت‌ها را ببند و آنچه به خاطر داری بنویس. سپس موارد جاافتاده را بررسی کن.')],
      [35, tr('Learn one concept', 'یادگیری یک مفهوم'), tr('Use the short video or lesson text. Pause to sketch a diagram or define a term in your own words.', 'از ویدیوی کوتاه یا متن درس استفاده کن. برای رسم نمودار یا تعریف اصطلاح با زبان خودت مکث کن.')],
      [10, tr('Take a real break', 'استراحت واقعی'), tr('Step away from the screen. A break helps the next practice block stay focused.', 'از صفحه‌نمایش فاصله بگیر. استراحت کمک می‌کند بازه بعدی متمرکز بماند.')],
      [45, tr('Apply it in a lab', 'به‌کارگیری در آزمایشگاه'), tr('Use only the named training room. Record the steps you took, the result and what it means.', 'فقط از اتاق آموزشی مشخص‌شده استفاده کن. مراحل، نتیجه و معنای آن را ثبت کن.')],
      [15, tr('Write a mini report', 'نوشتن گزارش کوتاه'), tr('Explain what you learned, what remains unclear and how the issue could be prevented.', 'آنچه یاد گرفتی، موارد نامشخص و راه پیشگیری از مشکل را توضیح بده.')],
      [5, tr('Plan the next session', 'برنامه‌ریزی جلسه بعد'), tr('Choose one small next action instead of opening ten tabs and losing your focus.', 'به‌جای باز کردن ده زبانه، یک اقدام کوچک برای جلسه بعد انتخاب کن.')]
    ];
    const advice = [
      [tr('Watch with a question', 'با یک سؤال تماشا کن'), tr('Before pressing play, write one thing you need to understand. Stop when you can answer it.', 'پیش از شروع ویدیو، موضوعی را که باید بفهمی بنویس. وقتی توانستی پاسخ بدهی، متوقفش کن.')],
      [tr('Practice before you feel ready', 'پیش از احساس آمادگی کامل تمرین کن'), tr('Try the lab after the explanation. Look up documentation when you are stuck; do not jump straight to a walkthrough.', 'پس از توضیح، آزمایشگاه را امتحان کن. هنگام گیر کردن مستندات را بخوان و مستقیم سراغ راهنمای حل نرو.')],
      [tr('Keep an evidence notebook', 'دفترچه شواهد داشته باش'), tr('Record the target scope, observation, evidence, uncertainty and remediation—not just commands.', 'محدوده هدف، مشاهده، شواهد، موارد نامطمئن و راهکار اصلاح را ثبت کن، نه فقط فرمان‌ها را.')],
      [tr('Teach it back', 'آن را با زبان خودت توضیح بده'), tr('Explain the concept in three sentences as if you were briefing a teammate. If you cannot, revisit the gap.', 'مفهوم را در سه جمله، انگار برای هم‌تیمی‌ات، توضیح بده. اگر نتوانستی، به بخش نامفهوم برگرد.')],
      [tr('Review weekly', 'هر هفته مرور کن'), tr('Spend one lighter session revisiting notes, completing unfinished labs and updating your report.', 'یک جلسه سبک‌تر را به مرور یادداشت‌ها، تکمیل آزمایشگاه‌ها و به‌روزرسانی گزارش اختصاص بده.')]
    ];
    const quests = [
      [tr('Explain it simply', 'ساده توضیح بده'), tr('Describe a protocol or vulnerability without using jargon.', 'یک پروتکل یا آسیب‌پذیری را بدون اصطلاحات پیچیده توضیح بده.')],
      [tr('Draw the flow', 'مسیر را ترسیم کن'), tr('Sketch a login, network request or permission boundary.', 'فرایند ورود، درخواست شبکه یا مرز دسترسی را رسم کن.')],
      [tr('Fix, then retest', 'اصلاح کن و دوباره بیازما'), tr('Turn one lab finding into a remediation checklist.', 'یک یافته آزمایشگاهی را به چک‌لیست اصلاح تبدیل کن.')]
    ];
    return `${renderPageHead(tr('HOW TO STUDY', 'روش مطالعه'), tr('Consistency beats marathon sessions.', 'پیوستگی از جلسات طولانی و فرسایشی بهتر است.'), tr('This path is designed for steady skill-building. Your goal is not to watch every minute of every video; it is to understand a concept, apply it in a safe lab and explain your evidence.', 'این مسیر برای ساخت تدریجی مهارت طراحی شده است. هدف تماشای تمام دقایق ویدیوها نیست؛ هدف درک مفهوم، به‌کارگیری آن در آزمایشگاه امن و توضیح شواهد است.'), `<button class="btn ghost" data-nav="study">${tr('Open study room', 'باز کردن اتاق مطالعه')}</button>`)}
      <div class="guide-grid"><article class="card card-pad">${panelHead(tr('A realistic daily routine', 'برنامه روزانه واقع‌بینانه'), tr(`Your target: ${dailyHours} focused hours`, `هدف تو: ${dailyHours} ساعت تمرکز`), `<span class="pill">${tr('6 DAYS / WEEK', '۶ روز در هفته')}</span>`)}<div class="routine">${routine.map(([minutes, title, body]) => `<div class="routine-step"><div class="routine-time">${num(minutes)} ${tr('MIN', 'دقیقه')}</div><div><strong>${title}</strong><p>${body}</p></div></div>`).join('')}</div><div class="divider"></div><label class="tiny muted" for="dailyGoal">${tr('Set your daily study target (minutes)', 'هدف روزانه مطالعه را تعیین کن (دقیقه)')}</label><div class="goal-row"><input class="filter-select" type="number" inputmode="numeric" id="dailyGoal" min="30" max="360" step="15" value="${state.settings.dailyGoalMinutes}"/><button class="btn primary small" data-action="save-goal">${tr('Save daily target', 'ذخیره هدف روزانه')}</button></div><div class="subtle-rule">${tr('A useful starting point is 90–120 minutes on six days per week. Reduce the target during exam weeks or busy periods; consistency matters more than a fixed number.', 'نقطه شروع مناسب، ۹۰ تا ۱۲۰ دقیقه در شش روز هفته است. در دوره‌های شلوغ هدف را کاهش بده؛ پیوستگی از عدد ثابت مهم‌تر است.')}</div></article>
      <div class="guide-side"><article class="card card-pad">${panelHead(tr('How to get real results', 'چطور به نتیجه واقعی برسی'), tr('Use an active learning loop', 'از چرخه یادگیری فعال استفاده کن'))}<div class="advice-list">${advice.map(([title, body], i) => `<div class="advice-item"><span class="advice-no">${num(pad(i + 1))}</span><div><strong>${title}</strong><p>${body}</p></div></div>`).join('')}</div></article>
      <article class="card card-pad">${panelHead(tr('Make learning less repetitive', 'یادگیری را از یکنواختی خارج کن'), tr('Use small missions to keep momentum', 'برای حفظ انگیزه از مأموریت‌های کوچک استفاده کن'))}<div class="milestone-grid">${quests.map(([title, body]) => `<div class="milestone"><strong>${title}</strong><p>${body}</p></div>`).join('')}</div></article></div></div>
      <article class="card card-pad stacked">${panelHead(tr('Professional boundaries are a core skill', 'رعایت مرزهای حرفه‌ای یک مهارت اساسی است'), tr('Every practical exercise in this course should follow these rules', 'تمام تمرین‌های عملی این دوره باید از این قواعد پیروی کنند'))}<div class="safety-note">${tr('Only test systems that you own or that are explicitly provided for training, and follow the platform’s written scope. Never scan or access a real organization, person, account or public service without explicit written authorization. Do not collect real credentials or personal data. Stop if a lab behaves outside its stated scope. Ethical testing means minimizing impact and reporting clearly.', 'فقط سامانه‌هایی را آزمایش کن که مالک آن‌ها هستی یا مشخصاً برای آموزش در اختیارت قرار گرفته‌اند و محدوده مکتوب پلتفرم را رعایت کن. بدون مجوز کتبی و صریح، سازمان، فرد، حساب یا سرویس عمومی واقعی را اسکن نکن و به آن دسترسی نگیر. اعتبارنامه یا داده شخصی واقعی جمع‌آوری نکن. اگر آزمایشگاه از محدوده اعلام‌شده خارج شد، متوقف شو. آزمون اخلاقی یعنی کاهش اثر و گزارش‌دهی روشن.')}</div></article>`;
  }

  // ---------- Rendering and navigation ----------
  const RENDERERS = { home: renderHome, roadmap: renderRoadmap, tree: renderTree, lessons: renderLessons, 'lesson-detail': renderLessonDetail, study: renderStudy, reports: renderReports, guide: renderGuide };
  let revealObserver = null;
  function observeScrollItems() {
    revealObserver?.disconnect();
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.05 });
    $$('.lesson-card, .week-card, .report-card, .milestone, .advice-item').forEach(node => { node.classList.add('scroll-reveal'); revealObserver.observe(node); });
  }
  function render(animate) {
    const root = $('#pageContent');
    root.innerHTML = RENDERERS[currentPage]();
    $('#currentCrumb').textContent = tr(...CRUMBS[currentPage]);
    const activeNav = currentPage === 'lesson-detail' ? 'lessons' : currentPage;
    $$('.nav-link').forEach(button => {
      const active = button.dataset.page === activeNav;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
    });
    if (animate) {
      root.classList.remove('reveal'); void root.offsetWidth; root.classList.add('reveal');
      observeScrollItems();
    }
    updateLiveTimers();
  }
  // Redraws the current page in place, without animation.
  function refresh() {
    $('#pageContent').classList.remove('reveal');
    render(false);
  }
  const routeFor = (page, id) => page === 'lesson-detail' ? `#lesson/${id}` : `#${page}`;
  function showRoute() {
    const [name, id] = window.location.hash.slice(1).split('/');
    if (name === 'lesson' && isLessonId(id)) { currentPage = 'lesson-detail'; selectedLesson = id; }
    else currentPage = PAGES.includes(name) && name !== 'lesson-detail' ? name : 'home';
    closeMenu();
    render(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
  function navigate(page, id = selectedLesson) {
    const route = routeFor(page, id);
    if (window.location.hash !== route) {
      try { window.history.pushState(null, '', route); }
      catch (_) { window.location.hash = route; }
    }
    showRoute();
  }
  function openWeek(weekNo) {
    navigate('roadmap');
    const target = $(`#week-${weekNo}`);
    if (!target) return;
    target.classList.add('is-visible', 'highlight');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => target.classList.remove('highlight'), 1800);
  }

  // ---------- Interface ----------
  function showToast(message) {
    const toast = $('#toast'); if (!toast) return;
    toast.textContent = message; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }
  function setMenu(open) {
    $('#sidebar').classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    $('#mobileMenu').setAttribute('aria-expanded', String(open));
  }
  const closeMenu = () => setMenu(false);
  function applyLanguage() {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = isFa() ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach(el => { el.textContent = tr(...STATIC_TEXT[el.dataset.i18n]); });
    $$('[data-i18n-label]').forEach(el => el.setAttribute('aria-label', tr(...STATIC_TEXT[el.dataset.i18nLabel])));
    $('#todayLabel').textContent = new Intl.DateTimeFormat(locale(), { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date());
    $('#lessonCount').textContent = num(activeLessons().length);
    const description = $('meta[name="description"]');
    if (description) description.content = tr('A practical ethical cybersecurity learning roadmap with a 12-week plan, labs and progress tracking.', 'نقشه راه فارسی و کاربردی یادگیری امنیت سایبری اخلاقی همراه با برنامه ۱۲ هفته‌ای، آزمایشگاه‌ها و پیگیری پیشرفت.');
    $$('[data-language]').forEach(button => {
      const selected = button.dataset.language === currentLanguage;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  function setLanguage(language) {
    if (language === currentLanguage) return;
    currentLanguage = language;
    try { localStorage.setItem(LANGUAGE_KEY, currentLanguage); } catch (_) {}
    applyLanguage(); refresh();
  }

  // ---------- Data export and restore ----------
  function exportFile(filename, content, mime) {
    const url = URL.createObjectURL(new Blob([content], { type: mime }));
    const link = document.createElement('a'); link.href = url; link.download = filename;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function exportJson() {
    const payload = { exportedAt: new Date().toISOString(), courseHours: COURSE_HOURS, ...state };
    exportFile('nightshift-progress-backup.json', JSON.stringify(payload, null, 2), 'application/json');
    showToast(tr('Progress backup exported.', 'نسخه پشتیبان پیشرفت ساخته شد.'));
  }
  async function importJson(file) {
    let data;
    try { data = JSON.parse((await file.text()).replace(/^﻿/, '')); } catch (_) { data = null; }
    if (!isObject(data) || !Array.isArray(data.completed) || !isObject(data.lessonSeconds)) {
      showToast(tr('This file is not a Nightshift backup.', 'این فایل نسخه پشتیبان نایت‌شیفت نیست.'));
      return;
    }
    if (!window.confirm(tr('Replace the progress in this browser with this backup?', 'پیشرفت فعلی این مرورگر با این نسخه پشتیبان جایگزین شود؟'))) return;
    state = normalizeState(data); selectedLesson = state.stopwatch.lessonId;
    persist(); refresh();
    showToast(tr('Backup restored.', 'نسخه پشتیبان بازیابی شد.'));
  }
  function csvCell(value) {
    let cell = String(value ?? '');
    if (/^[=+\-@\t\r]/.test(cell)) cell = `'${cell}`; // stop spreadsheets from running text as a formula
    return `"${cell.replace(/"/g, '""')}"`;
  }
  function exportCsv() {
    const rows = [[tr('Module', 'بخش'), tr('Priority', 'اولویت'), tr('Planned hours', 'ساعت برنامه‌ریزی‌شده'), tr('Logged hours', 'ساعت ثبت‌شده'), tr('Status', 'وضعیت'), tr('Checklist', 'چک‌لیست'), tr('Notes', 'یادداشت')]];
    activeLessons().forEach(item => {
      const checklist = checklistData(item.id);
      rows.push([lessonTitle(item), priorityLabel(item.priority), item.hours, hoursFromSeconds(lessonSecondsFor(item.id)).toFixed(2), lessonStatusLabel(item.id), `${checklist.done} of ${checklist.items.length}`, String(state.notes[item.id] || '').replace(/\s+/g, ' ')]);
    });
    // The byte-order mark lets Excel read Persian text correctly.
    exportFile('nightshift-lesson-progress.csv', '﻿' + rows.map(row => row.map(csvCell).join(',')).join('\r\n'), 'text/csv;charset=utf-8');
    showToast(tr('Lesson progress exported.', 'گزارش پیشرفت درس‌ها ساخته شد.'));
  }
  function resetAll() {
    if (!window.confirm(tr('Reset all local Nightshift progress, notes, timers and history? This cannot be undone.', 'تمام پیشرفت، یادداشت‌ها، تایمرها و تاریخچه پاک شود؟ این کار قابل بازگشت نیست.'))) return;
    try { localStorage.removeItem(STORE_KEY); } catch (_) {}
    state = defaultState(); selectedLesson = state.stopwatch.lessonId;
    navigate('home');
    showToast(tr('Local workspace reset.', 'فضای کار محلی بازنشانی شد.'));
  }

  // ---------- Events (delegated, bound once) ----------
  const ACTIONS = {
    'open-lesson': el => navigate('lesson-detail', el.dataset.id),
    'open-week': el => openWeek(Number(el.dataset.week)),
    'toggle-complete': el => {
      const id = el.dataset.id;
      state.completed = isComplete(id) ? state.completed.filter(item => item !== id) : [...state.completed, id];
      persist(); refresh();
      showToast(isComplete(id) ? tr('Lesson marked complete.', 'درس تکمیل‌شده ثبت شد.') : tr('Completion status updated.', 'وضعیت تکمیل به‌روزرسانی شد.'));
    },
    'study-lesson': el => {
      selectedLesson = el.dataset.id;
      const busy = state.stopwatch.running || state.stopwatch.elapsedSeconds > 0 || pomodoroActive();
      if (!busy) { state.stopwatch.lessonId = selectedLesson; persist(); }
      navigate('study');
      if (busy && studyLessonId() !== el.dataset.id) showToast(tr('A timer holds time for another lesson. Save, stop or reset it first.', 'یک تایمر زمان درس دیگری را نگه داشته است. اول آن را ذخیره، متوقف یا بازنشانی کن.'));
    },
    'sw-start': startStopwatch,
    'sw-pause': pauseStopwatch,
    'sw-save': saveStopwatch,
    'sw-reset': resetStopwatch,
    'pom-mode': el => setPomodoroMode(el.dataset.mode),
    'pom-start': startPomodoro,
    'pom-pause': pausePomodoro,
    'pom-stop': stopPomodoro,
    'pom-settings': savePomodoroSettings,
    'pom-clear': () => {
      if (!window.confirm(tr('Clear the Pomodoro start history? Your saved course time will remain.', 'تاریخچه شروع پومودورو پاک شود؟ زمان ذخیره‌شده دوره باقی می‌ماند.'))) return;
      state.pomodoroHistory = []; persist(); refresh();
      showToast(tr('Pomodoro history cleared.', 'تاریخچه پومودورو پاک شد.'));
    },
    'save-goal': () => {
      const minutes = Number($('#dailyGoal')?.value);
      if (!Number.isInteger(minutes) || minutes < 30 || minutes > 360) { showToast(tr('Set a daily target between 30 and 360 minutes.', 'هدف روزانه را بین ۳۰ تا ۳۶۰ دقیقه تعیین کن.')); return; }
      state.settings.dailyGoalMinutes = minutes; persist(); refresh();
      showToast(tr('Daily target saved.', 'هدف روزانه ذخیره شد.'));
    },
    'export-json': exportJson,
    'import-json': () => $('#importFile')?.click(),
    'export-csv': exportCsv,
    'reset-all': resetAll
  };
  function onClick(event) {
    const target = event.target.closest('[data-action], [data-nav], .nav-link, [data-language], #mobileMenu, #sidebarClose, #navBackdrop, .brand');
    if (!target) return;
    if (target.id === 'mobileMenu') setMenu(!$('#sidebar').classList.contains('open'));
    else if (target.id === 'sidebarClose' || target.id === 'navBackdrop') closeMenu();
    else if (target.matches('.brand')) { event.preventDefault(); navigate('home'); }
    else if (target.matches('.nav-link')) navigate(target.dataset.page);
    else if (target.dataset.nav) navigate(target.dataset.nav);
    else if (target.dataset.language) setLanguage(target.dataset.language === 'fa' ? 'fa' : 'en');
    else ACTIONS[target.dataset.action]?.(target);
  }
  function onInput(event) {
    const el = event.target;
    if (el.id === 'lessonSearch') {
      lessonQuery = el.value;
      const visible = filteredLessons();
      $('#lessonGrid').innerHTML = lessonCards(visible);
      $('#lessonShown').textContent = lessonCount(visible);
    } else if (el.id === 'lessonNotes') {
      state.notes[el.dataset.noteId] = el.value; persist();
    }
  }
  function onChange(event) {
    const el = event.target;
    if (el.id === 'lessonFilter') {
      lessonFilter = el.value; refresh(); $('#lessonFilter')?.focus();
    } else if (el.id === 'studyLessonSelect') {
      if (state.stopwatch.running || state.pomodoro?.running) {
        showToast(tr('Pause the active timer before switching lessons.', 'پیش از تغییر درس، تایمر فعال را متوقف کن.'));
        refresh(); return;
      }
      selectedLesson = el.value; state.stopwatch.lessonId = el.value;
      if (state.pomodoro) {
        state.pomodoro.lessonId = el.value;
        const history = state.pomodoroHistory.find(item => item.id === state.pomodoro.historyId);
        if (history && pomodoroActive() && history.mode === 'focus') history.lessonId = el.value;
      }
      persist(); refresh();
    } else if (el.id === 'importFile' && el.files?.[0]) {
      importJson(el.files[0]); el.value = '';
    } else if (el.dataset.checklistLesson) {
      const id = el.dataset.checklistLesson;
      if (!Array.isArray(state.checklists[id])) state.checklists[id] = [];
      state.checklists[id][Number(el.dataset.checklistIndex)] = el.checked;
      persist();
      const record = checklistData(id);
      $('#checklistCount').textContent = checklistCount(record);
      $('#checklistProgress span').style.width = `${Math.round(record.done / Math.max(1, record.items.length) * 100)}%`;
      el.closest('.checklist-row')?.classList.toggle('done', el.checked);
    }
  }
  function timerTick() {
    if (state.pomodoro?.running && pomodoroRemaining() <= 0) completePomodoro();
    updateLiveTimers();
  }
  function setup() {
    document.addEventListener('click', onClick);
    document.addEventListener('input', onInput);
    document.addEventListener('change', onChange);
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('popstate', showRoute);
    // Keeps two open tabs from overwriting each other's progress.
    window.addEventListener('storage', event => {
      if (event.key !== STORE_KEY) return;
      state = loadState();
      if (!document.activeElement?.matches('input, textarea, select')) refresh();
    });
    applyLanguage();
    showRoute();
    if (state.pomodoro?.running && pomodoroRemaining() <= 0) completePomodoro();
    setInterval(timerTick, 500);
  }
  document.addEventListener('DOMContentLoaded', setup);
})();
