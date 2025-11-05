import { StyleSheet, Text, View } from 'react-native';

interface Props {
  label: string;
  value: string | number;
}

export function StatCard({ label, value }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0E4C92',
    padding: 16,
    borderRadius: 12,
    minWidth: 120,
    marginRight: 12
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff'
  },
  label: {
    fontSize: 14,
    color: '#dbe7ff'
  }
});
