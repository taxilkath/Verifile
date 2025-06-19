import React, { useState } from 'react';
import { Globe, Plus, Check, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Domain {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'failed';
  isDefault: boolean;
}

const DomainsSettings = () => {
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: '1',
      name: 'verifile.com',
      status: 'active',
      isDefault: true
    }
  ]);
  
  const [newDomain, setNewDomain] = useState('');

  const handleAddDomain = () => {
    if (!newDomain.trim()) {
      toast.error('Please enter a domain');
      return;
    }
    
    // Validate domain format
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(newDomain)) {
      toast.error('Please enter a valid domain');
      return;
    }
    
    // Check if domain already exists
    if (domains.some(domain => domain.name === newDomain)) {
      toast.error('This domain is already added');
      return;
    }
    
    // Add new domain
    const newDomainObj = {
      id: Date.now().toString(),
      name: newDomain,
      status: 'pending' as const,
      isDefault: false
    };
    
    setDomains([...domains, newDomainObj]);
    setNewDomain('');
    toast.success('Domain added successfully. Verification pending.');
  };

  const handleRemoveDomain = (id: string) => {
    const domain = domains.find(d => d.id === id);
    if (domain?.isDefault) {
      toast.error('You cannot remove the default domain');
      return;
    }
    
    setDomains(domains.filter(domain => domain.id !== id));
    toast.success('Domain removed successfully');
  };

  const handleSetDefault = (id: string) => {
    setDomains(domains.map(domain => ({
      ...domain,
      isDefault: domain.id === id
    })));
    toast.success('Default domain updated successfully');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Domains</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Manage custom domains for your organization
        </p>
      </div>

      {/* Default Domain */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Default Domain</h3>
        
        <div className="flex items-center space-x-3">
          <div className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white">
            verifile.com
          </div>
          <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-lg">
            Active
          </div>
        </div>
      </div>

      {/* Custom Domains */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Custom Domains</h3>
        
        <div className="space-y-4 mb-6">
          {domains.filter(domain => !domain.isDefault).length > 0 ? (
            domains.filter(domain => !domain.isDefault).map((domain) => (
              <div key={domain.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-slate-400" />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">{domain.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {domain.status === 'active' ? 'Verified' : 
                       domain.status === 'pending' ? 'Verification pending' : 
                       'Verification failed'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {domain.status === 'active' && (
                    <button
                      onClick={() => handleSetDefault(domain.id)}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                    >
                      Set as Default
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleRemoveDomain(domain.id)}
                    className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                No custom domains configured yet.
              </p>
            </div>
          )}
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h4 className="font-medium text-slate-900 dark:text-white mb-4">Add Custom Domain</h4>
          
          <div className="flex space-x-3">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="yourdomain.com"
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAddDomain}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
            >
              Add Domain
            </button>
          </div>
          
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            After adding a domain, you'll need to configure DNS settings to verify ownership.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DomainsSettings;