import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { PLAN, dayTotal } from '../data/plan';
import { useStore } from '../store';
import Ring from '../components/Ring';
import { Card, Label } from '../components/ui';
import { C } from '../theme';

export default function WeekScreen({ openDay }: { openDay: (id: string) => void }) {
  const { progress, dayDone, sessions, weekKey } = useStore();

  const totals = PLAN.map(d => ({ day: d, total: dayTotal(d), done: dayDone(d.id) }));
  const weekTotal = totals.reduce((n, t) => n + t.total, 0);
  const weekDone = Object.keys(progress).length;
  const weekPct = weekTotal ? weekDone / weekTotal : 0;
  const sessionsThisWeek = new Set(
    sessions.filter(s => isoWeekOf(s.date) === weekKey).map(s => s.dayId)
  ).size;

  const todayId = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Label>Training week</Label>
      <Text style={styles.h1}>Overview</Text>

      <Card style={styles.heroCard}>
        <View style={styles.heroRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNum}>{sessionsThisWeek}<Text style={styles.heroStatDim}>/5</Text></Text>
            <Label style={styles.heroStatLabel}>Sessions</Label>
          </View>
          <Ring size={148} stroke={13} progress={weekPct} color={C.green}>
            <Text style={styles.ringPct}>{Math.round(weekPct * 100)}%</Text>
            <Label style={styles.ringSub}>Week</Label>
          </Ring>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNum}>{weekDone}<Text style={styles.heroStatDim}>/{weekTotal}</Text></Text>
            <Label style={styles.heroStatLabel}>Exercises</Label>
          </View>
        </View>
      </Card>

      <View style={styles.dayRings}>
        {totals.map(({ day, total, done }) => {
          const p = total ? done / total : 0;
          const isToday = day.id === todayId;
          return (
            <Pressable key={day.id} style={styles.dayRing} onPress={() => openDay(day.id)}>
              <Ring size={56} stroke={5} progress={p} color={p >= 1 ? C.green : C.blue}>
                <Text style={styles.dayRingPct}>{Math.round(p * 100)}</Text>
              </Ring>
              <Text style={[styles.dayRingLabel, isToday && { color: C.green }]}>{day.short}</Text>
            </Pressable>
          );
        })}
      </View>

      <Label style={styles.sectionLabel}>The week at a glance</Label>
      {totals.map(({ day, total, done }) => (
        <Pressable key={day.id} onPress={() => openDay(day.id)}>
          <Card style={styles.dayCard}>
            <View style={styles.dayCardLeft}>
              <Text style={styles.dayNum}>{day.num}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.dayName}>{day.name} · {day.focus}</Text>
                <Text style={styles.daySub} numberOfLines={1}>{day.subtitle}</Text>
              </View>
              <View style={styles.dayRight}>
                <Text style={styles.dayCount}>{done}/{total}</Text>
                <Text style={styles.dayTime}>{day.time}</Text>
              </View>
            </View>
            <View style={styles.dayBar}>
              <View style={[styles.dayBarFill, { width: `${total ? (done / total) * 100 : 0}%` }]} />
            </View>
          </Card>
        </Pressable>
      ))}

      <Card style={styles.ruleCard}>
        <Label style={{ color: C.amber }}>Stop rule</Label>
        <Text style={styles.ruleText}>
          Nothing here should send pain down your leg. If a movement or a stretch does, that is nerve
          tension, not muscle tightness — stop that item and flag it. Anything your physio has prescribed
          replaces the equivalent item here.
        </Text>
      </Card>
      <Card style={[styles.ruleCard, { marginBottom: 24 }]}>
        <Label style={{ color: C.blue }}>Be honest about the clock</Label>
        <Text style={styles.ruleText}>
          Full sessions land at 80–95 minutes. If that does not fit, cut the OPTIONAL lines first, then
          the fascia block — not the main lifts and not the joint work. A 60-minute session you actually
          do beats a 90-minute one you skip.
        </Text>
      </Card>
    </ScrollView>
  );
}

function isoWeekOf(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingBottom: 40 },
  h1: { color: C.ink, fontSize: 30, fontWeight: '800', marginTop: 2, marginBottom: 16 },
  heroCard: { paddingVertical: 22 },
  heroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroStat: { alignItems: 'center', width: 74 },
  heroStatNum: { color: C.ink, fontSize: 24, fontWeight: '800', fontVariant: ['tabular-nums'] },
  heroStatDim: { color: C.faint, fontSize: 16, fontWeight: '700' },
  heroStatLabel: { marginTop: 3, fontSize: 9.5 },
  ringPct: { color: C.ink, fontSize: 32, fontWeight: '800', fontVariant: ['tabular-nums'] },
  ringSub: { fontSize: 9.5, marginTop: 1 },
  dayRings: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, paddingHorizontal: 6 },
  dayRing: { alignItems: 'center', gap: 6 },
  dayRingPct: { color: C.ink, fontSize: 13, fontWeight: '800', fontVariant: ['tabular-nums'] },
  dayRingLabel: { color: C.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  sectionLabel: { marginTop: 26, marginBottom: 12 },
  dayCard: { marginBottom: 10, padding: 14 },
  dayCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dayNum: { color: C.green, fontSize: 20, fontWeight: '900', width: 30 },
  dayName: { color: C.ink, fontSize: 15.5, fontWeight: '700' },
  daySub: { color: C.muted, fontSize: 12, marginTop: 1 },
  dayRight: { alignItems: 'flex-end' },
  dayCount: { color: C.ink, fontSize: 13, fontWeight: '800', fontVariant: ['tabular-nums'] },
  dayTime: { color: C.faint, fontSize: 10.5, marginTop: 1 },
  dayBar: { height: 4, borderRadius: 2, backgroundColor: C.track, marginTop: 11 },
  dayBarFill: { height: 4, borderRadius: 2, backgroundColor: C.green },
  ruleCard: { marginTop: 12, gap: 6 },
  ruleText: { color: C.muted, fontSize: 13, lineHeight: 19 },
});
