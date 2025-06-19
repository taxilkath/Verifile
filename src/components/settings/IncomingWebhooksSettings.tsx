import React, { useState } from 'react';
import { Webhook, Copy, Info } from 'lucide-react';
import { toast } from 'sonner';

interface IncomingWebhook {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

const IncomingWebhooksSettings = () => {
  const [webhooks, setWebhooks] = useState<IncomingWebhook[]>([
    {
      id: '1',
      name: 'New Incoming Webhook',
      url: '/services/TY21jMHEwaXNzMDAwc3c0MHcZZWc0ZXNhcQ/B40jUE',
      createdAt: 'Jun 19, 2025'
    }
  ]);
  
  const [webhookName, setWebhookName] = useState('');

  const handleCreateWebhook = () => {
    if (!webhookName.trim()) {
      toast.error('Please enter a webhook name');
      return;
    }
    
    // Create a mock webhook
    const newWebhook = {
      id: Date.now().toString(),
      name: webhookName,
      url: `/services/${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setWebhooks([...webhooks, newWebhook]);
    setWebhookName('');
    toast.success('Webhook created successfully');
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id));
    toast.success('Webhook deleted successfully');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Incoming Webhooks</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Create incoming webhooks to receive data from external services and automatically create new documents in Papermark.
        </p>
      </div>

      {/* Webhook Creator */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="webhookName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Webhook Name
            </label>
            <input
              id="webhookName"
              type="text"
              value={webhookName}
              onChange={(e) => setWebhookName(e.target.value)}
              placeholder="Enter a name for your webhook"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleCreateWebhook}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            Create Webhook
          </button>
        </div>
      </div>

      {/* Existing Webhooks */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Existing Webhooks
        </h3>
        
        {webhooks.length > 0 ? (
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {webhook.name}
                  </h4>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {webhook.createdAt}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-400 overflow-x-auto">
                    {webhook.url}
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(webhook.url);
                      toast.success('URL copied to clipboard');
                    }}
                    className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDeleteWebhook(webhook.id)}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Webhook className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No incoming webhooks yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Create your first incoming webhook to receive data from external services
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomingWebhooksSettings;