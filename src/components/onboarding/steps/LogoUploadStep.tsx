import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image, AlertCircle } from 'lucide-react';

interface LogoUploadStepProps {
  logoFile?: File;
  logoPreview?: string;
  onLogoChange: (file?: File, preview?: string) => void;
  onNext: () => void;
}

const LogoUploadStep: React.FC<LogoUploadStepProps> = ({
  logoFile,
  logoPreview,
  onLogoChange,
  onNext
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, SVG, or WebP)');
      return false;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return false;
    }

    setError('');
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        onLogoChange(file, preview);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeLogo = () => {
    onLogoChange(undefined, undefined);
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
        <h2 className="text-3xl font-bold text-white mb-4">Add Your Company Logo</h2>
        <p className="text-slate-400 text-lg">
          Upload your company logo to personalize your data rooms and documents.
          <br />
          <span className="text-sm">This step is optional - you can add it later.</span>
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-500/10'
              : logoPreview
              ? 'border-green-500 bg-green-500/5'
              : 'border-slate-600 hover:border-slate-500 bg-slate-800/30'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {logoPreview ? (
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="max-w-32 max-h-32 object-contain mx-auto rounded-lg"
                />
                <button
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-green-400 mt-4 font-medium">Logo uploaded successfully!</p>
              <p className="text-slate-400 text-sm mt-1">
                {logoFile?.name} ({(logoFile?.size || 0 / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex p-4 bg-slate-700 rounded-full mb-4">
                <Upload className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Drop your logo here</h3>
              <p className="text-slate-400 mb-4">
                or <span className="text-blue-400 font-medium">browse files</span>
              </p>
              <p className="text-slate-500 text-sm">
                Supports JPEG, PNG, SVG, WebP • Max 5MB
              </p>
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

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
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

export default LogoUploadStep;