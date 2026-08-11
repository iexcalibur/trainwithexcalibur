import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

import { useStore, isoWeekKey } from '../store';
import { Card, Label, fmtClock } from '../components/ui';
import { C } from '../theme';
import Heatmap from '../components/Heatmap';

export default function HistoryScreen() {
  const { sessions, weekKey, plan, profile } = useStore();

  const streak = useMemo(() => computeStreak(sessions.map(s => s.date)), [sessions]);
  const thisWeek = sessions.filter(s => isoWeekOf(s.date) === weekKey);
  const totalTime = sessions.reduce((n, s) => n + s.durationSec, 0);

  const byWeek = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of sessions) {
      const wk = isoWeekOf(s.date);
      m.set(wk, (m.get(wk) ?? 0) + 1);
    }
    const cap = plan.length || 5;
    const weeks: { wk: string; count: number }[] = [];
    const d = new Date();
    for (let i = 0; i < 8; i++) {
      const wk = isoWeekKey(d);
      weeks.unshift({ wk, count: Math.min(cap, m.get(wk) ?? 0) });
      d.setDate(d.getDate() - 7);
    }
    return weeks;
  }, [sessions, plan.length]);

  const cap = plan.length || 5;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Label>{profile ? profile.name + ' · Training history' : 'Training history'}</Label>
      <Text style={styles.h1}>History</Text>

      <View style={styles.statRow}>
        <Card style={styles.stat}>
          <Text style={styles.statNum}>{streak}</Text>
          <Label style={styles.statLabel}>Day streak</Label>
        </Card>
        <Card style={styles.stat}>
          <Text style={styles.statNum}>{thisWeek.length}<Text style={styles.statDim}>/{plan.length}</Text></Text>
          <Label style={styles.statLabel}>This week</Label>
        </Card>
        <Card style={styles.stat}>
          <Text style={styles.statNum}>{Math.round(totalTime / 3600 * 10) / 10}<Text style={styles.statDim}>h</Text></Text>
          <Label style={styles.statLabel}>Total time</Label>
        </Card>
      </View>

      <Heatmap sessions={sessions} plan={plan} />

      <Card style={styles.chartCard}>
        <Label style={{ marginBottom: 14 }}>Sessions per week · last 8</Label>
        <View style={styles.chart}>
          {byWeek.map(({ wk, count }) => (
            <View key={wk} style={styles.chartCol}>
              <View style={styles.chartBarTrack}>
                <View style={[styles.chartBarFill, {
                  height: `${(count / cap) * 100}%`,
                  backgroundColor: count >= cap ? C.green : C.blue,
                }]} />
              </View>
              <Text style={styles.chartTick}>{wk.slice(-2)}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Label style={{ marginTop: 22, marginBottom: 10 }}>Logged sessions</Label>
      {sessions.length === 0 && (
        <Card><Text style={styles.empty}>No sessions yet. Open a day and hit Start — ending the session logs it here.</Text></Card>
      )}
      {sessions.map((s, i) => {
        const day = plan.find(d => d.id === s.dayId);
        const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
        return (
          <Card key={i} style={styles.session}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sessionName}>{day ? `${day.name} · ${day.focus}` : s.dayId}</Text>
              <Text style={styles.sessionDate}>{s.date}</Text>
            </View>
            <View style={styles.sessionRight}>
              <Text style={styles.sessionTime}>{fmtClock(s.durationSec)}</Text>
              <Text style={[styles.sessionPct, pct >= 100 && { color: C.green }]}>{pct}% done</Text>
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
}

function isoWeekOf(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return isoWeekKey(new Date(y, m - 1, d));
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingTop: 74, paddingBottom: 130 },
  h1: { color: C.ink, fontSize: 30, fontWeight: '800', marginTop: 2, marginBottom: 16 },
  statRow: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statNum: { color: C.ink, fontSize: 24, fontWeight: '800', fontVariant: ['tabular-nums'] },
  statDim: { color: C.faint, fontSize: 15, fontWeight: '700' },
  statLabel: { marginTop: 4, fontSize: 9 },
  chartCard: { marginTop: 12 },
  chart: { flexDirection: 'row', justifyContent: 'space-between', height: 90 },
  chartCol: { alignItems: 'center', flex: 1, gap: 6 },
  chartBarTrack: { flex: 1, width: 14, borderRadius: 7, backgroundColor: C.track, justifyContent: 'flex-end', overflow: 'hidden' },
  chartBarFill: { width: 14, borderRadius: 7 },
  chartTick: { color: C.faint, fontSize: 9.5, fontVariant: ['tabular-nums'] },
  empty: { color: C.muted, fontSize: 13.5, lineHeight: 20 },
  session: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, padding: 14 },
  sessionName: { color: C.ink, fontSize: 14.5, fontWeight: '700' },
  sessionDate: { color: C.faint, fontSize: 12, marginTop: 2 },
  sessionRight: { alignItems: 'flex-end' },
  sessionTime: { color: C.blue, fontSize: 15, fontWeight: '800', fontVariant: ['tabular-nums'] },
  sessionPct: { color: C.muted, fontSize: 11.5, marginTop: 2 },
});

/* Consecutive training days ending today or yesterday; weekends don't break it. */
function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const have = new Set(dates);
  const d = new Date();
  let streak = 0;
  let graceUsed = false;
  for (let i = 0; i < 366; i++) {
    const iso = d.toISOString().slice(0, 10);
    const dow = d.getDay();
    const weekend = dow === 0 || dow === 6;
    if (have.has(iso)) streak++;
    else if (!weekend) {
      if (streak === 0 && !graceUsed) graceUsed = true; // today has no session yet — look back one day
      else break;
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
