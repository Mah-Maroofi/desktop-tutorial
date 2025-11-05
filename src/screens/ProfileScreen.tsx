import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { fetchUserProfile } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const data = await fetchUserProfile(user.uid);
        setProfile(data);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Ukjend feil.';
        Alert.alert('Profil', message);
      }
    };

    loadProfile();
  }, [user]);

  const stats = profile?.stats as { completed?: number; upcoming?: number; ongoing?: number } | undefined;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.avatar}>{user?.displayName?.[0]?.toUpperCase() ?? '?'}</Text>
        <View>
          <Text style={styles.name}>{user?.displayName ?? 'Utan namn'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Dine bidrag</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsRow}>
        <StatCard label="Fullførte" value={stats?.completed ?? 0} />
        <StatCard label="Kjem" value={stats?.upcoming ?? 0} />
        <StatCard label="Pågår" value={stats?.ongoing ?? 0} />
      </ScrollView>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          logout().catch(error => {
            const message = error instanceof Error ? error.message : 'Ukjend feil.';
            Alert.alert('Utlogging', message);
          });
        }}
      >
        <Text style={styles.logoutText}>Logg ut</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  content: {
    padding: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0E4C92',
    color: '#ffffff',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 28,
    fontWeight: '700',
    marginRight: 12
  },
  name: {
    fontSize: 20,
    fontWeight: '700'
  },
  email: {
    color: '#475569'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#0E4C92'
  },
  statsRow: {
    marginBottom: 24
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: '700'
  }
});
