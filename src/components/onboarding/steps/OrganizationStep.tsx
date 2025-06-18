import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Check, AlertCircle } from 'lucide-react';

interface OrganizationStepProps {
  organizationName: string;
  onOrganizationNameChange: (name: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const OrganizationStep: React.FC<OrganizationStepProps> = ({
  organizationName,
  onOrganizationNameChange,
  onNext,
  onBack
}) => {
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const trimmedName = organizationName.trim();
    
    if (!trimmedName) {
      setError(touched ? 'Organization name is required' : '');
      setIsValid(false);
    } else if (trimmedName.length < 2) {
      setError('Organization name must be at least 2 characters');
      setIsValid(false);
    } else if (trimmedName.length > 100) {
      setError('Organization name must be less than 100 characters');
      setIsValid(false);
    } else {
      setError('');
      setIsValid(true);
    }
  }, [organizationName, touched]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOrganizationNameChange(e.target.value);
    if (!touched) setTouched(true);
  };

  const handleNext = () => {
    if (isValid) {
      onNext();
    } else {
      setTouched(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">What's your organization name?</h2>
        <p className="text-slate-400 text-lg">
          This will be displayed on your data rooms and shared documents.
        </p>
      </div>

      <div className="space-y-6">
        {/* Organization Name Input */}
        <div className="space-y-2">
          <label htmlFor="orgName" className="block text-sm font-medium text-slate-300">
            Organization Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="orgName"
              type="text"
              value={organizationName}
              onChange={handleInputChange}
              onBlur={() => setTouched(true)}
              placeholder="Enter your organization name"
              className={`block w-full pl-12 pr-12 py-4 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 text-lg ${
                error
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : isValid && touched
                  ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                  : 'border-slate-600 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {isValid && touched && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <Check className="h-5 w-5 text-green-400" />
              </div>
            )}
          </div>
          
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 text-red-400"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          {/* Character Count */}
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">
              This will appear on all your shared documents
            </span>
            <span className={`${
              organizationName.length > 80 ? 'text-orange-400' : 'text-slate-500'
            }`}>
              {organizationName.length}/100
            </span>
          </div>
        </div>

        {/* Preview */}
        {organizationName.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/30 border border-slate-700 rounded-xl p-6"
          >
            <h3 className="text-white font-semibold mb-3">Preview</h3>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">{organizationName.trim()}</div>
                  <div className="text-slate-400 text-sm">Secure Data Room</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <button
            onClick={onBack}
            className="px-6 py-3 text-slate-400 hover:text-white transition-colors duration-200 font-medium"
          >
            ← Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={!isValid}
            className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span>Continue</span>
            <motion.div
              className="ml-2"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              →
            </motion.div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrganizationStep;