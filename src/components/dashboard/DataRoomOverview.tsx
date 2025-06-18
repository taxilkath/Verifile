import React from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Users, 
  Eye, 
  Shield,
  TrendingUp,
  Plus
} from 'lucide-react';

const dataRooms = [
  {
    id: 1,
    name: 'Project Alpha',
    description: 'Due diligence materials for Series A',
    members: 12,
    views: 247,
    documents: 18,
    status: 'active',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    name: 'Financial Reports',
    description: 'Q4 financial documents and projections',
    members: 8,
    views: 156,
    documents: 24,
    status: 'active',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 3,
    name: 'Legal Documents',
    description: 'Contracts and compliance materials',
    members: 5,
    views: 89,
    documents: 31,
    status: 'restricted',
    color: 'from-purple-500 to-pink-500'
  }
];

const DataRoomOverview = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Data Rooms
        </h2>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Room</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {dataRooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
          >
            {/* Status indicator */}
            <div className="absolute top-3 right-3">
              <div className={`w-2 h-2 rounded-full ${
                room.status === 'active' ? 'bg-green-400' : 'bg-orange-400'
              }`}></div>
            </div>

            {/* Room icon */}
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${room.color} flex items-center justify-center mb-3`}>
              <FolderOpen className="h-5 w-5 text-white" />
            </div>

            {/* Room info */}
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {room.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
              {room.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">{room.members}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">{room.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">{room.documents}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {dataRooms.length}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Active Rooms
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {dataRooms.reduce((sum, room) => sum + room.members, 0)}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Total Members
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {dataRooms.reduce((sum, room) => sum + room.views, 0)}
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Total Views
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataRoomOverview;