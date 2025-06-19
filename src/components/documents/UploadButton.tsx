import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { Upload, X, FileText, Plus, Loader2 } from 'lucide-react';
import { Document } from '../../types/documents';
import { toast } from 'sonner';

interface UploadButtonProps {
  onDocumentsAdd: (documents: Document[]) => void;
}

interface UploadingFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

const UploadButton: React.FC<UploadButtonProps> = ({ onDocumentsAdd }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (files: FileList) => {
    const newFiles: UploadingFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(newFiles);
    simulateUpload(newFiles);
  };

  const simulateUpload = async (files: UploadingFile[]) => {
    for (const file of files) {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadingFiles(prev => 
          prev.map(f => f.id === file.id ? { ...f, progress } : f)
        );
      }

      // Mark as completed
      setUploadingFiles(prev => 
        prev.map(f => f.id === file.id ? { ...f, status: 'completed' } : f)
      );

      // Add to documents list
      const newDocument: Document = {
        id: file.id,
        name: file.name,
        type: file.name.split('.').pop() || 'unknown',
        size: file.size,
        uploadedBy: 'You',
        uploadedAt: new Date().toISOString(),
        url: `https://example.com/${file.id}`,
        views: 0,
        downloads: 0,
        dataRoom: 'Default',
        tags: []
      };

      onDocumentsAdd([newDocument]);
    }

    toast.success(`Successfully uploaded ${files.length} document${files.length > 1 ? 's' : ''}`);
    
    // Clear after delay
    setTimeout(() => {
      setUploadingFiles([]);
      setShowDialog(false);
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <motion.button
        onClick={() => setShowDialog(true)}
        className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-2"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
        <div className="relative flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload Documents</span>
        </div>
      </motion.button>

      <Dialog.Root open={showDialog} onOpenChange={setShowDialog}>
        <AnimatePresence>
          {showDialog && (
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
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden z-50"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <Upload className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-white">
                          Upload Documents
                        </Dialog.Title>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Drag and drop or click to select files
                        </p>
                      </div>
                    </div>
                    
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

                  {/* Upload Area */}
                  <div className="p-6">
                    <div
                      className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
                        dragActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-700/50'
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      <input
                        type="file"
                        multiple
                        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />

                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                          <Plus className="h-10 w-10 text-white" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                          Drop files here or click to browse
                        </h3>
                        
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Support for all file types up to 100MB each
                        </p>
                        
                        <div className="flex items-center justify-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                          <span>PDF</span>
                          <span>•</span>
                          <span>DOCX</span>
                          <span>•</span>
                          <span>PPTX</span>
                          <span>•</span>
                          <span>Images</span>
                          <span>•</span>
                          <span>More</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Upload Progress */}
                    <AnimatePresence>
                      {uploadingFiles.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="mt-6 space-y-3"
                        >
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            Uploading Files ({uploadingFiles.length})
                          </h4>
                          
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {uploadingFiles.map((file) => (
                              <motion.div
                                key={file.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center space-x-3 p-3 bg-slate-100 dark:bg-slate-700 rounded-xl"
                              >
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                  {file.status === 'completed' ? (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                                    >
                                      <div className="w-2 h-2 bg-white rounded-full" />
                                    </motion.div>
                                  ) : file.status === 'uploading' ? (
                                    <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />
                                  ) : (
                                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {file.name}
                                  </div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {formatFileSize(file.size)}
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                                    {file.progress}%
                                  </div>
                                  <div className="w-16 h-1 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                    <motion.div
                                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${file.progress}%` }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

export default UploadButton;