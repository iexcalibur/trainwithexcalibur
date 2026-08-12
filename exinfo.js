/* ============================================================
   Exercise detail data: target muscles + alternates.
   Keyed by the exact exercise name used in plan.js.
   m: muscle keys (drive the body-map highlight + chips)
   alt: alternates that hit the same muscles
   ============================================================ */

const MUSCLES = {
  chest: 'Chest', 'upper-chest': 'Upper chest',
  'side-delts': 'Side delts', 'front-delts': 'Front delts', 'rear-delts': 'Rear delts',
  traps: 'Traps', 'upper-back': 'Upper back', lats: 'Lats', 'lower-back': 'Lower back',
  biceps: 'Biceps', triceps: 'Triceps', forearms: 'Forearms', 'rotator-cuff': 'Rotator cuff',
  abs: 'Abs', 'lower-abs': 'Lower abs', obliques: 'Obliques', core: 'Core',
  glutes: 'Glutes', 'glute-med': 'Upper glute', adductors: 'Adductors', 'hip-flexors': 'Hip flexors',
  quads: 'Quads', hamstrings: 'Hamstrings', calves: 'Calves', tibialis: 'Tibialis', achilles: 'Achilles',
  ankle: 'Ankle', knee: 'Knee tendons', hips: 'Hips', balance: 'Balance', 'plantar-fascia': 'Foot / plantar fascia',
  't-spine': 'Thoracic spine', cardio: 'Cardio / warm-up', mobility: 'Mobility', elastic: 'Elastic / tendon',
  grip: 'Grip', wrists: 'Wrists',
};

/* Body-map region mapping lives in bodymodel.js (REGION_ALIAS). */

const EXINFO = {
  /* ---------------- shared prep / warm-up ---------------- */
  'Easy cardio — bike or incline walk': { m: ['cardio'], alt: ['Rower, easy pace', 'Elliptical', 'Stair walk'] },
  'Easy cardio': { m: ['cardio'], alt: ['Bike or incline walk', 'Rower, easy pace', 'Elliptical'] },
  'Cat-cow · hip circles · band pull-aparts': { m: ['mobility', 't-spine', 'hips', 'rear-delts'], alt: ["World's greatest stretch", 'Arm swings + leg swings', 'Band dislocates'] },

  /* ---------------- Monday ---------------- */
  'Knee-to-wall ankle rock': { m: ['ankle', 'calves'], alt: ['Half-kneeling ankle rock over toes', 'Deep squat hold with ankle shifts', 'Banded ankle mobilization'] },
  '90/90 hip rotation switches': { m: ['hips', 'glutes', 'mobility'], alt: ['Seated hip internal/external rotations', 'Pigeon-to-pigeon switches', 'Supine figure-4 rocks'] },
  'Single-leg balance': { m: ['balance', 'ankle'], alt: ['Balance on a folded towel', 'Tandem (heel-to-toe) stance', 'Single-leg with head turns'] },
  'Glute bridge': { m: ['glutes', 'hamstrings'], alt: ['Banded glute bridge', 'Bodyweight hip thrust off a bench', 'Frog pump'] },
  'Leg swings · bodyweight squats': { m: ['mobility', 'quads', 'hips'], alt: ['Walking lunges, bodyweight', 'Tempo air squats', 'Lateral leg swings'] },
  'Leg press': { m: ['quads', 'glutes'], alt: ['Hack squat machine', 'Goblet squat', 'Belt squat'] },
  'Hip thrust, dumbbell or barbell': { m: ['glutes', 'hamstrings'], alt: ['Floor glute bridge, dumbbell on hips', '45° back extension, glute-biased', 'Single-leg glute bridge', 'Smith machine hip thrust', 'Glute drive machine'] },
  'Leg extension': { m: ['quads'], alt: ['Spanish squat', 'Sissy squat, assisted', 'Front-foot-elevated split squat'] },
  'Seated leg curl': { m: ['hamstrings'], alt: ['Lying leg curl', 'Nordic curl negatives', 'Slider leg curl'] },
  'Dumbbell Bulgarian split squat': { m: ['quads', 'glutes'], alt: ['Dumbbell reverse lunge', 'Step-up, knee-height box', 'Static split squat'] },
  'Cable kickback': { m: ['glutes'], alt: ['Banded standing kickback', 'Quadruped donkey kick', 'Single-leg glute bridge', '45° back extension, glute-biased'] },
  'Single-leg calf raise': { m: ['calves', 'ankle'], alt: ['Seated calf raise', 'Standing calf raise machine', 'Donkey calf raise'] },
  'Frog pump finisher': { m: ['glutes'], alt: ['Banded glute bridge burnout', 'Seated banded abduction burnout', 'Glute bridge iso hold'] },
  'Dumbbell dead bug': { m: ['abs', 'core'], alt: ['Bodyweight dead bug', 'Stability-ball dead bug', 'Bird dog'] },
  'Plank with dumbbell drag-through': { m: ['core', 'obliques'], alt: ['Plank shoulder taps', 'Light renegade row', 'Body saw'] },
  'Overhead dumbbell march': { m: ['core', 'side-delts'], alt: ['Waiter carry', 'Overhead plate hold + march', 'Dead-bug with overhead reach'] },
  'Standing quad stretch': { m: ['quads', 'hip-flexors'], alt: ['Couch stretch', 'Prone quad pull with strap', 'Side-lying quad stretch'] },
  'Calf stretch against wall · soleus with knee bent': { m: ['calves', 'achilles'], alt: ['Downward-dog calf pedals', 'Heel drop hold off a step', 'Half-kneeling soleus rock'] },
  'Kneeling hip flexor stretch': { m: ['hip-flexors', 'quads'], alt: ['Couch stretch', 'Half-kneeling stretch with overhead reach', 'Standing hip flexor lean'] },
  'Wide-stance adductor stretch': { m: ['adductors'], alt: ['Frog stretch', 'Cossack squat hold', 'Butterfly stretch'] },
  'Single knee-to-chest': { m: ['lower-back', 'glutes'], alt: ["Child's pose", 'Pelvic tilts', 'Double knee-to-chest, gentle'] },

  /* ---------------- Tuesday ---------------- */
  'Band external rotation': { m: ['rotator-cuff', 'rear-delts'], alt: ['Cable external rotation', 'Side-lying dumbbell external rotation', 'Face pull, light'] },
  'Wall slides · arm swings · push-ups as a ramp-up': { m: ['mobility', 'chest', 'side-delts'], alt: ['Scap push-ups', 'Band dislocates', 'Incline push-up ramp'] },
  'Incline dumbbell press': { m: ['upper-chest', 'front-delts', 'triceps'], alt: ['Incline barbell press', 'Incline machine press', 'Low-to-high cable fly'] },
  'Flat machine or dumbbell press': { m: ['chest', 'triceps'], alt: ['Barbell bench press', 'Weighted push-up', 'Floor press'] },
  'Incline cable fly or pec deck': { m: ['chest', 'upper-chest'], alt: ['Flat dumbbell fly', 'Deficit push-up, slow stretch', 'Cable crossover'] },
  'Chest dips': { m: ['chest', 'triceps'], alt: ['Assisted dip machine', 'Decline press', 'Close-grip push-up'] },
  'Overhead triceps extension': { m: ['triceps'], alt: ['Overhead cable extension', 'Skullcrusher', 'Single-arm overhead dumbbell extension'] },
  'Rope pushdown': { m: ['triceps'], alt: ['Straight-bar pushdown', 'Overhead dumbbell extension', 'Bench dips', 'Close-grip push-up'] },
  'Knee-to-wall dorsiflexion': { m: ['ankle', 'calves'], alt: ['Banded ankle distraction rock', 'Deep squat ankle shifts', 'Half-kneeling ankle rock'] },
  'Eccentric heel drop off a step, 3s lower': { m: ['calves', 'achilles'], alt: ['Slow-tempo calf raises, 3s down', 'Seated soleus raise', 'Isometric calf hold mid-range'] },
  'Tibialis raise, back to a wall, toes up': { m: ['tibialis'], alt: ['Heel walks', 'Banded dorsiflexion pulls', 'Seated toe raises with plate'] },
  'Banded eversion and inversion': { m: ['ankle'], alt: ['Ankle alphabet against band', 'Manual eversion holds', 'Lateral hops, small and controlled'] },
  'Single-leg balance, eyes closed': { m: ['balance', 'ankle'], alt: ['Cushion balance, eyes open', 'Single-leg with ball toss', 'Tandem stance, eyes closed'] },
  'Seated hip abduction machine': { m: ['glute-med'], alt: ['Banded lateral walks', 'Cable hip abduction', 'Side-lying leg raises'] },
  'Banded glute bridge with abduction at the top': { m: ['glutes', 'glute-med'], alt: ['Clamshell bridge', 'Monster walks', 'Banded squat with abduction'] },
  'Cable Pallof press': { m: ['obliques', 'core'], alt: ['Band Pallof press', 'Half-kneeling Pallof', 'Tall-kneeling anti-rotation hold'] },
  'Half-kneeling cable chop': { m: ['obliques', 'core'], alt: ['Band chop, high to low', 'Cable lift, low to high', 'Half-kneeling band rotation'] },
  'Suitcase carry': { m: ['obliques', 'core', 'grip'], alt: ['Offset kettlebell carry', 'Suitcase hold, static', 'Side plank'] },
  'Doorway pec · overhead triceps · kneeling lat on a bench': { m: ['chest', 'triceps', 'lats'], alt: ['Floor pec stretch', 'Wall lat stretch, hips back', 'Towel triceps stretch'] },
  'Lacrosse ball under the foot': { m: ['plantar-fascia'], alt: ['Golf ball roll', 'Frozen bottle roll', 'Toe-spread foot doming'] },
  'Slow foam roll: lats, quads, calves': { m: ['lats', 'quads', 'calves'], alt: ['Massage-gun pass, light', 'Lacrosse-ball targeted spots', 'Slow stick roller'] },

  /* ---------------- Wednesday ---------------- */
  'Scap shrugs from a dead hang': { m: ['traps', 'upper-back', 'grip'], alt: ['Scap push-up', 'Band scap pulldown', 'Active hang holds'] },
  'Band straight-arm pulldown · face pulls': { m: ['lats', 'rear-delts'], alt: ['Cable straight-arm pulldown, light', 'Band pull-aparts', 'Prone Y-raise'] },
  'Lat pulldown, wide or neutral grip': { m: ['lats', 'biceps'], alt: ['Pull-up or assisted pull-up', 'Single-arm cable pulldown', 'Machine pulldown, neutral grip'] },
  'Chest-supported row': { m: ['upper-back', 'lats', 'rear-delts'], alt: ['Seal row', 'T-bar row with chest pad', 'Machine row'] },
  'Straight-arm pulldown': { m: ['lats'], alt: ['Rope pullover', 'Dumbbell pullover', 'Kneeling cable pullover'] },
  'One-arm dumbbell or cable row': { m: ['lats', 'upper-back', 'biceps'], alt: ['Meadows row', 'Seated single-arm cable row', 'Kroc row, strict'] },
  'Face pull or reverse pec deck': { m: ['rear-delts', 'traps', 'rotator-cuff'], alt: ['Band pull-apart', 'Bent-over rear delt fly', 'Cable rear delt fly, single arm'] },
  'Spanish squat isometric, heavy band behind the knees': { m: ['knee', 'quads'], alt: ['Wall sit', 'Leg extension iso hold', 'Reverse sled drag, slow'] },
  'Slow step-down from a low box, 3s lower': { m: ['knee', 'quads', 'balance'], alt: ['Poliquin step-down', 'Eccentric leg press, single leg', 'Box step-down to tap'] },
  'Banded terminal knee extension': { m: ['knee', 'quads'], alt: ['Light leg extension, top range', 'Straight-leg raise with hold', 'Quad set isometric'] },
  'Lateral step-down': { m: ['knee', 'quads', 'glute-med'], alt: ['Shallow cossack squat', 'Lateral box step-up', 'Skater squat to box'] },
  'Reverse Nordic curl, shallow range': { m: ['quads', 'knee', 'hip-flexors'], alt: ['Assisted sissy squat', 'Kneeling lean-back with band', 'Wall sit, long hold'] },
  'Side plank with a dumbbell on the top hip': { m: ['obliques', 'core', 'glute-med'], alt: ['Bodyweight side plank, longer hold', 'Copenhagen side plank', 'Side plank with reach-through'] },
  'Cable lateral hold': { m: ['obliques', 'core'], alt: ['Suitcase hold', 'Banded lateral hold', 'Single-arm farmer hold'] },
  "Farmer's carry, two dumbbells": { m: ['grip', 'traps', 'core'], alt: ['Trap-bar carry', 'Heavy suitcase carry, switch hands', 'Front-rack carry'] },
  'Rope skipping': { m: ['elastic', 'calves', 'ankle'], alt: ['Double-leg mini hops in place', 'Low pogo hops', 'Light jog on the spot, springy'] },
  'Ankle pogo hops, minimal knee bend': { m: ['elastic', 'calves', 'achilles'], alt: ['Rope skipping', 'Line hops, front-back', 'Seated calf raise, fast concentric'] },
  'Med-ball chest pass into a wall': { m: ['elastic', 'chest', 'triceps'], alt: ['Plyo push-up on knees', 'Band speed press', 'Overhead med-ball throw, light'] },
  'Lat stretch holding an upright, hips sitting back · doorway pec': { m: ['lats', 'chest'], alt: ['Kneeling lat stretch on bench', 'Wall pec stretch', "Child's pose with side reach"] },
  'Thoracic extension over a foam roller': { m: ['t-spine', 'upper-back'], alt: ['Cat-cow, slow', 'Wall thoracic rotation', 'Bench t-spine mobilization'] },

  /* ---------------- Thursday ---------------- */
  'Band external rotation · wall slides': { m: ['rotator-cuff', 'side-delts'], alt: ['Cable external rotation', 'Prone Y-T-W raises', 'Band dislocates'] },
  'Empty-hand lateral raises · arm circles': { m: ['side-delts', 'mobility'], alt: ['Light band lateral raises', 'Scap circles', 'Wall slides'] },
  'Seated dumbbell or machine press': { m: ['side-delts', 'front-delts', 'triceps'], alt: ['Machine shoulder press', 'Landmine press', 'Standing dumbbell press, light'] },
  'Dumbbell lateral raise': { m: ['side-delts'], alt: ['Cable lateral raise', 'Machine lateral raise', 'Lean-in lateral raise'] },
  'Cable lateral raise': { m: ['side-delts'], alt: ['Dumbbell lateral raise', 'Machine lateral raise', 'Band lateral raise'] },
  'Rear delt fly or reverse pec deck': { m: ['rear-delts', 'upper-back'], alt: ['Face pull', 'Band reverse fly', 'Prone rear delt raise on incline'] },
  'Shrugs': { m: ['traps'], alt: ['Dumbbell shrug', 'Trap-bar shrug', 'Cable shrug'] },
  'Copenhagen plank, knee on a bench': { m: ['adductors', 'core'], alt: ['Short-lever Copenhagen (knee bent)', 'Side-lying adduction raises', 'Ball squeeze isometric'] },
  'Banded hip flexor march': { m: ['hip-flexors', 'core'], alt: ['Standing knee raise hold', 'Lying psoas march', 'Wall-supported march, slow'] },
  'Side-lying clam or hip abduction': { m: ['glute-med'], alt: ['Banded clamshell', 'Fire hydrant', 'Standing cable hip abduction'] },
  'Dumbbell step-up, knee-height box': { m: ['glutes', 'quads'], alt: ['Reverse lunge', 'Low box step-up', 'Single-leg leg press'] },
  'Dumbbell reverse lunge': { m: ['glutes', 'quads'], alt: ['Walking lunge', 'Split squat', 'Step-up'] },
  'Single-leg glute bridge': { m: ['glutes', 'hamstrings'], alt: ['Single-leg hip thrust', 'B-stance hip thrust', 'Frog pump'] },
  "Captain's-chair knee raise": { m: ['lower-abs', 'hip-flexors'], alt: ['Hanging knee raise', 'Reverse crunch', 'Dead bug, slow'] },
  'Reverse crunch on a bench': { m: ['lower-abs'], alt: ['Lying bent-knee leg raise', 'Dead bug', 'Stability-ball pike, easy range'] },
  'Lying leg raise, dumbbell between the feet': { m: ['lower-abs', 'hip-flexors'], alt: ['Hanging leg raise', 'Weighted reverse crunch', 'Flutter kicks, controlled'] },
  'Cross-body rear delt · doorway pec · overhead triceps · upper trap': { m: ['rear-delts', 'chest', 'triceps', 'traps'], alt: ['Thread-the-needle stretch', 'Wall pec stretch', 'Neck side-bend holds'] },
  'Lunge with overhead reach': { m: ['hip-flexors', 'lats', 'mobility'], alt: ["World's greatest stretch", 'Reverse lunge with reach', 'Half-kneeling overhead side reach'] },
  'Standing side bend, arm overhead': { m: ['obliques', 'lats'], alt: ['Seated side reach', "Child's pose with reach-over", 'Standing wall side stretch'] },

  /* ---------------- Friday ---------------- */
  'Wrist circles · flexor and extensor rocks': { m: ['wrists', 'forearms'], alt: ['Wrist push-up rocks on knees', 'Prayer stretch pulses', 'Fingertip wall push'] },
  'Band curls · band pushdowns': { m: ['biceps', 'triceps'], alt: ['Very light dumbbell curls + kickbacks', 'Cable warm-up sets', 'Isometric towel curl'] },
  'Close-grip press or dips': { m: ['triceps', 'chest'], alt: ['Close-grip push-up', 'JM press', 'Machine dip'] },
  'Incline dumbbell curl': { m: ['biceps'], alt: ['Behind-the-body cable curl', 'Preacher curl', 'Seated supinated curl'] },
  'Hammer curl': { m: ['biceps', 'forearms'], alt: ['Rope hammer curl', 'Cross-body hammer curl', 'Reverse curl'] },
  'Dumbbell Romanian deadlift': { m: ['hamstrings', 'glutes', 'lower-back'], alt: ['Barbell RDL', 'Cable RDL', '45° back extension'] },
  '45° back extension, glute-biased': { m: ['glutes', 'hamstrings', 'lower-back'], alt: ['Reverse hyperextension', 'Cable pull-through', 'Light RDL, high reps'] },
  'Cable pull-through': { m: ['glutes', 'hamstrings'], alt: ['45° back extension', 'Banded pull-through', 'Hip hinge with dowel'] },
  'Lying leg curl': { m: ['hamstrings'], alt: ['Seated leg curl', 'Nordic curl negatives', 'Slider leg curl'] },
  'Single-leg Romanian deadlift, bodyweight': { m: ['hamstrings', 'glutes', 'balance'], alt: ['Assisted single-leg RDL holding a rail', 'B-stance RDL', 'Single-leg hip hinge to wall'] },
  'Balance on a cushion, eyes closed': { m: ['balance', 'ankle'], alt: ['Firm-ground balance, eyes closed', 'Cushion balance with head turns', 'Tandem walk on a line'] },
  'Cable crunch': { m: ['abs'], alt: ['Machine crunch', 'Weighted crunch on bench', 'Stability-ball crunch'] },
  'Ab crunch machine': { m: ['abs'], alt: ['Cable crunch', 'Weighted floor crunch', 'Decline crunch'] },
  'Hollow hold or plank to finish': { m: ['abs', 'core'], alt: ['RKC plank', 'Body saw', 'Dead bug, slow tempo'] },
  'Skater hops, side to side': { m: ['elastic', 'glutes', 'ankle'], alt: ['Lateral line hops', 'Cossack switches, springy', 'Side shuffle, quick steps'] },
  'Lateral line hops, small and quick': { m: ['elastic', 'calves', 'ankle'], alt: ['Front-back line hops', 'Skater hops, small', 'Rope skipping, side swing'] },
  'Overhead triceps · biceps stretch, palm flat on a wall behind you': { m: ['triceps', 'biceps'], alt: ['Towel triceps stretch', 'Doorway biceps stretch', 'Wall forearm rotation stretch'] },
  'Wrist flexor stretch': { m: ['wrists', 'forearms'], alt: ['Prayer stretch', 'Reverse prayer stretch', 'Fingers-down wall stretch'] },
  'Foam roll lats, quads, calves': { m: ['lats', 'quads', 'calves'], alt: ['Massage-gun pass, light', 'Stick roller', 'Lacrosse-ball targeted spots'] },
};

