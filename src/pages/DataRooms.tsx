import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  Plus,
  Eye,
  Share2,
  Edit3,
  Trash2,
  Users,
  FileText,
  Calendar,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Lock,
  Globe,
  Star,
  TrendingUp
} from 'lucide-react';

interface DataRoom {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  viewerCount: number;
  lastUpdated: string;
  status: 'active' | 'archived' | 'draft';
  isStarred: boolean;
  accessType: 'private' | 'public' | 'restricted';
  tags: string[];
  gradient: string;
}

const mockDataRooms: DataRoom[] = [
  {
    id: '1',
    name: 'Series A Fundraising',
    description: 'Due diligence materials and financial projections for our Series A round',
    documentCount: 24,
    viewerCount: 12,
    lastUpdated: '2 hours ago',
    status: 'active',
    isStarred: true,
    accessType: 'private',
    tags: ['Fundraising', 'Financial'],
    gradient: 'from-blue-600 via-purple-600 to-cyan-600'
  },
  {
    id: '2',
    name: 'Q4 Board Materials',
    description: 'Quarterly board meeting documents and strategic updates',
    documentCount: 18,
    viewerCount: 8,
    lastUpdated: '1 day ago',
    status: 'active',
    isStarred: false,
    accessType: 'restricted',
    tags: ['Board', 'Quarterly'],
    gradient: 'from-emerald-600 via-teal-600 to-green-600'
  },
  {
    id: '3',
    name: 'Legal Documentation',
    description: 'Contracts, compliance documents, and legal agreements',
    documentCount: 31,
    viewerCount: 5,
    lastUpdated: '3 days ago',
    status: 'active',
    isStarred: false,
    accessType: 'private',
    tags: ['Legal', 'Compliance'],
    gradient: 'from-orange-600 via-red-600 to-pink-600'
  },
  {
    id: '4',
    name: 'Product Roadmap 2025',
    description: 'Strategic product planning and development roadmap',
    documentCount: 15,
    viewerCount: 22,
    lastUpdated: '5 days ago',
    status: 'draft',
    isStarred: true,
    accessType: 'public',
    tags: ['Product', 'Strategy'],
    gradient: 'from-purple-600 via-indigo-600 to-blue-600'
  },
  {
    id: '5',
    name: 'M&A Documentation',
    description: 'Merger and acquisition related documents and analysis',
    documentCount: 42,
    viewerCount: 7,
    lastUpdated: '1 week ago',
    status: 'archived',
    isStarred: false,
    accessType: 'private',
    tags: ['M&A', 'Strategic'],
    gradient: 'from-slate-600 via-gray-600 to-zinc-600'
  },
  {
    id: '6',
    name: 'Customer Research',
    description: 'User interviews, surveys, and market research data',
    documentCount: 28,
    viewerCount: 15,
    lastUpdated: '2 weeks ago',
    status: 'active',
    isStarred: false,
    accessType: 'restricted',
    tags: ['Research', 'Customer'],
    gradient: 'from-cyan-600 via-sky-600 to-blue-600'
  }
];

