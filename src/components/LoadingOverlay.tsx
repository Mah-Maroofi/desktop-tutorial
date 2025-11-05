import { ActivityIndicator, StyleSheet, View } from 'react-native';

export function LoadingOverlay() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0E4C92" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  }
});
