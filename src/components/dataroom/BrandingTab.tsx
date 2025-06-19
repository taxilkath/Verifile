import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Palette,
  Eye,
  RefreshCw,
  Check,
  Info,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface BrandingSettings {
  logo?: string;
  brandColor: string;
  backgroundColor: string;
  companyName: string;
  tagline: string;
  customDomain?: string;
}

interface BrandingTabProps {
  brandingSettings?: BrandingSettings;
  onBrandingUpdate?: (settings: BrandingSettings) => void;
}

const BrandingTab: React.FC<BrandingTabProps> = ({
  brandingSettings,
  onBrandingUpdate
}) => {
  const [settings, setSettings] = useState<BrandingSettings>({
    brandColor: '#000000',
    backgroundColor: '#ffffff',
    companyName: 'Verifile',
    tagline: 'Secure Document Sharing Platform',
    customDomain: 'verifile.com',
    ...brandingSettings
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.logo || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const backgroundColors = [
    '#ffffff', // White
    '#f8fafc', // Light gray
    '#f1f5f9', // Lighter gray
    '#64748b', // Medium gray
    '#334155', // Dark gray
    '#000000'  // Black
  ];

  const handleLogoUpload = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo file must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
      setSettings(prev => ({ ...prev, logo: result }));
      onBrandingUpdate?.({ ...settings, logo: result });
    };
    reader.readAsDataURL(file);
    setLogoFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleLogoUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleLogoUpload(files[0]);
    }
  };

  const handleColorChange = (field: 'brandColor' | 'backgroundColor', color: string) => {
    const newSettings = { ...settings, [field]: color };
    setSettings(newSettings);
    onBrandingUpdate?.(newSettings);
  };

  const handleTextChange = (field: keyof BrandingSettings, value: string) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    onBrandingUpdate?.(newSettings);
  };

  const resetBranding = () => {
    const defaultSettings: BrandingSettings = {
      brandColor: '#000000',
      backgroundColor: '#ffffff',
      companyName: 'Verifile',
      tagline: 'Secure Document Sharing Platform',
      customDomain: 'verifile.com'
    };
    setSettings(defaultSettings);
    setLogoPreview(null);
    setLogoFile(null);
    onBrandingUpdate?.(defaultSettings);
    toast.success('Branding reset to default');
  };

  const saveBranding = () => {
    toast.success('Branding settings saved successfully!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Settings Panel */}
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Dataroom Branding
          </h4>
          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
            <span>Customize the appearance of this dataroom for all viewers.</span>
            <Info className="h-4 w-4" />
          </div>
        </div>

        {/* Logo Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Logo <span className="text-slate-500">(max 2 MB)</span>
          </label>
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : logoPreview
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {logoPreview ? (
              <div className="space-y-3">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="max-w-24 max-h-24 object-contain mx-auto"
                />
                <p className="text-green-600 dark:text-green-400 font-medium">
                  Logo uploaded successfully
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLogoPreview(null);
                    setLogoFile(null);
                    setSettings(prev => ({ ...prev, logo: undefined }));
                  }}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm"
                >
                  Remove logo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                <div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-slate-500 dark:text-slate-500 text-sm">
                    PNG, JPG, SVG up to 2MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Brand Color */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Brand Color
          </label>
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-lg border-2 border-slate-200 dark:border-slate-600 cursor-pointer"
              style={{ backgroundColor: settings.brandColor }}
              onClick={() => document.getElementById('brand-color-input')?.click()}
            />
            <input
              id="brand-color-input"
              type="color"
              value={settings.brandColor}
              onChange={(e) => handleColorChange('brandColor', e.target.value)}
              className="sr-only"
            />
            <input
              type="text"
              value={settings.brandColor}
              onChange={(e) => handleColorChange('brandColor', e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Background Color
          </label>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {backgroundColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange('backgroundColor', color)}
                className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                  settings.backgroundColor === color
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                }`}
                style={{ backgroundColor: color }}
              >
                {settings.backgroundColor === color && (
                  <Check className="h-4 w-4 text-blue-600 mx-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Company Name */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Company Name
          </label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) => handleTextChange('companyName', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your Company Name"
          />
        </div>

        {/* Tagline */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tagline
          </label>
          <input
            type="text"
            value={settings.tagline}
            onChange={(e) => handleTextChange('tagline', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your company tagline"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={saveBranding}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={resetBranding}
            className="px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Reset branding
          </button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm">
              Document View
            </button>
            <button className="px-3 py-1 text-slate-500 dark:text-slate-400 rounded-lg text-sm">
              Front page
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Browser Preview */}
        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
            {/* Browser Chrome */}
            <div className="bg-slate-200 dark:bg-slate-700 px-4 py-2 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1 bg-white dark:bg-slate-800 rounded px-3 py-1 text-xs text-slate-500 dark:text-slate-400">
                {settings.customDomain}/view/...
              </div>
            </div>

            {/* Document Header */}
            <div 
              className="px-6 py-4 border-b border-slate-200 dark:border-slate-700"
              style={{ backgroundColor: settings.backgroundColor }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="h-8 w-auto object-contain"
                    />
                  ) : (
                    <div 
                      className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: settings.brandColor }}
                    >
                      {settings.companyName.charAt(0)}
                    </div>
                  )}
                  <span 
                    className="font-semibold"
                    style={{ color: settings.brandColor }}
                  >
                    {settings.companyName}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  1:13
                </div>
              </div>
            </div>

            {/* Document Content Preview */}
            <div 
              className="p-8 text-center"
              style={{ backgroundColor: settings.backgroundColor }}
            >
              <h1 
                className="text-4xl font-bold mb-4"
                style={{ color: settings.brandColor }}
              >
                {settings.companyName}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                {settings.tagline}
              </p>
              <div className="text-blue-500 text-sm mb-8">
                www.{settings.customDomain?.replace('https://', '').replace('http://', '')}
              </div>

              {/* Mock Company Logos */}
              <div className="grid grid-cols-4 gap-4 opacity-60">
                {['Snowflake', 'Vercel', 'Pattern', 'Realtor'].map((company, index) => (
                  <div key={company} className="text-xs text-slate-400 font-medium">
                    {company}
                  </div>
                ))}
                {['AppSmith', 'Coinweb', 'CrowdDev', 'Stanford'].map((company, index) => (
                  <div key={company} className="text-xs text-slate-400 font-medium">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingTab;