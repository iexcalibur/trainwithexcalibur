import React, { useEffect, useRef, useState } from 'react';
import {
  Modal, View, Text, Pressable, ScrollView, StyleSheet, Image,
  Animated, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  visible, exercise, dayName, sectionTitle, sectionTag, checked,
  swappedName, onSwap, onToggle, onClose,
}: {
  visible: boolean;
  exercise: Exercise | null;
  dayName: string;
  sectionTitle: string;
  sectionTag?: TagKey;
  checked: boolean;
  swappedName: string | null;
  onSwap: (alt: string | null) => void;
  onToggle: () => void;
  onClose: () => void;
}) {
  if (!exercise) return null;

  const shownName = swappedName ?? exercise.name;
  /* Alternates target the same muscles, so a swapped exercise keeps
     the original's muscle map and alternates list. */
  const info = exinfoFor(exercise.name, sectionTag);
  const demo = demoFor(shownName);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.topBar}>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.backBtn}>‹ Back</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={styles.kicker}>{dayName.toUpperCase()} · {sectionTitle.toUpperCase()}</Text>
          <Text style={styles.name}>{shownName}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.dose}>{exercise.dose}</Text>
            {!swappedName && exercise.tags?.map(t => <Tag key={t} k={t} />)}
          </View>
          {swappedName ? (
            <View style={styles.swapBanner}>
              <Text style={styles.swapBannerText}>⇄ Swapped in for {exercise.name}</Text>
              <Pressable style={styles.useBtn} onPress={() => onSwap(null)}>
                <Text style={styles.useBtnText}>Revert</Text>
              </Pressable>
            </View>
          ) : exercise.note ? <Text style={styles.note}>{exercise.note}</Text> : null}

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
                  <FrameLoop key={shownName} frames={demo.frames} name={shownName} />
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

          {(info.alt.length > 0 || swappedName) && (
            <>
              <Text style={styles.h}>{swappedName ? 'SWAP OPTIONS' : 'SAME MUSCLES, OTHER OPTIONS'}</Text>
              {swappedName && (
                <View style={styles.alt}>
                  <Text style={styles.altIcon}>↺</Text>
                  <Pressable style={{ flex: 1 }} onPress={() => Linking.openURL(imgSearch(exercise.name))}>
                    <Text style={styles.altText}>{exercise.name} <Text style={styles.altOrig}>(original)</Text></Text>
                  </Pressable>
                  <Pressable style={styles.useBtn} onPress={() => onSwap(null)}>
                    <Text style={styles.useBtnText}>Use</Text>
                  </Pressable>
                </View>
              )}
              {info.alt.filter(a => a !== swappedName).map(a => (
                <View key={a} style={styles.alt}>
                  <Text style={styles.altIcon}>↺</Text>
                  <Pressable style={{ flex: 1 }} onPress={() => Linking.openURL(imgSearch(a))}>
                    <Text style={styles.altText}>{a} <Text style={styles.altGo}>🖼</Text></Text>
                  </Pressable>
                  <Pressable style={styles.useBtn} onPress={() => onSwap(a)}>
                    <Text style={styles.useBtnText}>Use instead</Text>
                  </Pressable>
                </View>
              ))}
            </>
          )}

          <View style={styles.links}>
            <Pressable style={[styles.pill, { backgroundColor: C.blue }]}
              onPress={() => Linking.openURL(ytSearch(shownName))}>
              <Text style={styles.pillText}>▶ Watch tutorial</Text>
            </Pressable>
            <Pressable style={[styles.pill, { backgroundColor: C.card2 }]}
              onPress={() => Linking.openURL(imgSearch(shownName))}>
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
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  topBar: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 10 },
  backBtn: { color: C.blue, fontSize: 15, fontWeight: '700' },
  body: { paddingHorizontal: 20, paddingBottom: 44 },
  kicker: { color: C.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.6 },
  name: { color: C.ink, fontSize: 25, fontWeight: '800', marginTop: 3, marginBottom: 8 },
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
  altOrig: { color: C.faint, fontSize: 11.5 },
  useBtn: {
    backgroundColor: C.card2, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: StyleSheet.hairlineWidth, borderColor: C.line,
  },
  useBtnText: { color: C.green, fontSize: 11.5, fontWeight: '800' },
  swapBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10,
    marginTop: 10, padding: 11, borderRadius: 10,
    backgroundColor: '#12312A', borderLeftWidth: 3, borderLeftColor: C.green,
  },
  swapBannerText: { color: C.muted, fontSize: 12.5, flexShrink: 1 },
  links: { flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: 14 },
  pill: { flex: 1, borderRadius: 999, paddingVertical: 12, alignItems: 'center' },
  pillText: { color: '#08110D', fontSize: 13, fontWeight: '800' },
  doneBtn: { borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  doneText: { color: '#08110D', fontSize: 14.5, fontWeight: '800' },
});
