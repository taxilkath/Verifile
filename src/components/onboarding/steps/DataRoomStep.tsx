import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Check, AlertCircle } from 'lucide-react';

interface DataRoomStepProps {
  dataRoomName: string;
  dataRoomDescription: string;
  onDataRoomNameChange: (name: string) => void;
  onDataRoomDescriptionChange: (description: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const DataRoomStep: React.FC<DataRoomStepProps> = ({
  dataRoomName,
  dataRoomDescription,
  onDataRoomNameChange,
  onDataRoomDescriptionChange,
  onNext,
  onBack
}) => {
  const [nameError, setNameError] = useState('');
  const [isNameValid, setIsNameValid] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);

  useEffect(() => {
    const trimmedName = dataRoomName.trim();
    
    if (!trimmedName) {
      setNameError(nameTouched ? 'Data room name is required' : '');
      setIsNameValid(false);
    } else if (trimmedName.length < 2) {
      setNameError('Data room name must be at least 2 characters');
      setIsNameValid(false);
    } else if (trimmedName.length > 100) {
      setNameError('Data room name must be less than 100 characters');
      setIsNameValid(false);
    } else {
      setNameError('');
      setIsNameValid(true);
    }
  }, [dataRoomName, nameTouched]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDataRoomNameChange(e.target.value);
    if (!nameTouched) setNameTouched(true);
  };

  const handleNext = () => {
    if (isNameValid) {
      onNext();
    } else {
      setNameTouched(true);
    }
  };

  const suggestedNames = [
    'Financial Documents',
    'Due Diligence',
    'Project Alpha',
    'Board Materials',
    'Legal Documents',
    'Investment Deck'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Create Your First Data Room</h2>
        <p className="text-slate-400 text-lg">
          Data rooms are secure spaces where you can organize and share documents with specific people.
        </p>
      </div>

      <div className="space-y-6">
        {/* Data Room Name */}
        <div className="space-y-2">
          <label htmlFor="dataRoomName" className="block text-sm font-medium text-slate-300">
            Data Room Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FolderOpen className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="dataRoomName"
              type="text"
              value={dataRoomName}
              onChange={handleNameChange}
              onBlur={() => setNameTouched(true)}
              placeholder="Enter data room name"
              className={`block w-full pl-12 pr-12 py-4 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 text-lg ${
                nameError
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : isNameValid && nameTouched
                  ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                  : 'border-slate-600 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {isNameValid && nameTouched && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <Check className="h-5 w-5 text-green-400" />
              </div>
            )}
          </div>
          
          {nameError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 text-red-400"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{nameError}</span>
            </motion.div>
          )}
        </div>

        {/* Suggested Names */}
        {!dataRoomName && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-400">
              Popular data room names
            </label>
            <div className="flex flex-wrap gap-2">
              {suggestedNames.map((name) => (
                <button
                  key={name}
                  onClick={() => onDataRoomNameChange(name)}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg text-sm transition-all duration-200 hover:scale-105"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="dataRoomDescription" className="block text-sm font-medium text-slate-300">
            Description (Optional)
          </label>
          <textarea
            id="dataRoomDescription"
            value={dataRoomDescription}
            onChange={(e) => onDataRoomDescriptionChange(e.target.value)}
            placeholder="Describe what this data room will contain..."
            rows={4}
            className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
          />
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">
              Help team members understand the purpose of this data room
            </span>
            <span className={`${
              dataRoomDescription.length > 450 ? 'text-orange-400' : 'text-slate-500'
            }`}>
              {dataRoomDescription.length}/500
            </span>
          </div>
        </div>

        {/* Preview */}
        {dataRoomName.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/30 border border-slate-700 rounded-xl p-6"
          >
            <h3 className="text-white font-semibold mb-3">Preview</h3>
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium mb-1">{dataRoomName.trim()}</div>
                  {dataRoomDescription.trim() && (
                    <div className="text-slate-400 text-sm">{dataRoomDescription.trim()}</div>
                  )}
                  <div className="text-slate-500 text-xs mt-2">Created today • 0 documents</div>
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
            disabled={!isNameValid}
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

export default DataRoomStep;