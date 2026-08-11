import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Day, dayTotal } from './data/plan';
import { Profile, PROFILES, profileById } from './profiles';

export interface Session {
  dayId: string;
  date: string; // ISO date
  durationSec: number;
  done: number;
  total: number;
}

export interface ActiveSession {
  dayId: string;
  startedAt: number | null; // null = paused
  accumSec: number;
}

interface StoreValue {
  ready: boolean;
  weekKey: string;
  profile: Profile | null;
  plan: Day[];
  selectProfile: (id: string) => void;
  signOut: () => void;
  progress: Record<string, boolean>;
  toggle: (id: string) => void;
  resetDay: (dayId: string) => void;
  dayDone: (dayId: string) => number;
  sessions: Session[];
  swaps: Record<string, string>;
  setSwap: (id: string, alt: string | null) => void;
  active: ActiveSession | null;
  startSession: (dayId: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  discardSession: () => void;
}

const Store = createContext<StoreValue | null>(null);

export function isoWeekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function elapsedSec(a: ActiveSession | null): number {
  if (!a) return 0;
  return Math.floor(a.accumSec + (a.startedAt ? (Date.now() - a.startedAt) / 1000 : 0));
}

/* ------------------------------------------------------------------
   Storage keys. Everything below the profile is namespaced per user,
   so two people share a device without ever touching each other's
   data. AsyncStorage lives in the app's own sandbox: it survives app
   restarts and OS updates, is included in device backups, and is only
   removed when the app itself is deleted.
   ------------------------------------------------------------------ */
const K_PROFILE = 'ra:profile';
const kSessions = (p: string) => `ra:${p}:sessions`;
const kActive = (p: string) => `ra:${p}:active`;
const kProgress = (p: string, wk: string) => `ra:${p}:progress:${wk}`;
const kSwaps = (p: string) => `ra:${p}:swaps`;

/* Pre-profile builds stored everything under tw:* — hand it to Shubham. */
async function migrateLegacy() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const legacy = keys.filter(k => /^tw:(progress:.+|sessions|active)$/.test(k));
    if (!legacy.length) return;
    const pairs = await AsyncStorage.multiGet(legacy);
    const targets = legacy.map(k => k.replace(/^tw:/, 'ra:shubham:'));
    const existing = new Set(
      (await AsyncStorage.multiGet(targets))
        .filter(([, v]) => v != null)
        .map(([k]) => k)
    );
    const moved: [string, string][] = [];
    for (const [k, v] of pairs) {
      if (v == null) continue;
      const target = k.replace(/^tw:/, 'ra:shubham:');
      if (existing.has(target)) continue;   // never clobber newer data
      moved.push([target, v]);
    }
    if (moved.length) await AsyncStorage.multiSet(moved);
    await AsyncStorage.multiRemove(legacy);
  } catch {}
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const weekKey = isoWeekKey(new Date());
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [sessions, setSessions] = useState<Session[]>([]);
  const [swaps, setSwaps] = useState<Record<string, string>>({});
  const [active, setActive] = useState<ActiveSession | null>(null);

  const plan = profile?.plan ?? [];

  /* Load a profile's data set. */
  const loadFor = useCallback(async (p: Profile) => {
    try {
      const [pr, se, ac, sw] = await AsyncStorage.multiGet([
        kProgress(p.id, weekKey),
        kSessions(p.id),
        kActive(p.id),
        kSwaps(p.id),
      ]);
      setProgress(pr[1] ? JSON.parse(pr[1]) : {});
      setSessions(se[1] ? JSON.parse(se[1]) : []);
      setActive(ac[1] ? JSON.parse(ac[1]) : null);
      setSwaps(sw[1] ? JSON.parse(sw[1]) : {});
    } catch {
      setProgress({}); setSessions([]); setActive(null); setSwaps({});
    }
  }, [weekKey]);

  useEffect(() => {
    (async () => {
      await migrateLegacy();
      try {
        const id = await AsyncStorage.getItem(K_PROFILE);
        const p = profileById(id);
        if (p) { setProfile(p); await loadFor(p); }
      } catch {}
      setReady(true);
    })();
  }, [loadFor]);

  const selectProfile = useCallback((id: string) => {
    const p = profileById(id);
    if (!p) return;
    setProfile(p);
    AsyncStorage.setItem(K_PROFILE, id).catch(() => {});
    loadFor(p);
  }, [loadFor]);

  const signOut = useCallback(() => {
    setProfile(null);
    setProgress({}); setSessions([]); setActive(null); setSwaps({});
    AsyncStorage.removeItem(K_PROFILE).catch(() => {});
  }, []);

  const saveProgress = useCallback((next: Record<string, boolean>) => {
    setProgress(next);
    if (profile) AsyncStorage.setItem(kProgress(profile.id, weekKey), JSON.stringify(next)).catch(() => {});
  }, [profile, weekKey]);

  const saveSessions = useCallback((next: Session[]) => {
    setSessions(next);
    if (profile) AsyncStorage.setItem(kSessions(profile.id), JSON.stringify(next)).catch(() => {});
  }, [profile]);

  const saveActive = useCallback((next: ActiveSession | null) => {
    setActive(next);
    if (!profile) return;
    if (next) AsyncStorage.setItem(kActive(profile.id), JSON.stringify(next)).catch(() => {});
    else AsyncStorage.removeItem(kActive(profile.id)).catch(() => {});
  }, [profile]);

  const setSwap = useCallback((id: string, alt: string | null) => {
    const next = { ...swaps };
    if (alt) next[id] = alt;
    else delete next[id];
    setSwaps(next);
    if (profile) AsyncStorage.setItem(kSwaps(profile.id), JSON.stringify(next)).catch(() => {});
  }, [swaps, profile]);

  const toggle = useCallback((id: string) => {
    const next = { ...progress };
    if (next[id]) delete next[id];
    else next[id] = true;
    saveProgress(next);
  }, [progress, saveProgress]);

  const resetDay = useCallback((dayId: string) => {
    const next: Record<string, boolean> = {};
    for (const k of Object.keys(progress)) if (!k.startsWith(dayId + '-')) next[k] = progress[k];
    saveProgress(next);
  }, [progress, saveProgress]);

  const dayDone = useCallback((dayId: string) => {
    let n = 0;
    for (const k of Object.keys(progress)) if (k.startsWith(dayId + '-')) n++;
    return n;
  }, [progress]);

  const startSession = useCallback((dayId: string) => {
    saveActive({ dayId, startedAt: Date.now(), accumSec: 0 });
  }, [saveActive]);

  const pauseSession = useCallback(() => {
    if (!active || active.startedAt === null) return;
    saveActive({ ...active, startedAt: null, accumSec: elapsedSec(active) });
  }, [active, saveActive]);

  const resumeSession = useCallback(() => {
    if (!active || active.startedAt !== null) return;
    saveActive({ ...active, startedAt: Date.now() });
  }, [active, saveActive]);

  const endSession = useCallback(() => {
    if (!active) return;
    const day = plan.find(d => d.id === active.dayId);
    const rec: Session = {
      dayId: active.dayId,
      date: new Date().toISOString().slice(0, 10),
      durationSec: elapsedSec(active),
      done: dayDone(active.dayId),
      total: day ? dayTotal(day) : 0,
    };
    saveSessions([rec, ...sessions]);
    saveActive(null);
  }, [active, sessions, plan, dayDone, saveSessions, saveActive]);

  const discardSession = useCallback(() => saveActive(null), [saveActive]);

  return (
    <Store.Provider value={{
      ready, weekKey, profile, plan, selectProfile, signOut,
      progress, toggle, resetDay, dayDone, swaps, setSwap,
      sessions, active, startSession, pauseSession, resumeSession, endSession, discardSession,
    }}>
      {children}
    </Store.Provider>
  );
}

export function useStore(): StoreValue {
  const v = useContext(Store);
  if (!v) throw new Error('useStore outside provider');
  return v;
}

export { PROFILES };
