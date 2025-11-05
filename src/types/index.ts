export interface DugnadTask {
  id: string;
  title: string;
  description: string;
  requiredVolunteers: number;
  completedVolunteers: number;
}

export interface Dugnad {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  scheduledAt: string;
  requiredVolunteers: number;
  imageUrl?: string;
  organiserId: string;
  organiserName: string;
  participants: string[];
  acknowledgements: string[];
  progressUpdates: string[];
  createdAt: number;
}

export interface DugnadInput {
  title: string;
  description: string;
  category: string;
  location: string;
  scheduledAt: string;
  requiredVolunteers: number;
  imageUri?: string | null;
}

export interface DugnadParticipantMeta {
  uid: string;
  displayName: string;
  joinedAt: number;
}
