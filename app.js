/* ============================================================
   Training Week PWA — WHOOP-style UI
   Views: overview · day (checklist + session/rest timers) · history
   Storage: localStorage, progress keyed by ISO week.
   ============================================================ */

const TAGS = {
  hipext: 'HIP EXT',
  joints: 'JOINTS',
  fascia: 'FASCIA',
  optional: 'OPTIONAL',
  physio: 'PHYSIO',
};

const K = {
  profile: 'twpwa:profile',
  progress: (p, wk) => `twpwa:${p}:progress:${wk}`,
  sessions: p => `twpwa:${p}:sessions`,
  active: p => `twpwa:${p}:active`,
};

const PROFILES = {
  shubham: {
    name: 'Shubham',
    tagline: 'Five-day gym week · back-conscious build',
    color: 'var(--green)',
    plan: () => PLAN,
    rules: [
      { color: 'var(--amber)', label: 'Stop rule', text: 'Nothing here should send pain down your leg. If a movement or a stretch does, that is nerve tension, not muscle tightness — stop that item and flag it. Anything your physio has prescribed replaces the equivalent item here.' },
      { color: 'var(--blue)', label: 'Be honest about the clock', text: 'Full sessions land at 80–95 minutes. If that does not fit, cut the OPTIONAL lines first, then the fascia block — not the main lifts and not the joint work. A 60-minute session you actually do beats a 90-minute one you skip.' },
    ],
  },
  sakshi: {
    name: 'Sakshi',
    tagline: 'Beginner to toned · Phase 2 build (weeks 5–12)',
    color: 'var(--purple)',
    plan: () => SAKSHI_PLAN,
    rules: [
      { color: 'var(--green)', label: 'Progressive overload', text: 'Each week, do a little more than last week — one more rep, or slightly more weight, with good form. When every set hits the top of the rep range cleanly, add the smallest increment next session.' },
      { color: 'var(--amber)', label: 'Go lighter than you think', text: 'Form first — leave 1–2 reps in the tank, no ego-lifting. Muscle soreness early on is normal; sharp or joint pain is not — stop if it shows up. Rest days are part of the plan.' },
      { color: 'var(--blue)', label: 'Cardio · 2× a week', text: 'One steady session: 20–30 min incline walk, cycle or cross-trainer. One intervals session: 20 min of 1 min brisk / 2 min easy — start with 4–5 rounds and build up. Plus ~7–8k steps daily.' },
    ],
  },
};

/* One-time migration: pre-profile keys belong to Shubham. */
(function migrateLegacyKeys() {
  for (const k of Object.keys(localStorage)) {
    const m = k.match(/^twpwa:(progress:.+|sessions|active)$/);
    if (!m) continue;
    const nk = `twpwa:shubham:${m[1]}`;
    if (!localStorage.getItem(nk)) localStorage.setItem(nk, localStorage.getItem(k));
    localStorage.removeItem(k);
  }
})();

/* ---------------- state ---------------- */

function isoWeekKey(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

const weekKey = isoWeekKey(new Date());

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

let profile = localStorage.getItem(K.profile); // null → show login
if (profile && !PROFILES[profile]) profile = null;

let plan = [];
let progress = {};
let sessions = [];
let active = null;                 // {dayId, startedAt|null, accumSec}
let rest = null;                   // {end, len} — runtime only

let view = { name: profile ? 'week' : 'login' };
let collapsed = {};                // sectionKey -> true

function loadProfileState() {
  plan = PROFILES[profile].plan();
  progress = load(K.progress(profile, weekKey), {});
  sessions = load(K.sessions(profile), []);
  active = load(K.active(profile), null);
  rest = null;
  collapsed = {};
}
if (profile) loadProfileState();

const saveProgress = () => localStorage.setItem(K.progress(profile, weekKey), JSON.stringify(progress));
const saveSessions = () => localStorage.setItem(K.sessions(profile), JSON.stringify(sessions));
const saveActive = () => active
  ? localStorage.setItem(K.active(profile), JSON.stringify(active))
  : localStorage.removeItem(K.active(profile));

const dayTotal = d => d.sections.reduce((n, s) => n + s.items.length, 0);
const dayDone = id => Object.keys(progress).filter(k => k.startsWith(id + '-')).length;
const exKey = (d, si, ii) => `${d}-${si}-${ii}`;
const elapsedSec = () => !active ? 0
  : Math.floor(active.accumSec + (active.startedAt ? (Date.now() - active.startedAt) / 1000 : 0));

function todayDayId() {
  const id = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];
  return plan.some(d => d.id === id) ? id : plan[0].id;
}

/* ---------------- tiny helpers ---------------- */

const $ = sel => document.querySelector(sel);
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function fmtClock(total) {
  const h = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), s = total % 60;
  const mm = String(m).padStart(2, '0'), ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function ring(size, stroke, pct, color, center) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(1, Math.max(0, pct)));
  return `
    <span class="ring" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}">
        <circle class="track" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"/>
        <circle class="fill" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"
          stroke="${color}" stroke-dasharray="${c} ${c}" stroke-dashoffset="${off}"/>
      </svg>
      <span class="ring-center">${center}</span>
    </span>`;
}

const tagsHtml = tags => (tags || []).map(t => `<span class="tag ${t}">${TAGS[t]}</span>`).join('');

function buzz(pattern) { if (navigator.vibrate) navigator.vibrate(pattern); }

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    o.start(); o.stop(ctx.currentTime + 0.35);
  } catch {}
}

/* ---------------- views ---------------- */

function loginView() {
  return `
    <div class="login">
      <span class="label">Training week</span>
      <h1>Who's training?</h1>
      ${Object.entries(PROFILES).map(([id, p]) => `
        <button class="card profile-card" data-profile="${id}">
          <span class="avatar" style="background:${p.color}">${p.name[0]}</span>
          <span class="p-body">
            <span class="p-name">${p.name}</span>
            <span class="p-sub">${p.tagline}</span>
          </span>
          <span class="chev">›</span>
        </button>`).join('')}
      <p class="login-note">Progress, sessions and history are saved separately for each profile on this device.</p>
    </div>`;
}

function weekView() {
  const p = PROFILES[profile];
  const totals = plan.map(d => ({ d, total: dayTotal(d), done: dayDone(d.id) }));
  const weekTotal = totals.reduce((n, t) => n + t.total, 0);
  const weekDone = Object.keys(progress).length;
  const pct = weekTotal ? weekDone / weekTotal : 0;
  const sessionsThisWeek = new Set(
    sessions.filter(s => isoWeekKey(new Date(s.date + 'T12:00:00')) === weekKey).map(s => s.dayId)
  ).size;
  const today = todayDayId();

  return `
    <div class="ov-head">
      <div>
        <span class="label">${p.tagline}</span>
        <h1>Overview</h1>
      </div>
      <button class="avatar avatar-btn" data-act="switch-profile" style="background:${p.color}"
              aria-label="Switch profile">${p.name[0]}</button>
    </div>
    <div class="card hero">
      <div class="hero-stat"><b>${sessionsThisWeek}<span class="dim">/${plan.length}</span></b><span class="label">Sessions</span></div>
      ${ring(148, 13, pct, 'var(--green)',
        `<span><span class="ring-pct">${Math.round(pct * 100)}%</span><br><span class="label ring-sub">Week</span></span>`)}
      <div class="hero-stat"><b>${weekDone}<span class="dim">/${weekTotal}</span></b><span class="label">Exercises</span></div>
    </div>
    <div class="day-rings">
      ${totals.map(({ d, total, done }) => {
        const p = total ? done / total : 0;
        return `
        <button class="day-ring ${d.id === today ? 'today' : ''}" data-open-day="${d.id}" aria-label="Open ${d.name}">
          ${ring(56, 5, p, p >= 1 ? 'var(--green)' : 'var(--blue)', `<b>${Math.round(p * 100)}</b>`)}
          <span class="label">${d.short}</span>
        </button>`;
      }).join('')}
    </div>
    <span class="label section-label">The week at a glance</span>
    ${totals.map(({ d, total, done }) => `
      <button class="card day-card" data-open-day="${d.id}" aria-label="Open ${d.name} · ${d.focus}">
        <div class="day-card-row">
          <span class="num">${d.num}</span>
          <span class="titles">
            <span class="name">${d.name} · ${d.focus}</span>
            <span class="sub">${d.subtitle}</span>
          </span>
          <span class="right">
            <span class="count">${done}/${total}</span><br>
            <span class="time">${d.time}</span>
          </span>
        </div>
        <div class="bar"><i style="width:${total ? (done / total) * 100 : 0}%"></i></div>
      </button>`).join('')}
    ${p.rules.map(r => `
    <div class="card rule-card">
      <span class="label" style="color:${r.color}">${r.label}</span>
      <p>${r.text}</p>
    </div>`).join('')}`;
}

