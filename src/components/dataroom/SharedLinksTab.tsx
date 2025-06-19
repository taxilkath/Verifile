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

const SharedLinksTab: React.FC<SharedLinksTabProps> = ({ sharedLinks }) => {
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
            Shared Links
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Create secure links to share your data room with external parties
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Create Link</span>
        </button>
      </div>

      {/* Links List */}
      <div className="space-y-4">
        {sharedLinks.map((link, index) => {
          const PermissionIcon = getPermissionIcon(link.permissions);
          const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();
          
          return (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-slate-800 rounded-xl border p-6 transition-all duration-200 hover:shadow-lg ${
                isExpired 
                  ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' 
                  : link.isActive
                  ? 'border-slate-200 dark:border-slate-700'
                  : 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-3 rounded-lg ${
                    isExpired 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : link.isActive
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                  }`}>
                    <PermissionIcon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {link.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        isExpired
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : link.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                      }`}>
                        {isExpired ? 'Expired' : link.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 mb-3">
                      <div className="flex items-center space-x-2">
                        <code className="text-sm text-slate-600 dark:text-slate-300 flex-1 truncate">
                          {link.url}
                        </code>
                        <button
                          onClick={() => copyToClipboard(link.url)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => window.open(link.url, '_blank')}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{link.views} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Created {formatDate(link.createdAt)}</span>
                      </div>
                      {link.expiresAt && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Expires {formatDate(link.expiresAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200">
                    <Settings className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {sharedLinks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Link className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No shared links yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Create secure links to share your data room with external parties
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            Create Your First Link
          </button>
        </motion.div>
      )}

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