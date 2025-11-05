import { StyleSheet, Text, View } from 'react-native';

interface Props {
  message: string;
}

export function ErrorState({ message }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oi! Noko gjekk gale.</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff5f5',
    borderRadius: 12
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#b00020',
    marginBottom: 6
  },
  message: {
    color: '#5c2c2c'
  }
});
