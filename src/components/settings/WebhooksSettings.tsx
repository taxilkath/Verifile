import React, { useState } from 'react';
import { Webhook, Info, Plus, Copy } from 'lucide-react';
import { toast } from 'sonner';

const WebhooksSettings = () => {
  const [webhooks, setWebhooks] = useState<any[]>([]);

  const handleCreateWebhook = () => {
    toast.success('Please upgrade to create webhooks');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Webhooks</h2>
          <div className="flex items-center space-x-2">
            <span className="text-slate-600 dark:text-slate-400">
              Send data to external services when events happen in Papermark
            </span>
            <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-md">
              BUSINESS
            </span>
          </div>
        </div>
        <button
          onClick={handleCreateWebhook}
          className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
        >
          Create Webhook
        </button>
      </div>

      {webhooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <Webhook className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No webhooks configured
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-6">
            Webhooks allow you to receive HTTP requests whenever specific events occur in your account.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Events
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {webhooks.map((webhook) => (
                <tr key={webhook.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                    {webhook.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {webhook.url}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {webhook.events.join(', ')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WebhooksSettings;