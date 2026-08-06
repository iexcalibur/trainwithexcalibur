/* ============================================================
   Training Week — Complete Plan
   Plain JS: renders the 5 day pages, tracks progress in
   localStorage, handles tabs, collapsibles and dark mode.
   ============================================================ */

const TAGS = {
  hipext:   { label: 'Hip Ext',  cls: 'tag-hipext' },
  joints:   { label: 'Joints',   cls: 'tag-joints' },
  fascia:   { label: 'Fascia',   cls: 'tag-fascia' },
  optional: { label: 'Optional', cls: 'tag-optional' },
  physio:   { label: 'Physio',   cls: 'tag-physio' },
};

const PLAN = [
  {
    id: 'mon', num: '01', name: 'Monday',
    subtitle: 'Legs · heavy hip extension · abs (anti-extension)',
    time: '80–95 min',
    sections: [
      {
        title: 'Prep', meta: 'dynamic, 8 min',
        items: [
          { name: 'Easy cardio — bike or incline walk', dose: '5 min' },
          { name: 'Cat-cow · hip circles · band pull-aparts', dose: '8 / 8ea / 2×15' },
          { name: 'Knee-to-wall ankle rock', tags: ['joints'], note: 'Opens the ankle before the leg press.', dose: '2 × 10ea' },
          { name: '90/90 hip rotation switches', tags: ['joints'], dose: '2 × 8ea' },
          { name: 'Single-leg balance', tags: ['joints'], dose: '2 × 20s ea' },
          { name: 'Glute bridge', tags: ['hipext'], note: 'So the glutes drive the press, not your low back.', dose: '1 × 15' },
          { name: 'Leg swings · bodyweight squats', dose: '10ea / 10' },
        ],
      },
      {
        title: 'Main lifts', meta: 'heavy hip extension is folded in here',
        items: [
          { name: 'Leg press', tags: ['physio'], note: 'Full foot on the platform. Stop before your lower back lifts off the pad.', dose: '3 × 10–15' },
          { name: 'Hip thrust, dumbbell or barbell', tags: ['hipext'], note: 'Heels, ribs down, squeeze at the top.', dose: '4 × 8–12' },
          { name: 'Leg extension', dose: '3 × 12–15' },
          { name: 'Seated leg curl', dose: '3 × 12–15' },
          { name: 'Dumbbell Bulgarian split squat', note: 'Shorten the range if the hip pinches.', dose: '3 × 8–10ea' },
          { name: 'Cable kickback', tags: ['hipext'], dose: '3 × 12–15ea' },
          { name: 'Single-leg calf raise', tags: ['joints'], note: 'Unilateral fixes the side-to-side gap a machine hides.', dose: '3 × 12ea' },
          { name: 'Frog pump finisher', tags: ['hipext', 'optional'], dose: '2 × 20' },
        ],
        note: 'Heavy-glute swap-ins if a machine is taken or you want variety: glute drive machine 3 × 10–12, or single-leg hip thrust 3 × 10 each.',
      },
      {
        title: 'Abs', meta: 'anti-extension (front core)',
        items: [
          { name: 'Dumbbell dead bug', note: "Light DB at arm's length, ribs pinned down.", dose: '3 × 10ea' },
          { name: 'Plank with dumbbell drag-through', dose: '3 × 8ea' },
          { name: 'Overhead dumbbell march', dose: '3 × 30s' },
        ],
      },
      {
        title: 'Cool-down', meta: '2 min easy walk, then hold and breathe',
        items: [
          { name: 'Standing quad stretch', dose: '30s ea' },
          { name: 'Calf stretch against wall · soleus with knee bent', dose: '45s ea' },
          { name: 'Kneeling hip flexor stretch', tags: ['fascia'], note: 'Long hold; this is the slow melting work.', dose: '2 min ea' },
          { name: 'Wide-stance adductor stretch', tags: ['fascia'], dose: '2 min' },
          { name: 'Single knee-to-chest', note: 'Gentle; back off if anything travels down the leg.', dose: '30s ea' },
        ],
      },
    ],
    cut: 'Short on time — cut in this order: frog pump → Bulgarian split squat → cable kickback. Leg press, hip thrust and leg curl are the ones that matter.',
  },

  {
    id: 'tue', num: '02', name: 'Tuesday',
    subtitle: 'Chest · triceps · ankle day · abs (anti-rotation)',
    time: '80–90 min',
    sections: [
      {
        title: 'Prep', meta: 'dynamic, 7 min',
        items: [
          { name: 'Easy cardio', dose: '5 min' },
          { name: 'Cat-cow · hip circles · band pull-aparts', dose: '8 / 8ea / 2×15' },
          { name: 'Band external rotation', note: 'Shoulder prep before pressing.', dose: '2 × 12ea' },
          { name: 'Wall slides · arm swings · push-ups as a ramp-up', dose: '10 / 10 / 8–10' },
        ],
      },
      {
        title: 'Main lifts',
        items: [
          { name: 'Incline dumbbell press', note: 'Upper chest; control down, press up and slightly together.', dose: '4 × 8–12' },
          { name: 'Flat machine or dumbbell press', dose: '3 × 8–12' },
          { name: 'Incline cable fly or pec deck', note: 'The stretch that builds the chest line.', dose: '3 × 12–15' },
          { name: 'Chest dips', note: 'Lean forward; stop when reps stop being clean.', dose: '2–3 sets' },
          { name: 'Overhead triceps extension', note: 'Long head; elbows forward, ribs down.', dose: '3 × 10–12' },
          { name: 'Rope pushdown', dose: '3 × 12–15' },
        ],
      },
      {
        title: 'Ankle', tag: 'joints', meta: '12 min; the thinnest-covered joint in the plan',
        items: [
          { name: 'Knee-to-wall dorsiflexion', note: 'Range first; a stiff ankle sends load up to the knee.', dose: '3 × 10ea' },
          { name: 'Eccentric heel drop off a step, 3s lower', note: 'The Achilles builder.', dose: '3 × 10ea' },
          { name: 'Tibialis raise, back to a wall, toes up', note: 'The front of the shin, trained by nothing else here.', dose: '3 × 15–20' },
          { name: 'Banded eversion and inversion', note: 'Peroneals; this is your rolled-ankle insurance.', dose: '2 × 15ea way' },
          { name: 'Single-leg balance, eyes closed', dose: '3 × 30s ea' },
        ],
      },
      {
        title: 'Hip extension', tag: 'hipext', meta: 'light abduction, 5 min',
        items: [
          { name: 'Seated hip abduction machine', note: 'Upper glute; slow out, slower back.', dose: '3 × 15–20' },
          { name: 'Banded glute bridge with abduction at the top', tags: ['optional'], dose: '3 × 15' },
        ],
      },
      {
        title: 'Abs', meta: 'anti-rotation',
        items: [
          { name: 'Cable Pallof press', note: 'Resist the twist; ribs and hips stay square.', dose: '3 × 12ea' },
          { name: 'Half-kneeling cable chop', note: 'Light and controlled, no yanking.', dose: '3 × 12ea' },
          { name: 'Suitcase carry', note: 'One heavy DB; stay perfectly upright.', dose: '3 × 30–40m' },
        ],
      },
      {
        title: 'Cool-down', meta: 'holds and release',
        items: [
          { name: 'Doorway pec · overhead triceps · kneeling lat on a bench', dose: '30s ea' },
          { name: 'Lacrosse ball under the foot', tags: ['fascia'], note: 'The foot anchors the whole back line.', dose: '60s ea' },
          { name: 'Slow foam roll: lats, quads, calves', tags: ['fascia'], note: 'Never the lower back.', dose: '30–60s ea' },
        ],
      },
    ],
    cut: 'Short on time — cut in this order: banded glute bridge → chest dips → the chop. Keep the full ankle block — it is the gap this day exists to close.',
  },

  {
    id: 'wed', num: '03', name: 'Wednesday',
    subtitle: 'Back (V-taper) · knee day · abs (obliques) · elastic fascia',
    time: '85–95 min',
    sections: [
      {
        title: 'Prep', meta: 'dynamic, 7 min',
        items: [
          { name: 'Easy cardio', dose: '5 min' },
          { name: 'Cat-cow · hip circles · band pull-aparts', dose: '8 / 8ea / 2×15' },
          { name: 'Scap shrugs from a dead hang', note: 'Teaches the shoulder blade to move first.', dose: '1 × 10' },
          { name: 'Band straight-arm pulldown · face pulls', note: 'Lights up the lats before you pull heavy.', dose: '2×15 / 2×15' },
        ],
      },
      {
        title: 'Main lifts', meta: 'width first, then thickness',
        items: [
          { name: 'Lat pulldown, wide or neutral grip', note: 'Elbows down toward your pockets; hands are hooks.', dose: '4 × 8–12' },
          { name: 'Chest-supported row', note: 'Chest stays on the pad; pull to your lower ribs.', dose: '4 × 10–12' },
          { name: 'Straight-arm pulldown', note: 'Pure lat isolation, the V-flare movement.', dose: '3 × 12–15' },
          { name: 'One-arm dumbbell or cable row', note: 'Braced; elbow to the back pocket, no torso twist.', dose: '3 × 10–12ea' },
          { name: 'Face pull or reverse pec deck', note: 'Rear delts; what caps the shoulder from behind.', dose: '3 × 15–20' },
        ],
      },
      {
        title: 'Knee', tag: 'joints', meta: '12 min; tendon loading, which the main plan has none of',
        items: [
          { name: 'Spanish squat isometric, heavy band behind the knees', note: 'The best patellar tendon loader. Wall sit for the same time if you have no band.', dose: '3 × 30–45s' },
          { name: 'Slow step-down from a low box, 3s lower', note: 'Eccentric control, where knees usually fail.', dose: '3 × 8ea' },
          { name: 'Banded terminal knee extension', dose: '3 × 15ea' },
          { name: 'Lateral step-down', note: 'Frontal plane; the direction football punishes.', dose: '2 × 8ea' },
          { name: 'Reverse Nordic curl, shallow range', tags: ['optional'], dose: '2 × 6' },
        ],
      },
      {
        title: 'Abs', meta: 'obliques and lateral core',
        items: [
          { name: 'Side plank with a dumbbell on the top hip', dose: '3 × 20–40s ea' },
          { name: 'Cable lateral hold', note: 'Stand side-on and simply resist the pull.', dose: '3 × 20–30s ea' },
          { name: "Farmer's carry, two dumbbells", tags: ['optional'], dose: '3 × 40m' },
        ],
      },
      {
        title: 'Elastic + cool-down', tag: 'fascia', meta: '10 min; legs are fresh today, so the hops go here',
        items: [
          { name: 'Rope skipping', tags: ['physio'], note: 'Land quiet and springy; quiet landings are the whole skill.', dose: '5 × 30s' },
          { name: 'Ankle pogo hops, minimal knee bend', tags: ['physio'], dose: '3 × 20' },
          { name: 'Med-ball chest pass into a wall', note: 'Upper-body elastic work, zero impact.', dose: '3 × 10' },
          { name: 'Lat stretch holding an upright, hips sitting back · doorway pec', dose: '30s ea' },
          { name: 'Thoracic extension over a foam roller', note: 'Upper back only, never the lower back.', dose: '30–45s' },
        ],
      },
    ],
    cut: "Short on time — cut in this order: farmer's carry → reverse Nordic → med-ball pass. Never cut the pulldown, chest-supported row or straight-arm pulldown — they are the V-taper.",
  },

  {
    id: 'thu', num: '04', name: 'Thursday',
    subtitle: 'Shoulders · hip day · abs (lower)',
    time: '80–90 min',
    sections: [
      {
        title: 'Prep', meta: 'dynamic, 7 min',
        items: [
          { name: 'Easy cardio', dose: '5 min' },
          { name: 'Cat-cow · hip circles · band pull-aparts', dose: '8 / 8ea / 2×15' },
          { name: 'Band external rotation · wall slides', dose: '2×15ea / 10' },
          { name: 'Empty-hand lateral raises · arm circles', note: 'Grooves the pattern before you load it.', dose: '2×15 / 10ea way' },
        ],
      },
      {
        title: 'Main lifts', meta: 'side delts are the width, not the press',
        items: [
          { name: 'Seated dumbbell or machine press', note: 'Back supported, shoulder blades on the pad.', dose: '4 × 8–12' },
          { name: 'Dumbbell lateral raise', note: 'Lift with the elbow, stop at shoulder height, no shrugging.', dose: '4 × 12–20' },
          { name: 'Cable lateral raise', note: 'Constant tension; light enough that the shoulder does the work.', dose: '3 × 15' },
          { name: 'Rear delt fly or reverse pec deck', dose: '3 × 15–20' },
          { name: 'Shrugs', tags: ['optional'], dose: '3 × 12–15' },
        ],
      },
      {
        title: 'Hip', tag: 'joints', meta: '12 min; rotation, adductors and hip-flexor strength',
        items: [
          { name: '90/90 hip rotation switches', note: 'Rotation is the range this plan otherwise never trains.', dose: '3 × 8ea' },
          { name: 'Copenhagen plank, knee on a bench', note: "Adductors — the biggest gap, and groin strains are one of football's most common injuries.", dose: '3 × 15–20s ea' },
          { name: 'Banded hip flexor march', tags: ['physio'], note: 'The psoas attaches to your lumbar spine — drop it the moment anything travels down the leg.', dose: '3 × 12ea' },
          { name: 'Side-lying clam or hip abduction', dose: '3 × 15ea' },
        ],
      },
      {
        title: 'Hip extension', tag: 'hipext', meta: 'unilateral and step patterns, 6 min',
        items: [
          { name: 'Dumbbell step-up, knee-height box', note: 'Lower the box if deep hip flexion bothers the leg.', dose: '3 × 10ea' },
          { name: 'Dumbbell reverse lunge', dose: '3 × 10ea' },
          { name: 'Single-leg glute bridge', tags: ['optional'], dose: '3 × 12ea' },
        ],
      },
      {
        title: 'Abs', meta: 'lower abs',
        items: [
          { name: "Captain's-chair knee raise", tags: ['physio'], note: 'Curl hips toward ribs; no leg swinging.', dose: '3 × 10–15' },
          { name: 'Reverse crunch on a bench', dose: '3 × 12–15' },
          { name: 'Lying leg raise, dumbbell between the feet', tags: ['physio'], dose: '3 × 10–12' },
        ],
      },
      {
        title: 'Cool-down', meta: 'holds and long-chain work',
        items: [
          { name: 'Cross-body rear delt · doorway pec · overhead triceps · upper trap', dose: '30s ea' },
          { name: 'Lunge with overhead reach', tags: ['fascia'], note: 'Long-chain, keep moving through it.', dose: '2 × 8ea' },
          { name: 'Standing side bend, arm overhead', tags: ['fascia'], dose: '2 × 8ea' },
          { name: 'Kneeling hip flexor stretch', dose: '60–90s ea' },
        ],
      },
    ],
    cut: 'Short on time — cut in this order: shrugs → single-leg glute bridge → reverse lunge. Both lateral raises stay — they are the highest-value movement for shoulder width.',
  },

  {
    id: 'fri', num: '05', name: 'Friday',
    subtitle: 'Arms · hinge · integration · abs (flexion) · elastic fascia',
    time: '80–90 min',
    sections: [
      {
        title: 'Prep', meta: 'dynamic, 7 min',
        items: [
          { name: 'Easy cardio', dose: '5 min' },
          { name: 'Cat-cow · hip circles · band pull-aparts', dose: '8 / 8ea / 2×15' },
          { name: 'Wrist circles · flexor and extensor rocks', dose: '10 ea' },
          { name: 'Band curls · band pushdowns', note: 'Blood into the elbows before loading them.', dose: '2×15 / 2×15' },
        ],
      },
      {
        title: 'Main lifts',
        items: [
          { name: 'Close-grip press or dips', note: 'Keep this moderate; you pressed yesterday.', dose: '3 × 8–12' },
          { name: 'Overhead triceps extension', dose: '3 × 10–12' },
          { name: 'Rope pushdown', dose: '3 × 12–15' },
          { name: 'Incline dumbbell curl', note: 'Deeper stretch; upper arms still, no swinging.', dose: '3 × 10–15' },
          { name: 'Hammer curl', tags: ['optional'], dose: '3 × 10–12' },
        ],
      },
      {
        title: 'Hip extension', tag: 'hipext', meta: 'hinge; the second hard glute day',
        items: [
          { name: 'Dumbbell Romanian deadlift', tags: ['physio'], note: 'Hips back, dumbbells close to the legs, feel the hamstrings stretch.', dose: '3 × 8–12' },
          { name: '45° back extension, glute-biased', tags: ['physio'], note: 'Push the hips into the pad, squeeze at the top.', dose: '3 × 12–15' },
          { name: 'Cable pull-through', tags: ['physio', 'optional'], dose: '3 × 12–15' },
          { name: 'Lying leg curl', dose: '3 × 12–15' },
        ],
        callout: {
          title: 'Until hinging is cleared',
          body: 'Swap the three gated lines for: hip thrust 3 × 10–12 and cable kickback 3 × 12–15 each. You lose very little — thrusts are a top-tier glute builder and they do not load the spine in flexion.',
        },
      },
      {
        title: 'Integration', tag: 'joints', meta: '8 min; ties ankle, knee and hip together',
        items: [
          { name: 'Single-leg Romanian deadlift, bodyweight', tags: ['physio'], note: 'Balance and hinge in one.', dose: '2 × 8ea' },
          { name: 'Lateral step-down', dose: '2 × 8ea' },
          { name: 'Balance on a cushion, eyes closed', dose: '3 × 30s ea' },
        ],
      },
      {
        title: 'Abs', meta: 'flexion; the one loaded-flexion day of the week',
        items: [
          { name: 'Cable crunch', tags: ['physio'], note: 'Ribs toward hips; arms hold the rope, abs move the weight.', dose: '3 × 12–15' },
          { name: 'Ab crunch machine', tags: ['physio', 'optional'], dose: '3 × 12–15' },
          { name: 'Hollow hold or plank to finish', dose: '3 × 30–45s' },
        ],
      },
      {
        title: 'Elastic + cool-down', tag: 'fascia', meta: '10 min, lateral direction',
        items: [
          { name: 'Skater hops, side to side', tags: ['physio'], dose: '4 × 20s' },
          { name: 'Lateral line hops, small and quick', tags: ['physio'], dose: '3 × 20' },
          { name: 'Overhead triceps · biceps stretch, palm flat on a wall behind you', dose: '30s ea' },
          { name: 'Wrist flexor stretch', dose: '30s ea' },
          { name: 'Foam roll lats, quads, calves', note: 'Skip the lower back.', dose: '30–60s ea' },
        ],
      },
    ],
    cut: 'Short on time — cut in this order: hammer curl → ab crunch machine → cable pull-through.',
  },
];

/* ============================ Progress store ============================ */

const STORE_KEY = 'twp-progress';
const THEME_KEY = 'twp-theme';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch { return {}; }
}

let progress = loadProgress();

function saveProgress() {
  localStorage.setItem(STORE_KEY, JSON.stringify(progress));
}

/* ============================ Rendering ============================ */

function tagHtml(key) {
  const t = TAGS[key];
  return t ? `<span class="tag ${t.cls}">${t.label}</span>` : '';
}

function renderDay(day) {
  const sections = day.sections.map((sec, si) => {
    const rows = sec.items.map((it, ii) => {
      const id = `${day.id}-${si}-${ii}`;
      const tags = (it.tags || []).map(tagHtml).join('');
      const note = it.note ? `<div class="ex-note">${it.note}</div>` : '';
      return `
        <label class="ex" data-id="${id}">
          <input type="checkbox" data-id="${id}">
          <span>
            <span class="ex-name">${it.name}${tags}</span>
            ${note}
          </span>
          <span class="ex-dose">${it.dose}</span>
        </label>`;
    }).join('');

    const secTag = sec.tag ? tagHtml(sec.tag) : '';
    const meta = sec.meta ? `<span class="block-meta">— ${sec.meta}</span>` : '<span class="block-meta"></span>';
    const note = sec.note ? `<div class="block-note">${sec.note}</div>` : '';
    const callout = sec.callout
      ? `<div class="block-callout"><strong>${sec.callout.title}</strong>${sec.callout.body}</div>` : '';

    return `
      <div class="block" data-section="${day.id}-${si}">
        <button class="block-head" aria-expanded="true">
          <span class="block-index">${si + 1}</span>
          <span class="block-title">${sec.title}</span>
          ${secTag}
          ${meta}
          <span class="block-count" data-count="${day.id}-${si}"></span>
          <span class="chev">▼</span>
        </button>
        <div class="block-body">
          ${rows}
          ${note}
          ${callout}
        </div>
      </div>`;
  }).join('');

  return `
    <div class="day-header">
      <div class="day-num">${day.num}</div>
      <div class="day-titles">
        <h2>${day.name}</h2>
        <p>${day.subtitle}</p>
      </div>
      <div class="day-meta">
        <span class="time-chip">${day.time}</span>
        <button class="link-btn" data-reset-day="${day.id}">Reset day</button>
      </div>
    </div>
    <div class="day-progress">
      <div class="bar"><i data-day-bar="${day.id}"></i></div>
      <span class="pct" data-day-pct="${day.id}"></span>
    </div>
    ${sections}
    <p class="cut-note"><strong>Short on time?</strong> ${day.cut.replace(/^Short on time — /, '')}</p>`;
}

