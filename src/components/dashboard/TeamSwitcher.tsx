import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ChevronDown, Plus, Check } from 'lucide-react';

const TeamSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('Acme Corp');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const teams = [
    { name: 'Acme Corp', role: 'Owner' },
    { name: 'Startup Inc', role: 'Member' },
    { name: 'Enterprise Ltd', role: 'Admin' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="w-6 h-6 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
          <Building2 className="h-3 w-3 text-white" />
        </div>
        <span className="text-sm font-medium text-slate-900 dark:text-white">
          {selectedTeam}
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.1 }}
            className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl ring-1 ring-slate-200 dark:ring-slate-700 border border-slate-200 dark:border-slate-700 py-2"
          >
            <div className="px-3 py-2">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Teams
              </div>
            </div>

            <div className="py-1">
              {teams.map((team) => (
                <button
                  key={team.name}
                  onClick={() => {
                    setSelectedTeam(team.name);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <Building2 className="h-3 w-3 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {team.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {team.role}
                      </div>
                    </div>
                  </div>
                  {selectedTeam === team.name && (
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 py-2">
              <button className="flex items-center w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <Plus className="mr-3 h-4 w-4" />
                Create team
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamSwitcher;