import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { dayTotal, exId, Section, Exercise, TagKey } from '../data/plan';
import { useStore, elapsedSec } from '../store';
import Ring from '../components/Ring';
import { Card, Label, Tag, fmtClock } from '../components/ui';
import { C } from '../theme';
import ExerciseSheet from '../components/ExerciseSheet';

const REST_PRESETS = [60, 90, 120];

export default function DayScreen({ dayId }: { dayId: string }) {
  const { plan } = useStore();
  const day = plan.find(d => d.id === dayId)!;
  const store = useStore();
  const { progress, toggle, resetDay, active, startSession, pauseSession, resumeSession, endSession, swaps, setSwap } = store;

  const total = dayTotal(day);
  const done = useMemo(
    () => Object.keys(progress).filter(k => k.startsWith(day.id + '-')).length,
    [progress, day.id]
  );

  // ticking clock for session + rest timers
  const [now, setNow] = useState(Date.now());
  const [restEnd, setRestEnd] = useState<number | null>(null);
  const [restLen, setRestLen] = useState(90);
  const [sheet, setSheet] = useState<{ ex: Exercise; section: string; tag?: TagKey; id: string } | null>(null);
  const sessionRunning = active?.dayId === day.id && active.startedAt !== null;
  const sessionHere = active?.dayId === day.id;
  const needsTick = sessionRunning || restEnd !== null;

  useEffect(() => {
    if (!needsTick) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [needsTick]);

  const restLeft = restEnd ? Math.max(0, Math.ceil((restEnd - now) / 1000)) : 0;
  useEffect(() => {
    if (restEnd !== null && restLeft === 0) {
      setRestEnd(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  }, [restLeft, restEnd]);

  const elapsed = sessionHere ? elapsedSec(active) : 0;
  const [lo, hi] = day.targetMin;
  const targetPct = Math.min(1, elapsed / (hi * 60));
  const overTarget = elapsed > hi * 60;

  const onToggle = (id: string) => {
    toggle(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const confirmEnd = () => {
    Alert.alert('End session?', `Log ${fmtClock(elapsed)} for ${day.name} (${done}/${total} exercises done)?`, [
      { text: 'Keep going', style: 'cancel' },
      { text: 'End & log', style: 'default', onPress: endSession },
    ]);
  };

  return (
    <View style={styles.root}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Label>{day.name} · {day.time}</Label>
            <Text style={styles.h1}>{day.focus}</Text>
            <Text style={styles.sub}>{day.subtitle}</Text>
          </View>
          <Ring size={72} stroke={7} progress={total ? done / total : 0} color={done >= total ? C.green : C.blue}>
            <Text style={styles.headerRingText}>{done}</Text>
            <Text style={styles.headerRingSub}>/{total}</Text>
          </Ring>
        </View>

        {/* Session timer */}
        <Card style={styles.timerCard}>
          <View style={styles.timerRow}>
            <View>
              <Label style={{ color: sessionRunning ? C.blue : C.muted }}>
                {sessionHere ? (sessionRunning ? 'Session · live' : 'Session · paused') : 'Session'}
              </Label>
              <Text style={[styles.clock, overTarget && { color: C.amber }]}>{fmtClock(elapsed)}</Text>
              <Text style={styles.timerTarget}>target {lo}–{hi} min</Text>
            </View>
            <View style={styles.timerBtns}>
              {!sessionHere && (
                <Btn label="Start" color={C.green} onPress={() => startSession(day.id)} />
              )}
              {sessionHere && sessionRunning && (
                <Btn label="Pause" color={C.blue} onPress={pauseSession} />
              )}
              {sessionHere && !sessionRunning && (
                <Btn label="Resume" color={C.blue} onPress={resumeSession} />
              )}
              {sessionHere && <Btn label="End" color={C.red} onPress={confirmEnd} />}
            </View>
          </View>
          <View style={styles.timerBar}>
            <View style={[styles.timerBarFill, { width: `${targetPct * 100}%`, backgroundColor: overTarget ? C.amber : C.blue }]} />
          </View>
          {active && active.dayId !== day.id && (
            <Text style={styles.otherSession}>
              A session is running on {plan.find(d => d.id === active.dayId)?.name ?? active.dayId} — end it there first.
            </Text>
          )}
        </Card>

        {/* Rest timer */}
        <Card style={styles.restCard}>
          <View style={styles.restRow}>
            <Label>Rest</Label>
            {restEnd === null ? (
              <View style={styles.restBtns}>
                {REST_PRESETS.map(s => (
                  <Btn key={s} label={`${s}s`} color={C.card2} ink={C.ink}
                    onPress={() => { setRestLen(s); setRestEnd(Date.now() + s * 1000); }} />
                ))}
              </View>
            ) : (
              <View style={styles.restBtns}>
                <Text style={styles.restClock}>{restLeft}s</Text>
                <Btn label="Skip" color={C.card2} ink={C.muted} onPress={() => setRestEnd(null)} />
              </View>
            )}
          </View>
          {restEnd !== null && (
            <View style={styles.timerBar}>
              <View style={[styles.timerBarFill, { width: `${(restLeft / restLen) * 100}%`, backgroundColor: C.green }]} />
            </View>
          )}
        </Card>

        {day.sections.map((sec, si) => (
          <SectionCard key={si} day={day.id} sec={sec} si={si} progress={progress} swaps={swaps} onToggle={onToggle}
            onOpen={(ex, id) => setSheet({ ex, section: sec.title, tag: sec.tag, id })} />
        ))}

        <Card style={styles.cutCard}>
          <Label style={{ color: C.amber }}>Short on time?</Label>
          <Text style={styles.cutText}>{day.cut}</Text>
        </Card>
      </ScrollView>

      <ExerciseSheet
        visible={sheet !== null}
        exercise={sheet?.ex ?? null}
        dayName={day.name}
        sectionTitle={sheet?.section ?? ''}
        sectionTag={sheet?.tag}
        checked={sheet ? !!progress[sheet.id] : false}
        swappedName={sheet ? swaps[sheet.id] ?? null : null}
        onSwap={alt => sheet && setSwap(sheet.id, alt)}
        onToggle={() => sheet && onToggle(sheet.id)}
        onClose={() => setSheet(null)}
      />
    </View>
  );
}

function SectionCard({ day, sec, si, progress, swaps, onToggle, onOpen }:
  { day: string; sec: Section; si: number; progress: Record<string, boolean>;
    swaps: Record<string, string>;
    onToggle: (id: string) => void; onOpen: (ex: Exercise, id: string) => void }) {
  const [open, setOpen] = useState(true);
  const done = sec.items.filter((_, ii) => progress[exId(day, si, ii)]).length;
  return (
    <Card style={styles.section}>
      <Pressable style={styles.sectionHead} onPress={() => setOpen(o => !o)}>
        <View style={styles.sectionIndex}><Text style={styles.sectionIndexText}>{si + 1}</Text></View>
        <View style={{ flex: 1 }}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>{sec.title.toUpperCase()}</Text>
            {sec.tag && <Tag k={sec.tag} />}
          </View>
          {sec.meta && <Text style={styles.sectionMeta}>{sec.meta}</Text>}
        </View>
        <Text style={[styles.sectionCount, done === sec.items.length && { color: C.green }]}>
          {done}/{sec.items.length} {open ? '▾' : '▸'}
        </Text>
      </Pressable>
      {open && sec.items.map((it, ii) => {
        const id = exId(day, si, ii);
        const checked = !!progress[id];
        return (
          <Pressable key={ii} style={styles.ex} onPress={() => onOpen(it, id)}>
            <Pressable
              onPress={() => onToggle(id)}
              hitSlop={10}
              style={[styles.check, checked && styles.checkOn]}
            >
              {checked && <Text style={styles.checkMark}>✓</Text>}
            </Pressable>
            <View style={{ flex: 1 }}>
              <View style={styles.exNameRow}>
                <Text style={[styles.exName, checked && styles.exDone]}>{swaps[id] ?? it.name}</Text>
                {!swaps[id] && it.tags?.map(t => <Tag key={t} k={t} />)}
              </View>
              {swaps[id]
                ? <Text style={[styles.exNote, styles.swapNote, checked && { opacity: 0.5 }]}>⇄ Swapped in for {it.name}</Text>
                : it.note ? <Text style={[styles.exNote, checked && { opacity: 0.5 }]}>{it.note}</Text> : null}
            </View>
            <Text style={[styles.exDose, checked && styles.exDone]}>{it.dose}</Text>
            <Text style={styles.exChev}>›</Text>
          </Pressable>
        );
      })}
      {open && sec.note && <Text style={styles.secNote}>{sec.note}</Text>}
      {open && sec.callout && (
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>{sec.callout.title.toUpperCase()}</Text>
          <Text style={styles.calloutBody}>{sec.callout.body}</Text>
        </View>
      )}
    </Card>
  );
}

function Btn({ label, color, ink, onPress }: { label: string; color: string; ink?: string; onPress: () => void }) {
  const dark = ink ?? (color === C.card2 ? C.ink : '#08110D');
  return (
    <Pressable style={[styles.btn, { backgroundColor: color }]} onPress={onPress}>
      <Text style={[styles.btnText, { color: dark }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingTop: 74, paddingBottom: 130 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  back: { color: C.blue, fontSize: 15, fontWeight: '700' },
  reset: { color: C.faint, fontSize: 13, fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  h1: { color: C.ink, fontSize: 28, fontWeight: '800', marginTop: 2 },
  sub: { color: C.muted, fontSize: 12.5, marginTop: 3 },
  headerRingText: { color: C.ink, fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] },
  headerRingSub: { color: C.faint, fontSize: 10, fontWeight: '700' },
  timerCard: { marginBottom: 10 },
  timerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clock: { color: C.ink, fontSize: 40, fontWeight: '800', fontVariant: ['tabular-nums'], marginVertical: 2 },
  timerTarget: { color: C.faint, fontSize: 11.5 },
  timerBtns: { gap: 8, alignItems: 'flex-end' },
  timerBar: { height: 5, borderRadius: 3, backgroundColor: C.track, marginTop: 12 },
  timerBarFill: { height: 5, borderRadius: 3 },
  otherSession: { color: C.amber, fontSize: 12, marginTop: 10 },
  restCard: { marginBottom: 14, paddingVertical: 12 },
  restRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  restBtns: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  restClock: { color: C.green, fontSize: 22, fontWeight: '800', fontVariant: ['tabular-nums'], marginRight: 4 },
  btn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  btnText: { fontSize: 13, fontWeight: '800' },
  section: { marginBottom: 12, padding: 0, overflow: 'hidden' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  sectionIndex: { width: 22, height: 22, borderRadius: 6, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center' },
  sectionIndexText: { color: C.green, fontSize: 12, fontWeight: '800' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { color: C.ink, fontSize: 13, fontWeight: '800', letterSpacing: 1.2 },
  sectionMeta: { color: C.faint, fontSize: 11.5, marginTop: 1 },
  sectionCount: { color: C.muted, fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'] },
  ex: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  check: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: C.faint, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: C.green, borderColor: C.green },
  checkMark: { color: '#08110D', fontSize: 13, fontWeight: '900' },
  exNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  exName: { color: C.ink, fontSize: 14, fontWeight: '600' },
  exNote: { color: C.muted, fontSize: 12, marginTop: 2, lineHeight: 17 },
  exDose: { color: C.blue, fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'], maxWidth: 96, textAlign: 'right' },
  exDone: { textDecorationLine: 'line-through', opacity: 0.45 },
  exChev: { color: C.faint, fontSize: 18, fontWeight: '700', marginLeft: 2 },
  swapNote: { color: C.green },
  secNote: { color: C.faint, fontSize: 12, lineHeight: 17, padding: 14, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  callout: { margin: 14, marginTop: 10, padding: 12, borderRadius: 10, backgroundColor: '#241F12', borderLeftWidth: 3, borderLeftColor: C.amber },
  calloutTitle: { color: C.amber, fontSize: 10.5, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  calloutBody: { color: C.muted, fontSize: 12.5, lineHeight: 18 },
  cutCard: { gap: 6, marginBottom: 10 },
  cutText: { color: C.muted, fontSize: 13, lineHeight: 19 },
});
