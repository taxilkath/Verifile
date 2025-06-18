import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Users,
  Eye,
  Download
} from 'lucide-react';

const metrics = [
  {
    name: 'Document Views',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: Eye,
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    name: 'Downloads',
    value: '1,234',
    change: '+8.2%',
    trend: 'up',
    icon: Download,
    color: 'text-green-600 dark:text-green-400'
  },
  {
    name: 'Active Users',
    value: '89',
    change: '-2.1%',
    trend: 'down',
    icon: Users,
    color: 'text-purple-600 dark:text-purple-400'
  },
  {
    name: 'Engagement Rate',
    value: '94.2%',
    change: '+5.7%',
    trend: 'up',
    icon: BarChart3,
    color: 'text-orange-600 dark:text-orange-400'
  }
];

const AnalyticsPreview = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Analytics Overview
        </h2>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          View Details
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-white dark:bg-slate-800 ${metric.color}`}>
                <metric.icon className="h-4 w-4" />
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

      {/* Chart placeholder */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="h-32 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl flex items-center justify-center border border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <BarChart3 className="h-8 w-8 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Interactive charts coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPreview;