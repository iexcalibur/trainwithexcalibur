/* ============================================================
   Exercise demo clips — silent 2-frame loops (start ⇄ end position).

   Source: free-exercise-db (github.com/yuhonas/free-exercise-db),
   released into the public domain under the Unlicense. Frames are
   served from the jsDelivr CDN. Every mapping below was hand-checked
   against the movement it illustrates; exercises with no honest match
   are absent and fall back to the tutorial link in the sheet.

   d = image folder, t = source exercise title
   ============================================================ */

const DEMO_BASE = 'https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/';

const DEMOS = {
  "45° back extension, glute-biased": {"d":"Hyperextensions_Back_Extensions","t":"Hyperextensions (Back Extensions)"},
  "Ab crunch machine": {"d":"Ab_Crunch_Machine","t":"Ab Crunch Machine"},
  "Ankle pogo hops, minimal knee bend": {"d":"Rope_Jumping","t":"Rope Jumping"},
  "Assisted pull-up or close-grip pulldown": {"d":"Band_Assisted_Pull-Up","t":"Band Assisted Pull-Up"},
  "Balance on a cushion, eyes closed": {"d":"Balance_Board","t":"Balance Board"},
  "Band external rotation · wall slides": {"d":"External_Rotation_with_Band","t":"External Rotation with Band"},
  "Band external rotation": {"d":"External_Rotation_with_Band","t":"External Rotation with Band"},
  "Band pull-aparts · scapular push-ups · shoulder dislocates": {"d":"Band_Pull_Apart","t":"Band Pull Apart"},
  "Band straight-arm pulldown · face pulls": {"d":"Rope_Straight-Arm_Pulldown","t":"Rope Straight-Arm Pulldown"},
  "Banded glute bridge with abduction at the top": {"d":"Butt_Lift_Bridge","t":"Butt Lift (Bridge)"},
  "Banded hip flexor march": {"d":"Hip_Flexion_with_Band","t":"Hip Flexion with Band"},
  "Bicep curl": {"d":"Dumbbell_Bicep_Curl","t":"Dumbbell Bicep Curl"},
  "Bodyweight squats · world's greatest stretch": {"d":"Bodyweight_Squat","t":"Bodyweight Squat"},
  "Bulgarian split squat or leg press": {"d":"Split_Squat_with_Dumbbells","t":"Split Squat with Dumbbells"},
  "Cable Pallof press": {"d":"Pallof_Press","t":"Pallof Press"},
  "Cable crunch or hanging knee raise": {"d":"Cable_Crunch","t":"Cable Crunch"},
  "Cable crunch": {"d":"Cable_Crunch","t":"Cable Crunch"},
  "Cable kickback": {"d":"One-Legged_Cable_Kickback","t":"One-Legged Cable Kickback"},
  "Cable lateral hold": {"d":"Pallof_Press","t":"Pallof Press"},
  "Cable lateral raise": {"d":"Standing_Low-Pulley_Deltoid_Raise","t":"Standing Low-Pulley Deltoid Raise"},
  "Cable pull-through": {"d":"Pull_Through","t":"Pull Through"},
  "Calf raise": {"d":"Standing_Calf_Raises","t":"Standing Calf Raises"},
  "Calf stretch against a wall": {"d":"Calf_Stretch_Hands_Against_Wall","t":"Calf Stretch Hands Against Wall"},
  "Calf stretch against wall · soleus with knee bent": {"d":"Calf_Stretch_Hands_Against_Wall","t":"Calf Stretch Hands Against Wall"},
  "Captain's-chair knee raise": {"d":"Knee_Hip_Raise_On_Parallel_Bars","t":"Knee/Hip Raise On Parallel Bars"},
  "Cat-cow · arm circles · leg swings": {"d":"Cat_Stretch","t":"Cat Stretch"},
  "Cat-cow · hip circles · band pull-aparts": {"d":"Cat_Stretch","t":"Cat Stretch"},
  "Chest / doorway stretch": {"d":"Chest_And_Front_Of_Shoulder_Stretch","t":"Chest And Front Of Shoulder Stretch"},
  "Chest dips": {"d":"Dips_-_Chest_Version","t":"Dips - Chest Version"},
  "Chest press, dumbbell or machine": {"d":"Dumbbell_Bench_Press","t":"Dumbbell Bench Press"},
  "Chest-supported row": {"d":"Dumbbell_Incline_Row","t":"Dumbbell Incline Row"},
  "Child's pose": {"d":"Childs_Pose","t":"Child's Pose"},
  "Close-grip press or dips": {"d":"Close-Grip_Barbell_Bench_Press","t":"Close-Grip Barbell Bench Press"},
  "Cross-body rear delt · doorway pec · overhead triceps · upper trap": {"d":"Shoulder_Stretch","t":"Shoulder Stretch"},
  "Cross-body shoulder stretch": {"d":"Shoulder_Stretch","t":"Shoulder Stretch"},
  "Doorway pec · overhead triceps · kneeling lat on a bench": {"d":"Chest_And_Front_Of_Shoulder_Stretch","t":"Chest And Front Of Shoulder Stretch"},
  "Dumbbell Bulgarian split squat": {"d":"Split_Squat_with_Dumbbells","t":"Split Squat with Dumbbells"},
  "Dumbbell Romanian deadlift": {"d":"Stiff-Legged_Dumbbell_Deadlift","t":"Stiff-Legged Dumbbell Deadlift"},
  "Dumbbell dead bug": {"d":"Dead_Bug","t":"Dead Bug"},
  "Dumbbell lateral raise": {"d":"Side_Lateral_Raise","t":"Side Lateral Raise"},
  "Dumbbell reverse lunge": {"d":"Dumbbell_Rear_Lunge","t":"Dumbbell Rear Lunge"},
  "Dumbbell step-up, knee-height box": {"d":"Dumbbell_Step_Ups","t":"Dumbbell Step Ups"},
  "Easy cardio — bike or incline walk": {"d":"Bicycling_Stationary","t":"Bicycling, Stationary"},
  "Easy cardio — treadmill, cycle or cross-trainer": {"d":"Walking_Treadmill","t":"Walking, Treadmill"},
  "Easy cardio": {"d":"Walking_Treadmill","t":"Walking, Treadmill"},
  "Easy walk to bring heart rate down": {"d":"Walking_Treadmill","t":"Walking, Treadmill"},
  "Eccentric heel drop off a step, 3s lower": {"d":"Standing_Calf_Raises","t":"Standing Calf Raises"},
  "Empty-hand lateral raises · arm circles": {"d":"Arm_Circles","t":"Arm Circles"},
  "Face pull or rear-delt fly": {"d":"Face_Pull","t":"Face Pull"},
  "Face pull or reverse pec deck": {"d":"Face_Pull","t":"Face Pull"},
  "Farmer's carry, two dumbbells": {"d":"Farmers_Walk","t":"Farmer's Walk"},
  "Figure-4 glute stretch": {"d":"Ankle_On_The_Knee","t":"Ankle On The Knee"},
  "Flat machine or dumbbell press": {"d":"Dumbbell_Bench_Press","t":"Dumbbell Bench Press"},
  "Foam roll lats, quads, calves": {"d":"Latissimus_Dorsi-SMR","t":"Latissimus Dorsi-SMR"},
  "Frog pump finisher": {"d":"Butt_Lift_Bridge","t":"Butt Lift (Bridge)"},
  "Glute bridge": {"d":"Butt_Lift_Bridge","t":"Butt Lift (Bridge)"},
  "Glute bridges · clamshells · ankle circles": {"d":"Butt_Lift_Bridge","t":"Butt Lift (Bridge)"},
  "Goblet or dumbbell squat": {"d":"Goblet_Squat","t":"Goblet Squat"},
  "Half-kneeling cable chop": {"d":"Standing_Cable_Wood_Chop","t":"Standing Cable Wood Chop"},
  "Hammer curl": {"d":"Hammer_Curls","t":"Hammer Curls"},
  "Hamstring stretch, standing or seated": {"d":"Seated_Floor_Hamstring_Stretch","t":"Seated Floor Hamstring Stretch"},
  "Hip thrust, dumbbell or barbell": {"d":"Barbell_Hip_Thrust","t":"Barbell Hip Thrust"},
  "Hollow hold or plank to finish": {"d":"Plank","t":"Plank"},
  "Incline cable fly or pec deck": {"d":"Incline_Cable_Flye","t":"Incline Cable Flye"},
  "Incline chest press": {"d":"Incline_Dumbbell_Press","t":"Incline Dumbbell Press"},
  "Incline dumbbell curl": {"d":"Incline_Dumbbell_Curl","t":"Incline Dumbbell Curl"},
  "Incline dumbbell press": {"d":"Incline_Dumbbell_Press","t":"Incline Dumbbell Press"},
  "Kneeling hip flexor stretch": {"d":"Kneeling_Hip_Flexor","t":"Kneeling Hip Flexor"},
  "Lacrosse ball under the foot": {"d":"Foot-SMR","t":"Foot-SMR"},
  "Lat pulldown, wide or neutral grip": {"d":"Wide-Grip_Lat_Pulldown","t":"Wide-Grip Lat Pulldown"},
  "Lat pulldown": {"d":"Wide-Grip_Lat_Pulldown","t":"Wide-Grip Lat Pulldown"},
  "Lat stretch holding an upright, hips sitting back · doorway pec": {"d":"Overhead_Lat","t":"Overhead Lat"},
  "Lateral line hops, small and quick": {"d":"Lateral_Cone_Hops","t":"Lateral Cone Hops"},
  "Leg curl, seated or lying": {"d":"Seated_Leg_Curl","t":"Seated Leg Curl"},
  "Leg extension": {"d":"Leg_Extensions","t":"Leg Extensions"},
  "Leg press": {"d":"Leg_Press","t":"Leg Press"},
  "Leg swings · bodyweight squats": {"d":"Bodyweight_Squat","t":"Bodyweight Squat"},
  "Lunge with overhead reach": {"d":"Worlds_Greatest_Stretch","t":"World's Greatest Stretch"},
  "Lying leg curl": {"d":"Lying_Leg_Curls","t":"Lying Leg Curls"},
  "Lying leg raise, dumbbell between the feet": {"d":"Flat_Bench_Lying_Leg_Raise","t":"Flat Bench Lying Leg Raise"},
  "Med-ball chest pass into a wall": {"d":"Medicine_Ball_Chest_Pass","t":"Medicine Ball Chest Pass"},
  "One-arm dumbbell or cable row": {"d":"One-Arm_Dumbbell_Row","t":"One-Arm Dumbbell Row"},
  "Overhead triceps extension": {"d":"Standing_Dumbbell_Triceps_Extension","t":"Standing Dumbbell Triceps Extension"},
  "Overhead triceps · biceps stretch, palm flat on a wall behind you": {"d":"Triceps_Stretch","t":"Triceps Stretch"},
  "Plank with dumbbell drag-through": {"d":"Plank","t":"Plank"},
  "Rear delt fly or reverse pec deck": {"d":"Reverse_Machine_Flyes","t":"Reverse Machine Flyes"},
  "Reverse crunch on a bench": {"d":"Reverse_Crunch","t":"Reverse Crunch"},
  "Rope pushdown": {"d":"Triceps_Pushdown_-_Rope_Attachment","t":"Triceps Pushdown - Rope Attachment"},
  "Rope skipping": {"d":"Rope_Jumping","t":"Rope Jumping"},
  "Scap shrugs from a dead hang": {"d":"Scapular_Pull-Up","t":"Scapular Pull-Up"},
  "Seated dumbbell or machine press": {"d":"Seated_Dumbbell_Press","t":"Seated Dumbbell Press"},
  "Seated hip abduction machine": {"d":"Thigh_Abductor","t":"Thigh Abductor"},
  "Seated leg curl": {"d":"Seated_Leg_Curl","t":"Seated Leg Curl"},
  "Seated row": {"d":"Seated_Cable_Rows","t":"Seated Cable Rows"},
  "Seated shoulder press": {"d":"Seated_Dumbbell_Press","t":"Seated Dumbbell Press"},
  "Shrugs": {"d":"Dumbbell_Shrug","t":"Dumbbell Shrug"},
  "Side plank with a dumbbell on the top hip": {"d":"Side_Bridge","t":"Side Bridge"},
  "Side plank": {"d":"Side_Bridge","t":"Side Bridge"},
  "Side-lying clam or hip abduction": {"d":"Side_Leg_Raises","t":"Side Leg Raises"},
  "Single knee-to-chest": {"d":"One_Knee_To_Chest","t":"One Knee To Chest"},
  "Single-leg Romanian deadlift, bodyweight": {"d":"Kettlebell_One-Legged_Deadlift","t":"Kettlebell One-Legged Deadlift"},
  "Single-leg balance, eyes closed": {"d":"Balance_Board","t":"Balance Board"},
  "Single-leg balance": {"d":"Balance_Board","t":"Balance Board"},
  "Single-leg calf raise": {"d":"Standing_Dumbbell_Calf_Raise","t":"Standing Dumbbell Calf Raise"},
  "Single-leg glute bridge": {"d":"Single_Leg_Glute_Bridge","t":"Single Leg Glute Bridge"},
  "Skater hops, side to side": {"d":"Lateral_Bound","t":"Lateral Bound"},
  "Slow foam roll: lats, quads, calves": {"d":"Latissimus_Dorsi-SMR","t":"Latissimus Dorsi-SMR"},
  "Standing calf raise": {"d":"Standing_Calf_Raises","t":"Standing Calf Raises"},
  "Standing quad stretch": {"d":"Quad_Stretch","t":"Quad Stretch"},
  "Standing side bend, arm overhead": {"d":"Standing_Lateral_Stretch","t":"Standing Lateral Stretch"},
  "Straight-arm pulldown": {"d":"Straight-Arm_Pulldown","t":"Straight-Arm Pulldown"},
  "Suitcase carry": {"d":"Farmers_Walk","t":"Farmer's Walk"},
  "Thoracic extension over a foam roller": {"d":"Upper_Back_Stretch","t":"Upper Back Stretch"},
  "Triceps pushdown": {"d":"Triceps_Pushdown","t":"Triceps Pushdown"},
  "Walking lunge": {"d":"Bodyweight_Walking_Lunge","t":"Bodyweight Walking Lunge"},
  "Wall slides · arm swings · push-ups as a ramp-up": {"d":"Pushups","t":"Pushups"},
  "Wide-stance adductor stretch": {"d":"Intermediate_Groin_Stretch","t":"Intermediate Groin Stretch"},
  "Wrist circles · flexor and extensor rocks": {"d":"Wrist_Circles","t":"Wrist Circles"},
  "Wrist flexor stretch": {"d":"Kneeling_Forearm_Stretch","t":"Kneeling Forearm Stretch"},
};

