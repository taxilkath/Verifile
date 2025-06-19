import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Select from '@radix-ui/react-select';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  ChevronDown,
  Eye,
  Download,
  Share2,
  FolderOpen,
  MoreVertical,
  Calendar,
  User,
  TrendingUp,
  BarChart3,
  File,
  Image,
  Video,
  Music,
  Archive,
  Code,
  X,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import DocumentUploadModal from '../components/documents/DocumentUploadModal';
import BulkUploadModal from '../components/documents/BulkUploadModal';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import AnalyticsPanel from '../components/documents/AnalyticsPanel';

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
  dataRoom?: string;
  tags: string[];
}

interface DataRoom {
  id: string;
  name: string;
}

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
    dataRoom: 'Series A Fundraising',
    tags: ['financial', 'quarterly']
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
    dataRoom: 'Series A Fundraising',
    tags: ['presentation', 'investment']
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
    dataRoom: 'Legal Documents',
    tags: ['legal', 'contract']
  },
  {
    id: '4',
    name: 'Product Roadmap 2024.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 987654,
    uploadedBy: 'Emily Chen',
    uploadedAt: '2024-01-12T16:45:00Z',
    url: 'https://example.com/doc4.xlsx',
    views: 134,
    downloads: 45,
    dataRoom: 'Product Strategy',
    tags: ['product', 'roadmap']
  },
  {
    id: '5',
    name: 'Team Photo.jpg',
    type: 'image/jpeg',
    size: 3456789,
    uploadedBy: 'Alex Rodriguez',
    uploadedAt: '2024-01-11T11:20:00Z',
    url: 'https://example.com/doc5.jpg',
    views: 78,
    downloads: 23,
    dataRoom: 'Company Assets',
    tags: ['photo', 'team']
  }
];

const mockDataRooms: DataRoom[] = [
  { id: '1', name: 'Series A Fundraising' },
  { id: '2', name: 'Legal Documents' },
  { id: '3', name: 'Product Strategy' },
  { id: '4', name: 'Company Assets' }
];

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDataRoom, setSelectedDataRoom] = useState<string>('all');
  const [selectedFileType, setSelectedFileType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState<number | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(true);

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    if (type.includes('image')) return Image;
    if (type.includes('video')) return Video;
    if (type.includes('audio')) return Music;
    if (type.includes('zip') || type.includes('rar')) return Archive;
    if (type.includes('code') || type.includes('text')) return Code;
    if (type.includes('presentation')) return FileText;
    if (type.includes('spreadsheet')) return FileText;
    if (type.includes('word')) return FileText;
    return File;
  };

  const getFileTypeColor = (type: string) => {
    if (type.includes('pdf')) return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
    if (type.includes('image')) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    if (type.includes('video')) return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
    if (type.includes('audio')) return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
    if (type.includes('presentation')) return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    if (type.includes('spreadsheet')) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30';
    if (type.includes('word')) return 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30';
    return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700';
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

  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesDataRoom = selectedDataRoom === 'all' || doc.dataRoom === selectedDataRoom;
      
      const matchesFileType = selectedFileType === 'all' || 
                             (selectedFileType === 'pdf' && doc.type.includes('pdf')) ||
                             (selectedFileType === 'docx' && doc.type.includes('word')) ||
                             (selectedFileType === 'pptx' && doc.type.includes('presentation')) ||
                             (selectedFileType === 'xlsx' && doc.type.includes('spreadsheet'));
      
      return matchesSearch && matchesDataRoom && matchesFileType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case 'oldest':
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        case 'most-viewed':
          return b.views - a.views;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleDocumentClick = (index: number) => {
    setSelectedDocumentIndex(index);
    setShowPreviewModal(true);
  };

  const handleDocumentChange = (index: number) => {
    setSelectedDocumentIndex(index);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative flex">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showAnalytics ? 'mr-80' : ''}`}>
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Documents
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                      Manage, upload, and organize all your individual files here.
                    </p>
                  </div>

                  {/* Upload Dropdown */}
                  <div className="mt-4 sm:mt-0">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-2"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                          <div className="relative flex items-center space-x-2">
                            <Upload className="h-5 w-5" />
                            <span>Upload</span>
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </motion.button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 min-w-[200px] z-50"
                          sideOffset={5}
                        >
                          <DropdownMenu.Item
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200"
                            onClick={() => setShowUploadModal(true)}
                          >
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                Upload Single Document
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                Upload one file at a time
                              </div>
                            </div>
                          </DropdownMenu.Item>

                          <DropdownMenu.Item
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200"
                            onClick={() => setShowBulkUploadModal(true)}
                          >
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                              <Plus className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                Upload Multiple Documents
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                Bulk upload with progress tracking
                              </div>
                            </div>
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                </div>
              </motion.div>

              {/* Search and Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 space-y-4"
              >
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search documents by name, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg shadow-sm"
                  />
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Data Room Filter */}
                  <Select.Root value={selectedDataRoom} onValueChange={setSelectedDataRoom}>
                    <Select.Trigger className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-[200px]">
                      <div className="flex items-center space-x-2">
                        <FolderOpen className="h-4 w-4 text-slate-400" />
                        <Select.Value placeholder="All Data Rooms" />
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 p-2">
                        <Select.Item value="all" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                          All Data Rooms
                        </Select.Item>
                        {mockDataRooms.map((room) => (
                          <Select.Item key={room.id} value={room.name} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                            {room.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>

                  {/* File Type Filter */}
                  <Select.Root value={selectedFileType} onValueChange={setSelectedFileType}>
                    <Select.Trigger className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-[150px]">
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-slate-400" />
                        <Select.Value placeholder="All Types" />
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 p-2">
                        <Select.Item value="all" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                          All Types
                        </Select.Item>
                        <Select.Item value="pdf" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                          PDF
                        </Select.Item>
                        <Select.Item value="docx" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                          DOCX
                        </Select.Item>
                        <Select.Item value="pptx" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                          PPTX
                        </Select.Item>
                        <Select.Item value="xlsx" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                          XLSX
                        </Select.Item>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>

                  {/* Sort Filter */}
                  <Select.Root value={sortBy} onValueChange={setSortBy}>
                    <Select.Trigger className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-[150px]">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-slate-400" />
                        <Select.Value />
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 p-2">
                        <Select.Item value="newest" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                          Newest
                        </Select.Item>
                        <Select.Item value="oldest" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                          Oldest
                        </Select.Item>
                        <Select.Item value="most-viewed" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                          Most Viewed
                        </Select.Item>
                        <Select.Item value="name" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                          Name
                        </Select.Item>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>

                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 ml-auto">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        viewMode === 'grid'
                          ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-3 rounded-lg transition-all duration-200 ${
                        viewMode === 'list'
                          ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Analytics Toggle */}
                  <button
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      showAnalytics
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>

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
                      const colorClasses = getFileTypeColor(document.type);
                      
                      return (
                        <motion.div
                          key={document.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-black/20 cursor-pointer overflow-hidden"
                          onClick={() => handleDocumentClick(index)}
                        >
                          {/* Document Preview */}
                          <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center relative overflow-hidden">
                            <div className={`p-4 rounded-2xl ${colorClasses}`}>
                              <FileIcon className="h-12 w-12" />
                            </div>
                            
                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle quick view
                                }}
                                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200"
                              >
                                <Eye className="h-4 w-4 text-white" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle download
                                }}
                                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200"
                              >
                                <Download className="h-4 w-4 text-white" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle share
                                }}
                                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200"
                              >
                                <Share2 className="h-4 w-4 text-white" />
                              </button>
                            </div>
                          </div>

                          {/* Document Info */}
                          <div className="p-6">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {document.name}
                            </h3>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                                <FolderOpen className="h-3 w-3" />
                                <span>{document.dataRoom}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                                <User className="h-3 w-3" />
                                <span>{document.uploadedBy}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(document.uploadedAt)}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500 dark:text-slate-400">
                                {formatFileSize(document.size)}
                              </span>
                              <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
                                <div className="flex items-center space-x-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{document.views}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Download className="h-3 w-3" />
                                  <span>{document.downloads}</span>
                                </div>
                              </div>
                            </div>

                            {/* Tags */}
                            {document.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {document.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-md"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {document.tags.length > 2 && (
                                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded-md">
                                    +{document.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
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
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Data Room
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Uploaded By
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Upload Date
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Views / Downloads
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          {filteredDocuments.map((document, index) => {
                            const FileIcon = getFileIcon(document.type);
                            const colorClasses = getFileTypeColor(document.type);
                            
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
                                  <div className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses}`}>
                                      <FileIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                                        {document.name}
                                      </div>
                                      <div className="text-sm text-slate-500 dark:text-slate-400">
                                        {formatFileSize(document.size)}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                                  <div className="flex items-center space-x-2">
                                    <FolderOpen className="h-4 w-4 text-slate-400" />
                                    <span>{document.dataRoom}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                  {document.uploadedBy}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                  {formatDate(document.uploadedAt)}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1">
                                      <Eye className="h-4 w-4 text-blue-500" />
                                      <span>{document.views}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Download className="h-4 w-4 text-green-500" />
                                      <span>{document.downloads}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle view
                                      }}
                                      className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle download
                                      }}
                                      className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                                    >
                                      <Download className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle share
                                      }}
                                      className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                                    >
                                      <Share2 className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle more actions
                                      }}
                                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty State */}
              {filteredDocuments.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-16 w-16 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {searchQuery || selectedDataRoom !== 'all' || selectedFileType !== 'all' 
                      ? 'No documents found' 
                      : 'No documents yet'
                    }
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    {searchQuery || selectedDataRoom !== 'all' || selectedFileType !== 'all'
                      ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                      : 'Upload your first document to get started with secure document sharing.'
                    }
                  </p>
                  {(!searchQuery && selectedDataRoom === 'all' && selectedFileType === 'all') && (
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors duration-200"
                    >
                      Upload Your First Document
                    </button>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Panel */}
        <AnimatePresence>
          {showAnalytics && (
            <AnalyticsPanel documents={documents} />
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <DocumentUploadModal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />

      <BulkUploadModal 
        isOpen={showBulkUploadModal}
        onClose={() => setShowBulkUploadModal(false)}
      />

      {showPreviewModal && selectedDocumentIndex !== null && (
        <DocumentPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          documents={filteredDocuments}
          currentDocumentIndex={selectedDocumentIndex}
          onDocumentChange={handleDocumentChange}
        />
      )}
    </div>
  );
};

export default Documents;