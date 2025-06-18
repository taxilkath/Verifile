import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as Progress from '@radix-ui/react-progress';
import {
  ArrowLeft,
  Share2,
  Settings,
  MoreVertical,
  FileText,
  BarChart3,
  Link as LinkIcon,
  Activity,
  Users,
  Upload,
  Download,
  Eye,
  Calendar,
  Clock,
  User,
  Shield,
  Globe,
  Lock,
  Plus,
  X,
  Copy,
  Edit3,
  Trash2,
  UserPlus,
  Crown,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Search,
  Filter,
  Image,
  FileSpreadsheet,
  Presentation
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const dataRoom = {
  id: '1',
  name: 'Series A Fundraising',
  description: 'Due diligence materials and financial projections for our Series A funding round. This data room contains sensitive financial information, legal documents, and strategic plans.',
  lastUpdated: '2 hours ago',
  status: 'active',
  documentsCount: 24,
  viewersCount: 12,
  totalViews: 1247,
  gradient: 'from-blue-600 via-purple-600 to-cyan-600'
};

const mockDocuments = [
  {
    id: '1',
    name: 'Financial Projections Q1-Q4 2025.xlsx',
    type: 'spreadsheet',
    size: '2.4 MB',
    uploadedAt: '2 hours ago',
    views: 45,
    downloads: 12,
    status: 'active'
  },
  {
    id: '2',
    name: 'Investment Deck - Series A.pdf',
    type: 'presentation',
    size: '8.7 MB',
    uploadedAt: '1 day ago',
    views: 89,
    downloads: 23,
    status: 'active'
  },
  {
    id: '3',
    name: 'Legal Documentation Package.zip',
    type: 'archive',
    size: '15.2 MB',
    uploadedAt: '3 days ago',
    views: 34,
    downloads: 8,
    status: 'active'
  },
  {
    id: '4',
    name: 'Market Analysis Report.pdf',
    type: 'document',
    size: '4.1 MB',
    uploadedAt: '5 days ago',
    views: 67,
    downloads: 15,
    status: 'active'
  },
  {
    id: '5',
    name: 'Company Logo Assets.zip',
    type: 'archive',
    size: '12.8 MB',
    uploadedAt: '1 week ago',
    views: 23,
    downloads: 7,
    status: 'active'
  },
  {
    id: '6',
    name: 'Product Roadmap 2025.pptx',
    type: 'presentation',
    size: '6.3 MB',
    uploadedAt: '1 week ago',
    views: 56,
    downloads: 18,
    status: 'active'
  }
];

const mockAnalyticsData = [
  { date: '2025-01-01', views: 45, downloads: 12, uniqueVisitors: 8 },
  { date: '2025-01-02', views: 52, downloads: 15, uniqueVisitors: 11 },
  { date: '2025-01-03', views: 38, downloads: 9, uniqueVisitors: 7 },
  { date: '2025-01-04', views: 67, downloads: 18, uniqueVisitors: 14 },
  { date: '2025-01-05', views: 89, downloads: 25, uniqueVisitors: 19 },
  { date: '2025-01-06', views: 76, downloads: 21, uniqueVisitors: 16 },
  { date: '2025-01-07', views: 94, downloads: 28, uniqueVisitors: 22 }
];

const documentTypeData = [
  { name: 'PDFs', value: 45, color: '#3B82F6' },
  { name: 'Spreadsheets', value: 25, color: '#10B981' },
  { name: 'Presentations', value: 20, color: '#F59E0B' },
  { name: 'Archives', value: 10, color: '#8B5CF6' }
];

const mockSharedLinks = [
  {
    id: '1',
    name: 'Investor Access Link',
    url: 'https://verifile.com/share/abc123',
    expiresAt: '2025-02-15',
    views: 45,
    status: 'active',
    permissions: ['view', 'download']
  },
  {
    id: '2',
    name: 'Board Member Review',
    url: 'https://verifile.com/share/def456',
    expiresAt: '2025-01-30',
    views: 23,
    status: 'active',
    permissions: ['view']
  },
  {
    id: '3',
    name: 'Legal Team Access',
    url: 'https://verifile.com/share/ghi789',
    expiresAt: '2025-01-25',
    views: 12,
    status: 'expired',
    permissions: ['view', 'download', 'comment']
  }
];

const mockActivity = [
  {
    id: '1',
    type: 'view',
    user: 'john@investor.com',
    action: 'viewed Financial Projections Q1-Q4 2025.xlsx',
    timestamp: '2 minutes ago',
    icon: Eye
  },
  {
    id: '2',
    type: 'download',
    user: 'sarah@vc.com',
    action: 'downloaded Investment Deck - Series A.pdf',
    timestamp: '15 minutes ago',
    icon: Download
  },
  {
    id: '3',
    type: 'share',
    user: 'admin@company.com',
    action: 'created new shared link "Investor Access Link"',
    timestamp: '1 hour ago',
    icon: Share2
  },
  {
    id: '4',
    type: 'upload',
    user: 'admin@company.com',
    action: 'uploaded Market Analysis Report.pdf',
    timestamp: '2 hours ago',
    icon: Upload
  },
  {
    id: '5',
    type: 'access',
    user: 'mike@legal.com',
    action: 'was granted access to the data room',
    timestamp: '1 day ago',
    icon: UserPlus
  },
  {
    id: '6',
    type: 'view',
    user: 'emma@advisor.com',
    action: 'viewed Product Roadmap 2025.pptx',
    timestamp: '2 days ago',
    icon: Eye
  }
];

const mockTeamMembers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@company.com',
    role: 'owner',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    lastActive: '2 hours ago',
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    lastActive: '1 day ago',
    status: 'active'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@investor.com',
    role: 'viewer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    lastActive: '3 days ago',
    status: 'pending'
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma@advisor.com',
    role: 'viewer',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    lastActive: '5 days ago',
    status: 'active'
  }
];

const DataRoomDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('documents');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showCreateLinkModal, setShowCreateLinkModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

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
      animateCounter(1247, setViewsCount);
      animateCounter(342, setDownloadsCount);
      animateCounter(89, setVisitorsCount);
    }
  }, [activeTab]);

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
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
    }, 2000);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'spreadsheet':
        return FileSpreadsheet;
      case 'presentation':
        return Presentation;
      case 'image':
        return Image;
      default:
        return FileText;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'view': return 'text-blue-500';
      case 'download': return 'text-green-500';
      case 'share': return 'text-purple-500';
      case 'upload': return 'text-orange-500';
      case 'access': return 'text-cyan-500';
      default: return 'text-slate-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return Crown;
      case 'admin': return Shield;
      case 'viewer': return Eye;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-yellow-500';
      case 'admin': return 'text-purple-500';
      case 'viewer': return 'text-blue-500';
      default: return 'text-slate-500';
    }
  };

  const filteredDocuments = mockDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading skeleton component
  const DocumentSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        </div>
      </div>
      <div className="flex space-x-2">
        <div className="flex-1 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <Link 
              to="/dashboard/data-rooms" 
              className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200 flex items-center space-x-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Data Rooms</span>
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">{dataRoom.name}</span>
          </div>

          {/* Header Content */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xl">
            {/* Gradient Header */}
            <div className={`h-32 bg-gradient-to-r ${dataRoom.gradient} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
              <div className="absolute bottom-4 left-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl"
                >
                  <FileText className="h-8 w-8 text-white" />
                </motion.div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center space-x-3 mb-3"
                  >
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {dataRoom.name}
                    </h1>
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium rounded-full ring-2 ring-green-200 dark:ring-green-800"
                    >
                      {dataRoom.status}
                    </motion.span>
                  </motion.div>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-600 dark:text-slate-400 text-lg mb-4 max-w-3xl leading-relaxed"
                  >
                    {dataRoom.description}
                  </motion.p>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400"
                  >
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Updated {dataRoom.lastUpdated}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>{dataRoom.documentsCount} documents</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{dataRoom.viewersCount} viewers</span>
                    </div>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center space-x-3 mt-6 lg:mt-0"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Tabs.List className="flex space-x-1 bg-white dark:bg-slate-800 p-1 rounded-xl mb-8 overflow-x-auto shadow-lg border border-slate-200 dark:border-slate-700">
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
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ease-in-out whitespace-nowrap relative ${
                    activeTab === tab.value
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {activeTab === tab.value && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </motion.div>

          {/* Documents Tab */}
          <Tabs.Content value="documents">
            <AnimatePresence mode="wait">
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Search and Upload */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Upload</span>
                  </motion.button>
                </div>

                {/* Upload Area */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                      : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800'
                  } shadow-lg hover:shadow-xl`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="text-center">
                    <motion.div
                      animate={dragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="inline-flex p-4 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full mb-4"
                    >
                      <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {dragActive ? 'Drop files here' : 'Upload documents'}
                    </h3>
                    
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      Drag and drop files here, or click to browse
                    </p>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Choose Files
                    </motion.button>
                  </div>

                  {isUploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                    >
                      <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600 dark:text-slate-400">Uploading files...</p>
                        <Progress.Root className="w-48 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
                          <Progress.Indicator 
                            className="w-full h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-transform duration-300"
                            style={{ transform: 'translateX(-50%)' }}
                          />
                        </Progress.Root>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isUploading ? (
                    // Show skeletons while uploading
                    Array.from({ length: 6 }).map((_, index) => (
                      <DocumentSkeleton key={index} />
                    ))
                  ) : (
                    filteredDocuments.map((doc, index) => {
                      const IconComponent = getFileIcon(doc.type);
                      return (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 overflow-hidden"
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <motion.div 
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl flex items-center justify-center"
                              >
                                <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                              </motion.div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                  <MoreVertical className="h-4 w-4 text-slate-400" />
                                </button>
                              </div>
                            </div>

                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {doc.name}
                            </h3>

                            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                              <div className="flex items-center justify-between">
                                <span>Size</span>
                                <span className="font-medium">{doc.size}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Views</span>
                                <span className="font-medium text-blue-600 dark:text-blue-400">{doc.views}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Downloads</span>
                                <span className="font-medium text-green-600 dark:text-green-400">{doc.downloads}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                              <span>Uploaded {doc.uploadedAt}</span>
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-medium">
                                {doc.status}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                              >
                                View
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-400 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                              >
                                <Download className="h-4 w-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-400 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                              >
                                <Share2 className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </div>

                          {/* Hover glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </Tabs.Content>

          {/* Analytics Tab */}
          <Tabs.Content value="analytics">
            <AnimatePresence mode="wait">
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl flex items-center justify-center">
                        <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">+12%</span>
                      </div>
                    </div>
                    <motion.div 
                      className="text-3xl font-bold text-slate-900 dark:text-white mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {viewsCount.toLocaleString()}
                    </motion.div>
                    <div className="text-slate-500 dark:text-slate-400">Total Views</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl flex items-center justify-center">
                        <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">+8%</span>
                      </div>
                    </div>
                    <motion.div 
                      className="text-3xl font-bold text-slate-900 dark:text-white mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {downloadsCount.toLocaleString()}
                    </motion.div>
                    <div className="text-slate-500 dark:text-slate-400">Downloads</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-sm font-medium">-2%</span>
                      </div>
                    </div>
                    <motion.div 
                      className="text-3xl font-bold text-slate-900 dark:text-white mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {visitorsCount.toLocaleString()}
                    </motion.div>
                    <div className="text-slate-500 dark:text-slate-400">Unique Visitors</div>
                  </motion.div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                      Activity Over Time
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockAnalyticsData}>
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                          <XAxis dataKey="date" stroke="#64748B" />
                          <YAxis stroke="#64748B" />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#1E293B',
                              border: 'none',
                              borderRadius: '12px',
                              color: '#F1F5F9'
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="views"
                            stroke="#3B82F6"
                            fillOpacity={1}
                            fill="url(#colorViews)"
                            strokeWidth={3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
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
                              borderRadius: '12px',
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
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Additional Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                    Downloads vs Views
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockAnalyticsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="date" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1E293B',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#F1F5F9'
                          }}
                        />
                        <Bar dataKey="views" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="downloads" fill="#10B981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </Tabs.Content>

          {/* Shared Links Tab */}
          <Tabs.Content value="shared-links">
            <AnimatePresence mode="wait">
              <motion.div
                key="shared-links"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Shared Links
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateLinkModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Link</span>
                  </motion.button>
                </div>

                {/* Links List */}
                <div className="space-y-4">
                  {mockSharedLinks.map((link, index) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {link.name}
                            </h3>
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 }}
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                link.status === 'active'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                              }`}
                            >
                              {link.status}
                            </motion.span>
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <code className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg text-sm text-slate-600 dark:text-slate-400 flex-1 truncate">
                              {link.url}
                            </code>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                            >
                              <Copy className="h-4 w-4 text-slate-400" />
                            </motion.button>
                          </div>

                          <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{link.views} views</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Expires {link.expiresAt}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Shield className="h-4 w-4" />
                              <span>{link.permissions.join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <Edit3 className="h-4 w-4 text-slate-400" />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </Tabs.Content>

          {/* Activity Log Tab */}
          <Tabs.Content value="activity">
            <AnimatePresence mode="wait">
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Activity Log
                </h2>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
                  <div className="space-y-6">
                    {mockActivity.map((activity, index) => {
                      const IconComponent = activity.icon;
                      return (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300"
                        >
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                              activity.type === 'view' ? 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30' :
                              activity.type === 'download' ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30' :
                              activity.type === 'share' ? 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30' :
                              activity.type === 'upload' ? 'bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30' :
                              'bg-gradient-to-r from-cyan-100 to-cyan-200 dark:from-cyan-900/30 dark:to-cyan-800/30'
                            }`}
                          >
                            <IconComponent className={`h-5 w-5 ${getActivityColor(activity.type)}`} />
                          </motion.div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-slate-900 dark:text-white">
                                <span className="font-medium">{activity.user}</span>{' '}
                                <span className="text-slate-600 dark:text-slate-400">{activity.action}</span>
                              </p>
                              <span className="text-sm text-slate-500 dark:text-slate-400">
                                {activity.timestamp}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </Tabs.Content>

          {/* Team Access Tab */}
          <Tabs.Content value="team">
            <AnimatePresence mode="wait">
              <motion.div
                key="team"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Team Access
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowInviteModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Invite Member</span>
                  </motion.button>
                </div>

                {/* Team Members */}
                <div className="space-y-4">
                  {mockTeamMembers.map((member, index) => {
                    const RoleIcon = getRoleIcon(member.role);
                    return (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <motion.img
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                              src={member.avatar}
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                  {member.name}
                                </h3>
                                <RoleIcon className={`h-4 w-4 ${getRoleColor(member.role)}`} />
                              </div>
                              <p className="text-slate-500 dark:text-slate-400">{member.email}</p>
                              <p className="text-sm text-slate-400">Last active {member.lastActive}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                member.status === 'active'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                              }`}
                            >
                              {member.status}
                            </motion.span>

                            <Select.Root defaultValue={member.role}>
                              <Select.Trigger className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                <Select.Value />
                                <ChevronDown className="h-4 w-4" />
                              </Select.Trigger>
                              <Select.Portal>
                                <Select.Content className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-1 z-50">
                                  <Select.Item value="owner" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                                    Owner
                                  </Select.Item>
                                  <Select.Item value="admin" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                                    Admin
                                  </Select.Item>
                                  <Select.Item value="viewer" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                                    Viewer
                                  </Select.Item>
                                </Select.Content>
                              </Select.Portal>
                            </Select.Root>

                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </Tabs.Content>
        </Tabs.Root>
      </div>

      {/* Create Link Modal */}
      <Dialog.Root open={showCreateLinkModal} onOpenChange={setShowCreateLinkModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 w-full max-w-md shadow-2xl z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Dialog.Title className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Create Shared Link
              </Dialog.Title>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Link Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter link name"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2 rounded" defaultChecked />
                      <span className="text-sm">View documents</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2 rounded" />
                      <span className="text-sm">Download documents</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2 rounded" />
                      <span className="text-sm">Add comments</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    Cancel
                  </button>
                </Dialog.Close>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Create Link
                </motion.button>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Invite Member Modal */}
      <Dialog.Root open={showInviteModal} onOpenChange={setShowInviteModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 w-full max-w-md shadow-2xl z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Dialog.Title className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Invite Team Member
              </Dialog.Title>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="colleague@company.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Role
                  </label>
                  <Select.Root defaultValue="viewer">
                    <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                      <Select.Value />
                      <ChevronDown className="h-4 w-4" />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-1 z-50">
                        <Select.Item value="admin" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                          Admin
                        </Select.Item>
                        <Select.Item value="viewer" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer">
                          Viewer
                        </Select.Item>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    placeholder="Add a personal message..."
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    Cancel
                  </button>
                </Dialog.Close>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Send Invitation
                </motion.button>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default DataRoomDetail;