/* ------------------------------------------------------------
   Video demos for the movements the photo dataset doesn't cover
   (rehab / mobility / tendon work). Each id was verified via the
   YouTube oEmbed API — it exists, the title matches the movement,
   and it is embeddable. Played muted and looped, so it behaves
   like the silent clips above; unmute with the player controls.
   ------------------------------------------------------------ */
const VIDEOS = {
  '90/90 hip rotation switches': { v: 'qq_Z7sAmVrA', t: '90/90 Hip Switch — Simone Sports Performance' },
  'Band curls · band pushdowns': { v: 'Da57AuIofvU', t: 'Resistance Band Bicep Curl — Fitness Freedom Athletes' },
  'Banded eversion and inversion': { v: 'VyeqglvCwdE', t: 'Theraband Inversion and Eversion — Jeffrey B. Witty, M.D.' },
  'Banded terminal knee extension': { v: '7xG3MeoLjC0', t: 'Banded Terminal Knee Extension (TKE) — Tim Trevail' },
  'Copenhagen plank, knee on a bench': { v: 'GOijKtXza9M', t: 'Copenhagen Plank on a Bench — Revival Performance PT' },
  'Knee-to-wall ankle rock': { v: 'Y1IZXkdPPdw', t: 'Knee to Wall Ankle Mobility Drill — Nick Brattain' },
  'Knee-to-wall dorsiflexion': { v: 'pSMPd12mrg0', t: 'Knee to Wall Dorsiflexion — The Physiobot' },
  'Lateral step-down': { v: 'AQ1kCW6DOKM', t: 'Lateral Step Down — ATLASTHETICS' },
  'Overhead dumbbell march': { v: 'SBnTGJUKkkM', t: 'Dumbbell Overhead March — Garage Fitness Girl' },
  'Reverse Nordic curl, shallow range': { v: 'BnlPIJ3d-ck', t: 'Reverse Nordic (Beginner to Advanced) — Sports Rehab Expert' },
  'Slow step-down from a low box, 3s lower': { v: 'Or4C-UQ63Xc', t: 'Eccentric Single-Leg Step Down — Dr. Carl Baird' },
  'Spanish squat isometric, heavy band behind the knees': { v: 'mik90mAS6fU', t: 'Spanish Squats for Patellar Tendinopathy — The Knee Resource' },
  'Tibialis raise, back to a wall, toes up': { v: 'VzIcGAgBiaM', t: 'Tibialis Wall Raises — The Barefoot Sprinter' },
};

function demoFor(name) {
  const e = DEMOS[name];
  if (e) return { kind: 'frames', frames: [DEMO_BASE + e.d + '/0.jpg', DEMO_BASE + e.d + '/1.jpg'], title: e.t };
  const v = VIDEOS[name];
  if (v) {
    const p = new URLSearchParams({
      autoplay: '1', mute: '1', loop: '1', playlist: v.v,
      controls: '1', modestbranding: '1', rel: '0', playsinline: '1',
    });
    return { kind: 'video', src: `https://www.youtube-nocookie.com/embed/${v.v}?${p}`, watch: `https://www.youtube.com/watch?v=${v.v}`, title: v.t };
  }
  return null;
}