PLAN.forEach(day => {
  document.getElementById(`view-${day.id}`).innerHTML = renderDay(day);
});

/* ============================ Progress UI ============================ */

function updateCounts() {
  PLAN.forEach(day => {
    let total = 0, done = 0;
    day.sections.forEach((sec, si) => {
      const secTotal = sec.items.length;
      let secDone = 0;
      sec.items.forEach((_, ii) => {
        total++;
        if (progress[`${day.id}-${si}-${ii}`]) { done++; secDone++; }
      });
      const el = document.querySelector(`[data-count="${day.id}-${si}"]`);
      if (el) {
        el.textContent = `${secDone}/${secTotal}`;
        el.classList.toggle('done', secDone === secTotal && secTotal > 0);
      }
    });
    const pct = total ? Math.round((done / total) * 100) : 0;
    const bar = document.querySelector(`[data-day-bar="${day.id}"]`);
    const pctEl = document.querySelector(`[data-day-pct="${day.id}"]`);
    const tabBar = document.querySelector(`.tab[data-view="${day.id}"] .tab-bar i`);
    if (bar) bar.style.width = pct + '%';
    if (pctEl) pctEl.textContent = `${done}/${total} done`;
    if (tabBar) tabBar.style.width = pct + '%';
  });
}

function syncCheckboxes() {
  document.querySelectorAll('.ex input[type="checkbox"]').forEach(cb => {
    const checked = !!progress[cb.dataset.id];
    cb.checked = checked;
    cb.closest('.ex').classList.toggle('checked', checked);
  });
  updateCounts();
}

document.getElementById('main').addEventListener('change', e => {
  const cb = e.target;
  if (!cb.matches('.ex input[type="checkbox"]')) return;
  if (cb.checked) progress[cb.dataset.id] = true;
  else delete progress[cb.dataset.id];
  cb.closest('.ex').classList.toggle('checked', cb.checked);
  saveProgress();
  updateCounts();
});

/* Reset buttons */
document.getElementById('main').addEventListener('click', e => {
  const resetDay = e.target.closest('[data-reset-day]');
  if (resetDay) {
    const id = resetDay.dataset.resetDay;
    Object.keys(progress).forEach(k => { if (k.startsWith(id + '-')) delete progress[k]; });
    saveProgress();
    syncCheckboxes();
    return;
  }
  const head = e.target.closest('.block-head');
  if (head) {
    const block = head.closest('.block');
    const collapsed = block.classList.toggle('collapsed');
    head.setAttribute('aria-expanded', String(!collapsed));
  }
});

document.getElementById('reset-all').addEventListener('click', () => {
  if (!confirm('Clear all checked exercises for the whole week?')) return;
  progress = {};
  saveProgress();
  syncCheckboxes();
});

/* ============================ Tabs ============================ */

const tabs = document.querySelectorAll('.tab');
const views = document.querySelectorAll('.view');

function showView(id) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.view === id));
  views.forEach(v => v.classList.toggle('active', v.id === `view-${id}`));
  window.scrollTo({ top: 0 });
  if (history.replaceState) history.replaceState(null, '', `#${id}`);
}

tabs.forEach(tab => tab.addEventListener('click', () => showView(tab.dataset.view)));

/* Overview glance table → jump to day */
document.querySelectorAll('.glance tbody tr[data-goto]').forEach(tr => {
  tr.addEventListener('click', () => showView(tr.dataset.goto));
});

/* Deep link: #mon..#fri, #guide */
const initial = location.hash.replace('#', '');
if (['overview', 'mon', 'tue', 'wed', 'thu', 'fri', 'guide'].includes(initial)) showView(initial);

/* ============================ Theme ============================ */

const root = document.documentElement;

function applyTheme(theme) {
  if (theme === 'dark') root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');
}

const savedTheme = localStorage.getItem(THEME_KEY);
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

document.getElementById('theme-toggle').addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

/* ============================ Init ============================ */

syncCheckboxes();
