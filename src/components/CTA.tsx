import React from 'react';
import { ArrowRight, Shield, Clock, Users } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900 to-cyan-900/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl lg:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
              Ready to secure your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              document sharing?
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Join thousands of professionals who trust Verifile to protect their most sensitive documents 
            and accelerate their business processes.
          </p>

          {/* Benefits */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
            <div className="flex items-center space-x-3 text-slate-300">
              <Shield className="h-6 w-6 text-blue-400" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-300">
              <Clock className="h-6 w-6 text-green-400" />
              <span>5-minute Setup</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-300">
              <Users className="h-6 w-6 text-purple-400" />
              <span>Unlimited Users</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-5 rounded-xl font-semibold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-3">
              <span>Start Free Trial</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button className="text-white hover:text-blue-300 transition-colors duration-200 px-10 py-5 font-semibold text-xl border border-slate-600 hover:border-slate-500 rounded-xl">
              Schedule Demo
            </button>
          </div>

          {/* Trust indicators */}
          <div className="text-slate-400 text-sm">
            <p>No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"></div>
      </div>
    </section>
  );
};

export default CTA;