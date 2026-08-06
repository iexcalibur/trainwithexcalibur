import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PLAN, dayTotal } from './data/plan';

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
  progress: Record<string, boolean>;
  toggle: (id: string) => void;
  resetDay: (dayId: string) => void;
  dayDone: (dayId: string) => number;
  sessions: Session[];
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

const K_SESSIONS = 'tw:sessions';
const K_ACTIVE = 'tw:active';
const progressKey = (wk: string) => `tw:progress:${wk}`;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const weekKey = isoWeekKey(new Date());
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [sessions, setSessions] = useState<Session[]>([]);
  const [active, setActive] = useState<ActiveSession | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [p, s, a] = await Promise.all([
          AsyncStorage.getItem(progressKey(weekKey)),
          AsyncStorage.getItem(K_SESSIONS),
          AsyncStorage.getItem(K_ACTIVE),
        ]);
        if (p) setProgress(JSON.parse(p));
        if (s) setSessions(JSON.parse(s));
        if (a) setActive(JSON.parse(a));
      } catch {}
      setReady(true);
    })();
  }, [weekKey]);

  const saveProgress = useCallback((next: Record<string, boolean>) => {
    setProgress(next);
    AsyncStorage.setItem(progressKey(weekKey), JSON.stringify(next)).catch(() => {});
  }, [weekKey]);

  const saveSessions = useCallback((next: Session[]) => {
    setSessions(next);
    AsyncStorage.setItem(K_SESSIONS, JSON.stringify(next)).catch(() => {});
  }, []);

  const saveActive = useCallback((next: ActiveSession | null) => {
    setActive(next);
    if (next) AsyncStorage.setItem(K_ACTIVE, JSON.stringify(next)).catch(() => {});
    else AsyncStorage.removeItem(K_ACTIVE).catch(() => {});
  }, []);

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
    const day = PLAN.find(d => d.id === active.dayId);
    const total = day ? dayTotal(day) : 0;
    const rec: Session = {
      dayId: active.dayId,
      date: new Date().toISOString().slice(0, 10),
      durationSec: elapsedSec(active),
      done: dayDone(active.dayId),
      total,
    };
    saveSessions([rec, ...sessions]);
    saveActive(null);
  }, [active, sessions, dayDone, saveSessions, saveActive]);

  const discardSession = useCallback(() => saveActive(null), [saveActive]);

  return (
    <Store.Provider value={{
      ready, weekKey, progress, toggle, resetDay, dayDone,
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
