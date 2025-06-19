import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Download, 
  Share2, 
  MoreVertical,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Code,
  File,
  Calendar,
  User,
  FolderOpen,
  ArrowLeft
} from 'lucide-react';
import DocumentPreviewDialog from './DocumentPreviewDialog';
import ShareLinkDialog from './ShareLinkDialog';
import DocumentActionsMenu from './DocumentActionsMenu';
import { Document } from '../../types/documents';
import { toast } from 'sonner';

interface DocumentsTableProps {
  documents: Document[];
  onDocumentUpdate: (id: string, updates: Partial<Document>) => void;
  onDocumentDelete: (id: string) => void;
  selectedFolder?: string | null;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({
  documents,
  onDocumentUpdate,
  onDocumentDelete,
  selectedFolder
}) => {
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [shareDocument, setShareDocument] = useState<Document | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    if (type.includes('image')) return Image;
    if (type.includes('video')) return Video;
    if (type.includes('audio')) return Music;
    if (type.includes('zip') || type.includes('rar')) return Archive;
    if (type.includes('code') || type.includes('text')) return Code;
    return File;
  };

  const getFileTypeColor = (type: string) => {
    if (type.includes('pdf')) return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    if (type.includes('image')) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (type.includes('video')) return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
    if (type.includes('audio')) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
    if (type.includes('presentation')) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    if (type.includes('spreadsheet')) return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
    if (type.includes('word')) return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30';
    return 'text-slate-600 bg-slate-100 dark:bg-slate-700';
  };

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

  const handleDownload = async (document: Document) => {
    setDownloadingId(document.id);
    
    // Simulate download with realistic progress
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update download count
    onDocumentUpdate(document.id, { downloads: document.downloads + 1 });
    
    setDownloadingId(null);
    toast.success(`Downloaded ${document.name}`);
  };

  const handleView = (document: Document) => {
    // Update view count
    onDocumentUpdate(document.id, { views: document.views + 1 });
    setPreviewDocument(document);
  };

  return (
    <>
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-2xl">
        {selectedFolder && (
          <div className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-800/80 dark:to-slate-700/80">
            <div className="flex items-center space-x-3">
              <ArrowLeft className="h-5 w-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Viewing folder contents
              </span>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-700/50 dark:to-slate-800/50 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Data Room
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Views / Downloads
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
              <AnimatePresence>
                {documents.map((document, index) => {
                  const FileIcon = getFileIcon(document.type);
                  const colorClasses = getFileTypeColor(document.type);
                  
                  return (
                    <motion.tr
                      key={document.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-all duration-300"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClasses} shadow-lg`}
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <FileIcon className="h-6 w-6" />
                          </motion.div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {document.name}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {formatFileSize(document.size)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <FolderOpen className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-900 dark:text-white font-medium">
                            {document.dataRoom}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {document.uploadedBy}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {formatDate(document.uploadedAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            className="flex items-center space-x-1"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Eye className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {document.views}
                            </span>
                          </motion.div>
                          <motion.div 
                            className="flex items-center space-x-1"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Download className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {document.downloads}
                            </span>
                          </motion.div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <motion.button
                            onClick={() => handleView(document)}
                            className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Eye className="h-4 w-4" />
                          </motion.button>
                          
                          <motion.button
                            onClick={() => handleDownload(document)}
                            disabled={downloadingId === document.id}
                            className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-all duration-200 disabled:opacity-50"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {downloadingId === document.id ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full"
                              />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </motion.button>
                          
                          <motion.button
                            onClick={() => setShareDocument(document)}
                            className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all duration-200"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Share2 className="h-4 w-4" />
                          </motion.button>
                          
                          <DocumentActionsMenu
                            document={document}
                            onUpdate={onDocumentUpdate}
                            onDelete={onDocumentDelete}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialogs */}
      <DocumentPreviewDialog
        document={previewDocument}
        open={!!previewDocument}
        onClose={() => setPreviewDocument(null)}
      />

      <ShareLinkDialog
        document={shareDocument}
        open={!!shareDocument}
        onClose={() => setShareDocument(null)}
      />
    </>
  );
};

export default DocumentsTable;