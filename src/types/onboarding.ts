export interface Organization {
  id: string;
  name: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  organization_id?: string;
  full_name?: string;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface DataRoom {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TeamInvitation {
  id: string;
  organization_id: string;
  email: string;
  invited_by: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export interface OnboardingData {
  organizationName: string;
  logoFile?: File;
  logoPreview?: string;
  dataRoomName: string;
  dataRoomDescription: string;
  teamInvites: string[];
}