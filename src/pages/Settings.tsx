import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import {
  Copy,
  Info,
  AlertTriangle,
  Trash2,
  Settings as SettingsIcon,
  Bell,
  Globe,
  FileText,
  Users,
  Tag,
  Webhook,
  CreditCard,
  Key
} from 'lucide-react';
import { toast } from 'sonner';

// Import settings tab components
import GeneralSettings from '../components/settings/GeneralSettings';
import PeopleSettings from '../components/settings/PeopleSettings';
import DomainsSettings from '../components/settings/DomainsSettings';
import WebhooksSettings from '../components/settings/WebhooksSettings';
import TokensSettings from '../components/settings/TokensSettings';
import IncomingWebhooksSettings from '../components/settings/IncomingWebhooksSettings';
import BillingSettings from '../components/settings/BillingSettings';
import PresetsSettings from '../components/settings/PresetsSettings';
import TagsSettings from '../components/settings/TagsSettings';
import AgreementsSettings from '../components/settings/AgreementsSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your account settings
        </p>
      </div>

      <div className="flex">
        {/* Sidebar - Mobile view would have a different layout */}
        <div className="hidden md:block w-64 mr-8">
          <div className="space-y-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              General
            </button>
            <button 
              onClick={() => setActiveTab('people')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'people' 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              People
            </button>
            <button 
              onClick={() => setActiveTab('domains')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'domains' 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              Domains
            </button>
            <button 
              onClick={() => setActiveTab('webhooks')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'webhooks' 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              Webhooks
            </button>
            <button 
              onClick={() => setActiveTab('billing')}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'billing' 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              Billing
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="flex border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto">
              <Tabs.Trigger
                value="overview"
                className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Overview
              </Tabs.Trigger>
              <Tabs.Trigger
                value="people"
                className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === 'people'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                People
              </Tabs.Trigger>
              <Tabs.Trigger
                value="domains"
                className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === 'domains'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Domains
              </Tabs.Trigger>
              <Tabs.Trigger
                value="presets"
                className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === 'presets'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Presets
              </Tabs.Trigger>
              <Tabs.Trigger
                value="tags"
                className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === 'tags'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Tags
              </Tabs.Trigger>
              <Tabs.Trigger
                value="agreements"
                className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === 'agreements'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Agreements
              </Tabs.Trigger>
              <Tabs.Trigger
                value="webhooks"
                className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === 'webhooks'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Webhooks
              </Tabs.Trigger>
              <Tabs.Trigger
                value="tokens"
                className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === 'tokens'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Tokens
              </Tabs.Trigger>
              <Tabs.Trigger
                value="incoming-webhooks"
                className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === 'incoming-webhooks'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Incoming Webhooks
              </Tabs.Trigger>
              <Tabs.Trigger
                value="billing"
                className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === 'billing'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Billing
              </Tabs.Trigger>
            </Tabs.List>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Tabs.Content value="overview">
                <GeneralSettings />
              </Tabs.Content>

              <Tabs.Content value="people">
                <PeopleSettings />
              </Tabs.Content>

              <Tabs.Content value="domains">
                <DomainsSettings />
              </Tabs.Content>

              <Tabs.Content value="presets">
                <PresetsSettings />
              </Tabs.Content>

              <Tabs.Content value="tags">
                <TagsSettings />
              </Tabs.Content>

              <Tabs.Content value="agreements">
                <AgreementsSettings />
              </Tabs.Content>

              <Tabs.Content value="webhooks">
                <WebhooksSettings />
              </Tabs.Content>

              <Tabs.Content value="tokens">
                <TokensSettings />
              </Tabs.Content>

              <Tabs.Content value="incoming-webhooks">
                <IncomingWebhooksSettings />
              </Tabs.Content>

              <Tabs.Content value="billing">
                <BillingSettings />
              </Tabs.Content>
            </motion.div>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
};

export default Settings;