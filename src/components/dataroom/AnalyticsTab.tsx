import React from 'react';
import { motion } from 'framer-motion';
import * as Progress from '@radix-ui/react-progress';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Users,
  Clock,
  BarChart3,
  Calendar
} from 'lucide-react';

interface DataRoom {
  id: string;
  name: string;
  totalViews: number;
  documentCount: number;
  memberCount: number;
}

interface Document {
  id: string;
  name: string;
  views: number;
  downloads: number;
}

interface AnalyticsTabProps {
  dataRoom: DataRoom;
  documents: Document[];
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ dataRoom, documents }) => {
  const totalDownloads = documents.reduce((sum, doc) => sum + doc.downloads, 0);
  const avgViewsPerDocument = documents.length > 0 ? Math.round(dataRoom.totalViews / documents.length) : 0;
  
  const topDocuments = [...documents]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const metrics = [
    {
      name: 'Total Views',
      value: dataRoom.totalViews.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      name: 'Total Downloads',
      value: totalDownloads.toLocaleString(),
      change: '+8.2%',
      trend: 'up',
      icon: Download,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      name: 'Active Users',
      value: dataRoom.memberCount.toString(),
      change: '+2.1%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      name: 'Avg. Time Spent',
      value: '4m 32s',
      change: '+15.3%',
      trend: 'up',
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

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
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-slate-50 dark:bg-slate-700 ${metric.color}`}>
                <metric.icon className="h-6 w-6" />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.trend === 'up' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{metric.change}</span>
              </div>
            </div>
            
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {metric.value}
            </div>
            
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {metric.name}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Activity
            </h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              View Details
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between">
                <div className="text-sm text-slate-600 dark:text-slate-400 w-20">
                  {day.date}
                </div>
                <div className="flex-1 mx-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(day.views / 60) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white w-8">
                      {day.views}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                  <Download className="h-3 w-3" />
                  <span>{day.downloads}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Documents */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Top Documents
            </h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {topDocuments.map((document, index) => (
              <div key={document.id} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                  index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' :
                  index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                  'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {document.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {document.views} views • {document.downloads} downloads
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                  <Eye className="h-3 w-3" />
                  <span>{document.views}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Engagement Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
          Engagement Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              94%
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Document Completion Rate
            </div>
            <Progress.Root className="relative overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-full w-full h-2">
              <Progress.Indicator
                className="bg-blue-500 w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
                style={{ transform: `translateX(-${100 - 94}%)` }}
              />
            </Progress.Root>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {avgViewsPerDocument}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Avg. Views per Document
            </div>
            <Progress.Root className="relative overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-full w-full h-2">
              <Progress.Indicator
                className="bg-green-500 w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
                style={{ transform: `translateX(-${100 - 78}%)` }}
              />
            </Progress.Root>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              87%
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Return Visitor Rate
            </div>
            <Progress.Root className="relative overflow-hidden bg-slate-200 dark:bg-slate-700 rounded-full w-full h-2">
              <Progress.Indicator
                className="bg-purple-500 w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
                style={{ transform: `translateX(-${100 - 87}%)` }}
              />
            </Progress.Root>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;