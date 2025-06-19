import React, { useState } from 'react';
import { Key, Copy, Info } from 'lucide-react';
import { toast } from 'sonner';

interface Token {
  id: string;
  name: string;
  prefix: string;
  createdBy: string;
  createdAt: string;
}

const TokensSettings = () => {
  const [tokens, setTokens] = useState<Token[]>([
    {
      id: '1',
      name: 'asda',
      prefix: 'pmk...5aPV',
      createdBy: 'ron Janak',
      createdAt: 'Jun 19, 2025'
    }
  ]);
  
  const [newTokenName, setNewTokenName] = useState('');
  const [newToken, setNewToken] = useState<string | null>(null);

  const handleGenerateToken = () => {
    if (!newTokenName.trim()) {
      toast.error('Please enter a token name');
      return;
    }
    
    // Generate a mock token
    const mockToken = 'pmk_XA96g6Rqwq13V2H384SaPV';
    setNewToken(mockToken);
    
    // Add to tokens list
    const newTokenObj = {
      id: Date.now().toString(),
      name: newTokenName,
      prefix: 'pmk...aPV',
      createdBy: 'ron Janak',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setTokens([...tokens, newTokenObj]);
    setNewTokenName('');
  };

  const handleCopyToken = () => {
    if (newToken) {
      navigator.clipboard.writeText(newToken);
      toast.success('Token copied to clipboard');
    }
  };

  const handleRevokeToken = (id: string) => {
    setTokens(tokens.filter(token => token.id !== id));
    toast.success('Token revoked successfully');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">API Tokens</h2>
        <p className="text-slate-600 dark:text-slate-400 flex items-center space-x-2">
          <span>Create API tokens to integrate Papermark with your applications. Keep your tokens secure and never share them publicly.</span>
          <Info className="h-4 w-4 text-slate-400" />
        </p>
      </div>

      {/* Token Generator */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="tokenName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Token Name
            </label>
            <input
              id="tokenName"
              type="text"
              value={newTokenName}
              onChange={(e) => setNewTokenName(e.target.value)}
              placeholder="Enter a name for your token"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {newToken && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Your API Token (copy it now, it won't be shown again)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newToken}
                  readOnly
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none text-slate-600 dark:text-slate-400"
                />
                <button 
                  onClick={handleCopyToken}
                  className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleGenerateToken}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
          >
            Generate Token
          </button>
        </div>
      </div>

      {/* Existing Tokens */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Existing Tokens
        </h3>
        
        {tokens.length > 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {tokens.map((token) => (
                    <tr key={token.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {token.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {token.prefix}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex flex-col">
                          <span>Created by {token.createdBy}</span>
                          <span>{token.createdAt}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRevokeToken(token.id)}
                          className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No API tokens yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Generate your first API token to integrate with your applications
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokensSettings;