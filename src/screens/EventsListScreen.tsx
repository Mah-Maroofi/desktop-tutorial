import { useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventCard } from '../components/EventCard';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ErrorState } from '../components/ErrorState';
import { useDugnads } from '../hooks/useDugnads';
import { useAuth } from '../hooks/useAuth';
import type { RootStackParamList } from './types';

export function EventsListScreen() {
  const { user } = useAuth();
  const { dugnads, loading, error } = useDugnads({ userId: user?.uid });
  const [query, setQuery] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    if (!lower) return dugnads;
    return dugnads.filter(item =>
      [item.title, item.location, item.category].some(value =>
        value?.toLowerCase().includes(lower)
      )
    );
  }, [query, dugnads]);

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorState message={error} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Kommende dugnader</Text>
      <TextInput
        placeholder="Søk etter stad, tittel eller kategori"
        value={query}
        onChangeText={setQuery}
        style={styles.search}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={<Text style={styles.emptyText}>Ingen dugnader funne.</Text>}
        renderItem={({ item }) => (
          <EventCard dugnad={item} onPress={() => navigation.navigate('EventDetail', { dugnad: item })} />
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => undefined} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc'
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0E4C92',
    marginBottom: 12
  },
  search: {
    borderWidth: 1,
    borderColor: '#d6d9de',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280'
  }
});
