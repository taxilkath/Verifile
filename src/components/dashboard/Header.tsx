import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown,
  User,
  Settings,
  Key,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import UserAvatar from './UserAvatar';
import TeamSwitcher from './TeamSwitcher';

interface HeaderProps {
  onMenuClick: () => void;
  onCommandPaletteOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onCommandPaletteOpen }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>

            {/* Team switcher */}
            <TeamSwitcher />
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Command palette trigger */}
            <button
              onClick={onCommandPaletteOpen}
              className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm text-slate-600 dark:text-slate-400"
            >
              <Search className="h-4 w-4" />
              <span>Search...</span>
              <kbd className="ml-auto text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">⌘K</kbd>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={toggleNotifications}
              >
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    No new notifications
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <UserAvatar user={user} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;