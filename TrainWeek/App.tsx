import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StoreProvider, useStore } from './src/store';
import WeekScreen from './src/screens/WeekScreen';
import DayScreen from './src/screens/DayScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { C } from './src/theme';

type Tab = 'week' | 'today' | 'history';

function todayDayId(): string {
  const id = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];
  return ['mon', 'tue', 'wed', 'thu', 'fri'].includes(id) ? id : 'mon';
}

function Root() {
  const { ready, active } = useStore();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('week');
  const [openedDay, setOpenedDay] = useState<string | null>(null);

  if (!ready) return <View style={styles.root} />;

  let content: React.ReactNode;
  if (openedDay) {
    content = <DayScreen dayId={openedDay} goBack={() => setOpenedDay(null)} />;
  } else if (tab === 'week') {
    content = <WeekScreen openDay={setOpenedDay} />;
  } else if (tab === 'today') {
    content = <DayScreen dayId={todayDayId()} />;
  } else {
    content = <HistoryScreen />;
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'week', label: 'Overview', icon: '◎' },
    { key: 'today', label: 'Today', icon: '▶' },
    { key: 'history', label: 'History', icon: '≡' },
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>{content}</View>
      <View style={[styles.nav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {tabs.map(t => {
          const activeTab = !openedDay && tab === t.key;
          return (
            <Pressable
              key={t.key}
              style={styles.navBtn}
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
      </View>
    </SafeAreaView>
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  nav: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
    backgroundColor: C.card,
  },
  navBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, gap: 2 },
  navIcon: { color: C.faint, fontSize: 17 },
  navLabel: { color: C.faint, fontSize: 10.5, fontWeight: '700', letterSpacing: 0.6 },
});
