import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import { X, Copy, Check, Link, Calendar, Shield } from 'lucide-react';
import { Document } from '../../types/documents';
import { toast } from 'sonner';

interface ShareLinkDialogProps {
  document: Document | null;
  open: boolean;
  onClose: () => void;
}

const ShareLinkDialog: React.FC<ShareLinkDialogProps> = ({
  document,
  open,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDays, setExpiryDays] = useState(7);

  if (!document) return null;

  const shareUrl = `https://verifile.com/share/${document.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

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
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md z-50"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                      <Link className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-white">
                        Share Document
                      </Dialog.Title>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Create a secure link
                      </p>
                    </div>
                  </div>
                  
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

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Document Info */}
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {document.name}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {document.dataRoom}
                    </p>
                  </div>

                  {/* Share URL */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Share Link
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-xl px-4 py-3 text-sm text-slate-600 dark:text-slate-300 font-mono">
                        {shareUrl}
                      </div>
                      <motion.button
                        onClick={handleCopy}
                        className={`p-3 rounded-xl transition-all duration-200 ${
                          copied
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <AnimatePresence mode="wait">
                          {copied ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Check className="h-5 w-5" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="copy"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Copy className="h-5 w-5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  </div>

                  {/* Expiry Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-slate-400" />
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            Link Expiry
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Set when this link expires
                          </div>
                        </div>
                      </div>
                      <Switch.Root
                        checked={hasExpiry}
                        onCheckedChange={setHasExpiry}
                        className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
                      >
                        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform data-[state=checked]:translate-x-5 translate-x-0.5" />
                      </Switch.Root>
                    </div>

                    <AnimatePresence>
                      {hasExpiry && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Expires in (days)
                          </label>
                          <input
                            type="number"
                            value={expiryDays}
                            onChange={(e) => setExpiryDays(Number(e.target.value))}
                            min="1"
                            max="365"
                            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Secure Sharing
                        </h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          This link provides view-only access and tracks all activity for security.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                  <motion.button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Done
                  </motion.button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default ShareLinkDialog;