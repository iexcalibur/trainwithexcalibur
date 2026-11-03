/* ============================================================
   Shubham 2.0 — push / pull every 48 hours, 5 days.
   Chest and shoulders train together as "push" (Mon, Wed, Fri),
   back as "pull" (Tue, Thu), alternating so every group comes
   back exactly 48 hours later. Monday and Tuesday are heavy, the
   rest is volume, Friday a touch lighter so Monday is fresh.
   No legs. Abs every day, rotating through five different jobs,
   then a short conditioning finisher. Back-conscious rules carry
   over: supported rows and presses, no spinal flexion under load.
   Same shape as PLAN so every app feature works.
   ============================================================ */

const S2_WARM_PUSH = [
  { name: 'Easy cardio', dose: '5 min' },
  { name: 'Cat-cow · hip circles · band pull-aparts', dose: '8 / 8ea / 2×15' },
  { name: 'Band external rotation', note: 'Shoulder prep before pressing.', dose: '2 × 12ea' },
  { name: 'Wall slides · arm swings · push-ups as a ramp-up', dose: '10 / 10 / 8–10' },
];
const S2_WARM_PULL = [
  { name: 'Easy cardio', dose: '5 min' },
  { name: 'Cat-cow · hip circles · band pull-aparts', dose: '8 / 8ea / 2×15' },
  { name: 'Scap shrugs from a dead hang', note: 'Teaches the shoulder blade to move first.', dose: '1 × 10' },
  { name: 'Band straight-arm pulldown · face pulls', note: 'Lights up the lats before you pull heavy.', dose: '2×15 / 2×15' },
];
const S2_COOL_PUSH = [
  { name: 'Doorway pec · overhead triceps · kneeling lat on a bench', dose: '30s ea' },
  { name: 'Cross-body shoulder stretch', dose: '30s ea' },
  { name: 'Thoracic extension over a foam roller', note: 'Upper back only, never the lower back.', dose: '30–45s' },
  { name: "Child's pose", note: 'Back and lats. Breathe slowly, no bouncing.', dose: '30–60s' },
];
const S2_COOL_PULL = [
  { name: 'Lat stretch holding an upright, hips sitting back · doorway pec', dose: '30s ea' },
  { name: 'Overhead triceps · biceps stretch, palm flat on a wall behind you', dose: '30s ea' },
  { name: 'Thoracic extension over a foam roller', note: 'Upper back only, never the lower back.', dose: '30–45s' },
  { name: "Child's pose", note: 'Back and lats. Breathe slowly, no bouncing.', dose: '30–60s' },
];
const S2_MACHINE = { name: 'Ab crunch machine', note: 'Ribs toward hips; the machine moves, the hips do not.', dose: '3 × 12–15' };

