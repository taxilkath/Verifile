import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import {
  X,
  Upload,
  FileText,
  Loader2,
  Check,
  AlertCircle,
  ChevronDown,
  FolderOpen,
  Trash2,
  Plus,
  Pause,
  Play,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FileUpload {
  id: string;
  file: File;
  name: string;
  dataRoom: string;
  status: 'pending' | 'uploading' | 'completed' | 'error' | 'paused';
  progress: number;
  error?: string;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [defaultDataRoom, setDefaultDataRoom] = useState('');
  const [overallProgress, setOverallProgress] = useState(0);

  const dataRooms = [
    { id: '1', name: 'Series A Fundraising' },
    { id: '2', name: 'Legal Documents' },
    { id: '3', name: 'Product Strategy' },
    { id: '4', name: 'Company Assets' }
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const fileUploads: FileUpload[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      dataRoom: defaultDataRoom || dataRooms[0].name,
      status: 'pending',
      progress: 0
    }));

    setFiles(prev => [...prev, ...fileUploads]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileDataRoom = (id: string, dataRoom: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, dataRoom } : f));
  };

  const updateFileName = (id: string, name: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, name } : f));
  };

  const simulateFileUpload = async (fileUpload: FileUpload) => {
    const updateProgress = (progress: number, status: FileUpload['status'] = 'uploading') => {
      setFiles(prev => prev.map(f => 
        f.id === fileUpload.id ? { ...f, progress, status } : f
      ));
    };

    try {
      updateProgress(0, 'uploading');
      
      // Simulate chunked upload with Tus
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        updateProgress(i);
      }
      
      updateProgress(100, 'completed');
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileUpload.id 
          ? { ...f, status: 'error', error: 'Upload failed' }
          : f
      ));
    }
  };

  const startUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    
    // Upload files in parallel (limited concurrency)
    const concurrency = 3;
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    for (let i = 0; i < pendingFiles.length; i += concurrency) {
      const batch = pendingFiles.slice(i, i + concurrency);
      await Promise.all(batch.map(simulateFileUpload));
      
      // Update overall progress
      const completed = files.filter(f => f.status === 'completed').length;
      setOverallProgress((completed / files.length) * 100);
    }
    
    setUploading(false);
    toast.success(`Successfully uploaded ${files.length} documents!`);
  };

  const pauseUpload = () => {
    setUploading(false);
    setFiles(prev => prev.map(f => 
      f.status === 'uploading' ? { ...f, status: 'paused' } : f
    ));
  };

  const resumeUpload = () => {
    setUploading(true);
    // Resume paused uploads
    const pausedFiles = files.filter(f => f.status === 'paused');
    pausedFiles.forEach(simulateFileUpload);
  };

  const retryFailed = () => {
    const failedFiles = files.filter(f => f.status === 'error');
    failedFiles.forEach(file => {
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'pending', progress: 0, error: undefined } : f
      ));
    });
  };

  const resetAll = () => {
    setFiles([]);
    setUploading(false);
    setOverallProgress(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: FileUpload['status']) => {
    switch (status) {
      case 'pending': return 'text-slate-500 bg-slate-100 dark:bg-slate-700';
      case 'uploading': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'paused': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      default: return 'text-slate-500 bg-slate-100 dark:bg-slate-700';
    }
  };

  const completedCount = files.filter(f => f.status === 'completed').length;
  const errorCount = files.filter(f => f.status === 'error').length;
  const uploadingCount = files.filter(f => f.status === 'uploading').length;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
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
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden z-50"
              >
                <div className="flex flex-col h-full max-h-[90vh]">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <Dialog.Title className="text-2xl font-bold text-slate-900 dark:text-white">
                        Bulk Upload Documents
                      </Dialog.Title>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Upload multiple documents with resumable progress tracking
                      </p>
                    </div>
                    <Dialog.Close asChild>
                      <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200">
                        <X className="h-6 w-6" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                      {/* Default Data Room Selection */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Default Data Room
                        </label>
                        <Select.Root value={defaultDataRoom} onValueChange={setDefaultDataRoom}>
                          <Select.Trigger className="w-full max-w-md flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <div className="flex items-center space-x-2">
                              <FolderOpen className="h-4 w-4 text-slate-400" />
                              <Select.Value placeholder="Select default data room" />
                            </div>
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 p-2">
                              {dataRooms.map((room) => (
                                <Select.Item key={room.id} value={room.name} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                                  {room.name}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>

                      {/* File Drop Area */}
                      <div
                        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                          dragActive
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-700/50'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading}
                        />

                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            Drop multiple files here or click to browse
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400">
                            Select multiple files to upload them all at once with progress tracking
                          </p>
                        </div>
                      </div>

                      {/* Overall Progress */}
                      {files.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              Upload Progress
                            </h3>
                            <div className="flex items-center space-x-2">
                              {!uploading ? (
                                <button
                                  onClick={startUpload}
                                  disabled={files.length === 0 || completedCount === files.length}
                                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Play className="h-4 w-4" />
                                  <span>Start Upload</span>
                                </button>
                              ) : (
                                <button
                                  onClick={pauseUpload}
                                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors duration-200"
                                >
                                  <Pause className="h-4 w-4" />
                                  <span>Pause</span>
                                </button>
                              )}
                              
                              {errorCount > 0 && (
                                <button
                                  onClick={retryFailed}
                                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                  <span>Retry Failed</span>
                                </button>
                              )}
                              
                              <button
                                onClick={resetAll}
                                className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors duration-200"
                              >
                                <RotateCcw className="h-4 w-4" />
                                <span>Reset</span>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {completedCount}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                Completed
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {uploadingCount}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                Uploading
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {errorCount}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                Failed
                              </div>
                            </div>
                          </div>

                          <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                            <motion.div
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(completedCount / files.length) * 100}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Files List */}
                      {files.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Files ({files.length})
                          </h3>
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {files.map((fileUpload) => (
                              <motion.div
                                key={fileUpload.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-slate-500" />
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <input
                                        type="text"
                                        value={fileUpload.name}
                                        onChange={(e) => updateFileName(fileUpload.id, e.target.value)}
                                        className="font-medium text-slate-900 dark:text-white bg-transparent border-none outline-none flex-1"
                                        disabled={uploading}
                                      />
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(fileUpload.status)}`}>
                                        {fileUpload.status}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                                      <span>{formatFileSize(fileUpload.file.size)}</span>
                                      <Select.Root 
                                        value={fileUpload.dataRoom} 
                                        onValueChange={(value) => updateFileDataRoom(fileUpload.id, value)}
                                        disabled={uploading}
                                      >
                                        <Select.Trigger className="flex items-center space-x-1 text-xs">
                                          <FolderOpen className="h-3 w-3" />
                                          <Select.Value />
                                        </Select.Trigger>
                                        <Select.Portal>
                                          <Select.Content className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 p-1">
                                            {dataRooms.map((room) => (
                                              <Select.Item key={room.id} value={room.name} className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer text-xs">
                                                {room.name}
                                              </Select.Item>
                                            ))}
                                          </Select.Content>
                                        </Select.Portal>
                                      </Select.Root>
                                    </div>
                                    
                                    {fileUpload.status === 'uploading' && (
                                      <div className="mt-2">
                                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1">
                                          <motion.div
                                            className="bg-blue-500 h-1 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${fileUpload.progress}%` }}
                                            transition={{ duration: 0.3 }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                    
                                    {fileUpload.error && (
                                      <div className="mt-2 flex items-center space-x-1 text-red-600 dark:text-red-400 text-xs">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>{fileUpload.error}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <button
                                    onClick={() => removeFile(fileUpload.id)}
                                    disabled={uploading && fileUpload.status === 'uploading'}
                                    className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 disabled:opacity-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={onClose}
                        className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default BulkUploadModal;