function dayView(dayId, withBack) {
  const day = plan.find(d => d.id === dayId);
  const total = dayTotal(day), done = dayDone(day.id);
  const here = active && active.dayId === day.id;
  const running = here && active.startedAt !== null;
  const el = here ? elapsedSec() : 0;
  const [lo, hi] = day.target;
  const over = el > hi * 60;
  const tp = Math.min(1, el / (hi * 60));

  const timerBtns = !here
    ? `<button class="pill green" data-act="start">Start</button>`
    : (running
      ? `<button class="pill blue" data-act="pause">Pause</button><button class="pill red" data-act="end">End</button>`
      : `<button class="pill blue" data-act="resume">Resume</button><button class="pill red" data-act="end">End</button>`);

  const restLeft = rest ? Math.max(0, Math.ceil((rest.end - Date.now()) / 1000)) : 0;
  const restUi = !rest
    ? `<div class="rest-btns">${[60, 90, 120].map(s =>
        `<button class="pill gray" data-rest="${s}">${s}s</button>`).join('')}</div>`
    : `<div class="rest-btns"><span class="rest-clock">${restLeft}s</span>
       <button class="pill gray" data-rest="0">Skip</button></div>`;

  return `
    <div class="top-row">
      ${withBack ? `<button class="back-btn" data-act="back">‹ Week</button>` : '<span></span>'}
      <button class="reset-btn" data-act="reset-day">Reset</button>
    </div>
    <div class="day-header">
      <div class="titles">
        <span class="label">${day.name} · ${day.time}</span>
        <h1>${day.focus}</h1>
        <div class="sub">${day.subtitle}</div>
      </div>
      ${ring(72, 7, total ? done / total : 0, done >= total ? 'var(--green)' : 'var(--blue)',
        `<span><b>${done}</b><span class="dim">/${total}</span></span>`)}
    </div>

    <div class="card timer-card">
      <div class="timer-row">
        <div>
          <span class="label" style="${running ? 'color:var(--blue)' : ''}">
            ${here ? (running ? 'Session · live' : 'Session · paused') : 'Session'}
          </span>
          <div class="clock ${over ? 'over' : ''}" id="clock">${fmtClock(el)}</div>
          <span class="timer-target">target ${lo}–${hi} min</span>
        </div>
        <div class="timer-btns">${timerBtns}</div>
      </div>
      <div class="progress"><i id="session-bar" class="${over ? 'over' : ''}" style="width:${tp * 100}%"></i></div>
      ${active && !here ? `<p class="sec-note" style="border:none;padding:10px 0 0">
        A session is running on ${plan.find(d => d.id === active.dayId)?.name ?? '?'} — end it there first.</p>` : ''}
    </div>

    <div class="card rest-card">
      <div class="rest-row"><span class="label">Rest</span>${restUi}</div>
      ${rest ? `<div class="progress"><i class="rest" style="width:${(restLeft / rest.len) * 100}%"></i></div>` : ''}
    </div>

    ${day.sections.map((sec, si) => {
      const key = `${day.id}-${si}`;
      const secDone = sec.items.filter((_, ii) => progress[exKey(day.id, si, ii)]).length;
      return `
      <div class="card section ${collapsed[key] ? 'collapsed' : ''}">
        <button class="section-head" data-collapse="${key}">
          <span class="section-index">${si + 1}</span>
          <span class="titles">
            <span class="section-title-row">
              <span class="section-title">${sec.title.toUpperCase()}</span>
              ${sec.tag ? `<span class="tag ${sec.tag}">${TAGS[sec.tag]}</span>` : ''}
            </span>
            ${sec.meta ? `<div class="section-meta">${sec.meta}</div>` : ''}
          </span>
          <span class="section-count ${secDone === sec.items.length ? 'done' : ''}">
            ${secDone}/${sec.items.length} ${collapsed[key] ? '▸' : '▾'}
          </span>
        </button>
        ${sec.items.map((it, ii) => {
          const id = exKey(day.id, si, ii);
          const checked = !!progress[id];
          return `
          <div class="ex ${checked ? 'checked' : ''}" data-detail="${id}" role="button" tabindex="0"
               aria-label="${esc(it.name)} details">
            <button class="check" data-toggle="${id}" aria-label="Mark ${esc(it.name)} done">✓</button>
            <span class="body">
              <span class="name-row"><span class="name">${esc(it.name)}</span>${tagsHtml(it.tags)}</span>
              ${it.note ? `<div class="note">${esc(it.note)}</div>` : ''}
            </span>
            <span class="dose">${it.dose}</span>
            <span class="chev">›</span>
          </div>`;
        }).join('')}
        ${sec.note ? `<div class="sec-note">${esc(sec.note)}</div>` : ''}
        ${sec.callout ? `<div class="callout"><b>${sec.callout.title}</b><p>${esc(sec.callout.body)}</p></div>` : ''}
      </div>`;
    }).join('')}

    <div class="card cut-card">
      <span class="label">Short on time?</span>
      <p>${esc(day.cut.replace(/^Short on time — /, ''))}</p>
    </div>`;
}

