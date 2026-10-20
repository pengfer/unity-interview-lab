/* =========================================================
   Unity 面试题库 · 应用逻辑
   纯静态单页应用，数据与进度全部存在浏览器本地
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- 基础工具 ---------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var DAY = 86400000;
  var LEVELS = ['基础', '进阶', '高级'];

  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function dayKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }
  function fmtClock(ms) {
    var s = Math.max(0, Math.round(ms / 1000));
    return pad2(Math.floor(s / 60)) + ':' + pad2(s % 60);
  }
  function fmtDate(t) {
    var d = new Date(t);
    return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pct(a, b) { return b > 0 ? Math.round(a / b * 100) : 0; }

  /* ---------------- 题库索引 ---------------- */
  var BANK = Array.isArray(window.UNITY_BANK) ? window.UNITY_BANK.filter(function (q) {
    return q && q.id && q.q && Array.isArray(q.options) && Array.isArray(q.answer);
  }) : [];
  var BY_ID = Object.create(null);
  BANK.forEach(function (q) { BY_ID[q.id] = q; });

  var CATS = [
    { id: 'cs', name: 'C# 语言', icon: '⌨️', color: '#5b8cff' },
    { id: 'engine', name: '引擎核心', icon: '⚙️', color: '#7c5cff' },
    { id: 'physics', name: '物理系统', icon: '🧲', color: '#f97316' },
    { id: 'render', name: '渲染图形', icon: '🎨', color: '#14b8a6' },
    { id: 'anim', name: '动画系统', icon: '🏃', color: '#e11d48' },
    { id: 'ui', name: 'UI 系统', icon: '🖼️', color: '#0ea5e9' },
    { id: 'perf', name: '性能优化', icon: '⚡', color: '#f59e0b' },
    { id: 'asset', name: '资源管理', icon: '📦', color: '#8b5cf6' },
    { id: 'net', name: '网络同步', icon: '🌐', color: '#10b981' },
    { id: 'arch', name: '架构设计', icon: '🏛️', color: '#ec4899' },
    { id: 'math', name: '数学算法', icon: '📐', color: '#6366f1' }
  ];
  var CAT_MAP = Object.create(null);
  CATS.forEach(function (c) { CAT_MAP[c.id] = c; });
  function catOf(id) {
    return CAT_MAP[id] || { id: id, name: id || '其他', icon: '📘', color: '#8a92a3' };
  }

  /* ---------------- 本地状态 ---------------- */
  var KEY = 'unity_interview_lab_v1';
  function fresh() {
    return {
      v: 1,
      created: Date.now(),
      settings: { theme: 'auto', goal: 20 },
      days: {},
      prog: {},
      stars: {},
      wrong: {},
      exams: []
    };
  }
  var S = (function () {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return fresh();
      var o = JSON.parse(raw);
      var base = fresh();
      if (o && typeof o === 'object') {
        base.settings = Object.assign(base.settings, o.settings || {});
        base.days = o.days || {};
        base.prog = o.prog || {};
        base.stars = o.stars || {};
        base.wrong = o.wrong || {};
        base.exams = Array.isArray(o.exams) ? o.exams : [];
        base.created = o.created || base.created;
      }
      return base;
    } catch (e) { return fresh(); }
  })();
  var saveTimer = null;
  function save() {
    if (saveTimer) return;
    saveTimer = setTimeout(function () {
      saveTimer = null;
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* 隐私模式忽略 */ }
    }, 60);
  }
  function saveNow() {
    saveTimer = null;
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  }

  /* ---------------- 主题 ---------------- */
  function resolvedTheme() {
    var t = S.settings.theme;
    if (t === 'light' || t === 'dark') return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme() {
    document.body.dataset.theme = resolvedTheme();
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', resolvedTheme() === 'dark' ? '#0a0d13' : '#f3f5f9');
  }

  /* ---------------- 学习进度算法 ---------------- */
  var BOX_GAP = [0, 1, 2, 4, 8, 16]; /* 天 */
  function progOf(id) {
    var p = S.prog[id];
    if (!p) { p = S.prog[id] = { box: 0, seen: 0, ok: 0, bad: 0, due: 0 }; }
    return p;
  }
  function dayRec() {
    var k = dayKey();
    var d = S.days[k];
    if (!d) { d = S.days[k] = { n: 0, c: 0, checkin: false }; }
    return d;
  }
  function answer(id, correct) {
    var p = progOf(id);
    var d = dayRec();
    p.seen += 1;
    p.last = Date.now();
    d.n += 1;
    if (correct) {
      p.ok += 1;
      p.box = Math.min(5, (p.box || 0) + 1);
      d.c += 1;
      if (S.wrong[id]) delete S.wrong[id];
    } else {
      p.bad += 1;
      p.box = 0;
      S.wrong[id] = { t: Date.now(), n: ((S.wrong[id] && S.wrong[id].n) || 0) + 1 };
    }
    p.due = Date.now() + BOX_GAP[p.box] * DAY;
    if (!d.checkin && d.n >= S.settings.goal) {
      d.checkin = true;
      d.goalHit = true;
      toast('今日目标完成，自动打卡 ✓');
    }
    save();
  }
  function totals() {
    var n = 0, c = 0;
    for (var k in S.days) {
      n += S.days[k].n || 0;
      c += S.days[k].c || 0;
    }
    return { n: n, c: c, acc: n ? Math.round(c / n * 100) : 0 };
  }
  function dueCount() {
    var now = Date.now(), n = 0;
    for (var k in S.prog) {
      var p = S.prog[k];
      if (p.seen > 0 && (p.due || 0) <= now) n++;
    }
    return n;
  }
  function learnedCount() {
    var n = 0;
    for (var k in S.prog) if (S.prog[k].seen > 0) n++;
    return n;
  }
  function masteredCount() {
    var n = 0;
    for (var k in S.prog) if ((S.prog[k].box || 0) >= 3) n++;
    return n;
  }
  function calcStreak() {
    var n = 0;
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    /* 今天没打卡时，从昨天开始算，保证"昨天打过"仍显示连续 */
    if (!(S.days[dayKey(d)] && S.days[dayKey(d)].checkin)) d = new Date(d.getTime() - DAY);
    while (true) {
      var rec = S.days[dayKey(d)];
      if (rec && rec.checkin) { n++; d = new Date(d.getTime() - DAY); }
      else break;
    }
    return n;
  }
  function doCheckin() {
    var d = dayRec();
    if (d.checkin) { toast('今天已经打过卡啦'); return; }
    d.checkin = true;
    d.stamp = Date.now();
    save();
    toast('打卡成功，连续 ' + calcStreak() + ' 天');
  }

  /* ---------------- 队列构建 ---------------- */
  function buildLearnQueue(n) {
    var now = Date.now();
    var due = [], freshQ = [], later = [];
    BANK.forEach(function (q) {
      var p = S.prog[q.id];
      if (!p || !p.seen) freshQ.push(q);
      else if ((p.due || 0) <= now) due.push(q);
      else later.push(q);
    });
    due.sort(function (a, b) { return (S.prog[a.id].due || 0) - (S.prog[b.id].due || 0); });
    shuffle(freshQ);
    later.sort(function (a, b) { return (S.prog[a.id].due || 0) - (S.prog[b.id].due || 0); });
    var out = due.concat(freshQ, later).slice(0, n);
    return out.map(function (q) { return q.id; });
  }
  function dailyQuestion() {
    var k = dayKey();
    var h = 2166136261;
    for (var i = 0; i < k.length; i++) { h ^= k.charCodeAt(i); h = Math.imul(h, 16777619); }
    var idx = Math.abs(h) % Math.max(1, BANK.length);
    return BANK[idx] || null;
  }
  function siblings(id) {
    var q = BY_ID[id];
    if (!q) return [];
    return BANK.filter(function (x) { return x.cat === q.cat; });
  }

  /* ---------------- 通用片段 ---------------- */
  function catColor(id) { return catOf(id).color; }
  function catBadge(id) {
    var c = catOf(id);
    return '<span class="badge" style="background:' + hexA(c.color, 0.14) + ';color:' + c.color + '">' +
      '<span class="cat-dot" style="background:' + c.color + '"></span>' + esc(c.name) + '</span>';
  }
  function lvBadge(lv) {
    var cls = lv === '基础' ? 'lv1' : lv === '进阶' ? 'lv2' : 'lv3';
    return '<span class="badge ' + cls + '">' + esc(lv) + '</span>';
  }
  function typeBadge(t) {
    var name = t === 'multi' ? '多选' : t === 'judge' ? '判断' : '单选';
    return '<span class="badge">' + name + '</span>';
  }
  function hexA(hex, a) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }
  function starIcon(on) {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="' + (on ? 'currentColor' : 'none') +
      '" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="m12 3 2.7 5.9 6.3.8-4.6 4.5 1.2 6.3L12 17.6 6.4 20.5l1.2-6.3L3 9.7l6.3-.8z"/></svg>';
  }
  function optionLetter(i) { return i < 26 ? String.fromCharCode(65 + i) : String(i + 1); }

  function optionsStatic(q, picked, reveal) {
    return q.options.map(function (o, i) {
      var cls = 'opt static';
      var isAns = q.answer.indexOf(i) >= 0;
      if (reveal) {
        if (isAns) cls += ' is-correct';
        else if (picked && picked.indexOf(i) >= 0) cls += ' is-wrong';
      }
      return '<div class="' + cls + '"><span class="k">' + optionLetter(i) + '</span>' +
        '<span class="txt">' + esc(o) + '</span></div>';
    }).join('');
  }
  function optionsInteractive(q, picked) {
    return q.options.map(function (o, i) {
      var sel = picked && picked.indexOf(i) >= 0;
      return '<button class="opt' + (sel ? ' is-picked' : '') + '" data-act="exam-pick" data-i="' + i + '">' +
        '<span class="k">' + optionLetter(i) + '</span><span class="txt">' + esc(o) + '</span></button>';
    }).join('');
  }
  function codeBlock(q) {
    return q.code ? '<pre class="code">' + esc(q.code) + '</pre>' : '';
  }
  function explainBlock(q) {
    return '<div class="explain"><div class="lbl">✔ 答案解析</div>' + esc(q.explain || '暂无解析') + '</div>';
  }
  function tagsBlock(q) {
    if (!q.tags || !q.tags.length) return '';
    return '<div class="tags">' + q.tags.map(function (t) {
      return '<span class="tag">' + esc(t) + '</span>';
    }).join('') + '</div>';
  }
  function qcard(q, extraFoot) {
    var p = S.prog[q.id];
    var flags = '';
    if (S.stars[q.id]) flags += '<span title="已收藏" style="color:var(--warn)">★</span>';
    if (p && p.seen > 0) {
      flags += '<span class="badge ' + ((p.box || 0) >= 3 ? 'good' : '') + '">' +
        ((p.box || 0) >= 3 ? '已掌握' : '学习中') + '</span>';
    }
    if (S.wrong[q.id]) flags += '<span class="badge bad">错过</span>';
    return '<div class="qcard" role="button" data-act="nav" data-to="/q/' + esc(q.id) + '">' +
      '<div class="qhead">' + catBadge(q.cat) + lvBadge(q.level) + flags + '</div>' +
      '<div class="qt">' + esc(trim(q.q, 96)) + '</div>' +
      '<div class="qfoot"><span>' + esc((q.tags || []).slice(0, 3).join(' · ')) + '</span>' +
      (extraFoot || '') + '</div></div>';
  }
  function trim(s, n) {
    s = String(s || '').replace(/\s+/g, ' ').trim();
    return s.length > n ? s.slice(0, n) + '…' : s;
  }
  function emptyState(em, t, d, btn) {
    return '<div class="empty"><span class="em">' + em + '</span><div class="t">' + esc(t) + '</div>' +
      (d ? '<div class="d">' + esc(d) + '</div>' : '') + (btn || '') + '</div>';
  }

  /* ---------------- 图标 ---------------- */
  var ICONS = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 10.6 12 3.2l9 7.4"/><path d="M5.4 9.4V21h13.2V9.4"/></svg>',
    browse: '<svg viewBox="0 0 24 24"><rect x="3.2" y="4.2" width="17.6" height="15.6" rx="2.4"/><path d="M3.2 9h17.6"/><path d="M8 13.5h8"/></svg>',
    exam: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
    me: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8.2" r="3.9"/><path d="M4.4 20.8c0-4.2 3.4-6.8 7.6-6.8s7.6 2.6 7.6 6.8"/></svg>',
    back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 8 12l7 7"/></svg>',
    sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"/></svg>',
    moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.6A8.4 8.4 0 1 1 9.4 4 6.9 6.9 0 0 0 20 14.6Z"/></svg>'
  };

  /* ---------------- 路由 ---------------- */
  var browseState = { q: '', cat: 'all', level: 'all' };
  var examSetup = { cat: 'all', count: 20, level: 'all' };
  var session = null;
  var exam = null;
  var ticker = null;
  var detailOpen = Object.create(null);

  function parseRoute() {
    var raw = (location.hash || '').replace(/^#/, '');
    raw = raw.split('?')[0];
    var parts = raw.split('/').filter(Boolean);
    if (!parts.length) parts = ['home'];
    return { parts: parts };
  }

  function render(opts) {
    opts = opts || {};
    var r = parseRoute();
    var key = r.parts[0];
    var y = opts.keepScroll ? window.scrollY : 0;
    var view = $('#view');
    if (!view) return;

    if (ticker) { clearInterval(ticker); ticker = null; }

    var html = '';
    var immersive = false;
    var bar = null;

    try {
      if (key === 'home') {
        html = homeView(); bar = { brand: true };
      } else if (key === 'browse') {
        if (r.parts[1]) browseState.cat = r.parts[1];
        html = browseView(); bar = { brand: true };
      } else if (key === 'q' && r.parts[1]) {
        html = detailView(r.parts[1]); bar = { title: '题目详情', back: '/browse', action: starBtn(r.parts[1]) };
        immersive = true;
      } else if (key === 'learn') {
        html = learnView(); bar = { title: '卡片学习', back: '/home' }; immersive = true;
      } else if (key === 'exam') {
        html = examSetupView(); bar = { brand: true };
      } else if (key === 'run') {
        html = examRunView(); bar = { title: '模拟考核', back: '/exam' }; immersive = true;
      } else if (key === 'result' && r.parts[1]) {
        html = resultView(r.parts[1]); bar = { title: '考核结果', back: '/exam' }; immersive = true;
      } else if (key === 'me') {
        html = meView(); bar = { brand: true };
      } else if (key === 'wrong') {
        html = listView('wrong'); bar = { title: '错题本', back: '/me' }; immersive = true;
      } else if (key === 'star') {
        html = listView('star'); bar = { title: '我的收藏', back: '/me' }; immersive = true;
      } else if (key === 'exams') {
        html = examHistoryView(); bar = { title: '考核记录', back: '/me' }; immersive = true;
      } else {
        html = homeView(); bar = { brand: true };
      }
    } catch (err) {
      html = emptyState('⚠️', '页面出错了', String(err && err.message || err));
      bar = { title: '出错了', back: '/home' };
    }

    view.innerHTML = html;
    document.body.classList.toggle('immersive', immersive);
    $('#tabbar').classList.toggle('hidden', immersive);
    renderTopbar(bar, key);
    updateTab(key);
    if (!opts.keepScroll) window.scrollTo(0, 0);
    else window.scrollTo(0, y);
    applyTheme();
    afterRender(r);
    startTickerIfNeeded(key);
  }

  function renderTopbar(bar, key) {
    var el = $('#topbar');
    if (!el) return;
    if (!bar || bar.brand) {
      var streak = calcStreak();
      var themeIcon = resolvedTheme() === 'dark' ? ICONS.sun : ICONS.moon;
      var d = new Date();
      var dates = (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日 · 周' + '日一二三四五六'[d.getDay()];
      el.innerHTML =
        '<div class="brand-mark">U</div>' +
        '<div class="brand"><div><div class="brand-text">Unity 面试题库</div>' +
        '<div class="brand-sub">' + dates + ' · 共 ' + BANK.length + ' 题</div></div></div>' +
        '<div class="spacer"></div>' +
        (streak > 0 ? '<div class="streak-pill">🔥 ' + streak + ' 天</div>' : '') +
        '<button class="icon-btn" data-act="theme-toggle" aria-label="切换主题">' + themeIcon + '</button>';
    } else {
      el.innerHTML =
        '<button class="back" data-act="nav" data-to="' + esc(bar.back || '/home') + '" aria-label="返回">' + ICONS.back + '</button>' +
        '<div class="ttl">' + esc(bar.title || '') + '</div>' +
        '<div class="spacer"></div>' + (bar.action || '');
    }
  }
  function starBtn(id) {
    var on = !!S.stars[id];
    return '<button class="icon-btn" data-act="star" data-id="' + esc(id) + '" aria-label="收藏" ' +
      'style="color:' + (on ? 'var(--warn)' : 'var(--text-2)') + '">' + starIcon(on) + '</button>';
  }
  function updateTab(key) {
    var map = { home: 'home', browse: 'browse', q: 'browse', exam: 'exam', run: 'exam', result: 'exam', me: 'me', wrong: 'me', star: 'me', exams: 'me' };
    var active = map[key] || '';
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (t) {
      t.classList.toggle('active', t.dataset.tab === active);
    });
  }

  /* ---------------- 首页 ---------------- */
  function ringHTML(percent, size) {
    var r = 34, c = 2 * Math.PI * r;
    var off = c * (1 - clamp(percent, 0, 100) / 100);
    return '<div class="ring-wrap" style="width:' + size + 'px;height:' + size + 'px">' +
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 82 82">' +
      '<circle class="ring-track" cx="41" cy="41" r="' + r + '" fill="none" stroke-width="7"/>' +
      '<circle class="ring-bar" cx="41" cy="41" r="' + r + '" fill="none" stroke-width="7" ' +
      'stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/></svg>' +
      '<div class="ring-label">' + percent + '%<small>今日</small></div></div>';
  }

  function homeView() {
    var today = S.days[dayKey()] || { n: 0, c: 0, checkin: false };
    var goal = S.settings.goal || 20;
    var percent = clamp(Math.round(today.n / goal * 100), 0, 100);
    var t = totals();
    var due = dueCount();
    var learned = learnedCount();
    var daily = dailyQuestion();

    var h = '';
    h += '<div class="hero"><div class="hero-top"><div class="grow">' +
      '<h2>' + (today.checkin ? '今天已打卡 ✓' : '今日学习') + '</h2>' +
      '<p>已答 ' + today.n + ' 题 · 目标 ' + goal + ' 题' + (today.n ? ' · 正确 ' + (today.n ? Math.round(today.c / today.n * 100) : 0) + '%' : '') + '</p>' +
      '</div>' + ringHTML(percent, 82) + '</div>' +
      '<div class="hero-foot">' +
      '<button class="hero-btn ' + (today.checkin ? 'done' : '') + '" data-act="checkin">' +
      (today.checkin ? '今日已打卡 · 连续 ' + calcStreak() + ' 天' : '每日打卡') + '</button>' +
      '</div></div>';

    h += '<div class="stat-row">' +
      '<div class="stat"><b>' + calcStreak() + '</b><span>连续天数</span></div>' +
      '<div class="stat"><b>' + due + '</b><span>待复习</span></div>' +
      '<div class="stat"><b>' + t.acc + '%</b><span>总正确率</span></div>' +
      '</div>';

    h += '<div class="section-title">开始学习</div>';
    h += '<div class="row" role="button" data-act="start-learn">' +
      '<div class="ico" style="background:' + hexA('#5b8cff', .13) + '">🎯</div>' +
      '<div class="main"><div class="t">卡片学习' + (due > 0 ? ' · <span style="color:var(--warn)">' + due + ' 题待复习</span>' : '') + '</div>' +
      '<div class="s">20 题一轮，先复习再学新题</div></div>' +
      '<div class="chev">›</div></div>';

    h += '<div class="row" role="button" data-act="nav" data-to="/exam">' +
      '<div class="ico" style="background:' + hexA('#7c5cff', .13) + '">📝</div>' +
      '<div class="main"><div class="t">模拟考核</div><div class="s">随机抽题自测，交卷看逐题解析</div></div>' +
      '<div class="chev">›</div></div>';

    h += '<div class="row" role="button" data-act="nav" data-to="/browse">' +
      '<div class="ico" style="background:' + hexA('#14b8a6', .13) + '">📚</div>' +
      '<div class="main"><div class="t">知识浏览</div><div class="s">' + CATS.length + ' 个分类 · ' + BANK.length + ' 道题，可搜索</div></div>' +
      '<div class="chev">›</div></div>';

    if (Object.keys(S.wrong).length) {
      h += '<div class="row" role="button" data-act="nav" data-to="/wrong">' +
        '<div class="ico" style="background:' + hexA('#e0454a', .12) + '">🔁</div>' +
        '<div class="main"><div class="t">错题本</div><div class="s">' + Object.keys(S.wrong).length + ' 道题待巩固，答对后自动移出</div></div>' +
        '<div class="chev">›</div></div>';
    }

    if (daily) {
      h += '<div class="section-title">每日一题 <span class="more" data-act="nav" data-to="/q/' + esc(daily.id) + '">去作答</span></div>';
      h += qcard(daily);
    }

    var mPercent = pct(masteredCount(), BANK.length);
    h += '<div class="section-title">题库进度</div>';
    h += '<div class="card"><div style="display:flex;align-items:baseline;gap:8px">' +
      '<b style="font-size:22px;letter-spacing:-.5px">' + mPercent + '%</b>' +
      '<span class="muted small">已掌握 ' + masteredCount() + ' / ' + BANK.length + ' 题</span></div>' +
      '<div class="bar mt12"><i style="width:' + mPercent + '%"></i></div>' +
      '<div class="small muted mt8">已学过 ' + learned + ' 题 · 掌握指连续答对 3 次以上</div></div>';

    h += '<div style="height:8px"></div>';
    return h;
  }

  /* ---------------- 浏览 ---------------- */
  function browseView() {
    var h = '<h1 class="page-title">知识浏览</h1>';
    h += '<p class="page-desc">' + CATS.length + ' 个分类 · ' + BANK.length + ' 道题 · 支持搜索与难度筛选</p>';

    h += '<div class="search">' +
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>' +
      '<input id="search" type="search" placeholder="搜索题目、知识点、关键词" value="' + esc(browseState.q) + '" autocomplete="off" enterkeyhint="search">' +
      (browseState.q ? '<button class="clr" data-act="clear-search">✕</button>' : '') +
      '</div>';

    h += '<div class="chips mt12">';
    h += '<button class="chip ' + (browseState.cat === 'all' ? 'active' : '') + '" data-act="filter-cat" data-v="all">全部 ' + BANK.length + '</button>';
    CATS.forEach(function (c) {
      var n = BANK.filter(function (q) { return q.cat === c.id; }).length;
      h += '<button class="chip ' + (browseState.cat === c.id ? 'active' : '') + '" data-act="filter-cat" data-v="' + c.id + '">' +
        c.icon + ' ' + esc(c.name) + ' ' + n + '</button>';
    });
    h += '</div>';

    h += '<div class="chips mt8">';
    ['all', '基础', '进阶', '高级'].forEach(function (lv) {
      var label = lv === 'all' ? '全部难度' : lv;
      h += '<button class="chip ' + (browseState.level === lv ? 'active' : '') + '" data-act="filter-level" data-v="' + lv + '">' + label + '</button>';
    });
    h += '</div>';

    h += '<div id="qlist" class="mt12">' + browseListHTML() + '</div>';
    return h;
  }

  function filteredQuestions() {
    var q = browseState.q.trim().toLowerCase();
    return BANK.filter(function (x) {
      if (browseState.cat !== 'all' && x.cat !== browseState.cat) return false;
      if (browseState.level !== 'all' && x.level !== browseState.level) return false;
      if (!q) return true;
      var hay = (x.q + ' ' + (x.explain || '') + ' ' + (x.tags || []).join(' ') + ' ' + (x.options || []).join(' ')).toLowerCase();
      return hay.indexOf(q) >= 0;
    });
  }

  function browseListHTML() {
    var list = filteredQuestions();
    if (!list.length) return emptyState('🔍', '没有找到匹配的题目', '换个关键词，或清除筛选条件试试');
    var h = '<div class="small muted" style="margin:2px 0 10px">共 ' + list.length + ' 题</div>';
    h += list.map(function (q) { return qcard(q); }).join('');
    return h;
  }

  /* ---------------- 详情 ---------------- */
  function detailView(id) {
    var q = BY_ID[id];
    if (!q) return emptyState('😵', '题目不存在', '它可能已被移除');
    var reveal = !!detailOpen[id];
    var sibs = siblings(id);
    var idx = sibs.findIndex(function (x) { return x.id === id; });
    var p = S.prog[id];

    var h = '<div class="qdetail">';
    h += '<div class="qhead">' + catBadge(q.cat) + lvBadge(q.level) + typeBadge(q.type) +
      (p && p.seen ? '<span class="badge ' + ((p.box || 0) >= 3 ? 'good' : '') + '">' + ((p.box || 0) >= 3 ? '已掌握' : '学习中 ' + p.box + '/5') + '</span>' : '') +
      '</div>';

    h += '<h1>' + esc(q.q) + '</h1>';
    h += codeBlock(q);

    h += '<div class="mt12">' + (reveal ? optionsStatic(q, [], true) : optionsStatic(q, [], false)) + '</div>';

    if (reveal) {
      h += explainBlock(q);
    } else {
      h += '<button class="reveal-hint mt12" data-act="reveal-detail" data-id="' + esc(id) + '">👀 点击显示答案</button>';
    }

    h += tagsBlock(q);

    h += '<div class="btn-row mt20">' +
      '<button class="btn" data-act="nav" data-to="/q/' + esc(sibs[(idx - 1 + sibs.length) % sibs.length].id) + '">← 上一题</button>' +
      '<button class="btn" data-act="nav" data-to="/q/' + esc(sibs[(idx + 1) % sibs.length].id) + '">下一题 →</button>' +
      '</div>';
    h += '<div class="center small muted mt12">' + catOf(q.cat).name + ' · 第 ' + (idx + 1) + ' / ' + sibs.length + ' 题</div>';
    h += '</div>';
    return h;
  }

  /* ---------------- 卡片学习 ---------------- */
  function ensureSession() {
    if (session) return;
    session = { ids: buildLearnQueue(20), i: 0, revealed: false, right: 0, wrong: 0, done: false };
  }
  function learnView() {
    ensureSession();
    if (!session.ids.length) {
      return emptyState('🎉', '没有待学的题目了', '题库已全部学过，可以去「知识浏览」复习，或重置学习进度', '<div class="mt16"><button class="btn" data-act="nav" data-to="/browse">去浏览题库</button></div>');
    }
    if (session.done || session.i >= session.ids.length) return learnSummary();

    var q = BY_ID[session.ids[session.i]];
    if (!q) { session.i++; return learnView(); }
    var total = session.ids.length;
    var w = Math.round((session.i + (session.revealed ? 1 : 0)) / total * 100);

    var h = '<div class="study-top"><div class="bar"><i style="width:' + w + '%"></i></div>' +
      '<div class="cnt">' + (session.i + 1) + ' / ' + total + '</div></div>';

    h += '<div class="study-card">' +
      '<div class="qhead" style="display:flex;gap:7px;flex-wrap:wrap">' + catBadge(q.cat) + lvBadge(q.level) + typeBadge(q.type) + '</div>' +
      '<h2>' + esc(q.q) + '</h2>' + codeBlock(q);

    if (session.revealed) {
      h += '<div class="mt12">' + optionsStatic(q, [], true) + '</div>' + explainBlock(q);
    } else {
      h += '<button class="reveal-hint" data-act="reveal">👀 点击显示答案</button>';
    }
    h += '</div>';

    if (session.revealed) {
      h += '<div class="study-actions">' +
        '<button class="btn danger" data-act="learn-bad">😵 没掌握</button>' +
        '<button class="btn good" data-act="learn-good">✅ 掌握了</button>' +
        '</div>';
    }
    h += '<div class="center small muted mt16">答对会安排更长的复习间隔，答错 1 天后重来</div>';
    return h;
  }
  function learnSummary() {
    var total = session.ids.length;
    var right = session.right, wrong = session.wrong;
    var h = '<div class="card" style="text-align:center;padding:26px 18px">' +
      '<div style="font-size:40px">🎉</div>' +
      '<h2 style="margin:8px 0 4px;font-size:20px">本轮完成</h2>' +
      '<div class="muted small">共 ' + total + ' 题 · 掌握 ' + right + ' · 待加强 ' + wrong + '</div>' +
      '<div class="bar mt16"><i style="width:' + pct(right, total) + '%"></i></div>' +
      '<div class="small muted mt8">本轮正确率 ' + pct(right, total) + '%</div>' +
      '</div>';
    h += '<div class="stat-row">' +
      '<div class="stat"><b>' + calcStreak() + '</b><span>连续天数</span></div>' +
      '<div class="stat"><b>' + dueCount() + '</b><span>待复习</span></div>' +
      '<div class="stat"><b>' + learnedCount() + '</b><span>已学过</span></div>' +
      '</div>';
    h += '<div class="btn-row mt16">' +
      '<button class="btn" data-act="nav" data-to="/home">回首页</button>' +
      '<button class="btn primary" data-act="restart-learn">再来一轮</button></div>';
    return h;
  }

  /* ---------------- 考核设置 ---------------- */
  function examSetupView() {
    var h = '<h1 class="page-title">模拟考核</h1>';
    h += '<p class="page-desc">随机抽题，交卷后给出得分与逐题解析</p>';

    h += '<div class="card">' +
      '<div class="small muted">题目范围</div>' +
      '<div class="chips mt8">' +
      '<button class="chip ' + (examSetup.cat === 'all' ? 'active' : '') + '" data-act="exam-cat" data-v="all">全部</button>' +
      CATS.map(function (c) {
        return '<button class="chip ' + (examSetup.cat === c.id ? 'active' : '') + '" data-act="exam-cat" data-v="' + c.id + '">' +
          c.icon + ' ' + esc(c.name) + '</button>';
      }).join('') +
      '</div>' +
      '<div class="small muted mt16">难度</div>' +
      '<div class="chips mt8">' +
      ['all', '基础', '进阶', '高级'].map(function (lv) {
        return '<button class="chip ' + (examSetup.level === lv ? 'active' : '') + '" data-act="exam-level" data-v="' + lv + '">' +
          (lv === 'all' ? '全部' : lv) + '</button>';
      }).join('') +
      '</div>' +
      '<div class="small muted mt16">题量</div>' +
      '<div class="chips mt8">' +
      [10, 20, 30, 50].map(function (n) {
        return '<button class="chip ' + (examSetup.count === n ? 'active' : '') + '" data-act="exam-count" data-v="' + n + '">' + n + ' 题</button>';
      }).join('') +
      '</div>' +
      '<div class="small muted mt16" id="pool-info">' + poolInfoText() + '</div>' +
      '<button class="btn primary block mt16" data-act="exam-start">开始考核</button>' +
      '</div>';

    var hist = S.exams.slice(0, 5);
    h += '<div class="section-title">最近成绩 <span class="more" data-act="nav" data-to="/exams">全部</span></div>';
    if (!hist.length) {
      h += '<div class="card flat center muted small" style="padding:22px">还没有考核记录，先来一局吧</div>';
    } else {
      h += hist.map(function (e) {
        var score = pct(e.right, e.total);
        return '<div class="row" role="button" data-act="nav" data-to="/result/' + esc(e.id) + '">' +
          '<div class="ico" style="background:' + hexA(score >= 60 ? '#12996b' : '#e0454a', .12) + ';color:' + (score >= 60 ? 'var(--good)' : 'var(--bad)') + ';font-weight:750">' + score + '</div>' +
          '<div class="main"><div class="t">' + (examSetupLabel(e)) + '</div>' +
          '<div class="s">' + fmtDate(e.t) + ' · 对 ' + e.right + '/' + e.total + '</div></div>' +
          '<div class="chev">›</div></div>';
      }).join('');
    }
    return h;
  }
  function examSetupLabel(e) {
    var c = e.cat && e.cat !== 'all' ? catOf(e.cat).name : '综合';
    var lv = e.level && e.level !== 'all' ? ' · ' + e.level : '';
    return esc(c + lv);
  }
  function examPool() {
    return BANK.filter(function (q) {
      if (examSetup.cat !== 'all' && q.cat !== examSetup.cat) return false;
      if (examSetup.level !== 'all' && q.level !== examSetup.level) return false;
      return true;
    });
  }
  function poolInfoText() {
    var n = examPool().length;
    return '当前可抽 ' + n + ' 题，实际出题 ' + Math.min(n, examSetup.count) + ' 题';
  }

  /* ---------------- 考核进行中 ---------------- */
  function examRunView() {
    if (!exam) return emptyState('🤔', '没有进行中的考核', '请先设置并开始一次考核', '<div class="mt16"><button class="btn" data-act="nav" data-to="/exam">去设置</button></div>');
    var id = exam.ids[exam.i];
    var q = BY_ID[id];
    if (!q) { exam.i++; return examRunView(); }
    var picked = exam.picked[id] || [];
    var answered = exam.ids.filter(function (x) { return (exam.picked[x] || []).length > 0; }).length;

    var h = '<div class="exam-head">' +
      '<span class="idx">第 ' + (exam.i + 1) + ' / ' + exam.ids.length + ' 题</span>' +
      '<div class="spacer"></div>' +
      '<span class="timer" id="timer">' + fmtClock(Date.now() - exam.start) + '</span>' +
      '</div>';

    h += '<div class="study-card">' +
      '<div class="qhead" style="display:flex;gap:7px;flex-wrap:wrap">' + catBadge(q.cat) + lvBadge(q.level) + typeBadge(q.type) + '</div>' +
      '<h2>' + esc(q.q) + '</h2>' + codeBlock(q) +
      '<div class="mt12">' + optionsInteractive(q, picked) + '</div>' +
      (q.type === 'multi' ? '<div class="small muted mt8">多选题：选全对才得分</div>' : '') +
      '</div>';

    var isLast = exam.i === exam.ids.length - 1;
    h += '<div class="btn-row mt16">' +
      '<button class="btn" data-act="exam-prev" ' + (exam.i === 0 ? 'disabled' : '') + '>上一题</button>' +
      (isLast
        ? '<button class="btn primary" data-act="exam-submit">交卷</button>'
        : '<button class="btn primary" data-act="exam-next">下一题</button>') +
      '</div>';
    h += '<button class="btn block mt12" data-act="exam-sheet">答题卡 · 已答 ' + answered + ' / ' + exam.ids.length + '</button>';
    if (!isLast) h += '<button class="btn block danger mt8" data-act="exam-submit">交卷</button>';
    return h;
  }
  function submitExam(silent) {
    if (!exam) return;
    var answered = exam.ids.filter(function (x) { return (exam.picked[x] || []).length > 0; }).length;
    if (!silent && answered < exam.ids.length) {
      var left = exam.ids.length - answered;
      if (!window.confirm('还有 ' + left + ' 题未作答，确定交卷吗？')) return;
    }
    if (!silent && answered === exam.ids.length) {
      if (!window.confirm('确定交卷吗？')) return;
    }
    var rows = exam.ids.map(function (id) {
      var q = BY_ID[id];
      var picked = (exam.picked[id] || []).slice().sort(function (a, b) { return a - b; });
      var ans = q.answer.slice().sort(function (a, b) { return a - b; });
      var ok = picked.length === ans.length && picked.every(function (v, i) { return v === ans[i]; });
      return { id: id, picked: picked, ok: ok, skipped: picked.length === 0 };
    });
    var right = rows.filter(function (r) { return r.ok; }).length;
    var rec = {
      id: 'e' + Date.now().toString(36),
      t: Date.now(),
      cat: examSetup.cat,
      level: examSetup.level,
      total: rows.length,
      right: right,
      ms: Date.now() - exam.start,
      rows: rows
    };
    rows.forEach(function (r) { answer(r.id, r.ok); });
    S.exams.unshift(rec);
    S.exams = S.exams.slice(0, 30);
    saveNow();
    exam = null;
    if (ticker) { clearInterval(ticker); ticker = null; }
    go('/result/' + rec.id);
  }

  function resultView(eid) {
    var rec = S.exams.filter(function (e) { return e.id === eid; })[0];
    if (!rec) return emptyState('😵', '找不到这次记录', '可能已被清理');
    var score = pct(rec.right, rec.total);
    var wrongList = rec.rows.filter(function (r) { return !r.ok; });
    var skipped = rec.rows.filter(function (r) { return r.skipped; }).length;

    var h = '<div class="card score-hero">' +
      '<div class="big">' + score + '</div>' +
      '<div class="sub">' + rec.total + ' 题 · 对 ' + rec.right + ' · 错 ' + (rec.total - rec.right) +
      (skipped ? '（未答 ' + skipped + '）' : '') + ' · 用时 ' + fmtClock(rec.ms) + '</div>' +
      '<div class="bar mt16"><i style="width:' + score + '%"></i></div>' +
      '<div class="small muted mt8">' + (score >= 85 ? '状态很好，保持这个节奏 💪' : score >= 60 ? '及格线以上，把错题过一遍再考一次' : '基础还不稳，建议先去卡片学习复习') + '</div>' +
      '</div>';

    var byCat = {};
    rec.rows.forEach(function (r) {
      var q = BY_ID[r.id];
      if (!q) return;
      byCat[q.cat] = byCat[q.cat] || { n: 0, ok: 0 };
      byCat[q.cat].n++;
      if (r.ok) byCat[q.cat].ok++;
    });
    var catKeys = Object.keys(byCat);
    if (catKeys.length) {
      h += '<div class="section-title">分类得分</div><div class="card">';
      catKeys.forEach(function (cid, i) {
        var c = catOf(cid);
        var d = byCat[cid];
        h += '<div style="display:flex;align-items:center;gap:10px' + (i ? ';margin-top:12px' : '') + '">' +
          '<div style="width:74px;font-size:12.5px;font-weight:600">' + esc(c.name) + '</div>' +
          '<div class="bar" style="flex:1"><i style="width:' + pct(d.ok, d.n) + '%;background:' + c.color + '"></i></div>' +
          '<div class="small tnum" style="width:46px;text-align:right">' + d.ok + '/' + d.n + '</div></div>';
      });
      h += '</div>';
    }

    if (wrongList.length) {
      h += '<div class="section-title">错题回顾</div>';
      wrongList.forEach(function (r) {
        var q = BY_ID[r.id];
        if (!q) return;
        h += '<div class="card" style="margin-bottom:12px">' +
          '<div class="qhead" style="display:flex;gap:7px;flex-wrap:wrap">' + catBadge(q.cat) +
          (r.skipped ? '<span class="badge">未作答</span>' : '<span class="badge bad">答错</span>') + '</div>' +
          '<div style="font-weight:650;font-size:15px;line-height:1.55;margin-top:8px">' + esc(q.q) + '</div>' +
          codeBlock(q) +
          '<div class="mt12">' + optionsStatic(q, r.picked, true) + '</div>' +
          explainBlock(q) +
          '<div class="mt12"><button class="btn sm" data-act="learn-this" data-id="' + esc(q.id) + '">加入学习队列</button></div>' +
          '</div>';
      });
    } else {
      h += '<div class="card center" style="padding:24px"><div style="font-size:30px">🏆</div>' +
        '<div style="font-weight:700;margin-top:6px">全对！</div>' +
        '<div class="small muted mt8">这次考核没有错题</div></div>';
    }

    h += '<div class="btn-row mt16">' +
      '<button class="btn" data-act="nav" data-to="/exam">返回</button>' +
      '<button class="btn primary" data-act="exam-again">再来一次</button></div>';
    h += '<div style="height:8px"></div>';
    return h;
  }

  /* ---------------- 我的 ---------------- */
  function meView() {
    var t = totals();
    var learned = learnedCount(), mastered = masteredCount();
    var h = '<h1 class="page-title">我的学习</h1>';
    h += '<p class="page-desc">数据保存在本机浏览器，换设备可用导出/导入迁移</p>';

    h += '<div class="card">' +
      '<div style="display:flex;align-items:baseline;gap:8px">' +
      '<b style="font-size:26px;letter-spacing:-.6px">' + mastered + '</b>' +
      '<span class="muted small">/ ' + BANK.length + ' 题已掌握</span>' +
      '<div class="spacer"></div>' +
      '<span class="badge good">🔥 ' + calcStreak() + ' 天</span></div>' +
      '<div class="mastery">' + masteryBar() + '</div>' +
      '<div class="small muted mt8">已学过 ' + learned + ' 题 · 累计作答 ' + t.n + ' 次 · 正确率 ' + t.acc + '%</div>' +
      '</div>';

    h += '<div class="section-title">打卡记录</div>';
    h += '<div class="card">' + heatmapHTML() + '<div class="small muted mt8">最近 16 周 · 颜色越深当天学得越多</div></div>';

    h += '<div class="section-title">学习数据</div>';
    h += row('🔁', '错题本', Object.keys(S.wrong).length + ' 道题待巩固', '/wrong');
    h += row('⭐', '我的收藏', Object.keys(S.stars).length + ' 道题', '/star');
    h += row('📊', '考核记录', S.exams.length + ' 次模拟考核', '/exams');

    h += '<div class="section-title">设置</div>';
    h += '<div class="row" role="button" data-act="open-settings">' +
      '<div class="ico" style="background:var(--surface-3)">⚙️</div>' +
      '<div class="main"><div class="t">偏好与数据</div><div class="s">主题 · 每日目标 · 导出 / 导入 / 重置</div></div>' +
      '<div class="chev">›</div></div>';

    h += '<div class="center small muted mt20">Unity 面试题库 · v1.0<br>题目 ' + BANK.length + ' 道 · 面向 4 年经验</div>';
    h += '<div style="height:8px"></div>';
    return h;
  }
  function row(icon, title, sub, to, act) {
    return '<div class="row" role="button" data-act="' + (act || 'nav') + '" data-to="' + esc(to || '') + '">' +
      '<div class="ico">' + icon + '</div>' +
      '<div class="main"><div class="t">' + esc(title) + '</div><div class="s">' + esc(sub) + '</div></div>' +
      '<div class="chev">›</div></div>';
  }
  function masteryBar() {
    var tot = BANK.length || 1;
    var m = masteredCount();
    var l = learnedCount() - m;
    var n = tot - learnedCount();
    return '<i style="flex:' + m + ';background:var(--good)"></i>' +
      '<i style="flex:' + Math.max(l, 0) + ';background:var(--accent)"></i>' +
      '<i style="flex:' + Math.max(n, 0) + ';background:var(--surface-3)"></i>';
  }
  function heatmapHTML() {
    var weeks = 16;
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var dow = (today.getDay() + 6) % 7; /* 周一 = 0 */
    var start = new Date(today.getTime() - (weeks * 7 - 1 - (6 - dow)) * DAY);
    /* 对齐到周一 */
    start = new Date(start.getTime() - ((start.getDay() + 6) % 7) * DAY);
    var cells = '';
    for (var i = 0; i < weeks * 7; i++) {
      var d = new Date(start.getTime() + i * DAY);
      var k = dayKey(d);
      var rec = S.days[k];
      var n = (rec && rec.n) || 0;
      var lv = n === 0 ? 0 : n < 6 ? 1 : n < 15 ? 2 : n < 30 ? 3 : 4;
      if (rec && rec.checkin && lv < 2) lv = 2;
      if (d.getTime() > today.getTime()) {
        cells += '<i style="opacity:.25"></i>';
        continue;
      }
      cells += '<i class="' + (lv ? 'l' + lv : '') + (k === dayKey(today) ? ' today' : '') + '" title="' + k + (n ? ' · ' + n + ' 题' : '') + '"></i>';
    }
    return '<div class="heat">' + cells + '</div>';
  }

  /* ---------------- 列表页：错题 / 收藏 ---------------- */
  function listView(kind) {
    var ids = kind === 'wrong' ? Object.keys(S.wrong) : Object.keys(S.stars);
    var title = kind === 'wrong' ? '错题本' : '我的收藏';
    var h = '';
    if (!ids.length) {
      return emptyState(kind === 'wrong' ? '🎯' : '⭐', title + '还是空的',
        kind === 'wrong' ? '考核答错或卡片学习点「没掌握」的题会出现在这里' : '在题目详情页点右上角星标即可收藏',
        '<div class="mt16"><button class="btn" data-act="nav" data-to="/browse">去题库逛逛</button></div>');
    }
    h += '<div class="small muted" style="margin:2px 0 10px">共 ' + ids.length + ' 题</div>';
    if (kind === 'wrong') {
      ids.sort(function (a, b) { return (S.wrong[b].t || 0) - (S.wrong[a].t || 0); });
    }
    ids.forEach(function (id) {
      var q = BY_ID[id];
      if (!q) return;
      h += qcard(q, kind === 'wrong' ?
        '<button class="btn sm" style="margin-left:auto;height:28px;padding:0 10px" data-act="clear-wrong" data-id="' + esc(id) + '">移出</button>' : '');
    });
    return h;
  }

  /* ---------------- 考核记录 ---------------- */
  function examHistoryView() {
    if (!S.exams.length) return emptyState('📊', '还没有考核记录', '去「模拟考核」来一局', '<div class="mt16"><button class="btn" data-act="nav" data-to="/exam">开始考核</button></div>');
    var h = '';
    S.exams.forEach(function (e) {
      var score = pct(e.right, e.total);
      h += '<div class="row" role="button" data-act="nav" data-to="/result/' + esc(e.id) + '">' +
        '<div class="ico" style="background:' + hexA(score >= 60 ? '#12996b' : '#e0454a', .12) + ';color:' + (score >= 60 ? 'var(--good)' : 'var(--bad)') + ';font-weight:750">' + score + '</div>' +
        '<div class="main"><div class="t">' + examSetupLabel(e) + '</div>' +
        '<div class="s">' + fmtDate(e.t) + ' · 对 ' + e.right + '/' + e.total + ' · ' + fmtClock(e.ms) + '</div></div>' +
        '<div class="chev">›</div></div>';
    });
    return h;
  }

  /* ---------------- 交互 ---------------- */
  function go(path) {
    if (location.hash === '#' + path) render();
    else location.hash = '#' + path;
  }

  var toastTimer = null;
  function toast(msg) {
    var el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2000);
  }

  function openSheet(title, body) {
    var sheet = $('#sheet'), mask = $('#mask');
    sheet.innerHTML = '<div class="grab"></div><h3>' + esc(title) + '</h3>' + body;
    mask.classList.add('show');
    sheet.classList.add('show');
  }
  function closeSheet() {
    $('#mask').classList.remove('show');
    $('#sheet').classList.remove('show');
  }

  function openSettings() {
    var themes = [['auto', '跟随系统'], ['light', '浅色'], ['dark', '深色']];
    var goals = [10, 20, 30, 50];
    var body =
      '<div class="small muted">主题</div>' +
      '<div class="seg mt8" id="seg-theme">' + themes.map(function (t) {
        return '<button class="' + (S.settings.theme === t[0] ? 'active' : '') + '" data-act="set-theme" data-v="' + t[0] + '">' + t[1] + '</button>';
      }).join('') + '</div>' +
      '<div class="small muted mt16">每日目标（完成自动打卡）</div>' +
      '<div class="seg mt8" id="seg-goal">' + goals.map(function (g) {
        return '<button class="' + (S.settings.goal === g ? 'active' : '') + '" data-act="set-goal" data-v="' + g + '">' + g + ' 题</button>';
      }).join('') + '</div>' +
      '<div class="hr"></div>' +
      '<button class="btn block" data-act="export">导出学习数据（JSON）</button>' +
      '<button class="btn block mt8" data-act="import">导入学习数据</button>' +
      '<button class="btn block danger mt8" data-act="reset">清空所有进度</button>' +
      '<input type="file" id="importFile" accept="application/json,.json" style="display:none">' +
      '<div class="small muted mt12">共 ' + BANK.length + ' 道题 · 数据只存在本机</div>';
    openSheet('偏好与数据', body);
  }

  function exportData() {
    try {
      var blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'unity-interview-progress-' + dayKey() + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      toast('已导出');
    } catch (e) { toast('导出失败：' + e.message); }
  }
  function importData(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var o = JSON.parse(String(reader.result));
        if (!o || typeof o !== 'object' || !o.days) throw new Error('格式不正确');
        if (!window.confirm('导入会覆盖当前进度，确定吗？')) return;
        localStorage.setItem(KEY, JSON.stringify(o));
        location.reload();
      } catch (e) { toast('导入失败：' + e.message); }
    };
    reader.readAsText(file);
  }

  function afterRender(r) {
    var key = r.parts[0];
    var inp = $('#search');
    if (inp) {
      inp.addEventListener('input', function () {
        browseState.q = inp.value;
        var list = $('#qlist');
        if (list) list.innerHTML = browseListHTML();
        var clr = document.querySelector('[data-act="clear-search"]');
        if (clr) clr.style.display = inp.value ? '' : 'none';
      });
    }
    var imp = $('#importFile');
    if (imp) {
      imp.addEventListener('change', function () {
        if (imp.files && imp.files[0]) importData(imp.files[0]);
      });
    }
  }

  function startTickerIfNeeded(key) {
    if (key !== 'run' || !exam) return;
    ticker = setInterval(function () {
      var el = $('#timer');
      if (!el) { clearInterval(ticker); ticker = null; return; }
      el.textContent = fmtClock(Date.now() - exam.start);
    }, 500);
  }

  /* ---------------- 事件 ---------------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!t) return;
    var act = t.dataset.act;

    switch (act) {
      case 'nav':
        go(t.dataset.to || '/home');
        return;

      case 'theme-toggle': {
        var order = ['auto', 'light', 'dark'];
        var i = order.indexOf(S.settings.theme);
        S.settings.theme = order[(i + 1) % 3];
        saveNow(); applyTheme(); render({ keepScroll: true });
        toast('主题：' + ({ auto: '跟随系统', light: '浅色', dark: '深色' }[S.settings.theme]));
        return;
      }

      case 'checkin':
        doCheckin();
        render({ keepScroll: true });
        return;

      case 'start-learn':
        session = null;
        go('/learn');
        return;

      case 'reveal':
        session.revealed = true;
        render({ keepScroll: true });
        return;

      case 'learn-good':
        answer(session.ids[session.i], true);
        session.right++;
        session.i++;
        session.revealed = false;
        saveNow();
        render({ keepScroll: true });
        return;

      case 'learn-bad':
        answer(session.ids[session.i], false);
        session.wrong++;
        session.i++;
        session.revealed = false;
        saveNow();
        render({ keepScroll: true });
        return;

      case 'restart-learn':
        session = null;
        render();
        return;

      case 'reveal-detail':
        detailOpen[t.dataset.id] = true;
        render({ keepScroll: true });
        return;

      case 'star': {
        var sid = t.dataset.id;
        if (S.stars[sid]) delete S.stars[sid];
        else S.stars[sid] = Date.now();
        saveNow();
        render({ keepScroll: true });
        toast(S.stars[sid] ? '已收藏' : '已取消收藏');
        return;
      }

      case 'clear-wrong': {
        delete S.wrong[t.dataset.id];
        saveNow();
        render({ keepScroll: true });
        toast('已移出错题本');
        return;
      }

      case 'learn-this': {
        var lid = t.dataset.id;
        var p = progOf(lid);
        p.due = 0;
        p.box = 0;
        saveNow();
        toast('已加入学习队列');
        return;
      }

      case 'filter-cat':
        browseState.cat = t.dataset.v;
        render({ keepScroll: true });
        return;

      case 'filter-level':
        browseState.level = t.dataset.v;
        render({ keepScroll: true });
        return;

      case 'clear-search':
        browseState.q = '';
        render({ keepScroll: true });
        return;

      /* ---- 考核 ---- */
      case 'exam-cat':
        examSetup.cat = t.dataset.v;
        render({ keepScroll: true });
        return;
      case 'exam-level':
        examSetup.level = t.dataset.v;
        render({ keepScroll: true });
        return;
      case 'exam-count':
        examSetup.count = parseInt(t.dataset.v, 10) || 20;
        render({ keepScroll: true });
        return;

      case 'exam-start': {
        var pool = examPool().slice();
        if (pool.length < 3) { toast('这个范围内题目太少'); return; }
        shuffle(pool);
        var ids = pool.slice(0, Math.min(examSetup.count, pool.length)).map(function (q) { return q.id; });
        exam = { ids: ids, i: 0, picked: {}, start: Date.now() };
        go('/run');
        return;
      }

      case 'exam-pick': {
        if (!exam) return;
        var qid = exam.ids[exam.i];
        var qq = BY_ID[qid];
        var idx = parseInt(t.dataset.i, 10);
        var cur = (exam.picked[qid] || []).slice();
        if (qq.type === 'multi') {
          var pos = cur.indexOf(idx);
          if (pos >= 0) cur.splice(pos, 1); else cur.push(idx);
        } else {
          cur = [idx];
        }
        exam.picked[qid] = cur;
        render({ keepScroll: true });
        return;
      }

      case 'exam-prev':
        if (exam && exam.i > 0) { exam.i--; render(); }
        return;

      case 'exam-next':
        if (exam && exam.i < exam.ids.length - 1) { exam.i++; render(); }
        else if (exam) toast('已经是最后一题，可以交卷了');
        return;

      case 'exam-goto':
        if (exam) { exam.i = parseInt(t.dataset.i, 10); closeSheet(); render(); }
        return;

      case 'exam-sheet': {
        if (!exam) return;
        var cells = exam.ids.map(function (id, i) {
          var done = (exam.picked[id] || []).length > 0;
          return '<button class="' + (done ? 'done' : '') + (i === exam.i ? ' cur' : '') + '" data-act="exam-goto" data-i="' + i + '">' + (i + 1) + '</button>';
        }).join('');
        openSheet('答题卡', '<div class="sheet-grid">' + cells + '</div>' +
          '<div class="mt16"><button class="btn primary block" data-act="exam-submit">交卷</button></div>');
        return;
      }

      case 'exam-submit':
        closeSheet();
        submitExam(false);
        return;

      case 'exam-again':
        go('/exam');
        return;

      /* ---- 设置 ---- */
      case 'open-settings':
        openSettings();
        return;

      case 'set-theme':
        S.settings.theme = t.dataset.v;
        saveNow(); applyTheme();
        openSettings();
        return;

      case 'set-goal':
        S.settings.goal = parseInt(t.dataset.v, 10) || 20;
        saveNow();
        openSettings();
        render({ keepScroll: true });
        return;

      case 'export':
        exportData();
        return;
      case 'import': {
        var f = $('#importFile');
        if (f) f.click();
        return;
      }
      case 'reset':
        if (window.confirm('确定要清空所有学习进度、打卡与考核记录吗？此操作不可恢复。')) {
          localStorage.removeItem(KEY);
          S = fresh();
          closeSheet();
          go('/home');
          render();
          toast('已清空');
        }
        return;

      case 'closeSheet':
        closeSheet();
        return;
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'importFile' && e.target.files && e.target.files[0]) {
      importData(e.target.files[0]);
    }
  });

  /* ---------------- 启动 ---------------- */
  function boot() {
    var app = $('#app');
    var tabs = [
      { id: 'home', label: '学习', icon: ICONS.home, to: '/home' },
      { id: 'browse', label: '题库', icon: ICONS.browse, to: '/browse' },
      { id: 'exam', label: '考核', icon: ICONS.exam, to: '/exam' },
      { id: 'me', label: '我的', icon: ICONS.me, to: '/me' }
    ];
    app.innerHTML =
      '<header class="topbar" id="topbar"></header>' +
      '<main class="view" id="view"></main>' +
      '<nav class="tabbar" id="tabbar">' +
      tabs.map(function (t) {
        return '<button class="tab" data-tab="' + t.id + '" data-act="nav" data-to="' + t.to + '">' + t.icon + '<span>' + t.label + '</span></button>';
      }).join('') +
      '</nav>' +
      '<div class="toast" id="toast"></div>' +
      '<div class="sheet-mask" id="mask" data-act="closeSheet"></div>' +
      '<div class="sheet" id="sheet"></div>';

    if (!BANK.length) {
      $('#view').innerHTML = emptyState('📦', '题库没有加载出来', '请确认 assets/bank.js 已部署，或刷新页面重试');
      $('#topbar').innerHTML = '<div class="brand-mark">U</div><div class="brand-text">Unity 面试题库</div>';
      return;
    }

    window.addEventListener('hashchange', function () { render(); });
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').addEventListener &&
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        if (S.settings.theme === 'auto') { applyTheme(); render({ keepScroll: true }); }
      });

    applyTheme();
    render();

    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () {});
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
