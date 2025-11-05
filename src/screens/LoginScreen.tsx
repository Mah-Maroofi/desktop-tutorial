import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import type { RootStackParamList } from './types';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login } = useAuth();

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await login(email.trim(), password);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ukjend feil.';
      Alert.alert('Innlogging feila', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      accessibilityLabel="Innlogging"
    >
      <View style={styles.card}>
        <Text style={styles.title}>Velkomen til DugnadHub</Text>
        <TextInput
          style={styles.input}
          placeholder="E-post"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Passord"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>{submitting ? 'Loggar inn…' : 'Logg inn'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Har du ikkje brukar? Registrer deg</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f1f5f9'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    color: '#0E4C92'
  },
  input: {
    borderWidth: 1,
    borderColor: '#d6d9de',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16
  },
  button: {
    backgroundColor: '#0E4C92',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600'
  },
  link: {
    textAlign: 'center',
    color: '#0E4C92',
    fontWeight: '600'
  }
});
