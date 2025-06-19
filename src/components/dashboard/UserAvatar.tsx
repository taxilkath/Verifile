import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  Key,
  LogOut,
  ChevronDown,
  UserCog,
  HelpCircle,
  Bell,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

interface UserAvatarProps {
  user: SupabaseUser | null;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const menuItems = [
    { icon: User, label: 'Profile', onClick: () => handleNavigate('/dashboard/profile') },
    { icon: Settings, label: 'Account Settings', onClick: () => handleNavigate('/dashboard/settings') },
    { icon: Key, label: 'API Tokens', onClick: () => handleNavigate('/dashboard/settings') },
    { icon: Bell, label: 'Notifications', onClick: () => handleNavigate('/dashboard/settings') },
    { icon: Shield, label: 'Security', onClick: () => handleNavigate('/dashboard/settings') },
    { icon: HelpCircle, label: 'Help & Support', onClick: () => window.open('https://docs.verifile.com', '_blank') },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user?.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-slate-900 dark:text-white">
            {user?.email?.split('@')[0]}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {user?.email}
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl z-50"
          >
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {user?.email?.split('@')[0]}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="py-2">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 py-2">
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserAvatar;