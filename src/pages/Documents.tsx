import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Select from '@radix-ui/react-select';
import {
  Search,
  Filter,
  ChevronDown,
  FolderOpen,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import DocumentsTable from '../components/documents/DocumentsTable';
import UploadButton from '../components/documents/UploadButton';
import DocumentsSidebar from '../components/documents/DocumentsSidebar';
import FoldersSection from '../components/documents/FoldersSection';
import { Document, Folder } from '../types/documents';

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
    tags: ['financial', 'quarterly'],
    folderId: 'folder1'
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
    tags: ['legal', 'contract'],
    folderId: 'folder2'
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

const mockFolders: Folder[] = [
  {
    id: 'folder1',
    name: 'Financial Documents',
    emoji: '💰',
    documents: mockDocuments.filter(doc => doc.folderId === 'folder1'),
    createdAt: '2024-01-10T10:00:00Z',
    dataRoom: 'Series A Fundraising'
  },
  {
    id: 'folder2',
    name: 'Legal Files',
    emoji: '⚖️',
    documents: mockDocuments.filter(doc => doc.folderId === 'folder2'),
    createdAt: '2024-01-08T14:30:00Z',
    dataRoom: 'Legal Documents'
  }
];

const mockDataRooms = [
  'Series A Fundraising',
  'Legal Documents',
  'Product Strategy',
  'Company Assets',
  'Board Materials'
];

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDataRoom, setSelectedDataRoom] = useState<string>('all');
  const [selectedFileType, setSelectedFileType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const filteredDocuments = documents
    .filter(doc => {
      // If a folder is selected, only show documents in that folder
      if (selectedFolder) {
        return doc.folderId === selectedFolder;
      }
      
      // Otherwise show documents not in any folder
      if (!selectedFolder && doc.folderId) {
        return false;
      }

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

  const handleDocumentUpdate = (id: string, updates: Partial<Document>) => {
    setDocuments(prev => 
      prev.map(doc => doc.id === id ? { ...doc, ...updates } : doc)
    );
  };

  const handleDocumentDelete = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleDocumentsAdd = (newDocuments: Document[]) => {
    setDocuments(prev => [...newDocuments, ...prev]);
  };

  const handleFolderCreate = (folder: Folder) => {
    setFolders(prev => [folder, ...prev]);
  };

  const handleFolderUpdate = (id: string, updates: Partial<Folder>) => {
    setFolders(prev => 
      prev.map(folder => folder.id === id ? { ...folder, ...updates } : folder)
    );
  };

  const handleFolderDelete = (id: string) => {
    // Move documents out of folder before deleting
    setDocuments(prev => 
      prev.map(doc => doc.folderId === id ? { ...doc, folderId: undefined } : doc)
    );
    setFolders(prev => prev.filter(folder => folder.id !== id));
    if (selectedFolder === id) {
      setSelectedFolder(null);
    }
  };

  const handleStatClick = (statType: string) => {
    // Handle sidebar stat clicks to filter documents
    switch (statType) {
      case 'most-viewed':
        setSortBy('most-viewed');
        break;
      case 'recent':
        setSortBy('newest');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="relative flex">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-500 ease-in-out ${showSidebar ? 'mr-80' : ''}`}>
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
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                      Documents
                    </h1>
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                      Manage, upload, and organize all your individual files here.
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                    <motion.button
                      onClick={() => setShowSidebar(!showSidebar)}
                      className={`p-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                        showSidebar
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-500/25'
                          : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shadow-slate-200 dark:shadow-slate-700'
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <BarChart3 className="h-5 w-5" />
                    </motion.button>
                    
                    <UploadButton onDocumentsAdd={handleDocumentsAdd} />
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
                    className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
                  />
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Data Room Filter */}
                  <Select.Root value={selectedDataRoom} onValueChange={setSelectedDataRoom}>
                    <Select.Trigger className="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 min-w-[200px] shadow-lg hover:shadow-xl">
                      <div className="flex items-center space-x-2">
                        <FolderOpen className="h-4 w-4 text-slate-400" />
                        <Select.Value placeholder="All Data Rooms" />
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl z-50 p-2">
                        <Select.Item value="all" className="px-3 py-2 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 rounded-xl cursor-pointer transition-colors">
                          All Data Rooms
                        </Select.Item>
                        {mockDataRooms.map((room) => (
                          <Select.Item key={room} value={room} className="px-3 py-2 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 rounded-xl cursor-pointer transition-colors">
                            {room}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>

                  {/* File Type Filter */}
                  <Select.Root value={selectedFileType} onValueChange={setSelectedFileType}>
                    <Select.Trigger className="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 min-w-[150px] shadow-lg hover:shadow-xl">
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-slate-400" />
                        <Select.Value placeholder="All Types" />
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl z-50 p-2">
                        <Select.Item value="all" className="px-3 py-2 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 rounded-xl cursor-pointer transition-colors">
                          All Types
                        </Select.Item>
                        <Select.Item value="pdf" className="px-3 py-2 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 rounded-xl cursor-pointer transition-colors">
                          PDF
                        </Select.Item>
                        <Select.Item value="docx" className="px-3 py-2 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 rounded-xl cursor-pointer transition-colors">
                          DOCX
                        </Select.Item>
                        <Select.Item value="pptx" className="px-3 py-2 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 rounded-xl cursor-pointer transition-colors">
                          PPTX
                        </Select.Item>
                        <Select.Item value="xlsx" className="px-3 py-2 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 rounded-xl cursor-pointer transition-colors">
                          XLSX
                        </Select.Item>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>

                  {/* Sort Filter */}
                  <Select.Root value={sortBy} onValueChange={setSortBy}>
                    <Select.Trigger className="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 min-w-[150px] shadow-lg hover:shadow-xl">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-slate-400" />
                        <Select.Value />
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl z-50 p-2">
                        <Select.Item value="newest" className="px-3 py-2 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 rounded-xl cursor-pointer transition-colors">
                          Newest
                        </Select.Item>
                        <Select.Item value="oldest" className="px-3 py-2 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 rounded-xl cursor-pointer transition-colors">
                          Oldest
                        </Select.Item>
                        <Select.Item value="most-viewed" className="px-3 py-2 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 rounded-xl cursor-pointer transition-colors">
                          Most Viewed
                        </Select.Item>
                        <Select.Item value="name" className="px-3 py-2 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 rounded-xl cursor-pointer transition-colors">
                          Name
                        </Select.Item>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
              </motion.div>

              {/* Folders Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <FoldersSection
                  folders={folders}
                  selectedFolder={selectedFolder}
                  onFolderSelect={setSelectedFolder}
                  onFolderCreate={handleFolderCreate}
                  onFolderUpdate={handleFolderUpdate}
                  onFolderDelete={handleFolderDelete}
                />
              </motion.div>

              {/* Documents Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <DocumentsTable
                  documents={filteredDocuments}
                  onDocumentUpdate={handleDocumentUpdate}
                  onDocumentDelete={handleDocumentDelete}
                  selectedFolder={selectedFolder}
                />
              </motion.div>

              {/* Empty State */}
              {filteredDocuments.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <Search className="h-16 w-16 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {searchQuery || selectedDataRoom !== 'all' || selectedFileType !== 'all' 
                      ? 'No documents found' 
                      : selectedFolder
                      ? 'No documents in this folder'
                      : 'No documents yet'
                    }
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    {searchQuery || selectedDataRoom !== 'all' || selectedFileType !== 'all'
                      ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                      : selectedFolder
                      ? 'This folder is empty. Upload documents or move existing ones here.'
                      : 'Upload your first document to get started with secure document sharing.'
                    }
                  </p>
                  {(!searchQuery && selectedDataRoom === 'all' && selectedFileType === 'all' && !selectedFolder) && (
                    <UploadButton onDocumentsAdd={handleDocumentsAdd} />
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <DocumentsSidebar 
              documents={documents} 
              onStatClick={handleStatClick}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Documents;