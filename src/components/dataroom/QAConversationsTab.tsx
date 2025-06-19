import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Settings,
  ToggleLeft,
  ToggleRight,
  Info,
  Crown,
  Plus,
  Search,
  User,
  Clock,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  participants: number;
  lastActive: string;
  status: 'active' | 'archived';
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Financial Projections Discussion',
    lastMessage: 'Can you explain the growth assumptions in slide 15?',
    participants: 3,
    lastActive: '2 hours ago',
    status: 'active'
  },
  {
    id: '2',
    title: 'Legal Agreement Clarifications',
    lastMessage: 'What are the terms for early termination?',
    participants: 2,
    lastActive: '1 day ago',
    status: 'active'
  }
];

const QAConversationsTab = () => {
  const [qaEnabled, setQaEnabled] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleQA = () => {
    setQaEnabled(!qaEnabled);
    toast.success(qaEnabled ? 'Q&A conversations disabled' : 'Q&A conversations enabled');
  };

  const handleCreateConversation = () => {
    toast.success('New conversation created');
  };

  const filteredConversations = conversations.filter(
    conv => conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Q&A Conversations</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Enable Q&A to allow viewers to ask questions about your documents
                </p>
              </div>
              <button 
                onClick={handleToggleQA}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
              >
                {qaEnabled ? (
                  <>
                    <ToggleRight className="h-5 w-5 text-green-500" />
                    <span>Enabled</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="h-5 w-5" />
                    <span>Disabled</span>
                  </>
                )}
              </button>
            </div>
            
            {qaEnabled && (
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Q&A conversations allow viewers to ask questions about specific documents or the entire data room. 
                      You'll be notified when new questions are asked, and you can respond at your convenience.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Q&A Settings */}
      {qaEnabled && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Q&A Settings</h3>
            <button className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors">
              <Settings className="h-4 w-4" />
              <span>Configure</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Require Authentication</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Users must sign in to ask questions</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Email Notifications</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Get notified when questions are asked</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversations List */}
      {qaEnabled && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Conversations</h3>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <button 
                  onClick={handleCreateConversation}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>New</span>
                </button>
              </div>
            </div>
          </div>

          {filteredConversations.length > 0 ? (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredConversations.map((conversation, index) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-base font-medium text-slate-900 dark:text-white truncate">
                          {conversation.title}
                        </h4>
                        {conversation.status === 'archived' && (
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                            Archived
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{conversation.participants} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{conversation.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No conversations yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {searchQuery ? 'No conversations match your search' : 'Start a new conversation or wait for viewers to ask questions'}
              </p>
              {!searchQuery && (
                <button 
                  onClick={handleCreateConversation}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Start a Conversation
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Upgrade Banner (shown when Q&A is disabled) */}
      {!qaEnabled && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
          <MessageSquare className="h-16 w-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Enable Q&A Conversations
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Allow viewers to ask questions about your documents and engage in meaningful discussions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleToggleQA}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Enable Q&A
            </button>
            <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span>Upgrade for Advanced Features</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QAConversationsTab;