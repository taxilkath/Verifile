import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import {
  Link,
  Plus,
  Copy,
  ExternalLink,
  Eye,
  Calendar,
  Settings,
  Trash2,
  Check,
  ChevronDown,
  X,
  Globe,
  Lock,
  Users,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface SharedLink {
  id: string;
  name: string;
  url: string;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  views: number;
  isActive: boolean;
  permissions: string[];
}

interface SharedLinksTabProps {
  sharedLinks: SharedLink[];
}

const SharedLinksTab: React.FC<SharedLinksTabProps> = ({ sharedLinks = [] }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLink, setNewLink] = useState({
    name: '',
    permissions: ['view'],
    expiresAt: '',
    password: '',
    allowDownload: true
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const getPermissionIcon = (permissions: string[]) => {
    if (permissions.includes('edit')) return Shield;
    if (permissions.includes('download')) return Globe;
    return Eye;
  };

  const handleCreateLink = () => {
    // Simulate link creation
    const generatedUrl = `https://verifile.com/share/${Math.random().toString(36).substr(2, 9)}`;
    console.log('Creating link:', { ...newLink, url: generatedUrl });
    setShowCreateModal(false);
    setNewLink({
      name: '',
      permissions: ['view'],
      expiresAt: '',
      password: '',
      allowDownload: true
    });
    toast.success('Shared link created successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Links
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Share data room with strong access controls using links.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm">
            Links
          </button>
          <button className="px-3 py-1 text-slate-500 dark:text-slate-400 rounded-lg text-sm">
            Groups
          </button>
        </div>
      </div>

      {/* Links List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Link</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Last Viewed</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Active</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400"></th>
            </tr>
          </thead>
          <tbody>
            {sharedLinks.length > 0 ? (
              sharedLinks.map((link) => {
                const PermissionIcon = getPermissionIcon(link.permissions);
                return (
                  <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-slate-900 dark:text-white">
                      {link.name}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="bg-slate-100 dark:bg-slate-700 rounded px-2 py-1 text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate">
                          {link.url}
                        </div>
                        <button 
                          onClick={() => copyToClipboard(link.url)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => window.open(link.url, '_blank')}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400">
                      {link.views > 0 ? formatDate(link.createdAt) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={link.isActive} />
                          <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                          <span className="ml-2 text-sm text-slate-900 dark:text-white">{link.isActive ? 'Yes' : 'No'}</span>
                        </label>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <Settings className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400">
                  No shared links yet. Create your first link to share this data room.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Active Link Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
          Active Link Controls
        </h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Require email to view
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Receive email notification
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Allow downloads
            </span>
          </div>
        </div>
        <button 
          className="w-full mt-3 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
        >
          Configure link
        </button>
      </div>

      {/* Create Link Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Create Link</span>
        </button>
      </div>

      {/* Create Link Modal */}
      <Dialog.Root open={showCreateModal} onOpenChange={setShowCreateModal}>
        <AnimatePresence>
          {showCreateModal && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                />
              </Dialog.Overlay>
              
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.3 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md z-50"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <Dialog.Title className="text-xl font-semibold text-slate-900 dark:text-white">
                        Create Shared Link
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200">
                          <X className="h-5 w-5" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="space-y-4">
                      {/* Link Name */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Link Name
                        </label>
                        <input
                          type="text"
                          value={newLink.name}
                          onChange={(e) => setNewLink(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Investor Access"
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      {/* Permissions */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Permissions
                        </label>
                        <Select.Root
                          value={newLink.permissions[0]}
                          onValueChange={(value) => setNewLink(prev => ({ ...prev, permissions: [value] }))}
                        >
                          <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <Select.Value />
                            <ChevronDown className="h-4 w-4" />
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                              <Select.Item value="view" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                View Only
                              </Select.Item>
                              <Select.Item value="download" className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                View & Download
                              </Select.Item>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>

                      {/* Expiration */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Expiration Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={newLink.expiresAt}
                          onChange={(e) => setNewLink(prev => ({ ...prev, expiresAt: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      {/* Password Protection */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Password Protection (Optional)
                        </label>
                        <input
                          type="password"
                          value={newLink.password}
                          onChange={(e) => setNewLink(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter password"
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <Dialog.Close asChild>
                        <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button
                        onClick={handleCreateLink}
                        disabled={!newLink.name}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Create Link
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
};

export default SharedLinksTab;