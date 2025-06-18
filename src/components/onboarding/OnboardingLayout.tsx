import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onSkip?: () => void;
  showSkip?: boolean;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  onSkip,
  showSkip = true
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left sidebar with progress */}
      <div className="hidden lg:flex lg:w-80 bg-slate-800 border-r border-slate-700 flex-col">
        <div className="p-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 mb-12">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Verifile
            </span>
          </Link>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Setup Progress</span>
              <span className="text-sm text-slate-400">{currentStep}/{totalSteps}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { step: 1, title: 'Company Logo', desc: 'Upload your brand' },
              { step: 2, title: 'Organization', desc: 'Set your company name' },
              { step: 3, title: 'Data Room', desc: 'Create your first room' },
              { step: 4, title: 'Team Members', desc: 'Invite your team' },
              { step: 5, title: 'Review', desc: 'Confirm your setup' }
            ].map((item) => (
              <div key={item.step} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  currentStep >= item.step
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : currentStep === item.step - 1
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {currentStep > item.step ? '✓' : item.step}
                </div>
                <div>
                  <div className={`text-sm font-medium ${
                    currentStep >= item.step ? 'text-white' : 'text-slate-400'
                  }`}>
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-auto p-8">
          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl p-6 border border-blue-800/30">
            <h3 className="text-white font-semibold mb-2">Almost there!</h3>
            <p className="text-slate-400 text-sm">
              Complete your setup to start sharing documents securely with your team.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200 lg:hidden"
              >
                <ArrowLeft className="h-5 w-5 text-slate-400" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-white">Welcome to Verifile</h1>
                <p className="text-slate-400 text-sm">Let's get your account set up</p>
              </div>
            </div>
            
            {showSkip && onSkip && (
              <button
                onClick={onSkip}
                className="text-slate-400 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                Skip and go to Dashboard
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;