import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Switch from '@radix-ui/react-switch';
import {
  X,
  FileText,
  Eye,
  Download,
  Share2,
  MoreVertical,
  Link,
  Users,
  BarChart3,
  Clock,
  Calendar,
  Globe,
  Shield,
  Copy,
  ExternalLink,
  Settings,
  Trash2,
  Edit3,
  Plus,
  ChevronDown,
  Activity,
  TrendingUp,
  AlertCircle,
  Palette
} from 'lucide-react';
import { Document } from '../../types/documents';
import BrandingTab from '../dataroom/BrandingTab';
import { toast } from 'sonner';

interface DocumentDetailDrawerProps {
  document: Document | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Document>) => void;
  onDelete: (id: string) => void;
}

interface SharedLink {
  id: string;
  name: string;
  url: string;
  views: number;
  lastViewed: string;
  active: boolean;
  controls: number;
  createdAt: string;
}

interface Visitor {
  id: string;
  name: string;
  email?: string;
  visitDuration: string;
  visitCompletion: number;
  lastViewed: string;
  location?: string;
  device?: string;
}

interface AnalyticsData {
  totalViews: number;
  totalDownloads: number;
  avgTimeSpent: string;
  completionRate: number;
  viewsToday: number;
  viewsThisWeek: number;
  viewsThisMonth: number;
  topCountries: Array<{ country: string; views: number }>;
  deviceBreakdown: Array<{ device: string; percentage: number }>;
  timeSpentData: Array<{ date: string; time: number }>;
}

