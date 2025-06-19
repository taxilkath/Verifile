import React, { useState } from 'react';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Agreement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  isDefault: boolean;
}

const AgreementsSettings = () => {
  const [agreements, setAgreements] = useState<Agreement[]>([
    {
      id: '1',
      title: 'Standard Confidentiality Notice',
      content: 'This document contains confidential information. By viewing this document, you agree to maintain its confidentiality and not to share its contents with any third party without explicit permission.',
      isActive: true,
      isDefault: true
    }
  ]);

  const handleCreateAgreement = () => {
    toast.success('Agreement creation feature coming soon');
  };

  const handleEditAgreement = (id: string) => {
    toast.success('Agreement editing feature coming soon');
  };

  const handleToggleActive = (id: string) => {
    setAgreements(agreements.map(agreement => 
      agreement.id === id 
        ? { ...agreement, isActive: !agreement.isActive }
        : agreement
    ));
    
    const agreement = agreements.find(a => a.id === id);
    toast.success(`Agreement ${agreement?.isActive ? 'deactivated' : 'activated'} successfully`);
  };

  const handleDeleteAgreement = (id: string) => {
    const agreement = agreements.find(a => a.id === id);
    if (agreement?.isDefault) {
      toast.error('You cannot delete the default agreement');
      return;
    }
    
    setAgreements(agreements.filter(agreement => agreement.id !== id));
    toast.success('Agreement deleted successfully');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Agreements</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Require viewers to accept agreements before accessing documents
          </p>
        </div>
        <button
          onClick={handleCreateAgreement}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Agreement</span>
        </button>
      </div>

      {/* Default Agreement */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Default Agreement</h3>
        
        {agreements.filter(a => a.isDefault).map((agreement) => (
          <div key={agreement.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium text-slate-900 dark:text-white">{agreement.title}</div>
              <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-lg">
                Active
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              {agreement.content}
            </p>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Applied to all documents by default
            </div>
          </div>
        ))}
      </div>

      {/* Custom Agreements */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Custom Agreements</h3>
        
        {agreements.filter(a => !a.isDefault).length > 0 ? (
          <div className="space-y-4">
            {agreements.filter(a => !a.isDefault).map((agreement) => (
              <div key={agreement.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-slate-900 dark:text-white">{agreement.title}</div>
                  <div className="flex items-center space-x-2">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id={`toggle-${agreement.id}`}
                        className="sr-only peer"
                        checked={agreement.isActive}
                        onChange={() => handleToggleActive(agreement.id)}
                      />
                      <label 
                        htmlFor={`toggle-${agreement.id}`}
                        className="block h-6 overflow-hidden bg-slate-300 dark:bg-slate-600 rounded-full cursor-pointer peer-checked:bg-blue-500"
                      >
                        <span className="absolute inset-y-0 left-0 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out peer-checked:translate-x-4"></span>
                      </label>
                    </div>
                    
                    <button
                      onClick={() => handleEditAgreement(agreement.id)}
                      className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteAgreement(agreement.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {agreement.content.length > 100 
                    ? `${agreement.content.substring(0, 100)}...` 
                    : agreement.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No custom agreements yet.
            </p>
            <button
              onClick={handleCreateAgreement}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
            >
              Create Custom Agreement
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgreementsSettings;