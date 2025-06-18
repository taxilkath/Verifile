import React, { useState, useEffect, useRef } from 'react';

const stats = [
  { number: '10K+', label: 'Active Users', suffix: '' },
  { number: '50M+', label: 'Documents Shared', suffix: '' },
  { number: '99.9%', label: 'Uptime SLA', suffix: '' },
  { number: '256', label: 'Bit Encryption', suffix: 'AES-' }
];

const AnimatedNumber = ({ target, suffix = '', prefix = '' }) => {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
    let startTime = null;
    const duration = 2000; // 2 seconds

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const currentValue = Math.floor(progress * numericTarget);
      setCurrent(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, target]);

  const formatNumber = (num) => {
    if (target.includes('K')) return (num / 1000).toFixed(1) + 'K';
    if (target.includes('M')) return (num / 1000000).toFixed(1) + 'M';
    if (target.includes('.')) return num.toFixed(1);
    return num.toString();
  };

  return (
    <span ref={ref} className="font-bold text-3xl lg:text-4xl">
      {prefix}{isVisible ? formatNumber(current) : '0'}{target.includes('%') ? '%' : ''}{suffix}
    </span>
  );
};

const Stats = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-slate-900 to-cyan-900/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Trusted by professionals
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              worldwide
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Join thousands of businesses who trust Verifile with their most sensitive documents
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105"
            >
              <div className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                <AnimatedNumber target={stat.number} suffix={stat.suffix} />
              </div>
              <div className="text-slate-400 mt-2 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Global visualization */}
        <div className="mt-24 text-center">
          <div className="relative inline-block">
            <div className="w-96 h-96 mx-auto rounded-full bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-800/30 flex items-center justify-center">
              <div className="w-72 h-72 rounded-full bg-gradient-to-br from-blue-800/30 to-cyan-800/30 border border-blue-700/50 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-600/40 to-cyan-600/40 border border-blue-600/60 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-2">Global Scale</div>
                    <div className="text-slate-400">Available Worldwide</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating stats */}
            <div className="absolute top-8 left-8 bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
              <div className="text-green-400 font-bold">150+</div>
              <div className="text-xs text-slate-400">Countries</div>
            </div>
            <div className="absolute top-16 right-4 bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
              <div className="text-blue-400 font-bold">24/7</div>
              <div className="text-xs text-slate-400">Support</div>
            </div>
            <div className="absolute bottom-12 left-12 bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
              <div className="text-purple-400 font-bold">SOC 2</div>
              <div className="text-xs text-slate-400">Compliant</div>
            </div>
            <div className="absolute bottom-8 right-8 bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
              <div className="text-orange-400 font-bold">GDPR</div>
              <div className="text-xs text-slate-400">Ready</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;