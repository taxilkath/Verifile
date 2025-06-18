import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Eye, 
  Download, 
  UserPlus, 
  Share2,
  Clock
} from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'view',
    icon: Eye,
    title: 'Financial Report Q4.pdf viewed',
    description: 'by john@company.com',
    time: '2 minutes ago',
    color: 'text-green-500'
  },
  {
    id: 2,
    type: 'download',
    icon: Download,
    title: 'Investment Deck downloaded',
    description: 'by sarah@investor.com',
    time: '15 minutes ago',
    color: 'text-blue-500'
  },
  {
    id: 3,
    type: 'share',
    icon: Share2,
    title: 'Data room shared',
    description: 'Project Alpha with 3 recipients',
    time: '1 hour ago',
    color: 'text-purple-500'
  },
  {
    id: 4,
    type: 'invite',
    icon: UserPlus,
    title: 'Team member invited',
    description: 'mike@company.com joined the team',
    time: '2 hours ago',
    color: 'text-orange-500'
  },
  {
    id: 5,
    type: 'upload',
    icon: FileText,
    title: 'New document uploaded',
    description: 'Legal Agreement v2.pdf',
    time: '3 hours ago',
    color: 'text-cyan-500'
  }
];

const RecentActivity = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Recent Activity
        </h2>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-700 ${activity.color}`}>
              <activity.icon className="h-4 w-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {activity.title}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {activity.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-slate-400">
              <Clock className="h-3 w-3" />
              <span>{activity.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;