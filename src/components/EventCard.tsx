import { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Dugnad } from '../types';

interface Props {
  dugnad: Dugnad;
  onPress: () => void;
}

function formatDate(dateIso: string) {
  const date = new Date(dateIso);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function EventCardComponent({ dugnad, onPress }: Props) {
  const filled = dugnad.participants?.length ?? 0;
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} accessibilityRole="button">
      {dugnad.imageUrl ? <Image source={{ uri: dugnad.imageUrl }} style={styles.image} /> : null}
      <View style={styles.content}>
        <Text style={styles.title}>{dugnad.title}</Text>
        <Text style={styles.meta}>{formatDate(dugnad.scheduledAt)}</Text>
        <Text style={styles.meta}>{dugnad.location}</Text>
        <Text style={styles.meta}>
          {filled} / {dugnad.requiredVolunteers} frivillige
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export const EventCard = memo(EventCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8
  },
  image: {
    width: '100%',
    height: 160
  },
  content: {
    padding: 16
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1a1a1a'
  },
  meta: {
    fontSize: 14,
    color: '#4a4a4a',
    marginBottom: 2
  }
});
