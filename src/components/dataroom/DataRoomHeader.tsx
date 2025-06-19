import React from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Users, 
  Eye, 
  FileText, 
  Calendar, 
  MoreVertical,
  Edit3,
  Share2,
  Settings,
  Star,
  Palette
} from 'lucide-react';

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

interface DataRoomHeaderProps {
  dataRoom: DataRoom;
}

const DataRoomHeader: React.FC<DataRoomHeaderProps> = ({ dataRoom }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-lg"
        >
          {/* Header Content */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FolderOpen className="h-8 w-8 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {dataRoom.name}
                  </h1>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(dataRoom.status)}`}>
                    {dataRoom.status}
                  </span>
                  <button className="p-1 text-slate-400 hover:text-yellow-500 transition-colors duration-200">
                    <Star className="h-5 w-5" />
                  </button>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-4 max-w-3xl">
                  {dataRoom.description}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {formatDate(dataRoom.lastUpdated)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Created by {dataRoom.createdBy}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors duration-200">
                <Palette className="h-4 w-4" />
                <span>Branding</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors duration-200">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                <Edit3 className="h-4 w-4" />
                <span>Edit</span>
              </button>
              
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Documents</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {dataRoom.documentCount}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Team Members</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {dataRoom.memberCount}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Views</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {dataRoom.totalViews.toLocaleString()}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Engagement</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    94%
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DataRoomHeader;