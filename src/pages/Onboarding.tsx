import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { OnboardingService } from '../lib/onboarding';
import { OnboardingData } from '../types/onboarding';
import OnboardingLayout from '../components/onboarding/OnboardingLayout';
import LogoUploadStep from '../components/onboarding/steps/LogoUploadStep';
import OrganizationStep from '../components/onboarding/steps/OrganizationStep';
import DataRoomStep from '../components/onboarding/steps/DataRoomStep';
import TeamInviteStep from '../components/onboarding/steps/TeamInviteStep';
import ReviewStep from '../components/onboarding/steps/ReviewStep';

const TOTAL_STEPS = 5;

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    organizationName: '',
    dataRoomName: '',
    dataRoomDescription: '',
    teamInvites: []
  });

  // Check if user is already onboarded
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await OnboardingService.getUserProfile(user.id);
      if (profile?.is_onboarded) {
        navigate('/dashboard');
      }
    };

    checkOnboardingStatus();
  }, [user, navigate]);

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLogoChange = (file?: File, preview?: string) => {
    setOnboardingData(prev => ({
      ...prev,
      logoFile: file,
      logoPreview: preview
    }));
  };

  const handleOrganizationNameChange = (name: string) => {
    setOnboardingData(prev => ({
      ...prev,
      organizationName: name
    }));
  };

  const handleDataRoomNameChange = (name: string) => {
    setOnboardingData(prev => ({
      ...prev,
      dataRoomName: name
    }));
  };

  const handleDataRoomDescriptionChange = (description: string) => {
    setOnboardingData(prev => ({
      ...prev,
      dataRoomDescription: description
    }));
  };

  const handleTeamInvitesChange = (invites: string[]) => {
    setOnboardingData(prev => ({
      ...prev,
      teamInvites: invites
    }));
  };

  const handleComplete = async () => {
    if (!user) return;

    const result = await OnboardingService.completeOnboarding(user.id, onboardingData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      throw new Error(result.error?.message || 'Failed to complete onboarding');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <LogoUploadStep
            logoFile={onboardingData.logoFile}
            logoPreview={onboardingData.logoPreview}
            onLogoChange={handleLogoChange}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <OrganizationStep
            organizationName={onboardingData.organizationName}
            onOrganizationNameChange={handleOrganizationNameChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <DataRoomStep
            dataRoomName={onboardingData.dataRoomName}
            dataRoomDescription={onboardingData.dataRoomDescription}
            onDataRoomNameChange={handleDataRoomNameChange}
            onDataRoomDescriptionChange={handleDataRoomDescriptionChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <TeamInviteStep
            teamInvites={onboardingData.teamInvites}
            onTeamInvitesChange={handleTeamInvitesChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <ReviewStep
            organizationName={onboardingData.organizationName}
            logoPreview={onboardingData.logoPreview}
            dataRoomName={onboardingData.dataRoomName}
            dataRoomDescription={onboardingData.dataRoomDescription}
            teamInvites={onboardingData.teamInvites}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={TOTAL_STEPS}
      onSkip={handleSkip}
      showSkip={currentStep < TOTAL_STEPS}
    >
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </OnboardingLayout>
  );
};

export default Onboarding;