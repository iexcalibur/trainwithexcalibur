import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';
import { StoreProvider, useStore } from './src/store';
import LoginScreen from './src/screens/LoginScreen';
import WeekScreen from './src/screens/WeekScreen';
import DayScreen from './src/screens/DayScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { C } from './src/theme';

type Tab = 'week' | 'today' | 'history';

const CHROME_BG = 'rgba(21, 26, 33, 0.55)';

function Root() {
  const { ready, active, profile, plan, signOut, resetDay } = useStore();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('week');
  const [openedDay, setOpenedDay] = useState<string | null>(null);

  if (!ready) return <View style={styles.root} />;

  /* No profile chosen yet — ask who's training. */
  if (!profile) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <StatusBar style="light" />
        <LoginScreen />
      </SafeAreaView>
    );
  }

  const todayDayId = () => {
    const wd = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];
    const slot = plan.find(d => d.slotId === wd);
    return slot ? slot.id : plan[0].id;   // workout assigned to today's slot
  };

  /* The day shown right now (pushed from the week, or the Today tab). */
  const currentDayId = openedDay ?? (tab === 'today' ? todayDayId() : null);
  const currentDay = currentDayId ? plan.find(d => d.id === currentDayId) : null;

  let content: React.ReactNode;
  if (openedDay) {
    content = <DayScreen dayId={openedDay} />;
  } else if (tab === 'week') {
    content = <WeekScreen openDay={setOpenedDay} />;
  } else if (tab === 'today') {
    content = <DayScreen dayId={todayDayId()} />;
  } else {
    content = <HistoryScreen />;
  }

  const confirmReset = () => {
    if (!currentDay) return;
    Alert.alert('Reset day?', `Uncheck every exercise for ${currentDay.name}.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => resetDay(currentDay.id) },
    ]);
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'week', label: 'Overview', icon: '◎' },
    { key: 'today', label: 'Today', icon: '▶' },
    { key: 'history', label: 'History', icon: '≡' },
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>{content}</View>

      {/* Floating topper */}
      <BlurView intensity={50} tint="dark" blurMethod="dimezisBlurViewSdk31Plus"
        style={[styles.topper, { top: insets.top + 10 }]}>
        {currentDay ? (
          <>
            {openedDay ? (
              <Pressable style={styles.topperBack} onPress={() => setOpenedDay(null)} hitSlop={8}>
                <Text style={styles.topperBackText}>‹</Text>
              </Pressable>
            ) : (
              <Brand />
            )}
            <Text style={styles.topperTitle} numberOfLines={1}>
              {currentDay.name}
            </Text>
            <Pressable style={styles.topperAction} onPress={confirmReset} hitSlop={8}>
              <Text style={styles.topperActionText}>Reset</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Brand />
            <View style={{ flex: 1 }} />
            <Pressable
              style={[styles.topperAvatar, { backgroundColor: profile.color }]}
              onPress={signOut}
              accessibilityLabel="Switch profile"
            >
              <Text style={styles.topperAvatarText}>{profile.name[0]}</Text>
            </Pressable>
          </>
        )}
      </BlurView>

      {/* Floating pill nav */}
      <BlurView intensity={50} tint="dark" blurMethod="dimezisBlurViewSdk31Plus"
        style={[styles.nav, { bottom: Math.max(12, insets.bottom - 16) }]}>
        {tabs.map(t => {
          const activeTab = !openedDay && tab === t.key;
          return (
            <Pressable
              key={t.key}
              style={[styles.navBtn, activeTab && styles.navBtnActive]}
              onPress={() => { setOpenedDay(null); setTab(t.key); }}
            >
              <Text style={[styles.navIcon, activeTab && { color: C.green }]}>
                {t.icon}
                {t.key === 'today' && active ? ' ·' : ''}
              </Text>
              <Text style={[styles.navLabel, activeTab && { color: C.ink }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </BlurView>
    </SafeAreaView>
  );
}

function Brand() {
  return (
    <View style={styles.brand}>
      <Svg viewBox="0 0 24 24" width={15} height={15}>
        <Path d="M3 12h12M11 5l7 7-7 7" stroke={C.green} strokeWidth={2.6}
          fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <Text style={styles.brandText}>Running Arrow</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Root />
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const chrome = {
  backgroundColor: CHROME_BG,
  borderRadius: 999,
  overflow: 'hidden' as const,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: C.line,
  shadowColor: '#000',
  shadowOpacity: 0.45,
  shadowRadius: 15,
  shadowOffset: { width: 0, height: 10 },
  elevation: 12,
} as const;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  topper: {
    position: 'absolute',
    left: 16, right: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    /* 4px all round: with a 44px control the circle sits concentric
       inside the pill's rounded end, so the ring of gap is even. */
    padding: 4,
    ...chrome,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 12 },
  brandText: { color: C.ink, fontSize: 12, fontWeight: '800', letterSpacing: 1.6, textTransform: 'uppercase' },
  topperBack: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: C.card2,
    borderWidth: StyleSheet.hairlineWidth, borderColor: C.line,
    alignItems: 'center', justifyContent: 'center',
  },
  topperBackText: { color: C.ink, fontSize: 20, fontWeight: '700', marginTop: -2 },
  topperTitle: { flex: 1, color: C.ink, fontSize: 14.5, fontWeight: '800' },
  topperAction: {
    height: 42, justifyContent: 'center',
    paddingHorizontal: 16, borderRadius: 999,
    backgroundColor: C.card2,
    borderWidth: StyleSheet.hairlineWidth, borderColor: C.line,
  },
  topperActionText: { color: C.muted, fontSize: 12.5, fontWeight: '700' },
  topperAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  topperAvatarText: { color: '#08110D', fontSize: 14, fontWeight: '900' },

  nav: {
    position: 'absolute',
    left: 16, right: 16,
    flexDirection: 'row',
    padding: 6,
    ...chrome,
  },
  navBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, gap: 1, borderRadius: 999 },
  navBtnActive: { backgroundColor: C.card2 },
  navIcon: { color: C.faint, fontSize: 16 },
  navLabel: { color: C.faint, fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
});
