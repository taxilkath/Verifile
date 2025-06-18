import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className = '' }) => {
  return (
    <motion.div
      className={`bg-slate-200 dark:bg-slate-700 rounded-lg ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export const WelcomeWidgetSkeleton = () => (
  <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl p-8 animate-pulse">
    <SkeletonLoader className="h-6 w-32 mb-4" />
    <SkeletonLoader className="h-8 w-64 mb-2" />
    <SkeletonLoader className="h-6 w-96 mb-6" />
    <div className="flex space-x-4">
      <SkeletonLoader className="h-12 w-32" />
      <SkeletonLoader className="h-12 w-40" />
    </div>
  </div>
);

export const RecentActivitySkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
    <div className="flex items-center justify-between mb-6">
      <SkeletonLoader className="h-6 w-32" />
      <SkeletonLoader className="h-4 w-16" />
    </div>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-start space-x-3 p-3">
          <SkeletonLoader className="w-8 h-8 rounded-lg" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader className="h-4 w-48" />
            <SkeletonLoader className="h-3 w-32" />
          </div>
          <SkeletonLoader className="h-3 w-16" />
        </div>
      ))}
    </div>
  </div>
);

export const DataRoomOverviewSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
    <div className="flex items-center justify-between mb-6">
      <SkeletonLoader className="h-6 w-24" />
      <SkeletonLoader className="h-10 w-28" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
          <SkeletonLoader className="w-10 h-10 rounded-lg mb-3" />
          <SkeletonLoader className="h-5 w-32 mb-1" />
          <SkeletonLoader className="h-4 w-48 mb-4" />
          <div className="grid grid-cols-3 gap-2">
            <SkeletonLoader className="h-3 w-8" />
            <SkeletonLoader className="h-3 w-8" />
            <SkeletonLoader className="h-3 w-8" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonLoader;