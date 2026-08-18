/* ============================================================
   Sakshi's Gym Plan — Beginner to Toned (12 weeks)
   Phase 2 · Weeks 5–12: Build — 4 days/week, Upper/Lower split.
   Same shape as PLAN so every app feature works unchanged.
   ============================================================ */

const SAKSHI_UPPER_PREP = [
  { name: 'Easy cardio — treadmill, cycle or cross-trainer', dose: '5 min' },
  { name: 'Cat-cow · arm circles · leg swings', dose: '8 / 10ea / 10ea' },
  { name: "Bodyweight squats · world's greatest stretch", dose: '10 / 5ea' },
  { name: 'Band pull-aparts · scapular push-ups · shoulder dislocates', note: 'Upper-day activation — wakes the upper back up so the right muscles do the work.', dose: '15 / 10 / 10' },
];

const SAKSHI_LOWER_PREP = [
  { name: 'Easy cardio — treadmill, cycle or cross-trainer', dose: '5 min' },
  { name: 'Cat-cow · arm circles · leg swings', dose: '8 / 10ea / 10ea' },
  { name: "Bodyweight squats · world's greatest stretch", dose: '10 / 5ea' },
  { name: 'Glute bridges · clamshells · ankle circles', note: 'Lower-day activation — sitting all day leaves the glutes "asleep"; switch them on first.', dose: '15 / 12ea / 10ea' },
];

const SAKSHI_UPPER_COOL = [
  { name: 'Easy walk to bring heart rate down', dose: '3–5 min' },
  { name: 'Chest / doorway stretch', dose: '30s' },
  { name: 'Cross-body shoulder stretch', dose: '30s ea' },
  { name: "Child's pose", note: 'Back and lats. Breathe slowly, no bouncing.', dose: '30–60s' },
];

const SAKSHI_LOWER_COOL = [
  { name: 'Easy walk to bring heart rate down', dose: '3–5 min' },
  { name: 'Standing quad stretch', dose: '30s ea' },
  { name: 'Hamstring stretch, standing or seated', dose: '30s ea' },
  { name: 'Kneeling hip flexor stretch', dose: '30s ea' },
  { name: 'Figure-4 glute stretch', dose: '30s ea' },
  { name: 'Calf stretch against a wall', dose: '30s ea' },
];

