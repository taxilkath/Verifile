import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as Progress from '@radix-ui/react-progress';
import {
  ArrowLeft,
  FolderOpen,
  Share2,
  Settings,
  MoreVertical,
  Upload,
  Search,
  Filter,
  Grid3X3,
  List,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Code,
  Download,
  Eye,
  Trash2,
  Plus,
  Users,
  Link as LinkIcon,
  Activity,
  BarChart3,
  Calendar,
  Clock,
  User,
  Mail,
  Shield,
  Globe,
  Lock,
  Copy,
  ExternalLink,
  Edit3,
  UserPlus,
  Crown,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { toast } from 'sonner';
import DocumentPreviewModal from '../components/DocumentPreviewModal';

// Mock data
const mockDataRoom = {
  id: '1',
  name: 'Series A Fundraising',
  description: 'Due diligence materials and financial projections for our Series A funding round. This data room contains confidential information including financial statements, legal documents, and strategic plans.',
  status: 'active' as const,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T15:30:00Z',
  documentsCount: 24,
  viewersCount: 12,
  totalViews: 247,
  gradient: 'from-blue-600 via-purple-600 to-cyan-600'
};

const mockDocuments = [
  {
    id: '1',
    name: 'Financial_Projections_2024.pdf',
    type: 'application/pdf',
    size: 2048576,
    uploadedBy: 'Sarah Chen',
    uploadedAt: '2024-01-20T10:30:00Z',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnail: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    views: 45,
    downloads: 12,
    description: 'Detailed financial projections for the next 3 years including revenue forecasts and expense breakdowns.'
  },
  {
    id: '2',
    name: 'Pitch_Deck_Final.pdf',
    type: 'application/pdf',
    size: 5242880,
    uploadedBy: 'Marcus Rodriguez',
    uploadedAt: '2024-01-19T14:15:00Z',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnail: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    views: 78,
    downloads: 23,
    description: 'Company pitch deck with market analysis, business model, and growth strategy.'
  },
  {
    id: '3',
    name: 'Legal_Documents.zip',
    type: 'application/zip',
    size: 10485760,
    uploadedBy: 'Emily Watson',
    uploadedAt: '2024-01-18T09:45:00Z',
    url: '#',
    views: 23,
    downloads: 8,
    description: 'Collection of legal documents including incorporation papers and contracts.'
  },
  {
    id: '4',
    name: 'Market_Research_Report.pdf',
    type: 'application/pdf',
    size: 3145728,
    uploadedBy: 'David Kim',
    uploadedAt: '2024-01-17T16:20:00Z',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnail: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    views: 34,
    downloads: 15,
    description: 'Comprehensive market research and competitive analysis report.'
  }
];

const mockSharedLinks = [
  {
    id: '1',
    name: 'Investor Access Link',
    url: 'https://verifile.com/share/abc123',
    createdAt: '2024-01-15T10:00:00Z',
    expiresAt: '2024-02-15T10:00:00Z',
    views: 45,
    status: 'active' as const,
    permissions: ['view', 'download'],
    password: true
  },
  {
    id: '2',
    name: 'Board Member Review',
    url: 'https://verifile.com/share/def456',
    createdAt: '2024-01-18T14:30:00Z',
    expiresAt: '2024-01-25T14:30:00Z',
    views: 12,
    status: 'active' as const,
    permissions: ['view'],
    password: false
  },
  {
    id: '3',
    name: 'Legal Team Access',
    url: 'https://verifile.com/share/ghi789',
    createdAt: '2024-01-10T09:15:00Z',
    expiresAt: '2024-01-20T09:15:00Z',
    views: 8,
    status: 'expired' as const,
    permissions: ['view', 'download', 'comment'],
    password: true
  }
];

const mockActivity = [
  {
    id: '1',
    type: 'document_viewed',
    user: 'john@investor.com',
    document: 'Financial_Projections_2024.pdf',
    timestamp: '2024-01-20T15:30:00Z',
    details: 'Viewed for 5 minutes'
  },
  {
    id: '2',
    type: 'document_downloaded',
    user: 'sarah@boardmember.com',
    document: 'Pitch_Deck_Final.pdf',
    timestamp: '2024-01-20T14:15:00Z',
    details: 'Downloaded successfully'
  },
  {
    id: '3',
    type: 'link_accessed',
    user: 'mike@legal.com',
    document: 'Investor Access Link',
    timestamp: '2024-01-20T13:45:00Z',
    details: 'Accessed via shared link'
  },
  {
    id: '4',
    type: 'document_uploaded',
    user: 'emily@company.com',
    document: 'Market_Research_Report.pdf',
    timestamp: '2024-01-20T11:20:00Z',
    details: 'New document added'
  },
  {
    id: '5',
    type: 'user_invited',
    user: 'admin@company.com',
    document: 'david@analyst.com',
    timestamp: '2024-01-20T10:00:00Z',
    details: 'Invited as viewer'
  }
];

const mockTeamMembers = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    lastActive: '2024-01-20T15:30:00Z',
    status: 'active'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    email: 'marcus@company.com',
    role: 'editor',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    lastActive: '2024-01-20T14:15:00Z',
    status: 'active'
  },
  {
    id: '3',
    name: 'Emily Watson',
    email: 'emily@company.com',
    role: 'viewer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    lastActive: '2024-01-19T16:45:00Z',
    status: 'active'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@investor.com',
    role: 'viewer',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    lastActive: '2024-01-18T12:30:00Z',
    status: 'pending'
  }
];

