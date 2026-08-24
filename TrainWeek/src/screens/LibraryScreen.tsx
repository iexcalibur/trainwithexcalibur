import React, { useState } from 'react';
import { Modal, View, Text, Pressable, ScrollView, StyleSheet, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { WebView } from 'react-native-webview';
import { MUSCLES, EXINFO, EQUIP, equipFor } from '../data/exinfo';
import { demoFor } from '../data/exdemo';
import BodyMap from '../components/BodyMap';
import { FrameLoop } from '../components/ExerciseSheet';
import { Label } from '../components/ui';
import { C } from '../theme';

/* Library home groups the muscle dictionary into browsable regions —
   same grouping as the PWA. */
const LIB_GROUPS: [string, string[]][] = [
  ['Chest & shoulders', ['chest', 'upper-chest', 'side-delts', 'front-delts', 'rear-delts', 'rotator-cuff']],
  ['Back', ['traps', 'upper-back', 'lats', 'lower-back']],
  ['Arms', ['biceps', 'triceps', 'forearms', 'grip', 'wrists']],
  ['Core', ['abs', 'lower-abs', 'obliques', 'core']],
  ['Glutes & hips', ['glutes', 'glute-med', 'adductors', 'hip-flexors', 'hips']],
  ['Legs', ['quads', 'hamstrings', 'calves', 'tibialis', 'achilles']],
  ['Joints, balance & recovery', ['ankle', 'knee', 'balance', 'plantar-fascia', 't-spine', 'mobility', 'elastic', 'cardio']],
];

const imgSearch = (q: string) =>
  `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q + ' exercise')}`;
const ytSearch = (q: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' exercise form')}`;

function exercisesFor(muscle: string): string[] {
  return Object.keys(EXINFO)
    .filter(n => (EXINFO[n].m || []).includes(muscle))
    .sort((a, b) => {
      const pa = EXINFO[a].m[0] === muscle ? 0 : 1;
      const pb = EXINFO[b].m[0] === muscle ? 0 : 1;
      return pa - pb || a.localeCompare(b);
    });
}

/* Floating topper used by both modals: round back button + title. */
function LibTopper({ title, onBack }: { title: string; onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <BlurView intensity={50} tint="dark" blurMethod="dimezisBlurViewSdk31Plus"
      style={[styles.topper, { top: insets.top + 10 }]}>
      <Pressable style={styles.topperBack} onPress={onBack} hitSlop={8} accessibilityLabel="Back">
        <Text style={styles.topperBackText}>‹</Text>
      </Pressable>
      <Text style={styles.topperTitle} numberOfLines={1}>{title}</Text>
    </BlurView>
  );
}

/* Standalone exercise page: pure knowledge, no plan coupling —
   no dose, no Mark done, no swap. Alternates that live in the
   library push onward; the rest open an image search. */
function LibraryExercise({ name, onOpen }: { name: string; onOpen: (n: string) => void }) {
  const insets = useSafeAreaInsets();
  const info = EXINFO[name] || { m: ['mobility'], alt: [] };
  const eq = equipFor(name);
  const demo = demoFor(name);

  return (
    <ScrollView
      contentContainerStyle={[styles.body, { paddingTop: insets.top + 74 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.kicker}>LIBRARY · {(MUSCLES[info.m[0]] || '').toUpperCase()}</Text>
      <Text style={styles.name}>{name}</Text>

      <Text style={styles.h}>EQUIPMENT</Text>
      <View style={styles.chips}>
        {(eq.length ? eq : ['bodyweight']).map(k => (
          <View key={k} style={styles.chip}>
            <Text style={[styles.chipText, { color: C.green }]}>{EQUIP[k] || k}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.h}>TARGETS</Text>
      <View style={styles.chips}>
        {info.m.map(k => (
          <View key={k} style={styles.chip}>
            <Text style={styles.chipText}>{MUSCLES[k] || k}</Text>
          </View>
        ))}
      </View>
      <BodyMap keys={info.m} />

      {demo && (
        <>
          <Text style={styles.h}>HOW IT LOOKS</Text>
          {demo.kind === 'frames' ? (
            <>
              <FrameLoop key={name} frames={demo.frames} name={name} />
              <Text style={styles.cap}>Silent loop · {demo.title}</Text>
            </>
          ) : (
            <>
              <View style={styles.videoStage}>
                <WebView
                  source={{ uri: demo.src }}
                  style={styles.video}
                  allowsInlineMediaPlayback
                  mediaPlaybackRequiresUserAction={false}
                  javaScriptEnabled
                  domStorageEnabled
                />
              </View>
              <Pressable onPress={() => Linking.openURL(demo.watch)}>
                <Text style={[styles.cap, styles.capLink]}>Muted loop · {demo.title}</Text>
              </Pressable>
            </>
          )}
        </>
      )}

      {info.alt.length > 0 && (
        <>
          <Text style={styles.h}>SAME MUSCLES, OTHER OPTIONS</Text>
          {info.alt.map(a => EXINFO[a] ? (
            <Pressable key={a} style={styles.alt} onPress={() => onOpen(a)}>
              <Text style={styles.altText}>{a}</Text>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          ) : (
            <Pressable key={a} style={styles.alt} onPress={() => Linking.openURL(imgSearch(a))}>
              <Text style={styles.altText}>{a} <Text style={styles.altGo}>🖼</Text></Text>
            </Pressable>
          ))}
        </>
      )}

      <View style={styles.links}>
        <Pressable style={[styles.pill, { backgroundColor: C.blue }]}
          onPress={() => Linking.openURL(ytSearch(name))}>
          <Text style={styles.pillText}>▶ Watch tutorial</Text>
        </Pressable>
        <Pressable style={[styles.pill, { backgroundColor: C.card2 }]}
          onPress={() => Linking.openURL(imgSearch(name))}>
          <Text style={[styles.pillText, { color: C.ink }]}>🖼 See images</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default function LibraryScreen() {
  const [muscle, setMuscle] = useState<string | null>(null);
  /* Alternate links push onto this stack so back walks the trail. */
  const [exStack, setExStack] = useState<string[]>([]);
  const exName = exStack.length ? exStack[exStack.length - 1] : null;

  const count = (k: string) =>
    Object.keys(EXINFO).filter(n => (EXINFO[n].m || []).includes(k)).length;

  return (
    <>
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        <Label>Knowledge base · {Object.keys(EXINFO).length} movements</Label>
        <Text style={styles.h1}>Library</Text>
        {LIB_GROUPS.map(([title, keys]) => (
          <View key={title}>
            <Label style={styles.groupLabel}>{title}</Label>
            <View style={styles.chipWrap}>
              {keys.map(k => (
                <Pressable key={k} style={styles.chip} onPress={() => setMuscle(k)}>
                  <Text style={styles.chipText}>{MUSCLES[k]}</Text>
                  <Text style={styles.chipN}>{count(k)}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Muscle list */}
      <Modal visible={!!muscle} animationType="slide" presentationStyle="fullScreen"
        onRequestClose={() => setMuscle(null)}>
        <View style={styles.root}>
          {muscle && (
            <MuscleList muscle={muscle} onOpen={n => setExStack([n])} />
          )}
          <LibTopper title={muscle ? (MUSCLES[muscle] || 'Library') : 'Library'} onBack={() => setMuscle(null)} />
        </View>
      </Modal>

      {/* Exercise page */}
      <Modal visible={!!exName} animationType="slide" presentationStyle="fullScreen"
        onRequestClose={() => setExStack(s => s.slice(0, -1))}>
        <View style={styles.root}>
          {exName && (
            <LibraryExercise name={exName} onOpen={n => setExStack(s => [...s, n])} />
          )}
          <LibTopper title="Library" onBack={() => setExStack(s => s.slice(0, -1))} />
        </View>
      </Modal>
    </>
  );
}

function MuscleList({ muscle, onOpen }: { muscle: string; onOpen: (n: string) => void }) {
  const insets = useSafeAreaInsets();
  const list = exercisesFor(muscle);
  return (
    <ScrollView contentContainerStyle={[styles.body, { paddingTop: insets.top + 74 }]}>
      <Label>Library</Label>
      <Text style={styles.h1}>{MUSCLES[muscle] || muscle}</Text>
      <Text style={styles.countLine}>
        {list.length} movement{list.length === 1 ? '' : 's'} in the knowledge base
      </Text>
      {list.map(n => (
        <Pressable key={n} style={styles.row} onPress={() => onOpen(n)}>
          <View style={styles.rowBody}>
            <Text style={styles.rowName}>
              {n}
              {EXINFO[n].m[0] === muscle ? '' : <Text style={styles.rowSec}>  SECONDARY</Text>}
            </Text>
            <Text style={styles.rowEq}>
              {(equipFor(n).map(k => EQUIP[k] || k).join(' · ')) || 'Bodyweight / floor'}
            </Text>
          </View>
          <Text style={styles.chev}>›</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingTop: 74, paddingBottom: 130 },
  body: { paddingHorizontal: 20, paddingBottom: 44 },
  h1: { color: C.ink, fontSize: 30, fontWeight: '800', marginTop: 2, marginBottom: 12 },
  groupLabel: { marginTop: 16, marginBottom: 8 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: C.card2, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: StyleSheet.hairlineWidth, borderColor: C.line,
  },
  chipText: { color: C.ink, fontSize: 11.5, fontWeight: '700' },
  chipN: { color: C.faint, fontSize: 10, fontWeight: '700' },
  countLine: { color: C.muted, fontSize: 12.5, marginBottom: 14 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.card, borderRadius: 14, padding: 13, marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth, borderColor: C.line,
  },
  rowBody: { flex: 1, minWidth: 0, gap: 2 },
  rowName: { color: C.ink, fontSize: 14, fontWeight: '700' },
  rowSec: { color: C.faint, fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
  rowEq: { color: C.muted, fontSize: 11.5 },
  chev: { color: C.faint, fontSize: 18, fontWeight: '700' },
  kicker: { color: C.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.6 },
  name: { color: C.ink, fontSize: 25, fontWeight: '800', marginTop: 3, marginBottom: 8 },
  h: { color: C.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.6, marginTop: 18, marginBottom: 8 },
  videoStage: {
    width: '100%', aspectRatio: 16 / 9, borderRadius: 14, overflow: 'hidden', backgroundColor: '#000',
  },
  video: { flex: 1, backgroundColor: '#000' },
  cap: { color: C.faint, fontSize: 10.5, textAlign: 'center', marginTop: 8 },
  capLink: { color: C.muted, textDecorationLine: 'underline' },
  alt: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line,
  },
  altText: { color: C.ink, fontSize: 13.5, fontWeight: '600', flex: 1 },
  altGo: { fontSize: 13, opacity: 0.75 },
  links: { flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: 14 },
  pill: { flex: 1, borderRadius: 999, paddingVertical: 12, alignItems: 'center' },
  pillText: { color: '#08110D', fontSize: 13, fontWeight: '800' },
  topper: {
    position: 'absolute',
    left: 16, right: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 4,
    backgroundColor: 'rgba(21, 26, 33, 0.55)',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  topperBack: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: C.card2,
    borderWidth: StyleSheet.hairlineWidth, borderColor: C.line,
    alignItems: 'center', justifyContent: 'center',
  },
  topperBackText: { color: C.ink, fontSize: 20, fontWeight: '700', marginTop: -2 },
  topperTitle: { flex: 1, color: C.ink, fontSize: 14.5, fontWeight: '800' },
});
