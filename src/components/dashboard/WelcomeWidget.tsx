import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeWidgetProps {
  userName?: string;
}

const WelcomeWidget: React.FC<WelcomeWidgetProps> = ({ userName }) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-tr from-blue-600 via-purple-600 to-cyan-600 rounded-2xl p-8 text-white"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;7&quot; cy=&quot;7&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      {/* Floating elements */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-cyan-300/20 rounded-full blur-xl animate-pulse animation-delay-1000"></div>

      <div className="relative">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-6 w-6 text-yellow-300" />
          <span className="text-sm font-medium text-blue-100">Welcome back</span>
        </div>

        <h1 className="text-3xl font-bold mb-2">
          {greeting}, {userName || 'there'}!
        </h1>
        
        <p className="text-blue-100 mb-6 text-lg">
          You have 3 new document views and 2 pending team invitations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="group bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2">
            <span>View Activity</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105">
            Create Data Room
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeWidget;