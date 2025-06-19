import React from 'react';
import { Sliders, Plus } from 'lucide-react';
import { toast } from 'sonner';

const PresetsSettings = () => {
  const handleCreatePreset = () => {
    toast.success('Preset creation feature coming soon');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Presets</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Create reusable settings for your documents and data rooms
          </p>
        </div>
        <button
          onClick={handleCreatePreset}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Preset</span>
        </button>
      </div>

      {/* Empty State */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sliders className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          No presets yet
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
          Presets allow you to save and reuse settings for your documents and data rooms, 
          such as access controls, branding, and more.
        </p>
        <button
          onClick={handleCreatePreset}
          className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
        >
          Create Your First Preset
        </button>
      </div>
    </div>
  );
};

export default PresetsSettings;