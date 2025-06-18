import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  X, 
  Download, 
  Share2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Clock,
  User,
  Calendar,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Code,
  Loader2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from 'sonner';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  thumbnail?: string;
  description?: string;
}

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentFile[];
  currentDocumentIndex: number;
  onDocumentChange: (index: number) => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  documents,
  currentDocumentIndex,
  onDocumentChange
}) => {
  const [viewStartTime, setViewStartTime] = useState<number | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentDocument = documents[currentDocumentIndex];

  // Track viewing time
  useEffect(() => {
    if (isOpen && currentDocument) {
      setViewStartTime(Date.now());
      
      // Reset PDF state when document changes
      setPageNumber(1);
      setScale(1.0);
      setRotation(0);
      setIsLoading(true);
      setError(null);
    }

    return () => {
      if (viewStartTime) {
        const timeSpent = Date.now() - viewStartTime;
        // Track document view event
        console.log(`Document viewed: ${currentDocument?.name}, Time spent: ${timeSpent}ms`);
        // Here you would send analytics to your backend
      }
    };
  }, [isOpen, currentDocument, viewStartTime]);

  const handleClose = () => {
    if (viewStartTime) {
      const timeSpent = Date.now() - viewStartTime;
      // Final tracking before close
      console.log(`Document session ended: ${currentDocument?.name}, Total time: ${timeSpent}ms`);
    }
    onClose();
  };

  const handlePrevious = () => {
    if (currentDocumentIndex > 0) {
      onDocumentChange(currentDocumentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentDocumentIndex < documents.length - 1) {
      onDocumentChange(currentDocumentIndex + 1);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(currentDocument.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentDocument.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(currentDocument.url);
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleDelete = () => {
    // Show confirmation dialog
    toast.error('Delete functionality would be implemented here');
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    setError('Failed to load PDF document');
    setIsLoading(false);
    console.error('PDF load error:', error);
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    if (type.includes('image')) return Image;
    if (type.includes('video')) return Video;
    if (type.includes('audio')) return Music;
    if (type.includes('zip') || type.includes('rar')) return Archive;
    if (type.includes('code') || type.includes('text')) return Code;
    return FileText;
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderDocumentPreview = () => {
    if (!currentDocument) return null;

    const isPDF = currentDocument.type.includes('pdf');
    const isImage = currentDocument.type.includes('image');
    const isVideo = currentDocument.type.includes('video');
    const isAudio = currentDocument.type.includes('audio');

    if (isPDF) {
      return (
        <div className="relative flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-xl overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Loading PDF...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10">
              <div className="text-center">
                <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <p className="text-red-600 dark:text-red-400 mb-2">Failed to load PDF</p>
                <p className="text-sm text-slate-500">{error}</p>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-auto p-4" style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}>
            <Document
              file={currentDocument.url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading=""
              className="flex justify-center"
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-lg"
              />
            </Document>
          </div>

          {/* PDF Controls */}
          {numPages && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border border-white/20">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                  disabled={pageNumber <= 1}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {pageNumber} / {numPages}
                </span>
                
                <button
                  onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                  disabled={pageNumber >= numPages}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

                <button
                  onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[3rem] text-center">
                  {Math.round(scale * 100)}%
                </span>
                
                <button
                  onClick={() => setScale(Math.min(3, scale + 0.1))}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>

                <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

                <button
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (isImage) {
      return (
        <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-xl overflow-hidden">
          <img
            src={currentDocument.url}
            alt={currentDocument.name}
            className="max-w-full max-h-full object-contain"
            style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-xl overflow-hidden">
          <video
            src={currentDocument.url}
            controls
            className="max-w-full max-h-full"
          />
        </div>
      );
    }

    if (isAudio) {
      return (
        <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <div className="text-center">
            <Music className="h-24 w-24 text-slate-400 mx-auto mb-6" />
            <audio src={currentDocument.url} controls className="mb-4" />
            <p className="text-slate-600 dark:text-slate-400">{currentDocument.name}</p>
          </div>
        </div>
      );
    }

    // Fallback for other file types
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-xl">
        <div className="text-center">
          <FileText className="h-24 w-24 text-slate-400 mx-auto mb-6" />
          <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Preview not available
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            This file type cannot be previewed in the browser
          </p>
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto"
          >
            <Download className="h-4 w-4" />
            <span>Download to view</span>
          </button>
        </div>
      </div>
    );
  };

  if (!currentDocument) return null;

  const FileIcon = getFileIcon(currentDocument.type);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>
            
            <Dialog.Content asChild>
              <motion.div
                ref={containerRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="fixed inset-4 md:inset-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 z-50 flex flex-col overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                      <FileIcon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                        {currentDocument.name}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{currentDocument.uploadedBy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(currentDocument.uploadedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="h-3 w-3" />
                          <span>{formatFileSize(currentDocument.size)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center space-x-2 mx-4">
                    <button
                      onClick={handlePrevious}
                      disabled={currentDocumentIndex === 0}
                      className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 px-3">
                      {currentDocumentIndex + 1} of {documents.length}
                    </span>
                    
                    <button
                      onClick={handleNext}
                      disabled={currentDocumentIndex === documents.length - 1}
                      className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDownload}
                      className="p-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-blue-500/20"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={handleShare}
                      className="p-3 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-600 dark:text-green-400 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-green-500/20"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={handleDelete}
                      className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-red-500/20"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    
                    <Dialog.Close asChild>
                      <button className="p-3 rounded-xl bg-slate-500/20 hover:bg-slate-500/30 text-slate-600 dark:text-slate-400 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-slate-500/20">
                        <X className="h-5 w-5" />
                      </button>
                    </Dialog.Close>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="flex-1 p-6 overflow-hidden">
                  {renderDocumentPreview()}
                </div>

                {/* Footer with metadata */}
                <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>Viewing since {viewStartTime ? new Date(viewStartTime).toLocaleTimeString() : ''}</span>
                      </div>
                      {currentDocument.description && (
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span className="truncate max-w-md">{currentDocument.description}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(currentDocument.url, '_blank')}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Open in new tab</span>
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

export default DocumentPreviewModal;