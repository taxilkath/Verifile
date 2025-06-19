export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  thumbnail?: string;
  description?: string;
  views: number;
  downloads: number;
  dataRoom: string;
  tags: string[];
  folderId?: string;
}

export interface Folder {
  id: string;
  name: string;
  emoji?: string;
  documents: Document[];
  createdAt: string;
  dataRoom: string;
}

export interface UploadProgress {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}