const DataRooms = () => {
  const navigate = useNavigate();
  const [dataRooms, setDataRooms] = useState<DataRoom[]>(mockDataRooms);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const filteredRooms = dataRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || room.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const toggleStar = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation(); // Prevent navigation when clicking the star
    setDataRooms(rooms => 
      rooms.map(room => 
        room.id === roomId ? { ...room, isStarred: !room.isStarred } : room
      )
    );
  };

  const handleViewDataRoom = (roomId: string) => {
    navigate(`/dashboard/data-rooms/${roomId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getAccessIcon = (accessType: string) => {
    switch (accessType) {
      case 'private': return <Lock className="h-3 w-3" />;
      case 'public': return <Globe className="h-3 w-3" />;
      case 'restricted': return <Users className="h-3 w-3" />;
      default: return <Lock className="h-3 w-3" />;
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

      {/* Header */}
      <div className="relative mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Data Rooms
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Secure spaces for sharing sensitive documents with stakeholders
            </p>
          </div>

          {/* Create Data Room Button */}
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="group relative mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
            <div className="relative flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create Data Room</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 flex flex-col sm:flex-row gap-4"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search data rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as any)}
              className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

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
          </div>
        </motion.div>
      </div>

      {/* Data Rooms Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-black/20 overflow-hidden cursor-pointer"
                onHoverStart={() => setSelectedRoom(room.id)}
                onHoverEnd={() => setSelectedRoom(null)}
                onClick={() => handleViewDataRoom(room.id)}
              >
                {/* Gradient Header */}
                <div className={`h-24 bg-gradient-to-r ${room.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <button
                      onClick={(e) => toggleStar(e, room.id)}
                      className={`p-1.5 rounded-full transition-all duration-200 ${
                        room.isStarred
                          ? 'bg-yellow-400 text-yellow-900'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <Star className={`h-3 w-3 ${room.isStarred ? 'fill-current' : ''}`} />
                    </button>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                      {room.status}
                    </div>
                  </div>
                  
                  {/* Floating icon */}
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                      <FolderOpen className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {room.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-slate-400">
                      {getAccessIcon(room.accessType)}
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                    {room.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {room.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {room.tags.length > 2 && (
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded-md">
                        +{room.tags.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {room.documentCount}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Documents
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {room.viewerCount}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Viewers
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          94%
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Engagement
                      </div>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <Calendar className="h-3 w-3 mr-1" />
                    Updated {room.lastUpdated}
                  </div>

                  {/* Action Buttons */}
                  <AnimatePresence>
                    {selectedRoom === room.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center space-x-2"
                      >
                        <button 
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDataRoom(room.id);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </button>
                        
                        <button 
                          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 p-2 rounded-lg transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle share action
                          }}
                        >
                          <Share2 className="h-3 w-3" />
                        </button>
                        
                        <button 
                          className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 p-2 rounded-lg transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle edit action
                          }}
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        
                        <button 
                          className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 p-2 rounded-lg transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delete action
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Hover Ring Effect */}
                <div className="absolute inset-0 ring-2 ring-blue-500/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Viewers
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredRooms.map((room, index) => (
                    <motion.tr
                      key={room.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200 cursor-pointer"
                      onClick={() => handleViewDataRoom(room.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${room.gradient} flex items-center justify-center`}>
                            <FolderOpen className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">
                                {room.name}
                              </div>
                              {room.isStarred && (
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              )}
                              {getAccessIcon(room.accessType)}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                              {room.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(room.status)}`}>
                          {room.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                        {room.documentCount}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                        {room.viewerCount}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {room.lastUpdated}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDataRoom(room.id);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle share action
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit action
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle delete action
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No data rooms found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {searchQuery ? 'Try adjusting your search criteria' : 'Create your first data room to get started'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            Create Data Room
          </button>
        </motion.div>
      )}

      {/* Create Data Room Modal */}
      <CreateDataRoomModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
};

// Create Data Room Modal Component
const CreateDataRoomModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    accessType: 'private',
    tags: [] as string[]
  });

  const [currentTag, setCurrentTag] = useState('');

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Create New Data Room
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Set up a secure space for sharing documents
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Data Room Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter data room name"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose of this data room"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </motion.div>

              {/* Access Type */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Access Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'private', label: 'Private', icon: Lock, desc: 'Invite only' },
                    { value: 'restricted', label: 'Restricted', icon: Users, desc: 'Limited access' },
                    { value: 'public', label: 'Public', icon: Globe, desc: 'Anyone with link' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData(prev => ({ ...prev, accessType: option.value }))}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.accessType === option.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                      }`}
                    >
                      <option.icon className={`h-5 w-5 mx-auto mb-2 ${
                        formData.accessType === option.value ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                      }`} />
                      <div className={`text-sm font-medium ${
                        formData.accessType === option.value ? 'text-blue-900 dark:text-blue-100' : 'text-slate-900 dark:text-white'
                      }`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {option.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tags
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag"
                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
              >
                Create Data Room
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DataRooms;