const analyticsData = [
  { date: '2024-01-14', views: 12, downloads: 3, uniqueVisitors: 8 },
  { date: '2024-01-15', views: 18, downloads: 5, uniqueVisitors: 12 },
  { date: '2024-01-16', views: 25, downloads: 8, uniqueVisitors: 15 },
  { date: '2024-01-17', views: 32, downloads: 12, uniqueVisitors: 18 },
  { date: '2024-01-18', views: 28, downloads: 9, uniqueVisitors: 16 },
  { date: '2024-01-19', views: 35, downloads: 15, uniqueVisitors: 22 },
  { date: '2024-01-20', views: 42, downloads: 18, uniqueVisitors: 25 }
];

const documentTypeData = [
  { name: 'PDFs', value: 45, color: '#3B82F6' },
  { name: 'Images', value: 25, color: '#10B981' },
  { name: 'Videos', value: 20, color: '#F59E0B' },
  { name: 'Others', value: 10, color: '#EF4444' }
];

const DataRoomDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('documents');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);

  // Animated counters
  const [viewsCount, setViewsCount] = useState(0);
  const [downloadsCount, setDownloadsCount] = useState(0);
  const [visitorsCount, setVisitorsCount] = useState(0);

  useEffect(() => {
    // Animate counters
    const animateCounter = (target: number, setter: (value: number) => void) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 30);
    };

    if (activeTab === 'analytics') {
      animateCounter(247, setViewsCount);
      animateCounter(89, setDownloadsCount);
      animateCounter(156, setVisitorsCount);
    }
  }, [activeTab]);

  const filteredDocuments = mockDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    if (type.includes('image')) return Image;
    if (type.includes('video')) return Video;
    if (type.includes('audio')) return Music;
    if (type.includes('zip') || type.includes('rar')) return Archive;
    if (type.includes('code') || type.includes('text')) return Code;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document_viewed': return Eye;
      case 'document_downloaded': return Download;
      case 'document_uploaded': return Upload;
      case 'link_accessed': return LinkIcon;
      case 'user_invited': return UserPlus;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'document_viewed': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'document_downloaded': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'document_uploaded': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      case 'link_accessed': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'user_invited': return 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-900/30';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown;
      case 'editor': return Edit3;
      case 'viewer': return Eye;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      case 'editor': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'viewer': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-900/30';
    }
  };

  const handleDocumentClick = (documentIndex: number) => {
    setCurrentDocumentIndex(documentIndex);
    setIsPreviewOpen(true);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      toast.success('File upload functionality would be implemented here');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <nav className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
          <Link to="/dashboard/data-rooms" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Data Rooms
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900 dark:text-white font-medium">{mockDataRoom.name}</span>
        </nav>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden"
      >
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-r ${mockDataRoom.gradient} opacity-10`}></div>
        
        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className={`p-4 bg-gradient-to-r ${mockDataRoom.gradient} rounded-2xl shadow-lg`}>
                <FolderOpen className="h-8 w-8 text-white" />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                  {mockDataRoom.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-3xl leading-relaxed mb-4">
                  {mockDataRoom.description}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created {formatDate(mockDataRoom.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Updated {formatDate(mockDataRoom.updatedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>{mockDataRoom.documentsCount} documents</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{mockDataRoom.viewersCount} viewers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="group bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 backdrop-blur-sm border border-white/20 dark:border-slate-600/50 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              
              <button className="group bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 backdrop-blur-sm border border-white/20 dark:border-slate-600/50 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
              
              <button className="group bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 backdrop-blur-sm border border-white/20 dark:border-slate-600/50 text-slate-700 dark:text-slate-300 p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs.List className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto">
            {[
              { value: 'documents', label: 'Documents', icon: FileText },
              { value: 'analytics', label: 'Analytics', icon: BarChart3 },
              { value: 'shared-links', label: 'Shared Links', icon: LinkIcon },
              { value: 'activity', label: 'Activity Log', icon: Activity },
              { value: 'team', label: 'Team Access', icon: Users }
            ].map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className="group relative flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-400 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white whitespace-nowrap"
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {activeTab === tab.value && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </motion.div>

        {/* Documents Tab */}
        <Tabs.Content value="documents" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Documents Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Documents</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {filteredDocuments.length} of {mockDocuments.length} documents
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Upload Button */}
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </button>
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-800/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <Upload className={`h-12 w-12 mx-auto mb-4 ${dragActive ? 'text-blue-500' : 'text-slate-400'}`} />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {dragActive ? 'Drop files here' : 'Drag and drop files here'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  or click to browse files
                </p>
                <button className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                  Browse Files
                </button>
              </div>
            </div>

            {/* Documents Grid/List */}
            <AnimatePresence mode="wait">
              {viewMode === 'grid' ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredDocuments.map((document, index) => {
                    const FileIcon = getFileIcon(document.type);
                    return (
                      <motion.div
                        key={document.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden cursor-pointer"
                        onClick={() => handleDocumentClick(index)}
                      >
                        {/* Thumbnail */}
                        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center relative overflow-hidden">
                          {document.thumbnail ? (
                            <img
                              src={document.thumbnail}
                              alt={document.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileIcon className="h-12 w-12 text-slate-400" />
                          )}
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-2">
                              <button className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors">
                                <Download className="h-4 w-4" />
                              </button>
                              <button className="p-2 bg-white/90 dark:bg-slate-800/90 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors">
                                <Share2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-semibold text-slate-900 dark:text-white truncate mb-1">
                            {document.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                            {formatFileSize(document.size)} • {formatDate(document.uploadedAt)}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Eye className="h-3 w-3" />
                                <span>{document.views}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Download className="h-3 w-3" />
                                <span>{document.downloads}</span>
                              </div>
                            </div>
                            <span>{document.uploadedBy}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Uploaded By
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Views
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredDocuments.map((document, index) => {
                          const FileIcon = getFileIcon(document.type);
                          return (
                            <motion.tr
                              key={document.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200 cursor-pointer"
                              onClick={() => handleDocumentClick(index)}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                    <FileIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                                      {document.name}
                                    </div>
                                    {document.description && (
                                      <div className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-md">
                                        {document.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                                {formatFileSize(document.size)}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                                {document.uploadedBy}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                {formatDate(document.uploadedAt)}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-1">
                                    <Eye className="h-3 w-3 text-slate-400" />
                                    <span>{document.views}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Download className="h-3 w-3 text-slate-400" />
                                    <span>{document.downloads}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                                    <Download className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                                    <Share2 className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Tabs.Content>

        {/* Analytics Tab */}
        <Tabs.Content value="analytics" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Analytics Header */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Analytics</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Track document engagement and user activity
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Views</p>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                      {viewsCount.toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-1 mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 text-sm font-medium">+12.5%</span>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">vs last week</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 dark:text-green-400 text-sm font-medium">Downloads</p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                      {downloadsCount.toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-1 mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 text-sm font-medium">+8.2%</span>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">vs last week</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Unique Visitors</p>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                      {visitorsCount.toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-1 mt-2">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-red-600 dark:text-red-400 text-sm font-medium">-2.1%</span>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">vs last week</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Activity Over Time
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748B' }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748B' }}
                      />
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          border: 'none', 
                          borderRadius: '8px',
                          color: '#F1F5F9'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                      />
                      <Area
                        type="monotone"
                        dataKey="downloads"
                        stroke="#10B981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorDownloads)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Document Types Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Document Types
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={documentTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {documentTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          border: 'none', 
                          borderRadius: '8px',
                          color: '#F1F5F9'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {documentTypeData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </Tabs.Content>

        {/* Shared Links Tab */}
        <Tabs.Content value="shared-links" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Shared Links Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Shared Links</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage public access links to your data room
                </p>
              </div>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Link</span>
              </button>
            </div>

            {/* Shared Links List */}
            <div className="space-y-4">
              {mockSharedLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {link.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          link.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {link.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <code className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded text-sm text-slate-700 dark:text-slate-300 flex-1 truncate">
                          {link.url}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(link.url);
                            toast.success('Link copied to clipboard');
                          }}
                          className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{link.views} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created {formatDate(link.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Expires {formatDate(link.expiresAt)}</span>
                        </div>
                        {link.password && (
                          <div className="flex items-center space-x-1">
                            <Lock className="h-4 w-4" />
                            <span>Password protected</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 mt-3">
                        {link.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Tabs.Content>

        {/* Activity Log Tab */}
        <Tabs.Content value="activity" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Activity Header */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Activity Log</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Track all user interactions and document activities
              </p>
            </div>

            {/* Activity Feed */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6">
                <div className="space-y-6">
                  {mockActivity.map((activity, index) => {
                    const ActivityIcon = getActivityIcon(activity.type);
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-4 group hover:bg-slate-50 dark:hover:bg-slate-700/50 -mx-6 px-6 py-3 rounded-lg transition-colors duration-200"
                      >
                        <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                          <ActivityIcon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-slate-900 dark:text-white">
                              {activity.user}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400">
                              {activity.type.replace('_', ' ')}
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {activity.document}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {activity.details}
                          </p>
                        </div>
                        
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(activity.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </Tabs.Content>

        {/* Team Access Tab */}
        <Tabs.Content value="team" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Team Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Team Access</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage team members and their permissions
                </p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Invite Member</span>
              </button>
            </div>

            {/* Team Members */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockTeamMembers.map((member, index) => {
                const RoleIcon = getRoleIcon(member.role);
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {member.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {member.email}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role)}`}>
                              <RoleIcon className="h-3 w-3 mr-1" />
                              {member.role}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              member.status === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }`}>
                              {member.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Select.Root defaultValue={member.role}>
                          <Select.Trigger className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm">
                            <Select.Value />
                            <ChevronDown className="h-3 w-3" />
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-1">
                              <Select.Item value="admin" className="px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                                Admin
                              </Select.Item>
                              <Select.Item value="editor" className="px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                                Editor
                              </Select.Item>
                              <Select.Item value="viewer" className="px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                                Viewer
                              </Select.Item>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                        
                        <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Last active: {formatDate(member.lastActive)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        documents={filteredDocuments}
        currentDocumentIndex={currentDocumentIndex}
        onDocumentChange={setCurrentDocumentIndex}
      />
    </div>
  );
};

export default DataRoomDetail;