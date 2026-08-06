export type TagKey = 'hipext' | 'joints' | 'fascia' | 'optional' | 'physio';

export interface Exercise {
  name: string;
  dose: string;
  note?: string;
  tags?: TagKey[];
}

export interface Section {
  title: string;
  meta?: string;
  tag?: TagKey;
  items: Exercise[];
  note?: string;
  callout?: { title: string; body: string };
}

export interface Day {
  id: string;
  num: string;
  name: string;
  short: string;
  focus: string;
  subtitle: string;
  time: string;
  targetMin: [number, number];
  sections: Section[];
  cut: string;
}

export const PLAN: Day[] = [
  {
    id: 'mon', num: '01', name: 'Monday', short: 'MON', focus: 'Legs',
    subtitle: 'Legs · heavy hip extension · abs (anti-extension)',
    time: '80–95 min', targetMin: [80, 95],
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
    cut: 'Cut in this order: frog pump → Bulgarian split squat → cable kickback. Leg press, hip thrust and leg curl are the ones that matter.',
  },

  {
    id: 'tue', num: '02', name: 'Tuesday', short: 'TUE', focus: 'Chest',
    subtitle: 'Chest · triceps · ankle day · abs (anti-rotation)',
    time: '80–90 min', targetMin: [80, 90],
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
    cut: 'Cut in this order: banded glute bridge → chest dips → the chop. Keep the full ankle block — it is the gap this day exists to close.',
  },

  {
    id: 'wed', num: '03', name: 'Wednesday', short: 'WED', focus: 'Back',
    subtitle: 'Back (V-taper) · knee day · abs (obliques) · elastic fascia',
    time: '85–95 min', targetMin: [85, 95],
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
    cut: "Cut in this order: farmer's carry → reverse Nordic → med-ball pass. Never cut the pulldown, chest-supported row or straight-arm pulldown — they are the V-taper.",
  },

  {
    id: 'thu', num: '04', name: 'Thursday', short: 'THU', focus: 'Shoulders',
    subtitle: 'Shoulders · hip day · abs (lower)',
    time: '80–90 min', targetMin: [80, 90],
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
    cut: 'Cut in this order: shrugs → single-leg glute bridge → reverse lunge. Both lateral raises stay — they are the highest-value movement for shoulder width.',
  },

  {
    id: 'fri', num: '05', name: 'Friday', short: 'FRI', focus: 'Arms',
    subtitle: 'Arms · hinge · integration · abs (flexion) · elastic fascia',
    time: '80–90 min', targetMin: [80, 90],
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
    cut: 'Cut in this order: hammer curl → ab crunch machine → cable pull-through.',
  },
];

export function dayTotal(day: Day): number {
  return day.sections.reduce((n, s) => n + s.items.length, 0);
}

export function exId(dayId: string, si: number, ii: number): string {
  return `${dayId}-${si}-${ii}`;
}
