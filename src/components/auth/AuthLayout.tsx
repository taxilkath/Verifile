import React from 'react';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Verifile
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-slate-400">{subtitle}</p>
          </div>

          {/* Form */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8">
            {children}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-slate-400 text-sm">
            <p>© 2025 Verifile. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-slate-900 to-cyan-900/30"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23334155&quot; fill-opacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;7&quot; cy=&quot;7&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

        {/* Content */}
        <div className="relative flex items-center justify-center p-12">
          <div className="text-center max-w-lg">
            <div className="mb-8">
              <div className="inline-flex p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl border border-blue-500/30 mb-6">
                <Shield className="h-16 w-16 text-blue-400" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Secure Document
              </span>
              <br />
              <span className="text-white">Sharing Platform</span>
            </h2>
            
            <p className="text-xl text-slate-400 leading-relaxed mb-8">
              Join thousands of professionals who trust Verifile to protect their sensitive documents and accelerate their business processes.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Bank-grade encryption</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Real-time analytics</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Custom branding</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default AuthLayout;