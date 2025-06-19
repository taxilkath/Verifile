import { useState, useEffect } from 'react';

interface Document {
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
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar?: string;
  lastActive: string;
  status: 'active' | 'pending' | 'inactive';
}

interface SharedLink {
  id: string;
  name: string;
  url: string;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  views: number;
  isActive: boolean;
  permissions: string[];
}

interface ActivityItem {
  id: string;
  type: 'view' | 'download' | 'upload' | 'share' | 'invite' | 'edit';
  user: string;
  action: string;
  target?: string;
  timestamp: string;
  metadata?: any;
}

interface DataRoom {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
  documentCount: number;
  memberCount: number;
  totalViews: number;
  status: 'active' | 'archived' | 'draft';
}

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Financial Report Q4 2024.pdf',
    type: 'application/pdf',
    size: 2456789,
    uploadedBy: 'John Smith',
    uploadedAt: '2024-01-15T10:30:00Z',
    url: 'https://example.com/doc1.pdf',
    views: 247,
    downloads: 89,
    description: 'Quarterly financial report with detailed analysis'
  },
  {
    id: '2',
    name: 'Investment Deck.pptx',
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    size: 5678901,
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2024-01-14T14:20:00Z',
    url: 'https://example.com/doc2.pptx',
    views: 156,
    downloads: 67,
    description: 'Series A investment presentation'
  },
  {
    id: '3',
    name: 'Legal Agreement.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 1234567,
    uploadedBy: 'Mike Wilson',
    uploadedAt: '2024-01-13T09:15:00Z',
    url: 'https://example.com/doc3.docx',
    views: 89,
    downloads: 34,
    description: 'Partnership agreement draft'
  }
];

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@company.com',
    role: 'owner',
    lastActive: '2 minutes ago',
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'admin',
    lastActive: '1 hour ago',
    status: 'active'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@company.com',
    role: 'editor',
    lastActive: '3 hours ago',
    status: 'active'
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa@investor.com',
    role: 'viewer',
    lastActive: '1 day ago',
    status: 'pending'
  }
];

const mockSharedLinks: SharedLink[] = [
  {
    id: '1',
    name: 'Investor Access Link',
    url: 'https://verifile.com/share/abc123',
    createdBy: 'John Smith',
    createdAt: '2024-01-15T10:30:00Z',
    expiresAt: '2024-02-15T10:30:00Z',
    views: 45,
    isActive: true,
    permissions: ['view', 'download']
  },
  {
    id: '2',
    name: 'Board Review Link',
    url: 'https://verifile.com/share/def456',
    createdBy: 'Sarah Johnson',
    createdAt: '2024-01-14T14:20:00Z',
    views: 23,
    isActive: true,
    permissions: ['view']
  }
];

const mockActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'view',
    user: 'investor@fund.com',
    action: 'viewed',
    target: 'Financial Report Q4 2024.pdf',
    timestamp: '2024-01-15T15:30:00Z'
  },
  {
    id: '2',
    type: 'download',
    user: 'sarah@company.com',
    action: 'downloaded',
    target: 'Investment Deck.pptx',
    timestamp: '2024-01-15T14:20:00Z'
  },
  {
    id: '3',
    type: 'upload',
    user: 'john@company.com',
    action: 'uploaded',
    target: 'Legal Agreement.docx',
    timestamp: '2024-01-15T13:15:00Z'
  },
  {
    id: '4',
    type: 'invite',
    user: 'john@company.com',
    action: 'invited',
    target: 'lisa@investor.com',
    timestamp: '2024-01-15T12:00:00Z'
  }
];

export const useDataRoom = (id?: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataRoom, setDataRoom] = useState<DataRoom | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchDataRoom = async () => {
      if (!id) {
        setError('No data room ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data room info
        const mockDataRoom: DataRoom = {
          id: id,
          name: 'Series A Fundraising',
          description: 'Due diligence materials and financial projections for our Series A round',
          createdBy: 'John Smith',
          createdAt: '2024-01-10T10:00:00Z',
          lastUpdated: '2024-01-15T15:30:00Z',
          documentCount: mockDocuments.length,
          memberCount: mockTeamMembers.length,
          totalViews: mockDocuments.reduce((sum, doc) => sum + doc.views, 0),
          status: 'active'
        };

        setDataRoom(mockDataRoom);
        setDocuments(mockDocuments);
        setTeamMembers(mockTeamMembers);
        setSharedLinks(mockSharedLinks);
        setActivity(mockActivity);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data room');
        console.error('Error fetching data room:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDataRoom();
  }, [id]);

  return {
    dataRoom,
    documents,
    teamMembers,
    sharedLinks,
    activity,
    loading,
    error
  };
};