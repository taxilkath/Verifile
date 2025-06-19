import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import { 
  ChevronLeft, 
  FileText, 
  Settings, 
  MessageSquare, 
  Palette,
  Home,
  Plus,
  Download,
  FolderPlus,
  Edit,
  MoreVertical,
  Eye,
  Mail,
  ArrowDown,
  Lock,
  Bell,
  Copy,
  Cog,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import DataRoomHeader from '../components/dataroom/DataRoomHeader';
import DocumentsTab from '../components/dataroom/DocumentsTab';
import AnalyticsTab from '../components/dataroom/AnalyticsTab';
import ActivityLogTab from '../components/dataroom/ActivityLogTab';
import TeamAccessTab from '../components/dataroom/TeamAccessTab';
import SharedLinksTab from '../components/dataroom/SharedLinksTab';
import QAConversationsTab from '../components/dataroom/QAConversationsTab';
import BrandingTab from '../components/dataroom/BrandingTab';
import SettingsTab from '../components/dataroom/SettingsTab';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import { useDataRoom } from '../hooks/useDataRoom';
import { toast } from 'sonner';

const DataRoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('data-room');
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showLinkControls, setShowLinkControls] = useState(false);
  const [linkSettings, setLinkSettings] = useState({
    requireEmail: true,
    emailNotification: true,
    allowDownloads: true
  });

  const {
    dataRoom,
    documents,
    teamMembers,
    sharedLinks,
    activity,
    loading,
    error
  } = useDataRoom(id);

  const handleDocumentClick = (index: number) => {
    setSelectedDocument(index);
    setShowDocumentModal(true);
  };

  const handleDocumentChange = (index: number) => {
    setSelectedDocument(index);
  };

  const handleGenerateIndex = () => {
    toast.success('Index file generated successfully');
  };

  const handleAddDocument = () => {
    toast.success('Document upload started');
  };

  const handleAddFolder = () => {
    toast.success('New folder created');
  };

  const handleEditIndex = () => {
    toast.success('Index editing mode enabled');
  };

  const handleConfigureLink = () => {
    setShowLinkControls(!showLinkControls);
  };

  const handleLinkSettingChange = (setting: string) => {
    setLinkSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('http://localhost:3000/view/cmc0qj12k001aw40wddme5b6s');
    toast.success('Link copied to clipboard');
  };

  const handleSaveChanges = () => {
    toast.success('Changes saved successfully');
  };

  const handleDuplicateDataroom = () => {
    toast.success('Please upgrade to duplicate datarooms');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !dataRoom) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Data Room Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            The data room you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => navigate('/dashboard/data-rooms')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            Back to Data Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative">
        {/* Back Button */}
        <div className="px-4 sm:px-6 lg:px-8 pt-6">
          <button
            onClick={() => navigate('/dashboard/data-rooms')}
            className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Data Rooms</span>
          </button>
        </div>

        {/* Header */}
        <DataRoomHeader dataRoom={dataRoom} />

        {/* Tabs */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-8">
              <Tabs.Trigger
                value="data-room"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'data-room'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Data Room
              </Tabs.Trigger>
              <Tabs.Trigger
                value="permissions"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'permissions'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Permissions
              </Tabs.Trigger>
              <Tabs.Trigger
                value="qa-conversations"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'qa-conversations'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Q&A Conversations
              </Tabs.Trigger>
              <Tabs.Trigger
                value="branding"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'branding'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Branding
              </Tabs.Trigger>
              <Tabs.Trigger
                value="settings"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Settings
              </Tabs.Trigger>
            </Tabs.List>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Data Room Tab */}
              <Tabs.Content value="data-room">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
                  <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-700 dark:text-slate-300 transition-colors">
                        <Home className="h-4 w-4" />
                        <span>Dataroom Home</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={handleGenerateIndex}
                        className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Generate Index File</span>
                      </button>
                      <button className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-700 dark:text-slate-300 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Document List */}
                  <div className="p-4">
                    {documents.length > 0 ? (
                      <div className="space-y-2">
                        {documents.map((doc, index) => (
                          <div 
                            key={doc.id}
                            className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors"
                            onClick={() => handleDocumentClick(index)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-slate-500" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">
                                  {doc.name}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                  {new Date(doc.uploadedAt).toLocaleDateString()} • {doc.uploadedBy}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {doc.views} views
                              </div>
                              <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                          No documents yet
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                          Add your first document to get started
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                          <button 
                            onClick={handleAddDocument}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Document</span>
                          </button>
                          <button 
                            onClick={handleAddFolder}
                            className="flex items-center space-x-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                          >
                            <FolderPlus className="h-4 w-4" />
                            <span>Add Folder</span>
                          </button>
                          <button 
                            onClick={handleEditIndex}
                            className="flex items-center space-x-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit Index</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Links Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Links</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Share data room with strong access controls using links.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm">
                          Links
                        </button>
                        <button className="px-3 py-1 text-slate-500 dark:text-slate-400 rounded-lg text-sm">
                          Groups
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Link</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Last Viewed</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Active</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="py-3 px-4 text-sm text-slate-900 dark:text-white">
                              Link #e5b6s
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <div className="bg-slate-100 dark:bg-slate-700 rounded px-2 py-1 text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate">
                                  http://localhost:3000/view/cmc0qj12k001aw40wddme5b6s
                                </div>
                                <button 
                                  onClick={handleCopyLink}
                                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400">
                              -
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" defaultChecked />
                                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                  <span className="ml-2 text-sm text-slate-900 dark:text-white">Yes</span>
                                </label>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button 
                                onClick={handleConfigureLink}
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Link Controls */}
                <AnimatePresence>
                  {showLinkControls && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-96 right-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-4 z-10"
                    >
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                        Active Link Controls
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${linkSettings.requireEmail ? 'bg-green-400' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                          <button 
                            onClick={() => handleLinkSettingChange('requireEmail')}
                            className="text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                          >
                            Require email to view
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${linkSettings.emailNotification ? 'bg-green-400' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                          <button 
                            onClick={() => handleLinkSettingChange('emailNotification')}
                            className="text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                          >
                            Receive email notification
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${linkSettings.allowDownloads ? 'bg-green-400' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                          <button 
                            onClick={() => handleLinkSettingChange('allowDownloads')}
                            className="text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                          >
                            Allow downloads
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={handleConfigureLink}
                        className="w-full mt-3 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
                      >
                        Configure link
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Tabs.Content>

              {/* Permissions Tab */}
              <Tabs.Content value="permissions">
                <TeamAccessTab teamMembers={teamMembers} />
              </Tabs.Content>

              {/* Q&A Conversations Tab */}
              <Tabs.Content value="qa-conversations">
                <QAConversationsTab />
              </Tabs.Content>

              {/* Branding Tab */}
              <Tabs.Content value="branding">
                <BrandingTab />
              </Tabs.Content>

              {/* Settings Tab */}
              <Tabs.Content value="settings">
                <SettingsTab dataroomId={id || ''} dataroomName={dataRoom.name} />
              </Tabs.Content>
            </motion.div>
          </Tabs.Root>
        </div>
      </div>

      {/* Document Preview Modal */}
      {showDocumentModal && selectedDocument !== null && (
        <DocumentPreviewModal
          isOpen={showDocumentModal}
          onClose={() => setShowDocumentModal(false)}
          documents={documents}
          currentDocumentIndex={selectedDocument}
          onDocumentChange={handleDocumentChange}
        />
      )}
    </div>
  );
};

export default DataRoomDetail;