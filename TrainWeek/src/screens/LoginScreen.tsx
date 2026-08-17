import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { PROFILES } from '../profiles';
import { useStore } from '../store';
import { Label } from '../components/ui';
import { C } from '../theme';

export default function LoginScreen() {
  const { selectProfile } = useStore();
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Label>Running Arrow</Label>
      <Text style={styles.h1}>Who's training?</Text>

      {PROFILES.map(p => (
        <Pressable key={p.id} style={styles.card} onPress={() => selectProfile(p.id)}>
          <View style={[styles.avatar, { backgroundColor: p.color }]}>
            <Text style={styles.avatarText}>{p.name[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{p.name}</Text>
            <Text style={styles.sub}>{p.tagline}</Text>
          </View>
          <Text style={styles.chev}>›</Text>
        </Pressable>
      ))}

      <Text style={styles.note}>
        Progress, sessions and history are saved separately for each profile on this device.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingTop: 70 },
  h1: { color: C.ink, fontSize: 30, fontWeight: '800', marginTop: 2, marginBottom: 22 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
    padding: 18,
    marginBottom: 12,
  },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#08110D', fontSize: 19, fontWeight: '900' },
  name: { color: C.ink, fontSize: 17, fontWeight: '800' },
  sub: { color: C.muted, fontSize: 12.5, marginTop: 2 },
  chev: { color: C.faint, fontSize: 22, fontWeight: '700' },
  note: { color: C.faint, fontSize: 12, textAlign: 'center', marginTop: 16, lineHeight: 18 },
});
