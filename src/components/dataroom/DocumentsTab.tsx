import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  Download,
  Share2,
  MoreVertical,
  Plus,
  Calendar,
  User,
  Loader2
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  thumbnail?: string;
  description?: string;
  views: number;
  downloads: number;
}

interface DocumentsTabProps {
  documents: Document[];
  onDocumentClick: (index: number) => void;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents, onDocumentClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      day: 'numeric'
    });
  };

  const getFileIcon = (type: string) => {
    return FileText; // Simplified for now
  };

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
      handleFileUpload(e.dataTransfer.files);
    }
  }, []);

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-800/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {uploading ? (
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Uploading files...
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Please wait while we process your documents
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Support for PDF, DOC, PPT, XLS and more
            </p>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Documents Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredDocuments.map((document, index) => {
              const FileIcon = getFileIcon(document.type);
              return (
                <motion.div
                  key={document.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer overflow-hidden"
                  onClick={() => onDocumentClick(index)}
                >
                  {/* Document Preview */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                    <FileIcon className="h-12 w-12 text-slate-400" />
                  </div>

                  {/* Document Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {document.name}
                    </h3>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                      {formatFileSize(document.size)} • {formatDate(document.uploadedAt)}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{document.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{document.downloads}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle more actions
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all duration-200"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredDocuments.map((document, index) => {
                    const FileIcon = getFileIcon(document.type);
                    return (
                      <tr
                        key={document.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200 cursor-pointer"
                        onClick={() => onDocumentClick(index)}
                      >
                        <td className="px-6 py-4">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center space-x-3"
                          >
                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                              <FileIcon className="h-5 w-5 text-slate-500" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900 dark:text-white">
                                {document.name}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {document.uploadedBy}
                              </div>
                            </div>
                          </motion.div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                          {formatFileSize(document.size)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {formatDate(document.uploadedAt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                          {document.views}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle view
                              }}
                              className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle download
                              }}
                              className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle share
                              }}
                              className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {searchQuery ? 'No documents found' : 'No documents yet'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {searchQuery 
              ? 'Try adjusting your search criteria' 
              : 'Upload your first document to get started'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DocumentsTab;