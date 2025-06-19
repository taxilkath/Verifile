import React, { useState } from 'react';
import { toast } from 'sonner';

const GeneralSettings = () => {
  const [teamName, setTeamName] = useState("Ron Janak's Team");
  const [excelAdvancedMode, setExcelAdvancedMode] = useState(false);

  const handleSaveChanges = () => {
    toast.success('Changes saved successfully');
  };

  const handleDeleteTeam = () => {
    toast.error('This action cannot be undone. Please confirm deletion.');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">General</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your team
        </p>
      </div>

      {/* Team Name */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Team Name
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          This is the name of your team on Papermark.
        </p>
        <div className="space-y-2">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Max 32 characters.
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

      {/* Excel Advanced Mode */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Excel Advanced Mode
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Enable advanced mode for all new Excel files in your team. Existing files will not be affected.
        </p>
        <div className="flex items-center mb-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={excelAdvancedMode}
              onChange={() => setExcelAdvancedMode(!excelAdvancedMode)}
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">Enable advanced mode for Excel files</span>
          </label>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          When enabled, newly uploaded Excel files will be viewed using the Microsoft Office viewer for better formatting and compatibility.
        </p>
        <button 
          onClick={handleSaveChanges}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
        >
          Save Changes
        </button>
      </div>

      {/* Delete Team */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-800 p-6">
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
          Delete Team
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Permanently delete your team, custom domains, and all associated documents, links + their views.
          <br />
          This action cannot be undone - please proceed with caution.
        </p>
        <button 
          onClick={handleDeleteTeam}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Delete Team
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;