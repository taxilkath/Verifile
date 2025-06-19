import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import { ChevronLeft } from 'lucide-react';
import DataRoomHeader from '../components/dataroom/DataRoomHeader';
import DocumentsTab from '../components/dataroom/DocumentsTab';
import AnalyticsTab from '../components/dataroom/AnalyticsTab';
import SharedLinksTab from '../components/dataroom/SharedLinksTab';
import ActivityLogTab from '../components/dataroom/ActivityLogTab';
import TeamAccessTab from '../components/dataroom/TeamAccessTab';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import { useDataRoom } from '../hooks/useDataRoom';

const DataRoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('documents');
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

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
              {[
                { value: 'documents', label: 'Documents', count: documents.length },
                { value: 'analytics', label: 'Analytics' },
                { value: 'shared-links', label: 'Shared Links', count: sharedLinks.length },
                { value: 'activity', label: 'Activity' },
                { value: 'team', label: 'Team Access', count: teamMembers.length }
              ].map((tab) => (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.value
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      activeTab === tab.value
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Tabs.Content value="documents">
                <DocumentsTab 
                  documents={documents} 
                  onDocumentClick={handleDocumentClick}
                />
              </Tabs.Content>

              <Tabs.Content value="analytics">
                <AnalyticsTab dataRoom={dataRoom} documents={documents} />
              </Tabs.Content>

              <Tabs.Content value="shared-links">
                <SharedLinksTab sharedLinks={sharedLinks} />
              </Tabs.Content>

              <Tabs.Content value="activity">
                <ActivityLogTab activity={activity} />
              </Tabs.Content>

              <Tabs.Content value="team">
                <TeamAccessTab teamMembers={teamMembers} />
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