function historyView() {
  const streak = computeStreak(sessions.map(s => s.date));
  const thisWeek = sessions.filter(s => isoWeekKey(new Date(s.date + 'T12:00:00')) === weekKey);
  const totalTime = sessions.reduce((n, s) => n + s.durationSec, 0);

  const byWeek = new Map();
  for (const s of sessions) {
    const wk = isoWeekKey(new Date(s.date + 'T12:00:00'));
    byWeek.set(wk, (byWeek.get(wk) ?? 0) + 1);
  }
  const cap = plan.length;
  const weeks = [];
  const d = new Date();
  for (let i = 0; i < 8; i++) {
    weeks.unshift({ wk: isoWeekKey(d), count: Math.min(cap, byWeek.get(isoWeekKey(d)) ?? 0) });
    d.setDate(d.getDate() - 7);
  }

  const p = PROFILES[profile];
  return `
    <div class="ov-head">
      <div>
        <span class="label">${p.name} · Training history</span>
        <h1>History</h1>
      </div>
      <button class="avatar avatar-btn" data-act="switch-profile" style="background:${p.color}"
              aria-label="Switch profile">${p.name[0]}</button>
    </div>
    <div class="stat-row">
      <div class="card stat"><b>${streak}</b><span class="label">Day streak</span></div>
      <div class="card stat"><b>${thisWeek.length}<span class="dim">/${plan.length}</span></b><span class="label">This week</span></div>
      <div class="card stat"><b>${Math.round(totalTime / 360) / 10}<span class="dim">h</span></b><span class="label">Total time</span></div>
    </div>
    ${heatmapHtml()}
    <div class="card chart-card">
      <span class="label">Sessions per week · last 8</span>
      <div class="chart">
        ${weeks.map(({ wk, count }) => `
          <div class="chart-col">
            <div class="chart-bar"><i class="${count >= cap ? 'full' : ''}" style="height:${(count / cap) * 100}%"></i></div>
            <span class="chart-tick">${wk.slice(-2)}</span>
          </div>`).join('')}
      </div>
    </div>
    <span class="label section-label">Logged sessions</span>
    ${sessions.length === 0
      ? `<div class="card empty">No sessions yet. Open a day and hit Start — ending the session logs it here.</div>`
      : sessions.map(s => {
        const day = plan.find(d => d.id === s.dayId);
        const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
        return `
        <div class="card session-row">
          <span class="body">
            <span class="name">${day ? `${day.name} · ${day.focus}` : s.dayId}</span>
            <div class="date">${s.date}</div>
          </span>
          <span class="right">
            <span class="time">${fmtClock(s.durationSec)}</span>
            <div class="pct ${pct >= 100 ? 'full' : ''}">${pct}% done</div>
          </span>
        </div>`;
      }).join('')}`;
}

/* ---------------- exercise detail sheet ---------------- */

/* Silent looping demo: two frames (start ⇄ end) swapped on a timer. */
let demoTimer = null;

function startDemoLoop() {
  stopDemoLoop();
  const stage = $('.demo-stage');
  if (!stage || stage.classList.contains('demo-video')) return; // video loops itself
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  demoTimer = setInterval(() => stage.classList.toggle('b'), 800);
}

