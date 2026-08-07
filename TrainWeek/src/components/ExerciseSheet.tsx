import React, { useEffect, useRef, useState } from 'react';
import {
  Modal, View, Text, Pressable, ScrollView, StyleSheet, Image,
  Animated, Linking, useWindowDimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';
import { Exercise, TagKey } from '../data/plan';
import { MUSCLES, exinfoFor } from '../data/exinfo';
import { demoFor } from '../data/exdemo';
import BodyMap from './BodyMap';
import { Tag } from './ui';
import { C } from '../theme';

const imgSearch = (q: string) =>
  `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q + ' exercise')}`;
const ytSearch = (q: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' exercise form')}`;

/* Silent loop: two frames (start ⇄ end) swapped on a timer. */
function FrameLoop({ frames, name }: { frames: [string, string]; name: string }) {
  const fade = useRef(new Animated.Value(0)).current;
  const [second, setSecond] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSecond(s => !s), 800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: second ? 1 : 0,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [second, fade]);

  return (
    <View style={styles.stage}>
      <Image source={{ uri: frames[0] }} style={styles.frame} resizeMode="cover"
        accessibilityLabel={`${name} — start position`} />
      <Animated.Image source={{ uri: frames[1] }} style={[styles.frame, { opacity: fade }]}
        resizeMode="cover" accessibilityLabel={`${name} — end position`} />
    </View>
  );
}

export default function ExerciseSheet({
  visible, exercise, dayName, sectionTitle, sectionTag, checked, onToggle, onClose,
}: {
  visible: boolean;
  exercise: Exercise | null;
  dayName: string;
  sectionTitle: string;
  sectionTag?: TagKey;
  checked: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const { height } = useWindowDimensions();
  if (!exercise) return null;

  const info = exinfoFor(exercise.name, sectionTag);
  const demo = demoFor(exercise.name);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { maxHeight: height * 0.88 }]}>
        <View style={styles.grab} />
        <Pressable style={styles.close} onPress={onClose} hitSlop={12}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={styles.kicker}>{dayName.toUpperCase()} · {sectionTitle.toUpperCase()}</Text>
          <Text style={styles.name}>{exercise.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.dose}>{exercise.dose}</Text>
            {exercise.tags?.map(t => <Tag key={t} k={t} />)}
          </View>
          {exercise.note ? <Text style={styles.note}>{exercise.note}</Text> : null}

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
                  <FrameLoop frames={demo.frames} name={exercise.name} />
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
              {info.alt.map(a => (
                <Pressable key={a} style={styles.alt} onPress={() => Linking.openURL(imgSearch(a))}>
                  <Text style={styles.altIcon}>↺</Text>
                  <Text style={styles.altText}>{a}</Text>
                  <Text style={styles.altGo}>🖼</Text>
                </Pressable>
              ))}
            </>
          )}

          <View style={styles.links}>
            <Pressable style={[styles.pill, { backgroundColor: C.blue }]}
              onPress={() => Linking.openURL(ytSearch(exercise.name))}>
              <Text style={styles.pillText}>▶ Watch tutorial</Text>
            </Pressable>
            <Pressable style={[styles.pill, { backgroundColor: C.card2 }]}
              onPress={() => Linking.openURL(imgSearch(exercise.name))}>
              <Text style={[styles.pillText, { color: C.ink }]}>🖼 See images</Text>
            </Pressable>
          </View>

          <Pressable
            style={[styles.doneBtn, { backgroundColor: checked ? C.card2 : C.green }]}
            onPress={() => {
              onToggle();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            }}
          >
            <Text style={[styles.doneText, checked && { color: C.ink }]}>
              {checked ? '✓ Done — tap to undo' : 'Mark as done'}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(4,6,9,0.6)' },
  sheet: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: C.card,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    borderWidth: StyleSheet.hairlineWidth, borderColor: C.line,
    paddingTop: 10,
  },
  grab: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.line, alignSelf: 'center', marginBottom: 10 },
  close: { position: 'absolute', top: 14, right: 16, zIndex: 2, padding: 4 },
  closeText: { color: C.faint, fontSize: 15, fontWeight: '700' },
  body: { paddingHorizontal: 20, paddingBottom: 34 },
  kicker: { color: C.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.6 },
  name: { color: C.ink, fontSize: 21, fontWeight: '800', marginTop: 3, marginBottom: 8, paddingRight: 30 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  dose: { color: C.blue, fontSize: 14, fontWeight: '800', fontVariant: ['tabular-nums'] },
  note: { color: C.muted, fontSize: 13.5, lineHeight: 20, marginTop: 10 },
  h: { color: C.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.6, marginTop: 18, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: C.card2, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: StyleSheet.hairlineWidth, borderColor: C.line,
  },
  chipText: { color: C.ink, fontSize: 11.5, fontWeight: '700' },
  stage: {
    width: '100%', aspectRatio: 4 / 3, borderRadius: 14, overflow: 'hidden',
    backgroundColor: '#fff', borderWidth: StyleSheet.hairlineWidth, borderColor: C.line,
  },
  frame: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  videoStage: {
    width: '100%', aspectRatio: 16 / 9, borderRadius: 14, overflow: 'hidden', backgroundColor: '#000',
  },
  video: { flex: 1, backgroundColor: '#000' },
  cap: { color: C.faint, fontSize: 10.5, textAlign: 'center', marginTop: 8 },
  capLink: { color: C.muted, textDecorationLine: 'underline' },
  alt: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line,
  },
  altIcon: { color: C.green, fontSize: 13.5, fontWeight: '800' },
  altText: { color: C.ink, fontSize: 13.5, flex: 1 },
  altGo: { fontSize: 13, opacity: 0.75 },
  links: { flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: 14 },
  pill: { flex: 1, borderRadius: 999, paddingVertical: 12, alignItems: 'center' },
  pillText: { color: '#08110D', fontSize: 13, fontWeight: '800' },
  doneBtn: { borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  doneText: { color: '#08110D', fontSize: 14.5, fontWeight: '800' },
});
