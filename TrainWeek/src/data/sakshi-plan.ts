import { Day, Exercise } from './plan';

/* ============================================================
   Sakshi's Gym Plan — Beginner to Toned (12 weeks)
   Phase 2 · Weeks 5–12: Build — 4 days/week, Upper/Lower split.
   Same shape as PLAN so every app feature works unchanged.
   ============================================================ */

const UPPER_PREP: Exercise[] = [
  { name: 'Easy cardio — treadmill, cycle or cross-trainer', dose: '5 min' },
  { name: 'Cat-cow · arm circles · leg swings', dose: '8 / 10ea / 10ea' },
  { name: "Bodyweight squats · world's greatest stretch", dose: '10 / 5ea' },
  { name: 'Band pull-aparts · scapular push-ups · shoulder dislocates', note: 'Upper-day activation — wakes the upper back up so the right muscles do the work.', dose: '15 / 10 / 10' },
];

const LOWER_PREP: Exercise[] = [
  { name: 'Easy cardio — treadmill, cycle or cross-trainer', dose: '5 min' },
  { name: 'Cat-cow · arm circles · leg swings', dose: '8 / 10ea / 10ea' },
  { name: "Bodyweight squats · world's greatest stretch", dose: '10 / 5ea' },
  { name: 'Glute bridges · clamshells · ankle circles', note: 'Lower-day activation — sitting all day leaves the glutes "asleep"; switch them on first.', dose: '15 / 12ea / 10ea' },
];

const UPPER_COOL: Exercise[] = [
  { name: 'Easy walk to bring heart rate down', dose: '3–5 min' },
  { name: 'Chest / doorway stretch', dose: '30s' },
  { name: 'Cross-body shoulder stretch', dose: '30s ea' },
  { name: "Child's pose", note: 'Back and lats. Breathe slowly, no bouncing.', dose: '30–60s' },
];

const LOWER_COOL: Exercise[] = [
  { name: 'Easy walk to bring heart rate down', dose: '3–5 min' },
  { name: 'Standing quad stretch', dose: '30s ea' },
  { name: 'Hamstring stretch, standing or seated', dose: '30s ea' },
  { name: 'Kneeling hip flexor stretch', dose: '30s ea' },
  { name: 'Figure-4 glute stretch', dose: '30s ea' },
  { name: 'Calf stretch against a wall', dose: '30s ea' },
];

export const SAKSHI_PLAN: Day[] = [
  {
    id: 'mon', num: '01', name: 'Monday', short: 'MON', focus: 'Upper A',
    subtitle: 'Chest · back · shoulders · arms',
    time: '45–60 min', targetMin: [45, 60],
    sections: [
      { title: 'Prep', meta: 'dynamic warm-up + activation, 8–10 min', items: UPPER_PREP },
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
      { title: 'Cool-down', meta: 'hold 20–30 sec, breathe slowly, no bouncing', items: UPPER_COOL },
    ],
    cut: 'Cut in this order: bicep curl → triceps pushdown. The presses and the pulls are the session.',
  },

  {
    id: 'tue', num: '02', name: 'Tuesday', short: 'TUE', focus: 'Lower A',
    subtitle: 'Legs · glutes · core',
    time: '45–60 min', targetMin: [45, 60],
    sections: [
      { title: 'Prep', meta: 'dynamic warm-up + activation, 8–10 min', items: LOWER_PREP },
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
      { title: 'Cool-down', meta: 'hold 20–30 sec, breathe slowly, no bouncing', items: LOWER_COOL },
    ],
    cut: 'Cut in this order: walking lunge → calf raise. Squat, RDL and leg press stay.',
  },

  {
    id: 'thu', num: '03', name: 'Thursday', short: 'THU', focus: 'Upper B',
    subtitle: 'Incline press · pull-ups · side delts · arms',
    time: '45–60 min', targetMin: [45, 60],
    sections: [
      { title: 'Prep', meta: 'dynamic warm-up + activation, 8–10 min', items: UPPER_PREP },
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
      { title: 'Cool-down', meta: 'hold 20–30 sec, breathe slowly, no bouncing', items: UPPER_COOL },
    ],
    cut: 'Cut in this order: hammer curl → overhead triceps extension.',
  },

  {
    id: 'fri', num: '04', name: 'Friday', short: 'FRI', focus: 'Lower B',
    subtitle: 'Hip thrust · single-leg · hamstrings · core',
    time: '45–60 min', targetMin: [45, 60],
    sections: [
      { title: 'Prep', meta: 'dynamic warm-up + activation, 8–10 min', items: LOWER_PREP },
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
      { title: 'Cool-down', meta: 'hold 20–30 sec, breathe slowly, no bouncing', items: LOWER_COOL },
    ],
    cut: 'Cut in this order: leg extension → standing calf raise. Hip thrust stays.',
  },
];