const DocumentDetailDrawer: React.FC<DocumentDetailDrawerProps> = ({
  document,
  open,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [excludeInternalVisits, setExcludeInternalVisits] = useState(true);
  const [timeSpentPerPage, setTimeSpentPerPage] = useState(true);

  // Mock data - in real app this would come from API
  const [sharedLinks] = useState<SharedLink[]>([
    {
      id: '1',
      name: 'Link #jpjyz',
      url: 'https://www.verifile.com/view/cmc3pni4a000ajs04dcx09tr4',
      views: 0,
      lastViewed: '-',
      active: true,
      controls: 2,
      createdAt: '2024-01-15T10:30:00Z'
    }
  ]);

  const [visitors] = useState<Visitor[]>([
    {
      id: '1',
      name: 'Anonymous User',
      visitDuration: '2m 34s',
      visitCompletion: 85,
      lastViewed: '2 hours ago',
      location: 'San Francisco, CA',
      device: 'Desktop'
    },
    {
      id: '2',
      name: 'john@company.com',
      visitDuration: '4m 12s',
      visitCompletion: 100,
      lastViewed: '1 day ago',
      location: 'New York, NY',
      device: 'Mobile'
    }
  ]);

  const [analytics] = useState<AnalyticsData>({
    totalViews: document?.views || 0,
    totalDownloads: document?.downloads || 0,
    avgTimeSpent: '3m 45s',
    completionRate: 92,
    viewsToday: 12,
    viewsThisWeek: 45,
    viewsThisMonth: 156,
    topCountries: [
      { country: 'United States', views: 89 },
      { country: 'United Kingdom', views: 34 },
      { country: 'Canada', views: 23 }
    ],
    deviceBreakdown: [
      { device: 'Desktop', percentage: 65 },
      { device: 'Mobile', percentage: 28 },
      { device: 'Tablet', percentage: 7 }
    ],
    timeSpentData: [
      { date: 'Mon', time: 180 },
      { date: 'Tue', time: 220 },
      { date: 'Wed', time: 195 },
      { date: 'Thu', time: 240 },
      { date: 'Fri', time: 210 },
      { date: 'Sat', time: 165 },
      { date: 'Sun', time: 185 }
    ]
  });

  if (!document) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleCreateLink = () => {
    toast.success('New share link created!');
  };

  const handleDownload = () => {
    onUpdate(document.id, { downloads: document.downloads + 1 });
    toast.success('Download started');
  };

  const handleDelete = () => {
    onDelete(document.id);
    onClose();
    toast.success('Document deleted');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>
            
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-bold text-slate-900 dark:text-white">
                        {document.name}
                      </Dialog.Title>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {formatFileSize(document.size)} • {document.dataRoom}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Settings Toggle */}
                    <div className="flex items-center space-x-4 mr-4">
                      <div className="flex items-center space-x-2">
                        <Switch.Root
                          checked={excludeInternalVisits}
                          onCheckedChange={setExcludeInternalVisits}
                          className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
                        >
                          <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform data-[state=checked]:translate-x-5 translate-x-0.5" />
                        </Switch.Root>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Exclude internal visits
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <motion.button
                      onClick={() => window.open(document.url, '_blank')}
                      className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </motion.button>
                    
                    <motion.button
                      onClick={handleDownload}
                      className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="h-5 w-5" />
                    </motion.button>

                    <motion.button
                      onClick={handleCreateLink}
                      className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Create Link
                    </motion.button>

                    {/* More Actions */}
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <motion.button
                          className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <MoreVertical className="h-5 w-5" />
                        </motion.button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 min-w-[200px] z-50"
                          sideOffset={5}
                        >
                          <DropdownMenu.Item className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                            <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-slate-900 dark:text-white">Set download only</span>
                            <span className="ml-auto text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full">PRO</span>
                          </DropdownMenu.Item>

                          <DropdownMenu.Item className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                            <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-slate-900 dark:text-white">Export visits</span>
                            <span className="ml-auto text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full">PRO</span>
                          </DropdownMenu.Item>

                          <DropdownMenu.Item className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                            <Download className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                            <span className="text-sm font-medium text-slate-900 dark:text-white">Download latest version</span>
                          </DropdownMenu.Item>

                          <DropdownMenu.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-2" />

                          <DropdownMenu.Item
                            className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors"
                            onClick={handleDelete}
                          >
                            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                            <span className="text-sm font-medium text-red-600 dark:text-red-400">Delete document</span>
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                    
                    <Dialog.Close asChild>
                      <motion.button
                        className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X className="h-5 w-5" />
                      </motion.button>
                    </Dialog.Close>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                  <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                    <Tabs.List className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                      <Tabs.Trigger
                        value="overview"
                        className={`px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                          activeTab === 'overview'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Overview
                      </Tabs.Trigger>
                      <Tabs.Trigger
                        value="links"
                        className={`px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                          activeTab === 'links'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        All links ({sharedLinks.length})
                      </Tabs.Trigger>
                      <Tabs.Trigger
                        value="visitors"
                        className={`px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                          activeTab === 'visitors'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        All visitors ({visitors.length})
                      </Tabs.Trigger>
                      <Tabs.Trigger
                        value="branding"
                        className={`px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                          activeTab === 'branding'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Palette className="h-4 w-4" />
                          <span>Branding</span>
                        </div>
                      </Tabs.Trigger>
                    </Tabs.List>

                    <div className="flex-1 overflow-y-auto">
                      <Tabs.Content value="overview" className="p-6 space-y-6">
                        {/* Analytics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                              {analytics.totalViews}
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">Total Views</div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-800"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <Download className="h-8 w-8 text-green-600 dark:text-green-400" />
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">
                              {analytics.totalDownloads}
                            </div>
                            <div className="text-sm text-green-700 dark:text-green-300">Downloads</div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-1">
                              {analytics.avgTimeSpent}
                            </div>
                            <div className="text-sm text-purple-700 dark:text-purple-300">Avg. Time Spent</div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100 mb-1">
                              {analytics.completionRate}%
                            </div>
                            <div className="text-sm text-orange-700 dark:text-orange-300">Completion Rate</div>
                          </motion.div>
                        </div>

                        {/* Time Spent Chart */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              Time Spent Per Page
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Switch.Root
                                checked={timeSpentPerPage}
                                onCheckedChange={setTimeSpentPerPage}
                                className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
                              >
                                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform data-[state=checked]:translate-x-5 translate-x-0.5" />
                              </Switch.Root>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                Example time spent per page
                              </span>
                            </div>
                          </div>

                          <div className="h-64 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center">
                            <div className="text-center">
                              <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                              <p className="text-slate-600 dark:text-slate-400">
                                Interactive time spent chart would appear here
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Device & Location Stats */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
                          >
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                              Device Breakdown
                            </h3>
                            <div className="space-y-3">
                              {analytics.deviceBreakdown.map((device, index) => (
                                <div key={device.device} className="flex items-center justify-between">
                                  <span className="text-slate-600 dark:text-slate-400">{device.device}</span>
                                  <div className="flex items-center space-x-3">
                                    <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                      <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${device.percentage}%` }}
                                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white w-10 text-right">
                                      {device.percentage}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
                          >
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                              Top Countries
                            </h3>
                            <div className="space-y-3">
                              {analytics.topCountries.map((country, index) => (
                                <div key={country.country} className="flex items-center justify-between">
                                  <span className="text-slate-600 dark:text-slate-400">{country.country}</span>
                                  <div className="flex items-center space-x-3">
                                    <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                      <motion.div
                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(country.views / analytics.topCountries[0].views) * 100}%` }}
                                        transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white w-8 text-right">
                                      {country.views}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </Tabs.Content>

                      <Tabs.Content value="links" className="p-6">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              All links
                            </h3>
                            <motion.button
                              onClick={handleCreateLink}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Plus className="h-4 w-4 mr-2 inline" />
                              Create Link
                            </motion.button>
                          </div>

                          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                  <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                      Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                      Link
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                      Views
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                      Last Viewed
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                      Active
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                  {sharedLinks.map((link) => (
                                    <motion.tr
                                      key={link.id}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                      <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                                            {link.name}
                                          </div>
                                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                            Updated
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                          <code className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                            {link.url}
                                          </code>
                                          <button
                                            onClick={() => handleCopyLink(link.url)}
                                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                          >
                                            <Copy className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                          <Eye className="h-4 w-4 text-slate-400" />
                                          <span className="text-sm text-slate-900 dark:text-white">
                                            {link.views} views
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                        {link.lastViewed}
                                      </td>
                                      <td className="px-6 py-4">
                                        <Switch.Root
                                          checked={link.active}
                                          className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative data-[state=checked]:bg-green-500 transition-colors"
                                        >
                                          <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform data-[state=checked]:translate-x-5 translate-x-0.5" />
                                        </Switch.Root>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                        <DropdownMenu.Root>
                                          <DropdownMenu.Trigger asChild>
                                            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors">
                                              <MoreVertical className="h-4 w-4" />
                                            </button>
                                          </DropdownMenu.Trigger>
                                          <DropdownMenu.Portal>
                                            <DropdownMenu.Content className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2 min-w-[160px] z-50">
                                              <DropdownMenu.Item className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                                <Settings className="h-4 w-4" />
                                                <span className="text-sm">Edit Link</span>
                                              </DropdownMenu.Item>
                                              <DropdownMenu.Item className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                                <Eye className="h-4 w-4" />
                                                <span className="text-sm">Preview Link</span>
                                              </DropdownMenu.Item>
                                              <DropdownMenu.Item className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                                <Copy className="h-4 w-4" />
                                                <span className="text-sm">Duplicate Link</span>
                                              </DropdownMenu.Item>
                                            </DropdownMenu.Content>
                                          </DropdownMenu.Portal>
                                        </DropdownMenu.Root>
                                      </td>
                                    </motion.tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </Tabs.Content>

                      <Tabs.Content value="visitors" className="p-6">
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            All visitors
                          </h3>

                          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                  <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                      Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                      Visit Duration
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                      Visit Completion
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                      Last Viewed
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                  {visitors.length > 0 ? visitors.map((visitor) => (
                                    <motion.tr
                                      key={visitor.id}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                      <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                              {visitor.name.charAt(0)}
                                            </span>
                                          </div>
                                          <div>
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                                              {visitor.name}
                                            </div>
                                            {visitor.location && (
                                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                                {visitor.location}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                                        {visitor.visitDuration}
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                                              style={{ width: `${visitor.visitCompletion}%` }}
                                            />
                                          </div>
                                          <span className="text-sm text-slate-900 dark:text-white">
                                            {visitor.visitCompletion}%
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                        {visitor.lastViewed}
                                      </td>
                                    </motion.tr>
                                  )) : (
                                    <tr>
                                      <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="text-slate-500 dark:text-slate-400">
                                          No visits yet. Try sharing a link.
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {visitors.length > 0 && (
                            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                              <span>Showing {visitors.length} of {visitors.length} visits</span>
                              <div className="flex items-center space-x-2">
                                <span>Items per page</span>
                                <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1">
                                  <option>10</option>
                                  <option>25</option>
                                  <option>50</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      </Tabs.Content>

                      <Tabs.Content value="branding" className="p-6">
                        <BrandingTab />
                      </Tabs.Content>
                    </div>
                  </Tabs.Root>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default DocumentDetailDrawer;