import React from 'react';
import { Shield, BarChart3, Palette, Users, Lock, Zap } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption, watermarking, and access controls to protect your most sensitive documents.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track who viewed your documents, for how long, and get insights to accelerate your deals.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Palette,
    title: 'Custom Branding',
    description: 'White-label your data rooms with custom logos, colors, and domains for a professional experience.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite team members, set permissions, and collaborate securely on sensitive document sharing.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: Lock,
    title: 'Advanced Access Controls',
    description: 'Set expiration dates, download limits, IP restrictions, and require NDAs before access.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed with global CDN, instant previews, and seamless document navigation.',
    color: 'from-yellow-500 to-orange-500'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Everything you need for
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              secure document sharing
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            More than just file sharing. Verifile provides professional-grade features 
            to protect your documents and accelerate your business processes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-blue-300 transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;