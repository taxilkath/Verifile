import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900 to-cyan-900/20"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23334155&quot; fill-opacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;7&quot; cy=&quot;7&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border border-blue-800/50 mb-8 animate-slideUp">
            <span className="text-sm font-medium text-blue-300">🚀 Trusted by 10,000+ professionals</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 animate-slideUp animation-delay-200">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent leading-tight block">
              Secure Document
            </span>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight block">
              Sharing Platform
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-slideUp animation-delay-400">
            Share sensitive files with advanced access controls, custom branding, and real-time analytics. 
            Built for professionals who need more than basic file sharing.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slideUp animation-delay-600">
            <button className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-2">
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button className="group flex items-center space-x-2 text-white hover:text-blue-300 transition-colors duration-200 px-8 py-4">
              <div className="p-2 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors duration-200">
                <Play className="h-5 w-5 ml-0.5" />
              </div>
              <span className="font-medium">Watch Demo</span>
            </button>
          </div>

          {/* Hero illustration */}
          <div className="relative animate-slideUp animation-delay-800">
            <div className="mx-auto max-w-5xl">
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 max-w-md mx-4">
                    <div className="bg-slate-700 rounded-lg px-4 py-2 text-sm text-slate-400">
                      verifile.com/secure/financial-docs
                    </div>
                  </div>
                  <div className="w-20"></div>
                </div>

                {/* Dashboard preview */}
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Q4 Financial Report.pdf</h3>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded-full">Protected</span>
                            <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full">Analytics</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                          </div>
                          <div className="flex justify-between text-sm text-slate-400">
                            <span>Downloaded by 12 recipients</span>
                            <span>74% completion rate</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                        <div className="text-sm text-slate-400 mb-2">Access Control</div>
                        <div className="text-2xl font-bold text-green-400">Enterprise</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                        <div className="text-sm text-slate-400 mb-2">Views Today</div>
                        <div className="text-2xl font-bold text-blue-400">247</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;