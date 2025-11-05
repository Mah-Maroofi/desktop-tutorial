import { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../hooks/useAuth';
import { useDugnads } from '../hooks/useDugnads';

export function CreateDugnadScreen() {
  const { user } = useAuth();
  const { createDugnad } = useDugnads({ userId: user?.uid });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Generelt');
  const [location, setLocation] = useState('');
  const [volunteers, setVolunteers] = useState('10');
  const [date, setDate] = useState(new Date());
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const ensurePermission = async (permission: ImagePicker.PermissionResponse) => {
    if (!permission.granted) {
      Alert.alert('Tilgang nekta', 'Vi treng løyve til bilete for å knytte bilete til dugnaden.');
      return false;
    }
    return true;
  };

  const handleSelectImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!(await ensurePermission(permission))) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleCaptureImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!(await ensurePermission(permission))) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!title || !description || !location) {
      Alert.alert('Manglar informasjon', 'Fyll inn tittel, skildring og stad.');
      return;
    }

    try {
      setSubmitting(true);
      await createDugnad(
        {
          title,
          description,
          category,
          location,
          requiredVolunteers: Number.parseInt(volunteers, 10),
          scheduledAt: date.toISOString(),
          imageUri
        },
        user.uid,
        user.displayName ?? user.email ?? 'Ukjend arrangør'
      );
      Alert.alert('Ny dugnad', 'Dugnaden er publisert.');
      setTitle('');
      setDescription('');
      setLocation('');
      setVolunteers('10');
      setImageUri(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ukjend feil.';
      Alert.alert('Feil', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Opprett dugnad</Text>
      <TextInput placeholder="Tittel" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput
        placeholder="Skildring"
        style={[styles.input, styles.multiline]}
        value={description}
        multiline
        numberOfLines={4}
        onChangeText={setDescription}
      />
      <TextInput placeholder="Kategori" style={styles.input} value={category} onChangeText={setCategory} />
      <TextInput placeholder="Stad" style={styles.input} value={location} onChangeText={setLocation} />
      <TextInput
        placeholder="Tal på frivillige"
        style={styles.input}
        value={volunteers}
        onChangeText={setVolunteers}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateButtonText}>Vel dato og tid: {date.toLocaleString()}</Text>
      </TouchableOpacity>
      {showDatePicker ? (
        <DateTimePicker
          value={date}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      ) : null}
      <View style={styles.imageButtons}>
        <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
          <Text style={styles.imageButtonText}>Galleri</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={handleCaptureImage}>
          <Text style={styles.imageButtonText}>Kamera</Text>
        </TouchableOpacity>
      </View>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}
      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitText}>{submitting ? 'Publiserer…' : 'Publiser dugnad'}</Text>
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
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0E4C92',
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#d6d9de',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff'
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top'
  },
  dateButton: {
    padding: 12,
    backgroundColor: '#0E4C92',
    borderRadius: 12,
    marginBottom: 12
  },
  dateButtonText: {
    color: '#ffffff',
    fontWeight: '600'
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  imageButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#0E4C92',
    borderRadius: 12,
    marginHorizontal: 4
  },
  imageButtonText: {
    color: '#0E4C92',
    fontWeight: '600',
    textAlign: 'center'
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12
  },
  submitButton: {
    padding: 14,
    backgroundColor: '#0E4C92',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32
  },
  submitText: {
    color: '#ffffff',
    fontWeight: '700'
  },
  disabledButton: {
    opacity: 0.7
  }
});
