import React from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Download,
  Upload,
  Share2,
  UserPlus,
  Edit3,
  Activity,
  Clock,
  User
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'view' | 'download' | 'upload' | 'share' | 'invite' | 'edit';
  user: string;
  action: string;
  target?: string;
  timestamp: string;
  metadata?: any;
}

interface ActivityLogTabProps {
  activity: ActivityItem[];
}

const ActivityLogTab: React.FC<ActivityLogTabProps> = ({ activity }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view': return Eye;
      case 'download': return Download;
      case 'upload': return Upload;
      case 'share': return Share2;
      case 'invite': return UserPlus;
      case 'edit': return Edit3;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'view': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'download': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'upload': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
      case 'share': return 'text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/30';
      case 'invite': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'edit': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatActionText = (item: ActivityItem) => {
    switch (item.type) {
      case 'view':
        return (
          <>
            <span className="font-medium">{item.user}</span> viewed{' '}
            {item.target && <span className="font-medium text-blue-600 dark:text-blue-400">{item.target}</span>}
          </>
        );
      case 'download':
        return (
          <>
            <span className="font-medium">{item.user}</span> downloaded{' '}
            {item.target && <span className="font-medium text-green-600 dark:text-green-400">{item.target}</span>}
          </>
        );
      case 'upload':
        return (
          <>
            <span className="font-medium">{item.user}</span> uploaded{' '}
            {item.target && <span className="font-medium text-purple-600 dark:text-purple-400">{item.target}</span>}
          </>
        );
      case 'share':
        return (
          <>
            <span className="font-medium">{item.user}</span> shared the data room with{' '}
            {item.target && <span className="font-medium text-cyan-600 dark:text-cyan-400">{item.target}</span>}
          </>
        );
      case 'invite':
        return (
          <>
            <span className="font-medium">{item.user}</span> invited{' '}
            {item.target && <span className="font-medium text-orange-600 dark:text-orange-400">{item.target}</span>}
          </>
        );
      case 'edit':
        return (
          <>
            <span className="font-medium">{item.user}</span> edited{' '}
            {item.target && <span className="font-medium text-yellow-600 dark:text-yellow-400">{item.target}</span>}
          </>
        );
      default:
        return (
          <>
            <span className="font-medium">{item.user}</span> {item.action}{' '}
            {item.target && <span className="font-medium">{item.target}</span>}
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Activity Log
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Track all actions and events in your data room
        </p>
      </div>

      {/* Activity Feed */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="p-6">
          <div className="space-y-6">
            {activity.map((item, index) => {
              const ActivityIcon = getActivityIcon(item.type);
              const colorClasses = getActivityColor(item.type);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  {/* Icon */}
                  <div className={`p-2 rounded-lg ${colorClasses} flex-shrink-0`}>
                    <ActivityIcon className="h-4 w-4" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-900 dark:text-white">
                      {formatActionText(item)}
                    </div>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(item.timestamp)}</span>
                    </div>
                  </div>
                  
                  {/* Timestamp */}
                  <div className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                    {new Date(item.timestamp).toLocaleTimeString('en-US', {
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

      {/* Empty State */}
      {activity.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No activity yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Activity will appear here as users interact with your data room
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ActivityLogTab;