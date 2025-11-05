import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { useDugnads } from '../hooks/useDugnads';
import type { RootStackParamList } from './types';

export function EventDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'EventDetail'>>();
  const { user } = useAuth();
  const { dugnads, signUpForDugnad, withdrawFromDugnad, acknowledgeDugnad } = useDugnads({
    userId: user?.uid
  });
  const [loading, setLoading] = useState(false);

  const dugnad = useMemo(
    () => dugnads.find(item => item.id === route.params.dugnad.id) ?? route.params.dugnad,
    [dugnads, route.params.dugnad]
  );

  const hasJoined = user ? dugnad.participants?.includes(user.uid) : false;
  const hasAcknowledged = user ? dugnad.acknowledgements?.includes(user.uid) : false;
  const filled = dugnad.participants?.length ?? 0;

  const handleJoin = async () => {
    if (!user) return;
    try {
      setLoading(true);
      if (hasJoined) {
        await withdrawFromDugnad(dugnad.id, user.uid);
        Alert.alert('Påmelding', 'Du er fjerna frå dugnaden.');
      } else {
        await signUpForDugnad(dugnad.id, user.uid);
        Alert.alert('Påmelding', 'Du er påmeldt dugnaden.');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ukjend feil.';
      Alert.alert('Feil', message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async () => {
    if (!user || hasAcknowledged) return;
    try {
      await acknowledgeDugnad(dugnad.id, user.uid);
      Alert.alert('Takk!', 'Du har sendt ei anerkjenning til arrangøren.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ukjend feil.';
      Alert.alert('Feil', message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {dugnad.imageUrl ? <Image source={{ uri: dugnad.imageUrl }} style={styles.image} /> : null}
      <Text style={styles.title}>{dugnad.title}</Text>
      <Text style={styles.meta}>Arrangør: {dugnad.organiserName}</Text>
      <Text style={styles.meta}>Stad: {dugnad.location}</Text>
      <Text style={styles.meta}>Når: {new Date(dugnad.scheduledAt).toLocaleString()}</Text>
      <Text style={styles.meta}>
        {filled} av {dugnad.requiredVolunteers} frivillige påmeldt
      </Text>
      <Text style={styles.sectionHeading}>Skildring</Text>
      <Text style={styles.description}>{dugnad.description}</Text>

      <Text style={styles.sectionHeading}>Deltakarar</Text>
      <Text style={styles.description}>
        {dugnad.participants?.length ? dugnad.participants.join(', ') : 'Ingen påmeldingar enno.'}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, hasJoined ? styles.secondaryButton : styles.primaryButton]}
          onPress={handleJoin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{hasJoined ? 'Trekk deg' : 'Meld deg på'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.outlineButton, hasAcknowledged && styles.disabledButton]}
          onPress={handleAcknowledge}
          disabled={hasAcknowledged}
        >
          <Text style={[styles.buttonText, styles.outlineButtonText]}>
            {hasAcknowledged ? 'Anerkjenna' : 'Send anerkjenning'}
          </Text>
        </TouchableOpacity>
      </View>
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
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 16
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0E4C92',
    marginBottom: 8
  },
  meta: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4
  },
  sectionHeading: {
    marginTop: 18,
    marginBottom: 8,
    fontWeight: '700',
    fontSize: 16,
    color: '#0E4C92'
  },
  description: {
    fontSize: 15,
    color: '#1f2937'
  },
  actions: {
    flexDirection: 'row',
    marginTop: 24
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 12
  },
  primaryButton: {
    backgroundColor: '#0E4C92'
  },
  secondaryButton: {
    backgroundColor: '#dc2626'
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600'
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#0E4C92',
    backgroundColor: 'transparent'
  },
  outlineButtonText: {
    color: '#0E4C92'
  },
  disabledButton: {
    opacity: 0.6
  }
});
