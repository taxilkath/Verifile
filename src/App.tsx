import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OnboardingService } from './lib/onboarding';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import DataRooms from './pages/DataRooms';
import DataRoomDetail from './pages/DataRoomDetail';
import Documents from './pages/Documents';
import Onboarding from './pages/Onboarding';
import Branding from './pages/Branding';

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen bg-slate-900 text-white transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Header />
      <main>
        <Hero />
        <Features />
        <Stats />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        const { data: profile } = await OnboardingService.getUserProfile(user.id);
        setUserProfile(profile);
      }
      setCheckingOnboarding(false);
    };

    if (!loading) {
      checkOnboardingStatus();
    }
  }, [user, loading]);

  if (loading || checkingOnboarding) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user needs onboarding
  const needsOnboarding = !userProfile?.is_onboarded || !userProfile?.organization_id;
  
  // If user needs onboarding and trying to access dashboard, redirect to onboarding
  if (needsOnboarding && window.location.pathname.startsWith('/dashboard')) {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        const { data: profile } = await OnboardingService.getUserProfile(user.id);
        setUserProfile(profile);
      }
      setCheckingOnboarding(false);
    };

    if (!loading) {
      checkOnboardingStatus();
    }
  }, [user, loading]);

  if (loading || (user && checkingOnboarding)) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user) {
    // Check if user needs onboarding
    const needsOnboarding = !userProfile?.is_onboarded || !userProfile?.organization_id;
    
    // If user needs onboarding, go to onboarding, otherwise go to dashboard
    return <Navigate to={needsOnboarding ? "/onboarding" : "/dashboard"} />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="data-rooms" element={<DataRooms />} />
            <Route path="data-rooms/:id" element={<DataRoomDetail />} />
            <Route path="documents" element={<Documents />} />
            <Route path="branding" element={<Branding />} />
            {/* Add more dashboard routes here */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;