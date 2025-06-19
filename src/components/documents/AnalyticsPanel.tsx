import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  FileText,
  Calendar,
  BarChart3,
  Users,
  Clock,
  Star
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  views: number;
  downloads: number;
  uploadedAt: string;
}

interface AnalyticsPanelProps {
  documents: Document[];
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ documents }) => {
  const totalDocuments = documents.length;
  const totalViews = documents.reduce((sum, doc) => sum + doc.views, 0);
  const totalDownloads = documents.reduce((sum, doc) => sum + doc.downloads, 0);
  
  // Calculate this month's stats (mock data for demo)
  const thisMonthViews = Math.floor(totalViews * 0.3);
  const thisMonthDownloads = Math.floor(totalDownloads * 0.25);
  
  // Most viewed document
  const mostViewedDoc = documents.reduce((prev, current) => 
    prev.views > current.views ? prev : current, documents[0]
  );

  // Recent uploads (last 7 days)
  const recentUploads = documents.filter(doc => {
    const uploadDate = new Date(doc.uploadedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return uploadDate > weekAgo;
  }).length;

  const metrics = [
    {
      name: 'Total Documents',
      value: totalDocuments.toString(),
      change: `+${recentUploads}`,
      trend: 'up',
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      name: 'Views This Month',
      value: thisMonthViews.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      name: 'Downloads This Month',
      value: thisMonthDownloads.toLocaleString(),
      change: '+8.2%',
      trend: 'up',
      icon: Download,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
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
    { date: '4 days ago', views: 35, downloads: 7 },
    { date: '5 days ago', views: 48, downloads: 11 },
    { date: '6 days ago', views: 42, downloads: 10 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 shadow-xl overflow-y-auto"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Analytics
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Document insights
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                <div className={`flex items-center space-x-1 text-xs font-medium ${
                  metric.trend === 'up' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>
              
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {metric.value}
              </div>
              
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {metric.name}
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
            className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800"
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
          className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
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
                    <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-1">
                      <div 
                        className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${(day.views / 60) * 100}%` }}
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
          className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
        >
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">
            Top Documents
          </h3>

          <div className="space-y-3">
            {topDocuments.map((document, index) => (
              <div key={document.id} className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                  index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' :
                  index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                  'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-900 dark:text-white truncate">
                    {document.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {document.views} views
                  </div>
                </div>
              </div>
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
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-200 dark:border-slate-600 text-center">
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {Math.round(totalViews / totalDocuments) || 0}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Avg. Views
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-200 dark:border-slate-600 text-center">
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
            <button
              key={period}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors duration-200 ${
                period === '30D'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {period}
            </button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPanel;