import React from 'react';
import { CreditCard, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const BillingSettings = () => {
  const handleUpgrade = () => {
    toast.success('Redirecting to upgrade page');
  };

  const handleUpdatePayment = () => {
    toast.success('Payment method updated successfully');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Billing</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Current Plan</h3>
        
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <CreditCard className="h-6 w-6 text-slate-500" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-1">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">Free Plan</h4>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                Current
              </span>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Basic features with limited usage
            </p>
            
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-slate-600 dark:text-slate-400">Up to 50 documents</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-slate-600 dark:text-slate-400">Up to 50 links</span>
              </div>
              <div className="flex items-start space-x-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-slate-600 dark:text-slate-400">Basic analytics</span>
              </div>
            </div>
          </div>
          
          <div>
            <button
              onClick={handleUpgrade}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Upgrade
            </button>
          </div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                You're using 2/50 documents and 4/50 links
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Upgrade to increase your usage limits and unlock premium features
              </p>
              <button
                onClick={handleUpgrade}
                className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium"
              >
                Change plan to increase usage limits
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Payment Methods</h3>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-slate-400" />
          </div>
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No payment methods
          </h4>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Add a payment method to upgrade to a paid plan
          </p>
          <button
            onClick={handleUpdatePayment}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
          >
            Add Payment Method
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Billing History</h3>
        
        <div className="text-center py-8">
          <p className="text-slate-600 dark:text-slate-400">
            No billing history available
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillingSettings;