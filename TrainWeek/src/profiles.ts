import { Day } from './data/plan';
import { PLAN } from './data/plan';
import { SAKSHI_PLAN } from './data/sakshi-plan';
import { SHUBHAM2_PLAN } from './data/shubham2-plan';
import { RUN_TREADMILL, RUN_OUTDOOR, RUN_SPEED } from './data/run-plan';

export interface Rule {
  color: string;
  label: string;
  text: string;
}

export interface ProfileMode {
  key: string;
  label: string;
  sub: string;
}

export interface Profile {
  id: string;
  name: string;
  tagline: string;
  color: string;
  /** Default week; mode profiles use `plans[mode]` instead. */
  plan: Day[];
  /** Two variants of the same week (e.g. treadmill vs outdoor), chosen per profile. */
  modes?: ProfileMode[];
  plans?: Record<string, Day[]>;
  rules: Rule[];
}

export const PROFILES: Profile[] = [
  {
    id: 'shubham',
    name: 'Shubham',
    tagline: 'Five-day gym week · back-conscious build',
    color: '#1EE6A8',
    plan: PLAN,
    rules: [
      {
        color: '#FFB84A',
        label: 'Stop rule',
        text: 'Nothing here should send pain down your leg. If a movement or a stretch does, that is nerve tension, not muscle tightness — stop that item and flag it. Anything your physio has prescribed replaces the equivalent item here.',
      },
      {
        color: '#4AA8FF',
        label: 'Be honest about the clock',
        text: 'Full sessions land at 80–95 minutes. If that does not fit, cut the OPTIONAL lines first, then the fascia block — not the main lifts and not the joint work. A 60-minute session you actually do beats a 90-minute one you skip.',
      },
    ],
  },
  {
    id: 'shubham2',
    name: 'Shubham 2.0',
    tagline: 'Push / pull every 48 hours · 6 days · barbell anchors · daily dips + abs',
    color: '#4AA8FF',
    plan: SHUBHAM2_PLAN,
    rules: [
      {
        color: '#1EE6A8',
        label: 'Add weight, not exercises',
        text: 'The plan only works if the numbers climb. Hit the top of the rep range on every set of a lift, then add the smallest load next time; if you cannot, repeat the weight and try again. Log every top set. The barbell bench on Monday and the barbell row on Tuesday are the anchors — those two numbers are what a month of 2.0 should move.',
      },
      {
        color: '#FFB84A',
        label: 'Hit it when it recovers',
        text: 'Push, pull, push, pull, push, pull: chest and shoulders Monday, Wednesday, Friday; back Tuesday, Thursday, Saturday. Every group comes back exactly 48 hours later and gets three sessions a week. Monday and Tuesday are heavy, Wednesday and Thursday are volume, Friday and Saturday stay a touch lighter so the heavy days are fresh. If a group is still sore when its day comes round, drop the volume, not the session.',
      },
      {
        color: '#1EE6A8',
        label: 'Dips and abs every day',
        text: 'Dips are their own block every day, lower chest, never to failure: three short sets on push days, two on pull days so chest still gets its 48 hours. Monday to Friday the ab machine opens every abs block, then the day\'s job: anti-extension, anti-rotation, obliques, lower abs, flexion. Saturday has none — five days is the dose. Short, honest sets; the core is trained by the week, not by one long session.',
      },
      {
        color: '#4AA8FF',
        label: 'Back-conscious, still',
        text: 'No legs here, but the spine rules stay: supported rows and presses, nothing that loads the low back in flexion. Nothing should send pain down a leg — if it does, stop that item.',
      },
      {
        color: '#B48CFF',
        label: 'Conditioning finisher',
        text: 'Ten to fifteen minutes at the end of every session so a gym week still moves the football goal: easy base on Monday and Thursday, sprints Tuesday, a steady run Wednesday, shuttle sprints Friday, a walk-jog flush Saturday. Short on purpose — it is the lifting day, not a running day.',
      },
    ],
  },
  {
    id: 'shubham3',
    name: 'Shubham 3.0',
    tagline: 'Running · stamina, endurance, speed · 7 days',
    color: '#FFB84A',
    plan: RUN_TREADMILL,
    modes: [
      { key: 'treadmill', label: 'Treadmill', sub: 'Indoor · incline and speed cues' },
      { key: 'outdoor', label: 'Outdoor', sub: 'Road, track and hills' },
      { key: 'speed', label: 'Speed', sub: 'Short runs + sprints, every day' },
    ],
    plans: { treadmill: RUN_TREADMILL, outdoor: RUN_OUTDOOR, speed: RUN_SPEED },
    rules: [
      {
        color: '#1EE6A8',
        label: 'Easy days easy, hard days hard',
        text: 'Three short runs and the long run are easy on purpose — that is what lets the two sprint days be all-out and the endurance run stay steady. If you cannot talk in sentences on an easy day, slow down. Speed comes from the recovery, not from pushing every run.',
      },
      {
        color: '#FFB84A',
        label: 'Build slowly',
        text: 'Add about 10% a week in total minutes, and 5 minutes to the long run. Every fourth week, pull everything back by a quarter. Stamina and endurance are built over months; the plan only works if you are still running in month three.',
      },
      {
        color: '#4AA8FF',
        label: 'Listen to the legs',
        text: 'Shin, knee or Achilles pain that gets worse as you run is a stop sign, not something to run through — make that day a walk. Sprint days are the ones that bite: never sprint cold, and stop the session the moment form falls apart.',
      },
    ],
  },
  {
    id: 'sakshi',
    name: 'Sakshi',
    tagline: 'Beginner to toned · Phase 2 build (weeks 5–12)',
    color: '#B48CFF',
    plan: SAKSHI_PLAN,
    rules: [
      {
        color: '#1EE6A8',
        label: 'Progressive overload',
        text: 'Each week, do a little more than last week — one more rep, or slightly more weight, with good form. When every set hits the top of the rep range cleanly, add the smallest increment next session.',
      },
      {
        color: '#FFB84A',
        label: 'Go lighter than you think',
        text: 'Form first — leave 1–2 reps in the tank, no ego-lifting. Muscle soreness early on is normal; sharp or joint pain is not — stop if it shows up. Rest days are part of the plan.',
      },
      {
        color: '#4AA8FF',
        label: 'Cardio · 2× a week',
        text: 'One steady session: 20–30 min incline walk, cycle or cross-trainer. One intervals session: 20 min of 1 min brisk / 2 min easy — start with 4–5 rounds and build up. Plus ~7–8k steps daily.',
      },
    ],
  },
];

export const profileById = (id: string | null): Profile | undefined =>
  PROFILES.find(p => p.id === id);
