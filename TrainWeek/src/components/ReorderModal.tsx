import React, { useRef, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, PanResponder, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Day } from '../data/plan';
import { C } from '../theme';

const ROW_H = 72;

/* Drag workouts between fixed weekday slots. The weekday rail on the
   left never moves; only the workout cards reorder. */
export default function ReorderModal({
  visible, base, order, onDone, onCancel,
}: {
  visible: boolean;
  base: Day[];                       // canonical plan (weekday slots + workouts)
  order: string[];                   // current workout ids in slot order
  onDone: (ord: string[]) => void;
  onCancel: () => void;
}) {
  const [seq, setSeq] = useState<string[]>(order);
  const [drag, setDrag] = useState<{ from: number; to: number } | null>(null);
  const dragY = useRef(new Animated.Value(0)).current;
  const dragRef = useRef<{ from: number; to: number } | null>(null);

  // Re-sync working copy whenever the modal opens.
  const wasVisible = useRef(false);
  if (visible && !wasVisible.current) setSeq(order);
  wasVisible.current = visible;

  const byId = new Map(base.map(d => [d.id, d]));

  const makeResponder = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        dragRef.current = { from: index, to: index };
        setDrag({ from: index, to: index });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      },
      onPanResponderMove: (_, g) => {
        dragY.setValue(g.dy);
        const to = Math.max(0, Math.min(seq.length - 1, index + Math.round(g.dy / ROW_H)));
        if (dragRef.current && dragRef.current.to !== to) {
          dragRef.current = { from: index, to };
          setDrag({ from: index, to });
        }
      },
      onPanResponderRelease: () => {
        const d = dragRef.current;
        if (d && d.to !== d.from) {
          const next = [...seq];
          const [moved] = next.splice(d.from, 1);
          next.splice(d.to, 0, moved);
          setSeq(next);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        dragRef.current = null;
        setDrag(null);
        dragY.setValue(0);
      },
      onPanResponderTerminate: () => {
        dragRef.current = null;
        setDrag(null);
        dragY.setValue(0);
      },
    });

  const shiftFor = (i: number): number => {
    if (!drag || i === drag.from) return 0;
    if (drag.from < drag.to && i > drag.from && i <= drag.to) return -ROW_H;
    if (drag.from > drag.to && i >= drag.to && i < drag.from) return ROW_H;
    return 0;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <View style={styles.backdrop} />
      <View style={styles.sheet}>
        <Text style={styles.title}>Edit week order</Text>
        <Text style={styles.hint}>
          Drag a workout up or down — the weekdays stay put. Your checkmarks move with the workout.
        </Text>

        <View style={{ height: seq.length * ROW_H }}>
          {seq.map((wid, i) => {
            const w = byId.get(wid)!;
            const isDragging = drag?.from === i;
            const responder = makeResponder(i);
            return (
              <Animated.View
                key={wid}
                {...responder.panHandlers}
                style={[
                  styles.row,
                  { top: i * ROW_H },
                  isDragging
                    ? { transform: [{ translateY: dragY }], zIndex: 5, elevation: 5 }
                    : { transform: [{ translateY: shiftFor(i) }] },
                ]}
              >
                <View style={styles.dayRail}>
                  <Text style={styles.dayLabel}>{base[i].short}</Text>
                </View>
                <View style={[styles.card, isDragging && styles.cardDragging]}>
                  <Text style={styles.grip}>≡</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.focus}>{w.focus}</Text>
                    <Text style={styles.sub} numberOfLines={1}>{w.subtitle}</Text>
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Pressable style={[styles.btn, { backgroundColor: C.card2 }]} onPress={onCancel}>
            <Text style={[styles.btnText, { color: C.ink }]}>Cancel</Text>
          </Pressable>
          <Pressable style={[styles.btn, { backgroundColor: C.green }]} onPress={() => onDone(seq)}>
            <Text style={styles.btnText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(4,6,9,0.6)' },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: C.card,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    borderWidth: StyleSheet.hairlineWidth, borderColor: C.line,
    padding: 20, paddingBottom: 34,
  },
  title: { color: C.ink, fontSize: 19, fontWeight: '800' },
  hint: { color: C.faint, fontSize: 12, lineHeight: 17, marginTop: 6, marginBottom: 16 },
  row: {
    position: 'absolute', left: 0, right: 0, height: ROW_H,
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 10,
  },
  dayRail: { width: 44, alignItems: 'center' },
  dayLabel: { color: C.green, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  card: {
    flex: 1, height: ROW_H - 10,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.card2, borderRadius: 14, paddingHorizontal: 14,
    borderWidth: StyleSheet.hairlineWidth, borderColor: C.line,
  },
  cardDragging: { borderColor: C.green, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  grip: { color: C.faint, fontSize: 17, fontWeight: '700' },
  focus: { color: C.ink, fontSize: 15, fontWeight: '800' },
  sub: { color: C.muted, fontSize: 11.5, marginTop: 1 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  btn: { flex: 1, borderRadius: 999, paddingVertical: 13, alignItems: 'center' },
  btnText: { color: '#08110D', fontSize: 14, fontWeight: '800' },
});