function stopDemoLoop() {
  if (demoTimer) { clearInterval(demoTimer); demoTimer = null; }
}

function demoHtml(name) {
  const demo = demoFor(name);
  if (!demo) return '';

  if (demo.kind === 'video') {
    return `
      <span class="label sheet-h">How it looks</span>
      <div class="demo">
        <div class="demo-stage demo-video">
          <iframe src="${demo.src}" title="${esc(name)} demonstration" loading="lazy"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        <span class="demo-cap">Muted loop · <a href="${demo.watch}" target="_blank" rel="noopener">${esc(demo.title)}</a></span>
      </div>`;
  }

  return `
    <span class="label sheet-h">How it looks</span>
    <div class="demo">
      <div class="demo-stage">
        <img class="demo-frame f0" src="${demo.frames[0]}" alt="${esc(name)} — start position" loading="lazy">
        <img class="demo-frame f1" src="${demo.frames[1]}" alt="${esc(name)} — end position" loading="lazy">
      </div>
      <span class="demo-cap">Silent loop · ${esc(demo.title)}</span>
    </div>`;
}

let sheetId = null;

function renderSheet() {
  const backdrop = $('#sheet-backdrop');
  const sheet = $('#sheet');
  if (!sheetId) {
    stopDemoLoop();
    backdrop.hidden = true;
    sheet.hidden = true;
    document.body.style.overflow = '';
    return;
  }
  const [dayId, si, ii] = sheetId.split('-');
  const day = plan.find(d => d.id === dayId);
  const sec = day.sections[+si];
  const it = sec.items[+ii];
  const info = exinfoFor(it.name, sec.tag);
  const checked = !!progress[sheetId];
  const q = encodeURIComponent(it.name + ' exercise');

  sheet.innerHTML = `
    <div class="sheet-grab"></div>
    <button class="sheet-close" data-sheet-close aria-label="Close">✕</button>
    <span class="label">${day.name} · ${sec.title}</span>
    <h2 class="sheet-name">${esc(it.name)}</h2>
    <div class="sheet-meta">
      <span class="sheet-dose">${it.dose}</span>
      ${tagsHtml(it.tags)}
    </div>
    ${it.note ? `<p class="sheet-note">${esc(it.note)}</p>` : ''}

    <span class="label sheet-h">Targets</span>
    <div class="chips">${info.m.map(k => `<span class="chip">${MUSCLES[k] || k}</span>`).join('')}</div>
    ${bodyMap(info.m)}
    ${demoHtml(it.name)}

    ${info.alt.length ? `
      <span class="label sheet-h">Same muscles, other options</span>
      <ul class="alts">${info.alt.map(a => `
        <li><a href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(a + ' exercise')}"
               target="_blank" rel="noopener">${esc(a)}<span class="alt-go">🖼</span></a></li>`).join('')}</ul>` : ''}

    <div class="sheet-links">
      <a class="pill blue" target="_blank" rel="noopener"
         href="https://www.youtube.com/results?search_query=${q}+form">▶ Watch tutorial</a>
      <a class="pill gray" target="_blank" rel="noopener"
         href="https://www.google.com/search?tbm=isch&q=${q}">🖼 See images</a>
    </div>

    <button class="pill ${checked ? 'gray' : 'green'} sheet-toggle" data-sheet-toggle>
      ${checked ? '✓ Done — tap to undo' : 'Mark as done'}
    </button>`;
  backdrop.hidden = false;
  sheet.hidden = false;
  requestAnimationFrame(() => { backdrop.classList.add('open'); sheet.classList.add('open'); });
  document.body.style.overflow = 'hidden';
  startDemoLoop();
}

function openSheet(id) {
  sheetId = id;
  renderSheet();
}

function closeSheet() {
  $('#sheet-backdrop').classList.remove('open');
  $('#sheet').classList.remove('open');
  sheetId = null;
  setTimeout(renderSheet, 180);
}

$('#sheet-backdrop').addEventListener('click', closeSheet);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && sheetId) closeSheet(); });
$('#sheet').addEventListener('click', e => {
  if (e.target.closest('[data-sheet-close]')) return closeSheet();
  if (e.target.closest('[data-sheet-toggle]')) {
    if (progress[sheetId]) delete progress[sheetId]; else progress[sheetId] = true;
    saveProgress();
    buzz(10);
    render();
    renderSheet();
  }
});

