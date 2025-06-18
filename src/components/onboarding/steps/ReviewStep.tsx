import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Building2, FolderOpen, UserPlus, Loader2, AlertCircle } from 'lucide-react';

interface ReviewStepProps {
  organizationName: string;
  logoPreview?: string;
  dataRoomName: string;
  dataRoomDescription: string;
  teamInvites: string[];
  onComplete: () => Promise<void>;
  onBack: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  organizationName,
  logoPreview,
  dataRoomName,
  dataRoomDescription,
  teamInvites,
  onComplete,
  onBack
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = async () => {
    setIsCompleting(true);
    setError('');
    
    try {
      await onComplete();
    } catch (err) {
      setError('Failed to complete onboarding. Please try again.');
      setIsCompleting(false);
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
        <h2 className="text-3xl font-bold text-white mb-4">Review Your Setup</h2>
        <p className="text-slate-400 text-lg">
          Please review your information before completing the setup.
        </p>
      </div>

      <div className="space-y-6">
        {/* Organization Summary */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-white font-semibold">Organization</h3>
          </div>
          
          <div className="flex items-center space-x-4">
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Organization logo"
                className="w-12 h-12 object-contain rounded-lg bg-slate-700"
              />
            )}
            <div>
              <div className="text-white font-medium">{organizationName}</div>
              <div className="text-slate-400 text-sm">
                {logoPreview ? 'With custom logo' : 'No logo uploaded'}
              </div>
            </div>
          </div>
        </div>

        {/* Data Room Summary */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <FolderOpen className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-white font-semibold">First Data Room</h3>
          </div>
          
          <div>
            <div className="text-white font-medium mb-1">{dataRoomName}</div>
            {dataRoomDescription && (
              <div className="text-slate-400 text-sm mb-2">{dataRoomDescription}</div>
            )}
            <div className="text-slate-500 text-xs">Ready to receive documents</div>
          </div>
        </div>

        {/* Team Invites Summary */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-white font-semibold">Team Invitations</h3>
          </div>
          
          {teamInvites.length > 0 ? (
            <div className="space-y-2">
              <div className="text-slate-400 text-sm mb-3">
                {teamInvites.length} team member{teamInvites.length !== 1 ? 's' : ''} will be invited:
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {teamInvites.map((email, index) => (
                  <div key={index} className="text-white text-sm bg-slate-700/50 rounded px-3 py-1">
                    {email}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm">
              No team members to invite - you can add them later
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-2 text-red-400 bg-red-900/20 border border-red-700/50 rounded-lg p-3"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {/* Completion Info */}
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h4 className="text-blue-300 font-medium mb-1">What happens when you complete setup?</h4>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Your organization and data room will be created</li>
                <li>• Team invitation emails will be sent</li>
                <li>• You'll be redirected to your dashboard</li>
                <li>• You can start uploading and sharing documents</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <button
            onClick={onBack}
            disabled={isCompleting}
            className="px-6 py-3 text-slate-400 hover:text-white transition-colors duration-200 font-medium disabled:opacity-50"
          >
            ← Back
          </button>
          
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isCompleting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Completing Setup...</span>
              </>
            ) : (
              <>
                <span>Complete Setup</span>
                <Check className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewStep;