import React from 'react';
import { Shield, Twitter, Linkedin, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Verifile
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              Secure document sharing and data room platform designed for professionals who need more than basic file sharing.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200">
                <Twitter className="h-5 w-5 text-slate-400 hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200">
                <Linkedin className="h-5 w-5 text-slate-400 hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200">
                <Github className="h-5 w-5 text-slate-400 hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200">
                <Mail className="h-5 w-5 text-slate-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-6">Product</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Security</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Analytics</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Integrations</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">API</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">About</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Blog</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Contact</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Press</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-6">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Documentation</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Status</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Community</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Contact Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm">
              © 2025 Verifile, Inc. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;