const SAKSHI_PLAN = [
  {
    id: 'mon', num: '01', name: 'Monday', short: 'MON', focus: 'Upper A',
    subtitle: 'Chest · back · shoulders · arms',
    time: '45–60 min', target: [45, 60],
    sections: [
      { title: 'Prep', meta: 'dynamic warm-up + activation, 8–10 min', items: SAKSHI_UPPER_PREP },
      {
        title: 'Main lifts', meta: 'rest 90 sec between sets',
        items: [
          { name: 'Chest press, dumbbell or machine', dose: '3 × 8–12' },
          { name: 'Lat pulldown', dose: '3 × 8–12' },
          { name: 'Seated shoulder press', dose: '3 × 10' },
          { name: 'Seated row', dose: '3 × 10' },
          { name: 'Bicep curl', dose: '2 × 12' },
          { name: 'Triceps pushdown', dose: '2 × 12' },
        ],
        note: 'Progression: when you hit the top of the rep range on all sets with clean form, add the smallest increment next session.',
      },
      {
        title: 'Anti-tilt core', meta: 'pelvis neutral, ribs stacked',
        items: [
          { name: 'Dead bug with heel slide', note: 'Low back stays pressed into the floor as the heel slides away.', dose: '2 × 8ea' },
          { name: 'Reverse crunch', note: 'Curl the pelvis rather than swinging the legs.', dose: '2 × 10' },
          { name: 'RKC plank', note: 'Ribs down, glutes squeezed hard; shorter and harder than a normal plank.', dose: '2 × 15–20s' },
        ],
      },
      { title: 'Cool-down', meta: 'hold 20–30 sec, breathe slowly, no bouncing', items: SAKSHI_UPPER_COOL },
    ],
    cut: 'Cut in this order: bicep curl → triceps pushdown. The presses and the pulls are the session.',
  },

  {
    id: 'tue', num: '02', name: 'Tuesday', short: 'TUE', focus: 'Lower A',
    subtitle: 'Legs · glutes · core',
    time: '45–60 min', target: [45, 60],
    sections: [
      { title: 'Prep', meta: 'dynamic warm-up + activation, 8–10 min', items: SAKSHI_LOWER_PREP },
      {
        title: 'Main lifts', meta: 'rest 90 sec between sets',
        items: [
          { name: 'Goblet or dumbbell squat', dose: '3 × 8–12' },
          { name: 'Dumbbell Romanian deadlift', note: 'Hips back, dumbbells close to the legs, feel the hamstrings stretch.', dose: '3 × 10' },
          { name: 'Leg press', dose: '3 × 12' },
          { name: 'Walking lunge', dose: '2 × 10ea' },
          { name: 'Calf raise', dose: '3 × 15' },
          { name: 'Cable crunch or hanging knee raise', dose: '3 × 12' },
        ],
      },
      {
        title: 'Posterior control', meta: 'pelvic tilt under load',
        items: [
          { name: '90/90 hip lift with ball squeeze', note: 'Exhale fully at the top; hamstrings working, low back quiet.', dose: '2 × 5 breaths' },
          { name: 'Glute bridge with posterior tilt', note: 'Tuck the pelvis first, then lift; 3s hold at the top.', dose: '2 × 10' },
          { name: 'Kneeling hip flexor stretch with posterior tilt', note: 'Tilt before you shift forward — the tilt is the stretch.', dose: '60s ea' },
        ],
      },
      { title: 'Cool-down', meta: 'hold 20–30 sec, breathe slowly, no bouncing', items: SAKSHI_LOWER_COOL },
    ],
    cut: 'Cut in this order: walking lunge → calf raise. Squat, RDL and leg press stay.',
  },

  {
    id: 'thu', num: '03', name: 'Thursday', short: 'THU', focus: 'Upper B',
    subtitle: 'Incline press · pull-ups · side delts · arms',
    time: '45–60 min', target: [45, 60],
    sections: [
      { title: 'Prep', meta: 'dynamic warm-up + activation, 8–10 min', items: SAKSHI_UPPER_PREP },
      {
        title: 'Main lifts', meta: 'rest 90 sec between sets',
        items: [
          { name: 'Incline chest press', dose: '3 × 10' },
          { name: 'Assisted pull-up or close-grip pulldown', dose: '3 × 10' },
          { name: 'Dumbbell lateral raise', note: 'Lift with the elbow, stop at shoulder height, no shrugging.', dose: '3 × 12' },
          { name: 'Face pull or rear-delt fly', dose: '3 × 12' },
          { name: 'Hammer curl', dose: '2 × 12' },
          { name: 'Overhead triceps extension', dose: '2 × 12' },
        ],
      },
      {
        title: 'Mobility + rib position', meta: 'open the front line, stack the ribs',
        items: [
          { name: 'Couch stretch with posterior tilt', note: 'Tuck the pelvis hard; back off if the low back arches.', dose: '60s ea' },
          { name: 'Thoracic extension over roller, upper back only', dose: '45s' },
          { name: 'Wall angel, ribs down', note: 'Low back stays on the wall through the whole slide.', dose: '2 × 8' },
        ],
      },
      { title: 'Cool-down', meta: 'hold 20–30 sec, breathe slowly, no bouncing', items: SAKSHI_UPPER_COOL },
    ],
    cut: 'Cut in this order: hammer curl → overhead triceps extension.',
  },

  {
    id: 'fri', num: '04', name: 'Friday', short: 'FRI', focus: 'Lower B',
    subtitle: 'Hip thrust · single-leg · hamstrings · core',
    time: '45–60 min', target: [45, 60],
    sections: [
      { title: 'Prep', meta: 'dynamic warm-up + activation, 8–10 min', items: SAKSHI_LOWER_PREP },
      {
        title: 'Main lifts', meta: 'rest 90 sec between sets',
        items: [
          { name: 'Hip thrust, dumbbell or barbell', note: 'Heels down, ribs down, squeeze at the top.', dose: '3 × 10' },
          { name: 'Bulgarian split squat or leg press', dose: '3 × 10' },
          { name: 'Leg curl, seated or lying', dose: '3 × 12' },
          { name: 'Leg extension', dose: '3 × 12' },
          { name: 'Standing calf raise', dose: '3 × 15' },
          { name: 'Side plank', dose: '3 × 20–30s ea' },
        ],
      },
      {
        title: 'Standing integration', meta: 'neutral pelvis under real load',
        items: [
          { name: 'Suitcase carry, pelvis neutral', note: 'One moderate DB; no lean, no hip hike.', dose: '2 × 20m ea' },
          { name: 'Standing band march, tall', dose: '2 × 10ea' },
          { name: 'Wall sit with posterior tilt', note: 'Flatten the low back into the wall and hold it there.', dose: '2 × 20–30s' },
        ],
      },
      { title: 'Cool-down', meta: 'hold 20–30 sec, breathe slowly, no bouncing', items: SAKSHI_LOWER_COOL },
    ],
    cut: 'Cut in this order: leg extension → standing calf raise. Hip thrust stays.',
  },
];