/* ---------------- Sakshi · Phase 2 (Upper/Lower split) ---------------- */
Object.assign(EXINFO, {
  'Easy cardio — treadmill, cycle or cross-trainer': { m: ['cardio'], alt: ['Treadmill walk', 'Stationary cycle', 'Cross-trainer'] },
  'Cat-cow · arm circles · leg swings': { m: ['mobility', 't-spine', 'hips'], alt: ["World's greatest stretch", 'Hip circles', 'Band dislocates'] },
  "Bodyweight squats · world's greatest stretch": { m: ['mobility', 'quads', 'hips'], alt: ['Walking lunge with overhead reach', 'Tempo air squats', 'Deep squat hold'] },
  'Band pull-aparts · scapular push-ups · shoulder dislocates': { m: ['rear-delts', 'upper-back', 'rotator-cuff'], alt: ['Light face pulls', 'Wall slides', 'Prone Y-raises'] },
  'Glute bridges · clamshells · ankle circles': { m: ['glutes', 'glute-med', 'ankle'], alt: ['Banded glute bridges', 'Monster walks', 'Fire hydrants'] },
  'Chest press, dumbbell or machine': { m: ['chest', 'triceps'], alt: ['Incline push-up', 'Machine chest press', 'Floor press'] },
  'Lat pulldown': { m: ['lats', 'biceps'], alt: ['Assisted pull-up', 'Close-grip pulldown', 'Band pulldown'] },
  'Seated shoulder press': { m: ['side-delts', 'front-delts', 'triceps'], alt: ['Machine shoulder press', 'Landmine press', 'Standing dumbbell press, light'] },
  'Seated row': { m: ['upper-back', 'lats', 'biceps'], alt: ['Chest-supported row', 'Single-arm cable row', 'Band row'] },
  'Bicep curl': { m: ['biceps'], alt: ['Hammer curl', 'Cable curl', 'Incline dumbbell curl'] },
  'Triceps pushdown': { m: ['triceps'], alt: ['Rope pushdown', 'Overhead triceps extension', 'Bench dips'] },
  'Goblet or dumbbell squat': { m: ['quads', 'glutes'], alt: ['Leg press', 'Box squat', 'Wall sit'] },
  'Walking lunge': { m: ['quads', 'glutes', 'balance'], alt: ['Reverse lunge', 'Split squat', 'Step-up'] },
  'Calf raise': { m: ['calves'], alt: ['Standing calf raise machine', 'Seated calf raise', 'Single-leg calf raise'] },
  'Cable crunch or hanging knee raise': { m: ['abs', 'lower-abs'], alt: ['Reverse crunch', 'Dead bug', 'Machine crunch'] },
  'Incline chest press': { m: ['upper-chest', 'triceps'], alt: ['Incline dumbbell press', 'Incline push-up', 'Low-to-high cable fly'] },
  'Assisted pull-up or close-grip pulldown': { m: ['lats', 'biceps'], alt: ['Band-assisted pull-up', 'Neutral-grip pulldown', 'Inverted row'] },
  'Face pull or rear-delt fly': { m: ['rear-delts', 'upper-back'], alt: ['Reverse pec deck', 'Band pull-apart', 'Bent-over rear delt fly'] },
  'Bulgarian split squat or leg press': { m: ['quads', 'glutes'], alt: ['Reverse lunge', 'Static split squat', 'Step-up'] },
  'Leg curl, seated or lying': { m: ['hamstrings'], alt: ['Light Romanian deadlift', 'Slider leg curl', 'Nordic curl negatives'] },
  'Standing calf raise': { m: ['calves'], alt: ['Seated calf raise', 'Single-leg calf raise', 'Donkey calf raise'] },
  'Side plank': { m: ['obliques', 'core'], alt: ['Knee-bent side plank', 'Cable lateral hold', 'Suitcase carry'] },
  'Easy walk to bring heart rate down': { m: ['cardio'], alt: ['Slow cycle', 'Slow cross-trainer'] },
  'Chest / doorway stretch': { m: ['chest'], alt: ['Floor pec stretch', 'Wall pec stretch'] },
  'Cross-body shoulder stretch': { m: ['rear-delts'], alt: ['Thread-the-needle stretch', 'Sleeper stretch, gentle'] },
  "Child's pose": { m: ['lats', 'lower-back'], alt: ["Child's pose with side reach", 'Cat-cow, slow'] },
  'Hamstring stretch, standing or seated': { m: ['hamstrings'], alt: ['Seated forward fold, gentle', 'Standing heel-on-bench stretch'] },
  'Figure-4 glute stretch': { m: ['glutes'], alt: ['Pigeon stretch', 'Seated figure-4'] },
  'Calf stretch against a wall': { m: ['calves'], alt: ['Downward-dog calf pedals', 'Heel drop hold off a step'] },
});

/* Fallback when a name is missing from EXINFO. */
function exinfoFor(name, sectionTag) {
  if (EXINFO[name]) return EXINFO[name];
  const byTag = {
    joints: { m: ['mobility', 'balance'], alt: [] },
    hipext: { m: ['glutes', 'hamstrings'], alt: [] },
    fascia: { m: ['mobility'], alt: [] },
  };
  return byTag[sectionTag] || { m: ['mobility'], alt: [] };
}