const SHUBHAM2_PLAN = [
  {
    id: 'mon', short: 'MON', focus: 'Push', target: [60, 75], num: '01', name: 'Monday',
    subtitle: 'Chest + shoulders (heavy) · triceps · abs (anti-extension)',
    time: '60–75 min',
    sections: [
      { title: 'Pre-workout', meta: 'warm-up, 8 min', items: S2_WARM_PUSH },
      {
        title: 'Main lifts', meta: 'heavy day — push comes back Wednesday',
        items: [
          { name: 'Incline dumbbell press', note: 'Upper chest; control down, press up and slightly together.', dose: '4 × 6–10' },
          { name: 'Seated dumbbell or machine press', note: 'Back supported, shoulder blades on the pad.', dose: '4 × 6–10' },
          { name: 'Incline cable fly or pec deck', note: 'The stretch that builds the chest line.', dose: '3 × 12–15' },
          { name: 'Dumbbell lateral raise', note: 'Lift with the elbow, stop at shoulder height, no shrugging.', dose: '3 × 12–20' },
          { name: 'Overhead triceps extension', note: 'Long head; elbows forward, ribs down.', dose: '3 × 10–12' },
          { name: 'Rope pushdown', dose: '2 × 12–15' },
        ],
      },
      {
        title: 'Abs', meta: 'anti-extension (front core)',
        items: [
          S2_MACHINE,
          { name: 'Dumbbell dead bug', note: "Light DB at arm's length, ribs pinned down.", dose: '3 × 10ea' },
          { name: 'Plank with dumbbell drag-through', dose: '3 × 8ea' },
          { name: 'Overhead dumbbell march', dose: '3 × 30s' },
        ],
      },
      { title: 'Conditioning', meta: 'endurance base, 12 min', items: [{ name: 'Treadmill short run', note: 'Speed 8–9 km/h · incline 1%, talking pace. Just keeping the engine ticking.', dose: '10–12 min' }] },
      { title: 'Post-workout', meta: 'cool-down, hold and breathe', items: S2_COOL_PUSH },
    ],
    cut: 'Cut in this order: rope pushdown → lateral raise. The two presses and the fly are the session.',
  },

  {
    id: 'tue', short: 'TUE', focus: 'Pull', target: [60, 75], num: '02', name: 'Tuesday',
    subtitle: 'Back (heavy) · rear delts · biceps · abs (anti-rotation)',
    time: '60–75 min',
    sections: [
      { title: 'Pre-workout', meta: 'warm-up, 8 min', items: S2_WARM_PULL },
      {
        title: 'Main lifts', meta: 'heavy day — pull comes back Thursday',
        items: [
          { name: 'Lat pulldown, wide or neutral grip', note: 'Elbows down toward your pockets; hands are hooks.', dose: '4 × 6–10' },
          { name: 'Chest-supported row', note: 'Chest stays on the pad; pull to your lower ribs.', dose: '4 × 8–12' },
          { name: 'Straight-arm pulldown', note: 'Pure lat isolation, the V-flare movement.', dose: '3 × 12–15' },
          { name: 'Face pull or reverse pec deck', note: 'Rear delts; what caps the shoulder from behind.', dose: '3 × 15–20' },
          { name: 'Incline dumbbell curl', note: 'Deeper stretch; upper arms still, no swinging.', dose: '3 × 10–12' },
          { name: 'Hammer curl', dose: '2 × 10–12' },
        ],
      },
      {
        title: 'Abs', meta: 'anti-rotation',
        items: [
          S2_MACHINE,
          { name: 'Cable Pallof press', note: 'Resist the twist; ribs and hips stay square.', dose: '3 × 12ea' },
          { name: 'Half-kneeling cable chop', note: 'Light and controlled, no yanking.', dose: '3 × 12ea' },
          { name: 'Suitcase carry', note: 'One heavy DB; stay perfectly upright.', dose: '3 × 30–40m' },
        ],
      },
      { title: 'Conditioning', meta: 'speed, 10 min', items: [{ name: 'Treadmill sprints', note: 'Speed 15–16 km/h · incline 1%. Straddle the rails, drop on, go. Walk at 4–5 km/h between reps.', dose: '6 × 20s · 90s walk' }] },
      { title: 'Post-workout', meta: 'cool-down, hold and breathe', items: S2_COOL_PULL },
    ],
    cut: 'Cut in this order: hammer curl → straight-arm pulldown. Never cut the pulldown or the chest-supported row.',
  },

  {
    id: 'wed', short: 'WED', focus: 'Push', target: [60, 75], num: '03', name: 'Wednesday',
    subtitle: 'Chest + shoulders (volume) · 48h on · abs (obliques)',
    time: '60–75 min',
    sections: [
      { title: 'Pre-workout', meta: 'warm-up, 8 min', items: S2_WARM_PUSH },
      {
        title: 'Main lifts', meta: 'volume day — different angles from Monday',
        items: [
          { name: 'Flat machine or dumbbell press', dose: '3 × 10–12' },
          { name: 'Arnold press', note: 'Rotate through the press; full range, light enough to own every rep.', dose: '3 × 8–12' },
          { name: 'Chest dips', note: 'Lean forward; stop when reps stop being clean.', dose: '3 sets' },
          { name: 'Cable lateral raise', note: 'Constant tension; light enough that the shoulder does the work.', dose: '3 × 15' },
          { name: 'Rear delt fly or reverse pec deck', dose: '3 × 15–20' },
          { name: 'Close-grip press or dips', note: 'Keep this moderate; triceps are already warm.', dose: '2 × 10–12' },
        ],
      },
      {
        title: 'Abs', meta: 'obliques and lateral core',
        items: [
          S2_MACHINE,
          { name: 'Side plank with a dumbbell on the top hip', dose: '3 × 20–40s ea' },
          { name: 'Cable lateral hold', note: 'Stand side-on and simply resist the pull.', dose: '3 × 20–30s ea' },
          { name: "Farmer's carry, two dumbbells", dose: '3 × 40m' },
        ],
      },
      { title: 'Conditioning', meta: 'stamina, 15 min', items: [{ name: 'Treadmill endurance run', note: 'Speed 10–11 km/h · incline 1%. One speed, the pace you could hold for an hour.', dose: '12–15 min' }] },
      { title: 'Post-workout', meta: 'cool-down, hold and breathe', items: S2_COOL_PUSH },
    ],
    cut: 'Cut in this order: close-grip press → rear delt fly. Keep one press, the dips and the lateral raise.',
  },

  {
    id: 'thu', short: 'THU', focus: 'Pull', target: [60, 75], num: '04', name: 'Thursday',
    subtitle: 'Back (volume) · 48h on · biceps · abs (lower)',
    time: '60–75 min',
    sections: [
      { title: 'Pre-workout', meta: 'warm-up, 8 min', items: S2_WARM_PULL },
      {
        title: 'Main lifts', meta: 'volume day — different angles from Tuesday',
        items: [
          { name: 'Assisted pull-up or close-grip pulldown', dose: '3 × 8–10' },
          { name: 'Seated row', note: 'Squeeze the shoulder blades; no leaning back.', dose: '3 × 10–12' },
          { name: 'One-arm dumbbell or cable row', note: 'Braced; elbow to the back pocket, no torso twist.', dose: '3 × 10–12ea' },
          { name: 'Shrugs', dose: '3 × 12–15' },
          { name: 'Bicep curl', dose: '3 × 12' },
          { name: 'Straight-arm pulldown', dose: '2 × 15' },
        ],
      },
      {
        title: 'Abs', meta: 'lower abs',
        items: [
          S2_MACHINE,
          { name: "Captain's-chair knee raise", note: 'Curl hips toward ribs; no leg swinging.', dose: '3 × 10–15' },
          { name: 'Reverse crunch on a bench', dose: '3 × 12–15' },
          { name: 'Lying leg raise, dumbbell between the feet', dose: '3 × 10–12' },
        ],
      },
      { title: 'Conditioning', meta: 'easy, 10 min', items: [{ name: 'Treadmill short run', note: 'Speed 7.5–8.5 km/h · incline 0–1%. Recovery pace, slower than feels necessary.', dose: '10 min' }] },
      { title: 'Post-workout', meta: 'cool-down, hold and breathe', items: S2_COOL_PULL },
    ],
    cut: 'Cut in this order: straight-arm pulldown → shrugs. Keep the pull-up and both rows.',
  },

  {
    id: 'fri', short: 'FRI', focus: 'Push', target: [60, 75], num: '05', name: 'Friday',
    subtitle: 'Chest + shoulders (moderate) · 48h on · arms · abs (flexion)',
    time: '60–75 min',
    sections: [
      { title: 'Pre-workout', meta: 'warm-up, 8 min', items: S2_WARM_PUSH },
      {
        title: 'Main lifts', meta: 'moderate day — leave something for Monday',
        items: [
          { name: 'Incline chest press', dose: '3 × 10–12' },
          { name: 'Seated dumbbell or machine press', dose: '3 × 8–12' },
          { name: 'Incline cable fly or pec deck', dose: '2 × 15' },
          { name: 'Dumbbell lateral raise', note: 'Lift with the elbow, stop at shoulder height, no shrugging.', dose: '4 × 12–20' },
          { name: 'Overhead triceps extension', dose: '3 × 10–12' },
          { name: 'Rope pushdown', dose: '2 × 12–15' },
        ],
      },
      {
        title: 'Abs', meta: 'flexion; the one loaded-flexion day of the week',
        items: [
          S2_MACHINE,
          { name: 'Cable crunch', note: 'Ribs toward hips; arms hold the rope, abs move the weight.', dose: '3 × 12–15' },
          { name: 'Hollow hold or plank to finish', dose: '3 × 30–45s' },
        ],
      },
      { title: 'Conditioning', meta: 'football stamina, 12 min', items: [{ name: 'Shuttle sprints, 5-10-5', note: 'Sprint 5m, turn, 10m back, turn, 5m through. Hard turns are what football costs.', dose: '2 × (6 reps · 45s walk)' }] },
      { title: 'Post-workout', meta: 'cool-down, hold and breathe', items: S2_COOL_PUSH },
    ],
    cut: 'Cut in this order: rope pushdown → the fly. The press, the shoulder press and the lateral raise stay.',
  },
];
