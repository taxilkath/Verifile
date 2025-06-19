import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Download, 
  FileText, 
  Star,
  Calendar,
  Users,
  X
} from 'lucide-react';
import { Document } from '../../types/documents';

interface DocumentsSidebarProps {
  documents: Document[];
  onStatClick?: (statType: string) => void;
}

const DocumentsSidebar: React.FC<DocumentsSidebarProps> = ({ documents, onStatClick }) => {
  const totalDocuments = documents.length;
  const totalViews = documents.reduce((sum, doc) => sum + doc.views, 0);
  const totalDownloads = documents.reduce((sum, doc) => sum + doc.downloads, 0);
  
  // Calculate this month's stats (mock data for demo)
  const thisMonthViews = Math.floor(totalViews * 0.3);
  const thisMonthDownloads = Math.floor(totalDownloads * 0.25);
  
  // Most viewed document
  const mostViewedDoc = documents.length > 0 ? documents.reduce((prev, current) => 
    prev.views > current.views ? prev : current, documents[0]
  ) : null;

  // Recent uploads (last 7 days)
  const recentUploads = documents.filter(doc => {
    const uploadDate = new Date(doc.uploadedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return uploadDate > weekAgo;
  }).length;

  const stats = [
    {
      name: 'Total Documents',
      value: totalDocuments.toString(),
      change: `+${recentUploads}`,
      trend: 'up',
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      clickType: 'total'
    },
    {
      name: 'Views This Month',
      value: thisMonthViews.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      clickType: 'most-viewed'
    },
    {
      name: 'Downloads This Month',
      value: thisMonthDownloads.toLocaleString(),
      change: '+8.2%',
      trend: 'up',
      icon: Download,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      clickType: 'downloads'
    }
  ];

  const topDocuments = [...documents]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const recentActivity = [
    { date: 'Today', views: 45, downloads: 12 },
    { date: 'Yesterday', views: 38, downloads: 8 },
    { date: '2 days ago', views: 52, downloads: 15 },
    { date: '3 days ago', views: 41, downloads: 9 },
    { date: '4 days ago', views: 35, downloads: 7 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed right-0 top-0 h-full w-80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-l border-slate-200/50 dark:border-slate-700/50 shadow-2xl overflow-y-auto z-40"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Insights
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Document analytics
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => onStatClick?.(stat.clickType)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className={`flex items-center space-x-1 text-xs font-medium ${
                  stat.trend === 'up' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {stat.value}
              </div>
              
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {stat.name}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Most Viewed Document */}
        {mostViewedDoc && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 backdrop-blur-sm rounded-2xl p-4 border border-yellow-200/50 dark:border-yellow-800/50"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                Most Viewed This Month
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className="font-medium text-slate-900 dark:text-white text-sm line-clamp-2">
                {mostViewedDoc.name}
              </div>
              <div className="flex items-center space-x-4 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{mostViewedDoc.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="h-3 w-3" />
                  <span>{mostViewedDoc.downloads} downloads</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 dark:border-slate-600/50"
        >
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">
            Recent Activity
          </h3>

          <div className="space-y-3">
            {recentActivity.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between">
                <div className="text-xs text-slate-600 dark:text-slate-400 w-16">
                  {day.date}
                </div>
                <div className="flex-1 mx-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200/50 dark:bg-slate-600/50 rounded-full h-1">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(day.views / 60) * 100}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-900 dark:text-white w-6">
                      {day.views}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                  <Download className="h-2 w-2" />
                  <span>{day.downloads}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 dark:border-slate-600/50"
        >
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">
            Top Documents
          </h3>

          <div className="space-y-3">
            {topDocuments.map((document, index) => (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-2 hover:bg-white/80 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-300 cursor-pointer group"
                whileHover={{ scale: 1.02 }}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white' :
                  index === 2 ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white' :
                  'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {document.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {document.views} views
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="bg-white/80 dark:bg-slate-700/50 backdrop-blur-sm rounded-xl p-3 border border-slate-200/50 dark:border-slate-600/50 text-center">
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {Math.round(totalViews / totalDocuments) || 0}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Avg. Views
            </div>
          </div>
          
          <div className="bg-white/80 dark:bg-slate-700/50 backdrop-blur-sm rounded-xl p-3 border border-slate-200/50 dark:border-slate-600/50 text-center">
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              94%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Engagement
            </div>
          </div>
        </motion.div>

        {/* Time Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center space-x-2"
        >
          {['7D', '30D', '90D'].map((period) => (
            <motion.button
              key={period}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                period === '30D'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {period}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DocumentsSidebar;