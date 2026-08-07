import { Day } from './data/plan';
import { PLAN } from './data/plan';
import { SAKSHI_PLAN } from './data/sakshi-plan';

export interface Rule {
  color: string;
  label: string;
  text: string;
}

export interface Profile {
  id: string;
  name: string;
  tagline: string;
  color: string;
  plan: Day[];
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
