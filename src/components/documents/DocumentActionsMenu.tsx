import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { 
  MoreVertical, 
  Edit3, 
  FolderOpen, 
  RefreshCw, 
  Trash2, 
  X,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';
import { Document } from '../../types/documents';
import { toast } from 'sonner';

interface DocumentActionsMenuProps {
  document: Document;
  onUpdate: (id: string, updates: Partial<Document>) => void;
  onDelete: (id: string) => void;
}

const DocumentActionsMenu: React.FC<DocumentActionsMenuProps> = ({
  document,
  onUpdate,
  onDelete
}) => {
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newName, setNewName] = useState(document.name);
  const [selectedDataRoom, setSelectedDataRoom] = useState(document.dataRoom);

  const dataRooms = [
    'Series A Fundraising',
    'Legal Documents',
    'Product Strategy',
    'Company Assets',
    'Board Materials'
  ];

  const handleRename = () => {
    if (newName.trim() && newName !== document.name) {
      onUpdate(document.id, { name: newName.trim() });
      toast.success('Document renamed successfully');
    }
    setShowRenameDialog(false);
  };

  const handleMove = () => {
    if (selectedDataRoom !== document.dataRoom) {
      onUpdate(document.id, { dataRoom: selectedDataRoom });
      toast.success(`Moved to ${selectedDataRoom}`);
    }
    setShowMoveDialog(false);
  };

  const handleDelete = () => {
    onDelete(document.id);
    toast.success('Document deleted');
    setShowDeleteDialog(false);
  };

  const handleReplace = () => {
    // Simulate file picker
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = () => {
      if (input.files?.[0]) {
        toast.success('File replacement started');
      }
    };
    input.click();
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <motion.button
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreVertical className="h-4 w-4" />
          </motion.button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 min-w-[200px] z-50"
            sideOffset={5}
          >
            <DropdownMenu.Item
              className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200"
              onClick={() => setShowRenameDialog(true)}
            >
              <Edit3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-white">Rename</span>
            </DropdownMenu.Item>

            <DropdownMenu.Item
              className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200"
              onClick={() => setShowMoveDialog(true)}
            >
              <FolderOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-white">Move to Data Room</span>
            </DropdownMenu.Item>

            <DropdownMenu.Item
              className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200"
              onClick={handleReplace}
            >
              <RefreshCw className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-white">Replace</span>
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-2" />

            <DropdownMenu.Item
              className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors duration-200"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">Delete</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Rename Dialog */}
      <Dialog.Root open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <AnimatePresence>
          {showRenameDialog && (
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
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md z-50"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-white">
                        Rename Document
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl transition-colors">
                          <X className="h-5 w-5" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Document Name
                        </label>
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          autoFocus
                        />
                      </div>

                      <div className="flex justify-end space-x-3">
                        <Dialog.Close asChild>
                          <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Cancel
                          </button>
                        </Dialog.Close>
                        <motion.button
                          onClick={handleRename}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Rename
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

      {/* Move Dialog */}
      <Dialog.Root open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <AnimatePresence>
          {showMoveDialog && (
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
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md z-50"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-white">
                        Move to Data Room
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl transition-colors">
                          <X className="h-5 w-5" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Select Data Room
                        </label>
                        <Select.Root value={selectedDataRoom} onValueChange={setSelectedDataRoom}>
                          <Select.Trigger className="w-full flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <Select.Value />
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 p-2">
                              {dataRooms.map((room) => (
                                <Select.Item key={room} value={room} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                                  {room}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <Dialog.Close asChild>
                          <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Cancel
                          </button>
                        </Dialog.Close>
                        <motion.button
                          onClick={handleMove}
                          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Move
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

      {/* Delete Dialog */}
      <Dialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AnimatePresence>
          {showDeleteDialog && (
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
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md z-50"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-white">
                          Delete Document
                        </Dialog.Title>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          This action cannot be undone
                        </p>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6">
                      <p className="text-sm text-red-800 dark:text-red-200">
                        Are you sure you want to delete <strong>{document.name}</strong>? 
                        This will permanently remove the document and all its associated data.
                      </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Dialog.Close asChild>
                        <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                          Cancel
                        </button>
                      </Dialog.Close>
                      <motion.button
                        onClick={handleDelete}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Delete
                      </motion.button>
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

export default DocumentActionsMenu;