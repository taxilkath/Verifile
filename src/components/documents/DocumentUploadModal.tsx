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
  Tag,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ loaded: 0, total: 0, percentage: 0 });
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Form fields
  const [documentName, setDocumentName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDataRoom, setSelectedDataRoom] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!documentName) {
        setDocumentName(file.name);
      }
    }
  }, [documentName]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!documentName) {
        setDocumentName(file.name);
      }
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const simulateTusUpload = async (file: File) => {
    const chunkSize = 1024 * 1024; // 1MB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    for (let i = 0; i < totalChunks; i++) {
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
      
      const loaded = Math.min((i + 1) * chunkSize, file.size);
      const percentage = Math.round((loaded / file.size) * 100);
      
      setUploadProgress({
        loaded,
        total: file.size,
        percentage
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentName || !selectedDataRoom) {
      setError('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Simulate Tus resumable upload
      await simulateTusUpload(selectedFile);
      
      // Simulate final processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUploadComplete(true);
      toast.success('Document uploaded successfully!');
      
      // Reset form after delay
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
      
    } catch (err) {
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setDocumentName('');
    setDescription('');
    setSelectedDataRoom('');
    setTags([]);
    setCurrentTag('');
    setUploading(false);
    setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
    setUploadComplete(false);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title className="text-2xl font-bold text-slate-900 dark:text-white">
                      Upload Document
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200">
                        <X className="h-6 w-6" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {uploadComplete ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        Upload Complete!
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Your document has been uploaded successfully and is now available in your data room.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      {/* File Upload Area */}
                      <div
                        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                          dragActive
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : selectedFile
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-700/50'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          onChange={handleFileSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading}
                        />

                        {selectedFile ? (
                          <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                              <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                              {selectedFile.name}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                              {formatFileSize(selectedFile.size)}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                              Drop your file here or click to browse
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                              Supports all file types up to 100MB
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Upload Progress */}
                      {uploading && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              Uploading...
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {uploadProgress.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                            <motion.div
                              className="bg-blue-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress.percentage}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>{formatFileSize(uploadProgress.loaded)} of {formatFileSize(uploadProgress.total)}</span>
                            <span>Resumable upload in progress</span>
                          </div>
                        </motion.div>
                      )}

                      {/* Form Fields */}
                      <div className="space-y-4">
                        {/* Document Name */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Document Name *
                          </label>
                          <input
                            type="text"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            placeholder="Enter document name"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            disabled={uploading}
                          />
                        </div>

                        {/* Data Room Selection */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Data Room *
                          </label>
                          <Select.Root value={selectedDataRoom} onValueChange={setSelectedDataRoom} disabled={uploading}>
                            <Select.Trigger className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                              <div className="flex items-center space-x-2">
                                <FolderOpen className="h-4 w-4 text-slate-400" />
                                <Select.Value placeholder="Select a data room" />
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

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Description (Optional)
                          </label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a description for this document"
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                            disabled={uploading}
                          />
                        </div>

                        {/* Tags */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Tags (Optional)
                          </label>
                          <div className="flex space-x-2 mb-3">
                            <input
                              type="text"
                              value={currentTag}
                              onChange={(e) => setCurrentTag(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                              placeholder="Add a tag"
                              className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              disabled={uploading}
                            />
                            <button
                              onClick={addTag}
                              disabled={!currentTag.trim() || uploading}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                                <button
                                  onClick={() => removeTag(tag)}
                                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                  disabled={uploading}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
                        >
                          <AlertCircle className="h-5 w-5 flex-shrink-0" />
                          <span className="text-sm">{error}</span>
                        </motion.div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          onClick={onClose}
                          disabled={uploading}
                          className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpload}
                          disabled={!selectedFile || !documentName || !selectedDataRoom || uploading}
                          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-5 w-5" />
                              <span>Upload Document</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default DocumentUploadModal;