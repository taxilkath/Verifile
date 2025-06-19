import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cog,
  Bell,
  Copy,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface SettingsTabProps {
  dataroomId: string;
  dataroomName: string;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ dataroomId, dataroomName }) => {
  const [name, setName] = useState(dataroomName);
  
  const handleSaveChanges = () => {
    toast.success('Changes saved successfully');
  };
  
  const handleCopyId = () => {
    navigator.clipboard.writeText(dataroomId);
    toast.success('Dataroom ID copied to clipboard');
  };
  
  const handleDuplicateDataroom = () => {
    toast.success('Please upgrade to duplicate datarooms');
  };
  
  const handleDeleteDataroom = () => {
    toast.error('This action cannot be undone. Please confirm deletion.');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="md:col-span-1">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4">
            <button className="w-full flex items-center space-x-3 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white">
              <Cog className="h-5 w-5 text-slate-500" />
              <span>General</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg mt-1">
              <Bell className="h-5 w-5 text-slate-500" />
              <span>Notifications</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="md:col-span-3">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 space-y-8">
            {/* Dataroom Name */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Dataroom Name
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                This is the name of your data room.
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Max 32 characters
                  </div>
                  <button 
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Duplicate Dataroom */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Duplicate Dataroom
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Create a new data room with the same content (folders and files) as this data room.
              </p>
              <div className="flex justify-end">
                <button 
                  onClick={handleDuplicateDataroom}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                >
                  <span>Upgrade to Duplicate Datarooms</span>
                </button>
              </div>
            </div>

            {/* Dataroom ID */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Dataroom ID
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Unique ID of your dataroom.
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={dataroomId}
                  readOnly
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none text-slate-600 dark:text-slate-400"
                />
                <button 
                  onClick={handleCopyId}
                  className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Used to identify your dataroom when interacting with the API.
              </p>
            </div>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Danger Zone
              </h3>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mt-4">
                <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">Delete this dataroom</h4>
                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                  Once you delete a dataroom, there is no going back. Please be certain.
                </p>
                <button 
                  onClick={handleDeleteDataroom}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Delete Dataroom
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;