import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as ContextMenu from '@radix-ui/react-context-menu';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { 
  FolderOpen, 
  FolderClosed,
  Plus, 
  X, 
  Edit3, 
  Trash2, 
  MoreVertical,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Folder } from '../../types/documents';
import { toast } from 'sonner';

interface FoldersSectionProps {
  folders: Folder[];
  selectedFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onFolderCreate: (folder: Folder) => void;
  onFolderUpdate: (id: string, updates: Partial<Folder>) => void;
  onFolderDelete: (id: string) => void;
}

const FoldersSection: React.FC<FoldersSectionProps> = ({
  folders,
  selectedFolder,
  onFolderSelect,
  onFolderCreate,
  onFolderUpdate,
  onFolderDelete
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderEmoji, setNewFolderEmoji] = useState('📁');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: Folder = {
      id: Math.random().toString(36).substr(2, 9),
      name: newFolderName.trim(),
      emoji: newFolderEmoji,
      documents: [],
      createdAt: new Date().toISOString(),
      dataRoom: 'Default'
    };

    onFolderCreate(newFolder);
    setNewFolderName('');
    setNewFolderEmoji('📁');
    setShowCreateDialog(false);
    toast.success('Folder created successfully');
  };

  const handleRenameFolder = (folderId: string, newName: string) => {
    if (newName.trim()) {
      onFolderUpdate(folderId, { name: newName.trim() });
      toast.success('Folder renamed successfully');
    }
    setEditingFolder(null);
  };

  const handleDeleteFolder = (folderId: string) => {
    onFolderDelete(folderId);
    toast.success('Folder deleted successfully');
  };

  const toggleFolderExpansion = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const emojis = ['📁', '📂', '💼', '📊', '📋', '🗂️', '📑', '📄', '💰', '⚖️', '🔒', '🎯'];

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Folders
          </h2>
          <motion.button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-4 w-4" />
            <span>New Folder</span>
          </motion.button>
        </div>

        {/* All Documents Button */}
        <motion.button
          onClick={() => onFolderSelect(null)}
          className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 mb-2 ${
            selectedFolder === null
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : 'bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FolderOpen className="h-5 w-5" />
          <span className="font-medium">All Documents</span>
        </motion.button>

        {/* Folders List */}
        <div className="space-y-2">
          <AnimatePresence>
            {folders.map((folder, index) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <ContextMenu.Root>
                  <ContextMenu.Trigger asChild>
                    <div
                      className={`group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl transition-all duration-300 hover:shadow-lg ${
                        selectedFolder === folder.id
                          ? 'ring-2 ring-blue-500/50 shadow-lg'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between p-3">
                        <div 
                          className="flex items-center space-x-3 flex-1 cursor-pointer"
                          onClick={() => onFolderSelect(folder.id)}
                        >
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFolderExpansion(folder.id);
                            }}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {expandedFolders.has(folder.id) ? (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-400" />
                            )}
                          </motion.button>
                          
                          <div className="text-xl">{folder.emoji}</div>
                          
                          {editingFolder === folder.id ? (
                            <input
                              type="text"
                              defaultValue={folder.name}
                              onBlur={(e) => handleRenameFolder(folder.id, e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleRenameFolder(folder.id, e.currentTarget.value);
                                }
                              }}
                              className="flex-1 bg-transparent border-none outline-none font-medium text-slate-900 dark:text-white"
                              autoFocus
                            />
                          ) : (
                            <span className="font-medium text-slate-900 dark:text-white">
                              {folder.name}
                            </span>
                          )}
                          
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            ({folder.documents.length})
                          </span>
                        </div>

                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <motion.button
                              className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </motion.button>
                          </DropdownMenu.Trigger>

                          <DropdownMenu.Portal>
                            <DropdownMenu.Content
                              className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-2 min-w-[160px] z-50"
                              sideOffset={5}
                            >
                              <DropdownMenu.Item
                                className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-700/80 cursor-pointer transition-colors"
                                onClick={() => setEditingFolder(folder.id)}
                              >
                                <Edit3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium text-slate-900 dark:text-white">Rename</span>
                              </DropdownMenu.Item>

                              <DropdownMenu.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-1" />

                              <DropdownMenu.Item
                                className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors"
                                onClick={() => handleDeleteFolder(folder.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <span className="text-sm font-medium text-red-600 dark:text-red-400">Delete</span>
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </div>

                      {/* Folder Contents */}
                      <AnimatePresence>
                        {expandedFolders.has(folder.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-slate-200/50 dark:border-slate-700/50 p-3 pt-2"
                          >
                            {folder.documents.length > 0 ? (
                              <div className="space-y-1">
                                {folder.documents.slice(0, 3).map((doc) => (
                                  <div key={doc.id} className="text-sm text-slate-600 dark:text-slate-400 pl-4">
                                    • {doc.name}
                                  </div>
                                ))}
                                {folder.documents.length > 3 && (
                                  <div className="text-sm text-slate-500 dark:text-slate-500 pl-4">
                                    ... and {folder.documents.length - 3} more
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-sm text-slate-500 dark:text-slate-500 pl-4 italic">
                                Empty folder
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </ContextMenu.Trigger>

                  <ContextMenu.Portal>
                    <ContextMenu.Content className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-2 min-w-[160px] z-50">
                      <ContextMenu.Item
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-700/80 cursor-pointer transition-colors"
                        onClick={() => setEditingFolder(folder.id)}
                      >
                        <Edit3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">Rename</span>
                      </ContextMenu.Item>

                      <ContextMenu.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-1" />

                      <ContextMenu.Item
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors"
                        onClick={() => handleDeleteFolder(folder.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">Delete</span>
                      </ContextMenu.Item>
                    </ContextMenu.Content>
                  </ContextMenu.Portal>
                </ContextMenu.Root>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Create Folder Dialog */}
      <Dialog.Root open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <AnimatePresence>
          {showCreateDialog && (
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
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", duration: 0.3 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 w-full max-w-md z-50"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <Dialog.Title className="text-xl font-bold text-slate-900 dark:text-white">
                        Create New Folder
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <motion.button
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X className="h-5 w-5" />
                        </motion.button>
                      </Dialog.Close>
                    </div>

                    <div className="space-y-4">
                      {/* Emoji Selector */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Choose an emoji
                        </label>
                        <div className="grid grid-cols-6 gap-2">
                          {emojis.map((emoji) => (
                            <motion.button
                              key={emoji}
                              onClick={() => setNewFolderEmoji(emoji)}
                              className={`p-3 text-xl rounded-xl transition-all duration-200 ${
                                newFolderEmoji === emoji
                                  ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500/50'
                                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {emoji}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Folder Name */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Folder Name
                        </label>
                        <input
                          type="text"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          placeholder="Enter folder name"
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                          autoFocus
                        />
                      </div>

                      {/* Preview */}
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Preview:</div>
                        <div className="flex items-center space-x-3">
                          <div className="text-xl">{newFolderEmoji}</div>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {newFolderName || 'Untitled Folder'}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <Dialog.Close asChild>
                          <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Cancel
                          </button>
                        </Dialog.Close>
                        <motion.button
                          onClick={handleCreateFolder}
                          disabled={!newFolderName.trim()}
                          className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Create Folder
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </>
  );
};

export default FoldersSection;