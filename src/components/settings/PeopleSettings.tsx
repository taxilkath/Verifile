import React, { useState } from 'react';
import { MoreVertical, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  documents: number;
}

const PeopleSettings = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Ron Janak',
      email: 'ronjanak35@gmail.com',
      role: 'Admin',
      documents: 2
    }
  ]);

  const [showActions, setShowActions] = useState<string | null>(null);

  const handleInvite = () => {
    toast.success('Invitation sent successfully');
  };

  const handleLeaveTeam = () => {
    toast.error('You cannot leave the team as you are the only admin');
  };

  const handleRemoveTeammate = () => {
    toast.error('You cannot remove yourself from the team');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Team Members</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your team members
        </p>
      </div>

      {/* Team Members List */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            People
          </h3>
          <button
            onClick={handleInvite}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
          >
            Invite
          </button>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Teammates that have access to this project.
        </p>

        {teamMembers.map((member) => (
          <div key={member.id} className="relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{member.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{member.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{member.documents} documents</span>
                </div>
                
                <div className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg">
                  {member.role}
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowActions(showActions === member.id ? null : member.id)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  
                  {showActions === member.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
                      <h5 className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                        Actions
                      </h5>
                      <button 
                        onClick={handleLeaveTeam}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        Leave team
                      </button>
                      <button 
                        onClick={handleRemoveTeammate}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        Remove teammate
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleSettings;