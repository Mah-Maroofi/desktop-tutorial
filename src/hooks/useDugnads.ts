import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db, storage } from '../firebase/config';
import type { Dugnad, DugnadInput } from '../types';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { decode as atob } from 'base-64';

interface UseDugnadsOptions {
  userId?: string;
}

function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function useDugnads({ userId }: UseDugnadsOptions) {
  const [dugnads, setDugnads] = useState<Dugnad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'dugnads'), orderBy('scheduledAt', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const parsed: Dugnad[] = snapshot.docs.map(docSnapshot => ({
          id: docSnapshot.id,
          ...(docSnapshot.data() as Dugnad)
        }));
        setDugnads(parsed);
        setLoading(false);
      },
      err => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const signUpForDugnad = async (dugnadId: string, uid: string) => {
    const dugnadRef = doc(db, 'dugnads', dugnadId);
    await updateDoc(dugnadRef, {
      participants: arrayUnion(uid)
    });
  };

  const withdrawFromDugnad = async (dugnadId: string, uid: string) => {
    const dugnadRef = doc(db, 'dugnads', dugnadId);
    await updateDoc(dugnadRef, {
      participants: arrayRemove(uid)
    });
  };

  const acknowledgeDugnad = async (dugnadId: string, uid: string) => {
    const dugnadRef = doc(db, 'dugnads', dugnadId);
    await updateDoc(dugnadRef, {
      acknowledgements: arrayUnion(uid)
    });
  };

  const uploadImage = async (uri: string, organiserId: string) => {
    if (!uri) return null;

    if (Platform.OS === 'web' && uri.startsWith('data:')) {
      return uri;
    }

    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64
    });
    const bytes = base64ToUint8Array(base64);
    const storageRef = ref(storage, `dugnads/${organiserId}/${Date.now()}.jpg`);
    await uploadBytes(storageRef, bytes, { contentType: 'image/jpeg' });
    return getDownloadURL(storageRef);
  };

  const createDugnad = async (input: DugnadInput, organiserId: string, organiserName: string) => {
    let imageUrl: string | undefined;

    if (input.imageUri) {
      imageUrl = (await uploadImage(input.imageUri, organiserId)) ?? undefined;
    }

    await addDoc(collection(db, 'dugnads'), {
      title: input.title,
      description: input.description,
      category: input.category,
      location: input.location,
      scheduledAt: input.scheduledAt,
      requiredVolunteers: input.requiredVolunteers,
      imageUrl,
      organiserId,
      organiserName,
      participants: [],
      acknowledgements: [],
      progressUpdates: [],
      createdAt: serverTimestamp()
    });
  };

  return {
    dugnads,
    loading,
    error,
    signUpForDugnad,
    withdrawFromDugnad,
    acknowledgeDugnad,
    createDugnad
  };
}
