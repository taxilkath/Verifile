import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { X, FileText, Download, Share2, Eye } from 'lucide-react';
import { Document } from '../../types/documents';

interface DocumentPreviewDialogProps {
  document: Document | null;
  open: boolean;
  onClose: () => void;
}

const DocumentPreviewDialog: React.FC<DocumentPreviewDialogProps> = ({
  document,
  open,
  onClose
}) => {
  if (!document) return null;

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
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden z-50"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-bold text-slate-900 dark:text-white">
                        {document.name}
                      </Dialog.Title>
                      <p className="text-slate-600 dark:text-slate-400">
                        {document.dataRoom} • {document.uploadedBy}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Download className="h-5 w-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                    </motion.button>
                    
                    <Dialog.Close asChild>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </motion.button>
                    </Dialog.Close>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-8 flex-1 overflow-y-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-600"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <FileText className="h-12 w-12 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      Document Preview
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                      This is a preview placeholder for <strong>{document.name}</strong>. 
                      In a real application, this would show the actual document content.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-2">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm font-medium">Views</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {document.views}
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 mb-2">
                          <Download className="h-4 w-4" />
                          <span className="text-sm font-medium">Downloads</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {document.downloads}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default DocumentPreviewDialog;