/* ---------------- training heatmap (GitHub-style) ---------------- */

const HEAT_WEEKS = 26;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_ABBR = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const isoOf = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/* 0 = rest day, 1–4 by how much of the session was completed. */
function heatLevel(pct) {
  if (pct <= 0) return 0;
  if (pct < 0.5) return 1;
  if (pct < 0.75) return 2;
  if (pct < 1) return 3;
  return 4;
}

function heatmapHtml() {
  const byDate = new Map();
  for (const s of sessions) {
    const cur = byDate.get(s.date) || { pct: 0, dur: 0, n: 0, days: [] };
    cur.pct = Math.max(cur.pct, s.total ? s.done / s.total : 0);
    cur.dur += s.durationSec;
    cur.n++;
    const day = plan.find(d => d.id === s.dayId);
    cur.days.push(day ? day.focus : s.dayId);
    byDate.set(s.date, cur);
  }

  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const todayIso = isoOf(today);
  const mondayIdx = (today.getDay() + 6) % 7;          // 0 = Monday
  const start = new Date(today);
  start.setDate(today.getDate() - mondayIdx - (HEAT_WEEKS - 1) * 7);

  const cells = [];
  const months = [];
  let lastMonth = -1;

  for (let w = 0; w < HEAT_WEEKS; w++) {
    const colStart = new Date(start);
    colStart.setDate(start.getDate() + w * 7);
    const m = colStart.getMonth();
    months.push(m !== lastMonth ? MONTHS[m] : '');
    lastMonth = m;

    for (let d = 0; d < 7; d++) {
      const cur = new Date(start);
      cur.setDate(start.getDate() + w * 7 + d);
      const iso = isoOf(cur);
      const future = iso > todayIso;
      const hit = byDate.get(iso);
      const lvl = hit ? heatLevel(hit.pct) : 0;
      const label = hit
        ? `${iso} · ${hit.days.join(', ')} · ${Math.round(hit.pct * 100)}% · ${fmtClock(hit.dur)}`
        : `${iso} · rest`;
      cells.push(`<i class="hc l${lvl}${future ? ' future' : ''}${iso === todayIso ? ' today' : ''}"
        style="grid-row:${d + 1}" data-heat="${esc(label)}" title="${esc(label)}"></i>`);
    }
  }

  return `
    <div class="card heat-card">
      <span class="label">Training heatmap · last ${HEAT_WEEKS} weeks</span>
      <div class="heat-scroll">
        <div class="heat-inner">
          <div class="heat-months">${months.map(m => `<span>${m}</span>`).join('')}</div>
          <div class="heat-row">
            <div class="heat-days">${DAY_ABBR.map((d, i) => `<span>${i % 2 === 0 ? d : ''}</span>`).join('')}</div>
            <div class="heat-cells">${cells.join('')}</div>
          </div>
        </div>
      </div>
      <div class="heat-foot">
        <span id="heat-detail" class="heat-detail">Tap a square for that day</span>
        <span class="heat-legend">Less ${[0, 1, 2, 3, 4].map(l => `<i class="hc l${l}"></i>`).join('')} More</span>
      </div>
    </div>`;
}

