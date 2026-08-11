import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { dayTotal } from '../data/plan';
import { useStore } from '../store';
import ReorderModal from '../components/ReorderModal';
import Svg, { Path } from 'react-native-svg';
import Ring from '../components/Ring';
import { Card, Label } from '../components/ui';
import { C } from '../theme';

export default function WeekScreen({ openDay }: { openDay: (id: string) => void }) {
  const { progress, dayDone, sessions, weekKey, plan, profile, order, setOrder } = useStore();
  const [editing, setEditing] = React.useState(false);

  const totals = plan.map(d => ({ day: d, total: dayTotal(d), done: dayDone(d.id) }));
  const weekTotal = totals.reduce((n, t) => n + t.total, 0);
  const weekDone = Object.keys(progress).length;
  const weekPct = weekTotal ? weekDone / weekTotal : 0;
  const sessionsThisWeek = new Set(
    sessions.filter(s => isoWeekOf(s.date) === weekKey).map(s => s.dayId)
  ).size;

  const todayId = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Label>{profile?.tagline ?? 'Training week'}</Label>
      <Text style={styles.h1}>Overview</Text>

      <Card style={styles.heroCard}>
        <View style={styles.heroRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNum}>{sessionsThisWeek}<Text style={styles.heroStatDim}>/{plan.length}</Text></Text>
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
          const isToday = day.slotId === todayId;
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

      <View style={styles.glanceHead}>
        <Label>The week at a glance</Label>
        <Pressable
          onPress={() => setEditing(true)}
          hitSlop={10}
          style={styles.editBtn}
          accessibilityLabel="Edit week order"
        >
          <Svg viewBox="0 0 24 24" width={15} height={15}>
            <Path d="M12 20h9" stroke={C.muted} strokeWidth={2} strokeLinecap="round" />
            <Path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"
              stroke={C.muted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </Svg>
        </Pressable>
      </View>
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

      <ReorderModal
        visible={editing}
        base={profile?.plan ?? []}
        order={order}
        onDone={ord => { setOrder(ord); setEditing(false); }}
        onCancel={() => setEditing(false)}
      />

      {(profile?.rules ?? []).map((r, i) => (
        <Card key={i} style={[styles.ruleCard, i === (profile!.rules.length - 1) && { marginBottom: 24 }]}>
          <Label style={{ color: r.color }}>{r.label}</Label>
          <Text style={styles.ruleText}>{r.text}</Text>
        </Card>
      ))}
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
  ovHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  avatarText: { color: '#08110D', fontSize: 15, fontWeight: '900' },
  content: { padding: 20, paddingTop: 74, paddingBottom: 130 },
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
  glanceHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 26, marginBottom: 12 },
  editBtn: {
    width: 30, height: 30, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.card, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line,
  },
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
