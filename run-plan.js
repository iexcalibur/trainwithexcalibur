/* ============================================================
   Shubham 3.0 — running, 7 days. Two modes of the same week:
   RUN_TREADMILL (indoor) and RUN_OUTDOOR (road, track, hills).
   Stamina (tempo), endurance (long run), speed (intervals, hills),
   with easy days kept genuinely easy so the hard days can be hard.
   Same shape as PLAN so every app feature works unchanged.
   ============================================================ */

const RUN_WARM = [
  { name: 'Brisk walk into a jog', note: 'Walk 2 min, then jog so easy it feels silly.', dose: '5 min' },
  { name: 'Leg swings · ankle circles · hip circles', dose: '10ea / 10ea / 8ea' },
];
const RUN_WARM_FAST = [
  ...RUN_WARM,
  { name: 'A-skips · high knees · butt kicks', note: 'Short and springy; this is the speed switch.', dose: '2 × 20m each' },
];
const RUN_COOL = [
  { name: 'Easy walk to bring heart rate down', dose: '3–5 min' },
  { name: 'Standing quad stretch', dose: '30s ea' },
  { name: 'Hamstring stretch, standing or seated', dose: '30s ea' },
  { name: 'Calf stretch against a wall', dose: '30s ea' },
  { name: 'Kneeling hip flexor stretch', dose: '30s ea' },
  { name: 'Figure-4 glute stretch', dose: '30s ea' },
];
const RUN_STRENGTH = {
  feet:  [{ name: 'Single-leg calf raise', dose: '3 × 12ea' }, { name: 'Single-leg Romanian deadlift, bodyweight', note: 'Balance and hinge in one.', dose: '2 × 8ea' }],
  shins: [{ name: 'Tibialis raise, back to a wall, toes up', note: 'Shin-splint insurance.', dose: '3 × 15–20' }, { name: 'Single-leg balance, eyes closed', dose: '3 × 30s ea' }],
  hips:  [{ name: 'Glute bridge', dose: '2 × 15' }, { name: 'Side-lying clam or hip abduction', note: 'Keeps the knee tracking straight when you tire.', dose: '2 × 15ea' }],
  heels: [{ name: 'Eccentric heel drop off a step, 3s lower', note: 'The Achilles builder.', dose: '3 × 10ea' }, { name: 'Single-leg balance', dose: '2 × 20s ea' }],
};

/* day: [id, short, num, name, focus, subtitle, time, target, warm, main items, strength key, cut] */
function runWeek(main) {
  const spec = [
    ['mon', 'MON', '01', 'Monday',    'Easy',      'Aerobic base · conversational pace',          '45–55 min', [45, 55], RUN_WARM,      'feet',  'Cut the strength block, never the run.'],
    ['tue', 'TUE', '02', 'Tuesday',   'Speed',     'Intervals · fast reps, full recoveries',      '45–55 min', [45, 55], RUN_WARM_FAST, 'hips',  'Cut reps, not the warm-up — speed on cold legs is how hamstrings go.'],
    ['wed', 'WED', '03', 'Wednesday', 'Recovery',  'Very easy jog or brisk walk · mobility',      '30–40 min', [30, 40], RUN_WARM,      'shins', 'Short on time — walk 15 min and do the shin work. That is the whole point of today.'],
    ['thu', 'THU', '04', 'Thursday',  'Stamina',   'Tempo · comfortably hard, steady',            '50–60 min', [50, 60], RUN_WARM,      'feet',  'Shorten the tempo block to 12 min before you cut the easy minutes around it.'],
    ['fri', 'FRI', '05', 'Friday',    'Easy',      'Easy run · strides to keep the legs quick',   '40–50 min', [40, 50], RUN_WARM,      'hips',  'Cut the strides first, then shorten the run.'],
    ['sat', 'SAT', '06', 'Saturday',  'Hills',     'Hill repeats · strength and speed together',  '45–55 min', [45, 55], RUN_WARM_FAST, 'heels', 'Cut reps, keep the jog-down recoveries honest.'],
    ['sun', 'SUN', '07', 'Sunday',    'Endurance', 'Long run · the week’s most important session', '70–85 min', [70, 85], RUN_WARM,      'shins', 'Short on time — run 45 min easy. Never replace the long run with a hard run.'],
  ];
  return spec.map(([id, short, num, name, focus, subtitle, time, target, warm, skey, cut]) => ({
    id, short, num, name, focus, subtitle, time, target,
    sections: [
      { title: 'Warm-up', meta: 'easy minutes, then open the hips', items: warm },
      { title: 'Main run', meta: focus === 'Easy' || focus === 'Recovery' ? 'easy means easy' : 'the session', items: main[id] },
      { title: 'Strength + drills', meta: 'runner’s insurance, 6 min', items: RUN_STRENGTH[skey] },
      { title: 'Cool-down', meta: 'walk, then hold and breathe', items: RUN_COOL },
    ],
    cut,
  }));
}

const RUN_OUTDOOR = runWeek({
  mon: [{ name: 'Easy run', note: 'You should be able to talk in full sentences the whole way.', dose: '30–40 min' }],
  tue: [{ name: 'Track or road intervals', note: 'Hard but repeatable — the last rep should look like the first.', dose: '6–8 × 400m · 90s jog' }],
  wed: [{ name: 'Recovery jog', note: 'Slower than feels necessary. A brisk walk counts.', dose: '20–25 min' }],
  thu: [{ name: 'Tempo run', note: '10 min easy · 20 min comfortably hard · 10 min easy. Steady, not racing.', dose: '40 min' },],
  fri: [{ name: 'Easy run', dose: '30 min' }, { name: 'Strides', note: 'Build to fast over 20s, float, walk back. Relaxed face, tall hips.', dose: '6 × 20s' }],
  sat: [{ name: 'Hill repeats', note: 'Hard up, jog or walk down. Drive the knees, stay tall.', dose: '8 × 45s' }],
  sun: [{ name: 'Long run', note: 'Easy pace throughout. Add 5 minutes a week; every 4th week drop back.', dose: '60–75 min' }],
});

const RUN_TREADMILL = runWeek({
  mon: [{ name: 'Treadmill easy run', note: '1% incline to match the road. Talk-test pace the whole way.', dose: '30–40 min' }],
  tue: [{ name: 'Treadmill intervals', note: 'Fast = a speed you can hold for all the reps. Step the rails during the easy minutes if you need to.', dose: '6–8 × 1 min fast · 90s easy' }],
  wed: [{ name: 'Treadmill recovery jog', note: '0–1% incline, slower than feels necessary. A brisk walk counts.', dose: '20–25 min' }],
  thu: [{ name: 'Treadmill tempo run', note: '10 min easy · 20 min comfortably hard · 10 min easy. Pick one speed for the middle and hold it.', dose: '40 min' }],
  fri: [{ name: 'Treadmill easy run', dose: '30 min' }, { name: 'Treadmill strides', note: 'Ramp the belt up over 20s, hold, then back to a walk. Stay relaxed.', dose: '6 × 20s' }],
  sat: [{ name: 'Treadmill hill repeats', note: '6–8% incline, hard effort; drop to flat and walk or jog between reps.', dose: '8 × 60s · 90s easy' }],
  sun: [{ name: 'Treadmill long run', note: '1% incline, easy pace throughout. Add 5 minutes a week; every 4th week drop back.', dose: '60–75 min' }],
});
