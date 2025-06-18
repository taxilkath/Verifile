import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  FileText, 
  FolderOpen, 
  Users, 
  Settings,
  BarChart3,
  Share2
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose }) => {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Command className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-700 border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="flex items-center border-b border-slate-200 dark:border-slate-700 px-4">
                  <Search className="h-4 w-4 text-slate-400 mr-3" />
                  <Command.Input
                    placeholder="Search for commands, documents, or people..."
                    className="flex-1 py-4 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                  />
                </div>

                <Command.List className="max-h-96 overflow-y-auto p-2">
                  <Command.Empty className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    No results found.
                  </Command.Empty>

                  <Command.Group heading="Quick Actions">
                    <Command.Item className="flex items-center px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <FolderOpen className="h-4 w-4 mr-3 text-blue-500" />
                      Create new data room
                    </Command.Item>
                    <Command.Item className="flex items-center px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <FileText className="h-4 w-4 mr-3 text-green-500" />
                      Upload document
                    </Command.Item>
                    <Command.Item className="flex items-center px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <Users className="h-4 w-4 mr-3 text-purple-500" />
                      Invite team member
                    </Command.Item>
                  </Command.Group>

                  <Command.Group heading="Navigation">
                    <Command.Item className="flex items-center px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <BarChart3 className="h-4 w-4 mr-3 text-orange-500" />
                      Analytics
                    </Command.Item>
                    <Command.Item className="flex items-center px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <Share2 className="h-4 w-4 mr-3 text-cyan-500" />
                      Shared Links
                    </Command.Item>
                    <Command.Item className="flex items-center px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <Settings className="h-4 w-4 mr-3 text-slate-500" />
                      Settings
                    </Command.Item>
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;