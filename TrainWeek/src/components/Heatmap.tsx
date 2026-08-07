import React, { useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Session } from '../store';
import { Day } from '../data/plan';
import { Card, Label, fmtClock } from './ui';
import { C } from '../theme';

const WEEKS = 26;
const CELL = 12;
const GAP = 3;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_ABBR = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];

const LEVELS = ['#232A33', '#14503A', '#157F58', '#19B27A', C.green];

const isoOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function level(pct: number): number {
  if (pct <= 0) return 0;
  if (pct < 0.5) return 1;
  if (pct < 0.75) return 2;
  if (pct < 1) return 3;
  return 4;
}

interface Cell { iso: string; lvl: number; future: boolean; today: boolean; label: string }

export default function Heatmap({ sessions, plan }: { sessions: Session[]; plan: Day[] }) {
  const [detail, setDetail] = useState<string | null>(null);
  const scroller = useRef<ScrollView>(null);

  const { columns, months } = useMemo(() => {
    const byDate = new Map<string, { pct: number; dur: number; days: string[] }>();
    for (const s of sessions) {
      const cur = byDate.get(s.date) ?? { pct: 0, dur: 0, days: [] };
      cur.pct = Math.max(cur.pct, s.total ? s.done / s.total : 0);
      cur.dur += s.durationSec;
      const day = plan.find(d => d.id === s.dayId);
      cur.days.push(day ? day.focus : s.dayId);
      byDate.set(s.date, cur);
    }

    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const todayIso = isoOf(today);
    const mondayIdx = (today.getDay() + 6) % 7;
    const start = new Date(today);
    start.setDate(today.getDate() - mondayIdx - (WEEKS - 1) * 7);

    const cols: Cell[][] = [];
    const mons: string[] = [];
    let lastMonth = -1;

    for (let w = 0; w < WEEKS; w++) {
      const colStart = new Date(start);
      colStart.setDate(start.getDate() + w * 7);
      const m = colStart.getMonth();
      mons.push(m !== lastMonth ? MONTHS[m] : '');
      lastMonth = m;

      const col: Cell[] = [];
      for (let d = 0; d < 7; d++) {
        const cur = new Date(start);
        cur.setDate(start.getDate() + w * 7 + d);
        const iso = isoOf(cur);
        const hit = byDate.get(iso);
        col.push({
          iso,
          lvl: hit ? level(hit.pct) : 0,
          future: iso > todayIso,
          today: iso === todayIso,
          label: hit
            ? `${iso} · ${hit.days.join(', ')} · ${Math.round(hit.pct * 100)}% · ${fmtClock(hit.dur)}`
            : `${iso} · rest`,
        });
      }
      cols.push(col);
    }
    return { columns: cols, months: mons };
  }, [sessions, plan]);

  return (
    <Card style={styles.card}>
      <Label>Training heatmap · last {WEEKS} weeks</Label>

      <View style={styles.row}>
        {/* pinned day labels */}
        <View style={styles.days}>
          <View style={{ height: 15 }} />
          {DAY_ABBR.map((d, i) => (
            <Text key={i} style={styles.dayLabel}>{d}</Text>
          ))}
        </View>

        <ScrollView
          ref={scroller}
          horizontal
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={() => scroller.current?.scrollToEnd({ animated: false })}
        >
          <View>
            <View style={styles.monthRow}>
              {months.map((m, i) => (
                m ? (
                  <Text key={i} style={[styles.monthLabel, { left: i * (CELL + GAP) }]}>{m}</Text>
                ) : null
              ))}
            </View>
            <View style={styles.grid}>
              {columns.map((col, ci) => (
                <View key={ci} style={styles.col}>
                  {col.map(c => (
                    <Pressable
                      key={c.iso}
                      onPress={() => !c.future && setDetail(c.label)}
                      style={[
                        styles.cell,
                        { backgroundColor: LEVELS[c.lvl] },
                        c.future && { opacity: 0.25 },
                        c.today && styles.todayCell,
                      ]}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={styles.foot}>
        <Text style={styles.detail} numberOfLines={1}>
          {detail ?? 'Tap a square for that day'}
        </Text>
        <View style={styles.legend}>
          <Text style={styles.legendText}>Less</Text>
          {LEVELS.map((c, i) => (
            <View key={i} style={[styles.legendCell, { backgroundColor: c }]} />
          ))}
          <Text style={styles.legendText}>More</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 12 },
  row: { flexDirection: 'row', marginTop: 12 },
  days: { width: 26, gap: GAP },
  dayLabel: { color: C.faint, fontSize: 8.5, height: CELL, lineHeight: CELL },
  monthRow: { height: 15, position: 'relative' },
  monthLabel: { position: 'absolute', top: 0, color: C.faint, fontSize: 9 },
  grid: { flexDirection: 'row', gap: GAP },
  col: { gap: GAP },
  cell: { width: CELL, height: CELL, borderRadius: 3 },
  todayCell: { borderWidth: 1.5, borderColor: C.muted },
  foot: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    gap: 10, marginTop: 12, flexWrap: 'wrap',
  },
  detail: { color: C.muted, fontSize: 11, flexShrink: 1 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  legendText: { color: C.faint, fontSize: 9.5 },
  legendCell: { width: 10, height: 10, borderRadius: 2.5 },
});
