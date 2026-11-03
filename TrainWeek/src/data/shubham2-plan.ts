/* ============================================================
   Shubham 2.0 — upper-body frequency plan, 5 days.
   Chest, back and shoulders each get a heavy day and a volume
   day, never less than 48 hours apart. No legs. Abs every day,
   rotating through five different jobs. Back-conscious rules
   carry over: supported rows and presses, no spinal flexion
   under load. Same shape as PLAN so every app feature works.
   Generated from the PWA file shubham2-plan.js — keep them in sync.
   ============================================================ */

import { Day, Exercise } from './plan';

const S2_COOL_PRESS: Exercise[] = [
  { name: 'Doorway pec · overhead triceps · kneeling lat on a bench', dose: '30s ea' },
  { name: 'Cross-body shoulder stretch', dose: '30s ea' },
  { name: 'Thoracic extension over a foam roller', note: 'Upper back only, never the lower back.', dose: '30–45s' },
  { name: "Child's pose", note: 'Back and lats. Breathe slowly, no bouncing.', dose: '30–60s' },
];

export const SHUBHAM2_PLAN: Day[] = [
  {
    id: 'mon', short: 'MON', focus: 'Chest', targetMin: [60, 75], num: '01', name: 'Monday',
    subtitle: 'Chest (heavy) · triceps · abs (anti-extension)',
    time: '60–75 min',
    sections: [
      {
        title: 'Pre-workout', meta: 'warm-up, 8 min',
        items: [
          { name: 'Easy cardio', dose: '5 min' },
          { name: 'Cat-cow · hip circles · band pull-aparts', dose: '8 / 8ea / 2×15' },
          { name: 'Band external rotation', note: 'Shoulder prep before pressing.', dose: '2 × 12ea' },
          { name: 'Wall slides · arm swings · push-ups as a ramp-up', dose: '10 / 10 / 8–10' },
        ],
      },
      {
        title: 'Main lifts', meta: 'heavy day — chest comes back Thursday',
        items: [
          { name: 'Incline dumbbell press', note: 'Upper chest; control down, press up and slightly together.', dose: '4 × 6–10' },
          { name: 'Flat machine or dumbbell press', dose: '3 × 8–12' },
          { name: 'Incline cable fly or pec deck', note: 'The stretch that builds the chest line.', dose: '3 × 12–15' },
          { name: 'Chest dips', note: 'Lean forward; stop when reps stop being clean.', dose: '3 sets' },
          { name: 'Overhead triceps extension', note: 'Long head; elbows forward, ribs down.', dose: '3 × 10–12' },
          { name: 'Rope pushdown', dose: '3 × 12–15' },
        ],
      },
      {
        title: 'Abs', meta: 'anti-extension (front core)',
        items: [
          { name: 'Ab crunch machine', note: 'Ribs toward hips; the machine moves, the hips do not.', dose: '3 × 12–15' },
          { name: 'Dumbbell dead bug', note: "Light DB at arm's length, ribs pinned down.", dose: '3 × 10ea' },
          { name: 'Plank with dumbbell drag-through', dose: '3 × 8ea' },
          { name: 'Overhead dumbbell march', dose: '3 × 30s' },
        ],
      },
      { title: 'Conditioning', meta: 'endurance base, 12 min', items: [{ name: 'Treadmill short run', note: '1% incline, talking pace. Just keeping the engine ticking.', dose: '10–12 min' }] },
      { title: 'Post-workout', meta: 'cool-down, hold and breathe', items: S2_COOL_PRESS },
    ],
    cut: 'Cut in this order: rope pushdown → chest dips. The two presses and the fly are the session.',
  },

  {
    id: 'tue', short: 'TUE', focus: 'Back', targetMin: [60, 75], num: '02', name: 'Tuesday',
    subtitle: 'Back (heavy) · biceps · abs (anti-rotation)',
    time: '60–75 min',
    sections: [
      {
        title: 'Pre-workout', meta: 'warm-up, 8 min',
        items: [
          { name: 'Easy cardio', dose: '5 min' },
          { name: 'Cat-cow · hip circles · band pull-aparts', dose: '8 / 8ea / 2×15' },
          { name: 'Scap shrugs from a dead hang', note: 'Teaches the shoulder blade to move first.', dose: '1 × 10' },
          { name: 'Band straight-arm pulldown · face pulls', note: 'Lights up the lats before you pull heavy.', dose: '2×15 / 2×15' },
        ],
      },
      {
        title: 'Main lifts', meta: 'heavy day — back comes back Thursday',
        items: [
          { name: 'Lat pulldown, wide or neutral grip', note: 'Elbows down toward your pockets; hands are hooks.', dose: '4 × 6–10' },
          { name: 'Chest-supported row', note: 'Chest stays on the pad; pull to your lower ribs.', dose: '4 × 8–12' },
          { name: 'Straight-arm pulldown', note: 'Pure lat isolation, the V-flare movement.', dose: '3 × 12–15' },
          { name: 'One-arm dumbbell or cable row', note: 'Braced; elbow to the back pocket, no torso twist.', dose: '3 × 10–12ea' },
          { name: 'Face pull or reverse pec deck', note: 'Rear delts; what caps the shoulder from behind.', dose: '3 × 15–20' },
          { name: 'Incline dumbbell curl', note: 'Deeper stretch; upper arms still, no swinging.', dose: '3 × 10–12' },
        ],
      },
      {
        title: 'Abs', meta: 'anti-rotation',
        items: [
          { name: 'Ab crunch machine', note: 'Ribs toward hips; the machine moves, the hips do not.', dose: '3 × 12–15' },
          { name: 'Cable Pallof press', note: 'Resist the twist; ribs and hips stay square.', dose: '3 × 12ea' },
          { name: 'Half-kneeling cable chop', note: 'Light and controlled, no yanking.', dose: '3 × 12ea' },
          { name: 'Suitcase carry', note: 'One heavy DB; stay perfectly upright.', dose: '3 × 30–40m' },
        ],
      },
      { title: 'Conditioning', meta: 'speed, 10 min', items: [{ name: 'Treadmill sprints', note: 'Straddle the rails, drop on, go. Fully recovered between reps.', dose: '6 × 20s · 90s walk' }] },
      {
        title: 'Post-workout', meta: 'cool-down, hold and breathe',
        items: [
          { name: 'Lat stretch holding an upright, hips sitting back · doorway pec', dose: '30s ea' },
          { name: 'Overhead triceps · biceps stretch, palm flat on a wall behind you', dose: '30s ea' },
          { name: 'Thoracic extension over a foam roller', note: 'Upper back only, never the lower back.', dose: '30–45s' },
          { name: "Child's pose", note: 'Back and lats. Breathe slowly, no bouncing.', dose: '30–60s' },
        ],
      },
    ],
    cut: 'Cut in this order: incline curl → straight-arm pulldown. Never cut the pulldown or the chest-supported row.',
  },

  {
    id: 'wed', short: 'WED', focus: 'Shoulders', targetMin: [60, 75], num: '03', name: 'Wednesday',
    subtitle: 'Shoulders (heavy) · traps · abs (obliques)',
    time: '60–75 min',
    sections: [
      {
        title: 'Pre-workout', meta: 'warm-up, 7 min',
        items: [
          { name: 'Easy cardio', dose: '5 min' },
          { name: 'Cat-cow · hip circles · band pull-aparts', dose: '8 / 8ea / 2×15' },
          { name: 'Band external rotation · wall slides', dose: '2×15ea / 10' },
          { name: 'Empty-hand lateral raises · arm circles', note: 'Grooves the pattern before you load it.', dose: '2×15 / 10ea way' },
        ],
      },
      {
        title: 'Main lifts', meta: 'heavy day — shoulders come back Friday',
        items: [
          { name: 'Seated dumbbell or machine press', note: 'Back supported, shoulder blades on the pad.', dose: '4 × 6–10' },
          { name: 'Dumbbell lateral raise', note: 'Lift with the elbow, stop at shoulder height, no shrugging.', dose: '4 × 12–20' },
          { name: 'Cable lateral raise', note: 'Constant tension; light enough that the shoulder does the work.', dose: '3 × 15' },
          { name: 'Rear delt fly or reverse pec deck', dose: '3 × 15–20' },
          { name: 'Shrugs', dose: '3 × 12–15' },
          { name: 'Hammer curl', tags: ['optional'], dose: '3 × 10–12' },
        ],
      },
      {
        title: 'Abs', meta: 'obliques and lateral core',
        items: [
          { name: 'Ab crunch machine', note: 'Ribs toward hips; the machine moves, the hips do not.', dose: '3 × 12–15' },
          { name: 'Side plank with a dumbbell on the top hip', dose: '3 × 20–40s ea' },
          { name: 'Cable lateral hold', note: 'Stand side-on and simply resist the pull.', dose: '3 × 20–30s ea' },
          { name: "Farmer's carry, two dumbbells", dose: '3 × 40m' },
        ],
      },
      { title: 'Conditioning', meta: 'stamina, 15 min', items: [{ name: 'Treadmill endurance run', note: 'One speed, the pace you could hold for an hour.', dose: '12–15 min' }] },
      {
        title: 'Post-workout', meta: 'cool-down, hold and breathe',
        items: [
          { name: 'Cross-body rear delt · doorway pec · overhead triceps · upper trap', dose: '30s ea' },
          { name: 'Standing side bend, arm overhead', dose: '2 × 8ea' },
          { name: 'Wall angel, ribs down', note: 'Low back stays on the wall through the whole slide.', dose: '2 × 10' },
          { name: "Child's pose", note: 'Back and lats. Breathe slowly, no bouncing.', dose: '30–60s' },
        ],
      },
    ],
    cut: 'Cut in this order: hammer curl → shrugs. Both lateral raises stay — they are the width.',
  },

  {
    id: 'thu', short: 'THU', focus: 'Chest + Back', targetMin: [60, 75], num: '04', name: 'Thursday',
    subtitle: 'Chest + back (volume) · 72h and 48h recovered · abs (lower)',
    time: '60–75 min',
    sections: [
      {
        title: 'Pre-workout', meta: 'warm-up, 8 min',
        items: [
          { name: 'Easy cardio', dose: '5 min' },
          { name: 'Cat-cow · hip circles · band pull-aparts', dose: '8 / 8ea / 2×15' },
          { name: 'Band pull-aparts · scapular push-ups · shoulder dislocates', note: 'Wakes the upper back up so the right muscles do the work.', dose: '15 / 10 / 10' },
          { name: 'Wall slides · arm swings · push-ups as a ramp-up', dose: '10 / 10 / 8–10' },
        ],
      },
      {
        title: 'Main lifts', meta: 'volume day — alternate a push and a pull',
        items: [
          { name: 'Incline chest press', dose: '3 × 10–12' },
          { name: 'Assisted pull-up or close-grip pulldown', dose: '3 × 8–10' },
          { name: 'Flat machine or dumbbell press', dose: '3 × 10–12' },
          { name: 'Seated row', note: 'Squeeze the shoulder blades; no leaning back.', dose: '3 × 10–12' },
          { name: 'Incline cable fly or pec deck', dose: '2 × 15' },
          { name: 'Bicep curl', dose: '2 × 12' },
        ],
      },
      {
        title: 'Abs', meta: 'lower abs',
        items: [
          { name: 'Ab crunch machine', note: 'Ribs toward hips; the machine moves, the hips do not.', dose: '3 × 12–15' },
          { name: "Captain's-chair knee raise", note: 'Curl hips toward ribs; no leg swinging.', dose: '3 × 10–15' },
          { name: 'Reverse crunch on a bench', dose: '3 × 12–15' },
          { name: 'Lying leg raise, dumbbell between the feet', dose: '3 × 10–12' },
        ],
      },
      { title: 'Conditioning', meta: 'easy, 10 min', items: [{ name: 'Treadmill short run', note: 'Recovery pace. Slower than feels necessary.', dose: '10 min' }] },
      {
        title: 'Post-workout', meta: 'cool-down, hold and breathe',
        items: [
          { name: 'Doorway pec · overhead triceps · kneeling lat on a bench', dose: '30s ea' },
          { name: 'Lat stretch holding an upright, hips sitting back · doorway pec', dose: '30s ea' },
          { name: 'Thoracic extension over a foam roller', note: 'Upper back only, never the lower back.', dose: '30–45s' },
          { name: "Child's pose", note: 'Back and lats. Breathe slowly, no bouncing.', dose: '30–60s' },
        ],
      },
    ],
    cut: 'Cut in this order: bicep curl → the fly. Keep one press and one pull at minimum.',
  },

  {
    id: 'fri', short: 'FRI', focus: 'Shoulders + Arms', targetMin: [60, 75], num: '05', name: 'Friday',
    subtitle: 'Shoulders (volume) · arms · 48h recovered · abs (flexion)',
    time: '60–75 min',
    sections: [
      {
        title: 'Pre-workout', meta: 'warm-up, 7 min',
        items: [
          { name: 'Easy cardio', dose: '5 min' },
          { name: 'Cat-cow · hip circles · band pull-aparts', dose: '8 / 8ea / 2×15' },
          { name: 'Band external rotation · wall slides', dose: '2×15ea / 10' },
          { name: 'Band curls · band pushdowns', note: 'Blood into the elbows before loading them.', dose: '2×15 / 2×15' },
        ],
      },
      {
        title: 'Main lifts', meta: 'volume day — lighter press, chase the pump',
        items: [
          { name: 'Arnold press', note: 'Rotate through the press; full range, light enough to own every rep.', dose: '3 × 8–12' },
          { name: 'Dumbbell lateral raise', dose: '3 × 12–15' },
          { name: 'Face pull or reverse pec deck', dose: '3 × 15–20' },
          { name: 'Incline dumbbell curl', dose: '3 × 10–12' },
          { name: 'Overhead triceps extension', dose: '3 × 10–12' },
          { name: 'Hammer curl', dose: '2 × 10–12' },
          { name: 'Rope pushdown', dose: '2 × 12–15' },
        ],
      },
      {
        title: 'Abs', meta: 'flexion; the one loaded-flexion day of the week',
        items: [
          { name: 'Ab crunch machine', note: 'Ribs toward hips; the machine moves, the hips do not.', dose: '3 × 12–15' },
          { name: 'Cable crunch', note: 'Ribs toward hips; arms hold the rope, abs move the weight.', dose: '3 × 12–15' },
          { name: 'Hollow hold or plank to finish', dose: '3 × 30–45s' },
        ],
      },
      { title: 'Conditioning', meta: 'football stamina, 12 min', items: [{ name: 'Shuttle sprints, 5-10-5', note: 'Sprint 5m, turn, 10m back, turn, 5m through. Hard turns are what football costs.', dose: '2 × (6 reps · 45s walk)' }] },
      {
        title: 'Post-workout', meta: 'cool-down, hold and breathe',
        items: [
          { name: 'Cross-body rear delt · doorway pec · overhead triceps · upper trap', dose: '30s ea' },
          { name: 'Overhead triceps · biceps stretch, palm flat on a wall behind you', dose: '30s ea' },
          { name: 'Wrist flexor stretch', dose: '30s ea' },
          { name: "Child's pose", note: 'Back and lats. Breathe slowly, no bouncing.', dose: '30–60s' },
        ],
      },
    ],
    cut: 'Cut in this order: rope pushdown → hammer curl. The press, lateral raise and face pull stay.',
  },
];
