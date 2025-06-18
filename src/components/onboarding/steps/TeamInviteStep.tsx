import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, X, Plus, Check, AlertCircle } from 'lucide-react';

interface TeamInviteStepProps {
  teamInvites: string[];
  onTeamInvitesChange: (invites: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const TeamInviteStep: React.FC<TeamInviteStepProps> = ({
  teamInvites,
  onTeamInvitesChange,
  onNext,
  onBack
}) => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addEmail = () => {
    const email = currentEmail.trim().toLowerCase();
    
    if (!email) {
      setEmailError('Please enter an email address');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (teamInvites.includes(email)) {
      setEmailError('This email has already been added');
      return;
    }

    onTeamInvitesChange([...teamInvites, email]);
    setCurrentEmail('');
    setEmailError('');
  };

  const removeEmail = (emailToRemove: string) => {
    onTeamInvitesChange(teamInvites.filter(email => email !== emailToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEmail(e.target.value);
    if (emailError) setEmailError('');
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
        <h2 className="text-3xl font-bold text-white mb-4">Invite Your Team</h2>
        <p className="text-slate-400 text-lg">
          Add team members who will help manage documents and data rooms.
          <br />
          <span className="text-sm">You can always invite more people later.</span>
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="teamEmail" className="block text-sm font-medium text-slate-300">
            Team Member Email
          </label>
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="teamEmail"
                type="email"
                value={currentEmail}
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
                placeholder="colleague@company.com"
                className={`block w-full pl-12 pr-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  emailError
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-slate-600 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
            </div>
            <button
              onClick={addEmail}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
          
          {emailError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 text-red-400"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{emailError}</span>
            </motion.div>
          )}
        </div>

        {/* Invited Team Members */}
        {teamInvites.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              Team Members to Invite ({teamInvites.length})
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <AnimatePresence>
                {teamInvites.map((email, index) => (
                  <motion.div
                    key={email}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between bg-slate-800/50 border border-slate-600 rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <UserPlus className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{email}</div>
                        <div className="text-slate-400 text-sm">Pending invitation</div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeEmail(email)}
                      className="p-1 text-slate-400 hover:text-red-400 transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Empty State */}
        {teamInvites.length === 0 && (
          <div className="text-center py-12 bg-slate-800/20 border border-slate-700 rounded-xl">
            <div className="inline-flex p-4 bg-slate-700 rounded-full mb-4">
              <UserPlus className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">No team members added yet</h3>
            <p className="text-slate-400 text-sm">
              Add email addresses above to invite team members to your organization.
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h4 className="text-blue-300 font-medium mb-1">What happens next?</h4>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Team members will receive an email invitation</li>
                <li>• They can create an account and join your organization</li>
                <li>• You can manage permissions and access levels later</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <button
            onClick={onBack}
            className="px-6 py-3 text-slate-400 hover:text-white transition-colors duration-200 font-medium"
          >
            ← Back
          </button>
          
          <button
            onClick={onNext}
            className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-2"
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

export default TeamInviteStep;