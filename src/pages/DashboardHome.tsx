import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { OnboardingService } from '../lib/onboarding';
import WelcomeWidget from '../components/dashboard/WelcomeWidget';
import RecentActivity from '../components/dashboard/RecentActivity';
import DataRoomOverview from '../components/dashboard/DataRoomOverview';
import AnalyticsPreview from '../components/dashboard/AnalyticsPreview';
import { 
  WelcomeWidgetSkeleton, 
  RecentActivitySkeleton, 
  DataRoomOverviewSkeleton 
} from '../components/dashboard/SkeletonLoader';

const DashboardHome = () => {
  const { user } = useAuth();
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

  const hasOrganization = userProfile?.organization_id;
  const userName = userProfile?.full_name || user?.email?.split('@')[0];

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-8">
          <WelcomeWidgetSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentActivitySkeleton />
            <DataRoomOverviewSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        {/* Welcome Widget */}
        <WelcomeWidget userName={userName} />

        {/* Organization Status Alert */}
        {!hasOrganization && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-amber-900 text-sm font-bold">!</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Complete Your Setup
                </h3>
                <p className="text-amber-800 dark:text-amber-200 mb-4">
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <RecentActivity />

          {/* Analytics Preview */}
          <AnalyticsPreview />
        </div>

        {/* Data Room Overview */}
        <DataRoomOverview />
      </div>
    </div>
  );
};

export default DashboardHome;