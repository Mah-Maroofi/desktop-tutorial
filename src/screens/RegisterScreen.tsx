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

export function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { register } = useAuth();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Passord', 'Passorda er ikkje like.');
      return;
    }

    try {
      setSubmitting(true);
      await register(email.trim(), password, displayName.trim());
      Alert.alert('Registrering', 'Kontoen er oppretta. Du er no innlogga.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ukjend feil.';
      Alert.alert('Registrering feila', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      accessibilityLabel="Registrering"
    >
      <View style={styles.card}>
        <Text style={styles.title}>Lag ny DugnadHub-konto</Text>
        <TextInput
          style={styles.input}
          placeholder="Fullt namn"
          value={displayName}
          onChangeText={setDisplayName}
        />
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
        <TextInput
          style={styles.input}
          placeholder="Bekreft passord"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>{submitting ? 'Registrerer…' : 'Registrer deg'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Allereie brukar? Logg inn</Text>
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
