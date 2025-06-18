import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { OnboardingService } from '../lib/onboarding';
import { Shield, FileText, Users, BarChart3, Settings, LogOut, Plus, FolderOpen, UserPlus } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data: profile } = await OnboardingService.getUserProfile(user.id);
        setUserProfile(profile);
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const hasOrganization = userProfile?.organization_id;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Verifile
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">Welcome, {user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">
            {hasOrganization 
              ? 'Manage your secure document sharing' 
              : 'Complete your setup to start sharing documents securely'
            }
          </p>
        </div>

        {/* Organization Status Alert */}
        {!hasOrganization && (
          <div className="mb-8 bg-amber-900/20 border border-amber-700/50 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-amber-900 text-sm font-bold">!</span>
                </div>
              </div>
              <div>
                <h3 className="text-amber-300 font-semibold mb-2">Setup Required</h3>
                <p className="text-amber-200 text-sm mb-4">
                  You need to complete your organization setup before you can create data rooms or invite team members.
                </p>
                <a
                  href="/onboarding"
                  className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Complete Setup
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {hasOrganization && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <FolderOpen className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Create Data Room</h3>
                <p className="text-blue-100 text-sm">Set up a secure space for document sharing</p>
              </div>
              <Plus className="h-5 w-5 ml-auto group-hover:scale-110 transition-transform duration-200" />
            </button>

            <button className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <UserPlus className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Invite Team Member</h3>
                <p className="text-purple-100 text-sm">Add colleagues to your organization</p>
              </div>
              <Plus className="h-5 w-5 ml-auto group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Documents</p>
                <p className="text-2xl font-bold text-white">{hasOrganization ? '24' : '0'}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Shares</p>
                <p className="text-2xl font-bold text-white">{hasOrganization ? '12' : '0'}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-white">{hasOrganization ? '1,247' : '0'}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Security Score</p>
                <p className="text-2xl font-bold text-white">98%</p>
              </div>
              <Shield className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          {hasOrganization ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-700 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Financial Report Q4.pdf was viewed</span>
                </div>
                <span className="text-slate-400 text-sm">2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-700 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300">New data room created: Project Alpha</span>
                </div>
                <span className="text-slate-400 text-sm">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-700 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-slate-300">Access granted to john@company.com</span>
                </div>
                <span className="text-slate-400 text-sm">3 hours ago</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-slate-700 rounded-full mb-4">
                <BarChart3 className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">No Activity Yet</h3>
              <p className="text-slate-400 text-sm">
                Complete your organization setup to start tracking document activity.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;