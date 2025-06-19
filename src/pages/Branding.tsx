import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import {
  Upload,
  Palette,
  Eye,
  RefreshCw,
  Check,
  Info,
  ChevronLeft,
  ChevronRight,
  X,
  Crown,
  Globe,
  Link as LinkIcon
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

const Branding = () => {
  const [settings, setSettings] = useState<BrandingSettings>({
    brandColor: '#000000',
    backgroundColor: '#ffffff',
    companyName: 'Verifile',
    tagline: 'Secure Document Sharing Platform',
    customDomain: 'verifile.com'
  });

  const [activeTab, setActiveTab] = useState('document-branding');
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
    setSettings(prev => ({ ...prev, [field]: color }));
  };

  const handleTextChange = (field: keyof BrandingSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
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
    toast.success('Branding reset to default');
  };

  const saveBranding = () => {
    toast.success('Branding settings saved successfully!');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Branding</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Customize how your brand appears globally across Verifile documents your visitors see.
        </p>
      </div>

      {/* Tabs */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
          <Tabs.Trigger
            value="document-branding"
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'document-branding'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Document Branding
          </Tabs.Trigger>
          <Tabs.Trigger
            value="domains"
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'domains'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Domains
          </Tabs.Trigger>
          <Tabs.Trigger
            value="link-previews"
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'link-previews'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Link Previews
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="document-branding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Settings Panel */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Document Branding
                </h4>
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <span>All direct links to documents will have your branding applied.</span>
                  <Info className="h-4 w-4" />
                  <span className="italic">Data rooms are styled individually.</span>
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
                  className="flex items-center space-x-2 px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                >
                  <Crown className="h-4 w-4" />
                  <span>Upgrade to Save Branding</span>
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
        </Tabs.Content>

        <Tabs.Content value="domains">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Custom Domains</h3>
                  <p className="text-slate-600 dark:text-slate-400">Use your own domain for document sharing links</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Pro Feature</h4>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Custom domains are available on the Pro plan. Upgrade to use your own domain for all your document links.
                    </p>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Default Domain</h4>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-white">
                      verifile.com
                    </div>
                    <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-lg">
                      Active
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Custom Domains</h4>
                  <div className="bg-slate-100 dark:bg-slate-700/50 rounded-xl p-8 text-center">
                    <Globe className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      No custom domains configured yet. Upgrade to Pro to add your own domain.
                    </p>
                    <button className="bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors disabled:opacity-50" disabled>
                      Add Custom Domain
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="link-previews">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <LinkIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Link Previews</h3>
                  <p className="text-slate-600 dark:text-slate-400">Customize how your links appear when shared on social media</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Pro Feature</h4>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Custom link previews are available on the Pro plan. Upgrade to customize how your links appear when shared.
                    </p>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Default Link Preview</h4>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-b border-slate-200 dark:border-slate-600">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">Preview</div>
                    </div>
                    <div className="p-4">
                      <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-lg flex-shrink-0"></div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white mb-1">Verifile Document</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Secure document sharing platform</div>
                            <div className="text-xs text-blue-500">verifile.com</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Custom Link Preview Settings</h4>
                  <div className="bg-slate-100 dark:bg-slate-700/50 rounded-xl p-8 text-center">
                    <Eye className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Upgrade to Pro to customize your link preview image, title, and description.
                    </p>
                    <button className="bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors disabled:opacity-50" disabled>
                      Customize Link Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default Branding;