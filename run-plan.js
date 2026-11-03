/* ============================================================
   Shubham 3.0 — running, 7 days. Two modes of the same week:
   RUN_TREADMILL (indoor) and RUN_OUTDOOR (road, track, hills).
   Pure running — short runs, sprints, an endurance run, repeat-sprint
   sets and the long run. Easy days are kept genuinely easy so the
   sprint days can be all-out.
   Same shape as PLAN so every app feature works unchanged.
   ============================================================ */

const RUN_WARM = [
  { name: 'Brisk walk into a jog', note: 'Walk 2 min, then jog so easy it feels silly.', dose: '5 min' },
  { name: 'Leg swings · ankle circles · hip circles', dose: '10ea / 10ea / 8ea' },
];
const RUN_WARM_SPRINT = [
  ...RUN_WARM,
  { name: 'Build-up runs', note: 'Accelerate smoothly to about 80% over 60m, then coast. Never sprint cold.', dose: '3 × 60m' },
];
const RUN_COOL = [
  { name: 'Easy walk to bring heart rate down', dose: '3–5 min' },
  { name: 'Standing quad stretch', dose: '30s ea' },
  { name: 'Hamstring stretch, standing or seated', dose: '30s ea' },
  { name: 'Calf stretch against a wall', dose: '30s ea' },
];

/* day: [id, short, num, name, focus, subtitle, time, target, warm-up, cut] */
function runWeek(main) {
  const spec = [
    ['mon', 'MON', '01', 'Monday',    'Short run',        'Easy · conversational pace',                   '30–40 min', [30, 40], RUN_WARM,        'Shorten the run; never skip the warm-up.'],
    ['tue', 'TUE', '02', 'Tuesday',   'Sprints',          'Max-effort reps · full recovery between',       '35–45 min', [35, 45], RUN_WARM_SPRINT, 'Cut reps, not recoveries — a tired sprint teaches nothing and pulls hamstrings.'],
    ['wed', 'WED', '03', 'Wednesday', 'Endurance run',    'Steady · the pace you could hold for an hour',  '50–60 min', [50, 60], RUN_WARM,        'Cut the last 10 minutes; keep the pace steady.'],
    ['thu', 'THU', '04', 'Thursday',  'Short run',        'Easy · legs recover from Tuesday',              '30–35 min', [30, 35], RUN_WARM,        'Short on time — 15 min easy still counts.'],
    ['fri', 'FRI', '05', 'Friday',    'Multiple sprints', 'Repeat-sprint sets · short rests',              '40–50 min', [40, 50], RUN_WARM_SPRINT, 'Drop a whole set before you shorten the rests.'],
    ['sat', 'SAT', '06', 'Saturday',  'Short run',        'Easy · keep it light before the long run',      '30–35 min', [30, 35], RUN_WARM,        'Shorten the run; never skip the warm-up.'],
    ['sun', 'SUN', '07', 'Sunday',    'Long run',         'The week\u2019s most important session',       '70–85 min', [70, 85], RUN_WARM,        'Short on time — run 45 min easy. Never replace the long run with a hard run.'],
  ];
  return spec.map(([id, short, num, name, focus, subtitle, time, target, warm, cut]) => ({
    id, short, num, name, focus, subtitle, time, target,
    sections: [
      { title: 'Warm-up', meta: 'jog in, open the hips', items: warm },
      { title: 'Main run', meta: focus.includes('print') ? 'the session' : 'easy means easy', items: main[id] },
      { title: 'Cool-down', meta: 'walk, then hold and breathe', items: RUN_COOL },
    ],
    cut,
  }));
}

const RUN_OUTDOOR = runWeek({
  mon: [{ name: 'Short run', note: 'You should be able to talk in full sentences the whole way.', dose: '20–30 min' }],
  tue: [{ name: 'Sprints', note: 'All-out from a rolling start; walk back and stand until you are fully recovered. Quality over quantity.', dose: '8 × 100m · 2–3 min walk' }],
  wed: [{ name: 'Endurance run', note: 'Steady and even — the pace you could hold for an hour. No surges.', dose: '40–50 min' }],
  thu: [{ name: 'Short run', note: 'Slower than feels necessary. This is recovery, not training.', dose: '20–25 min' }],
  fri: [{ name: 'Multiple sprints', note: '3 sets of 6 × 30s hard with 45s walk between reps, 3 min between sets. Repeatability is the goal — the last rep should look like the first.', dose: '3 × (6 × 30s)' }],
  sat: [{ name: 'Short run', dose: '25–30 min' }],
  sun: [{ name: 'Long run', note: 'Easy pace throughout. Add 5 minutes a week; every 4th week drop back.', dose: '60–75 min' }],
});

const RUN_TREADMILL = runWeek({
  mon: [{ name: 'Treadmill short run', note: '1% incline to match the road. Talk-test pace the whole way.', dose: '20–30 min' }],
  tue: [{ name: 'Treadmill sprints', note: 'Belt to a hard speed, straddle the rails, drop on and go. Step off and stand until fully recovered.', dose: '8 × 20s · 2–3 min walk' }],
  wed: [{ name: 'Treadmill endurance run', note: '1% incline, one speed for the whole run — the pace you could hold for an hour.', dose: '40–50 min' }],
  thu: [{ name: 'Treadmill short run', note: '0–1% incline, slower than feels necessary. This is recovery, not training.', dose: '20–25 min' }],
  fri: [{ name: 'Treadmill multiple sprints', note: '3 sets of 6 × 30s hard with 45s walk between reps, 3 min between sets. Same speed every rep.', dose: '3 × (6 × 30s)' }],
  sat: [{ name: 'Treadmill short run', dose: '25–30 min' }],
  sun: [{ name: 'Treadmill long run', note: '1% incline, easy pace throughout. Add 5 minutes a week; every 4th week drop back.', dose: '60–75 min' }],
});