/* Consecutive training days; weekends don't break the chain. */
function computeStreak(dates) {
  if (!dates.length) return 0;
  const have = new Set(dates);
  const d = new Date();
  let streak = 0, graceUsed = false;
  for (let i = 0; i < 366; i++) {
    const iso = d.toISOString().slice(0, 10);
    const dow = d.getDay();
    const weekend = dow === 0 || dow === 6;
    if (have.has(iso)) streak++;
    else if (!weekend) {
      if (streak === 0 && !graceUsed) graceUsed = true;
      else break;
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

/* ---------------- render + events ---------------- */

function render() {
  const main = $('#view');
  document.getElementById('nav').style.display = view.name === 'login' ? 'none' : 'flex';
  if (view.name === 'login') main.innerHTML = loginView();
  else if (view.name === 'week') main.innerHTML = weekView();
  else if (view.name === 'day') main.innerHTML = dayView(view.dayId, view.from === 'week');
  else main.innerHTML = historyView();

  /* Heatmap opens showing the most recent weeks. */
  const heatScroll = $('.heat-scroll');
  if (heatScroll) heatScroll.scrollLeft = heatScroll.scrollWidth;

  document.querySelectorAll('.bottom-nav button').forEach(b => {
    const key = b.dataset.nav;
    const activeTab = (view.name === 'week' && key === 'week')
      || (view.name === 'history' && key === 'history')
      || (view.name === 'day' && view.from === 'nav' && key === 'today');
    b.classList.toggle('active', activeTab);
  });
}

document.getElementById('nav').addEventListener('click', e => {
  const btn = e.target.closest('[data-nav]');
  if (!btn) return;
  const key = btn.dataset.nav;
  if (key === 'week') view = { name: 'week' };
  else if (key === 'history') view = { name: 'history' };
  else view = { name: 'day', dayId: todayDayId(), from: 'nav' };
  window.scrollTo(0, 0);
  render();
});

$('#view').addEventListener('click', e => {
  const prof = e.target.closest('[data-profile]');
  if (prof) {
    profile = prof.dataset.profile;
    localStorage.setItem(K.profile, profile);
    loadProfileState();
    view = { name: 'week' };
    window.scrollTo(0, 0);
    return render();
  }
  const open = e.target.closest('[data-open-day]');
  if (open) {
    view = { name: 'day', dayId: open.dataset.openDay, from: 'week' };
    window.scrollTo(0, 0);
    return render();
  }
  const toggle = e.target.closest('[data-toggle]');
  if (toggle) {
    const id = toggle.dataset.toggle;
    if (progress[id]) delete progress[id]; else progress[id] = true;
    saveProgress();
    buzz(10);
    return render();
  }
  const detail = e.target.closest('[data-detail]');
  if (detail) return openSheet(detail.dataset.detail);
  const heat = e.target.closest('[data-heat]');
  if (heat) {
    const out = $('#heat-detail');
    if (out) out.textContent = heat.dataset.heat;
    document.querySelectorAll('.hc.sel').forEach(c => c.classList.remove('sel'));
    heat.classList.add('sel');
    return;
  }
  const col = e.target.closest('[data-collapse]');
  if (col) {
    collapsed[col.dataset.collapse] = !collapsed[col.dataset.collapse];
    return render();
  }
  const restBtn = e.target.closest('[data-rest]');
  if (restBtn) {
    const s = Number(restBtn.dataset.rest);
    rest = s > 0 ? { end: Date.now() + s * 1000, len: s } : null;
    return render();
  }
  const act = e.target.closest('[data-act]');
  if (!act) return;
  const day = view.name === 'day' ? plan.find(d => d.id === view.dayId) : null;
  switch (act.dataset.act) {
    case 'switch-profile':
      view = { name: 'login' };
      break;
    case 'back':
      view = { name: 'week' };
      break;
    case 'reset-day':
      if (day && confirm(`Uncheck every exercise for ${day.name}?`)) {
        for (const k of Object.keys(progress)) if (k.startsWith(day.id + '-')) delete progress[k];
        saveProgress();
      }
      break;
    case 'start':
      if (active) { alert('End the running session first.'); break; }
      active = { dayId: day.id, startedAt: Date.now(), accumSec: 0 };
      saveActive();
      break;
    case 'pause':
      active = { ...active, startedAt: null, accumSec: elapsedSec() };
      saveActive();
      break;
    case 'resume':
      active = { ...active, startedAt: Date.now() };
      saveActive();
      break;
    case 'end': {
      const dur = elapsedSec();
      if (confirm(`End session? Log ${fmtClock(dur)} for ${day.name}.`)) {
        sessions.unshift({
          dayId: day.id,
          date: new Date().toISOString().slice(0, 10),
          durationSec: dur,
          done: dayDone(day.id),
          total: dayTotal(day),
        });
        saveSessions();
        active = null;
        saveActive();
      }
      break;
    }
  }
  render();
});

/* ticking: 1s re-render of live bits while a timer runs on the day view */
setInterval(() => {
  if (view.name !== 'day') return;
  const here = active && active.dayId === view.dayId;
  const running = here && active.startedAt !== null;
  if (rest) {
    const left = Math.ceil((rest.end - Date.now()) / 1000);
    if (left <= 0) {
      rest = null;
      beep();
      buzz([200, 80, 200]);
    }
    render();
  } else if (running) {
    render();
  }
}, 1000);

render();
