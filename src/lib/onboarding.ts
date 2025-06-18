import { supabase } from './supabase';
import { OnboardingData, Organization, DataRoom, TeamInvitation } from '../types/onboarding';

export class OnboardingService {
  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return { data, error };
  }

  static async uploadLogo(file: File, organizationId: string): Promise<{ url?: string; error?: any }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${organizationId}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('organization-assets')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        return { error: uploadError };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('organization-assets')
        .getPublicUrl(fileName);

      return { url: publicUrl };
    } catch (error) {
      return { error };
    }
  }

  static async createOrganization(name: string, logoUrl?: string): Promise<{ data?: Organization; error?: any }> {
    const { data, error } = await supabase
      .from('organizations')
      .insert({
        name,
        logo_url: logoUrl
      })
      .select()
      .single();

    return { data, error };
  }

  static async createDataRoom(
    organizationId: string,
    name: string,
    description?: string,
    createdBy?: string
  ): Promise<{ data?: DataRoom; error?: any }> {
    const { data, error } = await supabase
      .from('data_rooms')
      .insert({
        organization_id: organizationId,
        name,
        description,
        created_by: createdBy
      })
      .select()
      .single();

    return { data, error };
  }

  static async createTeamInvitations(
    organizationId: string,
    emails: string[],
    invitedBy: string
  ): Promise<{ data?: TeamInvitation[]; error?: any }> {
    const invitations = emails.map(email => ({
      organization_id: organizationId,
      email,
      invited_by: invitedBy
    }));

    const { data, error } = await supabase
      .from('team_invitations')
      .insert(invitations)
      .select();

    return { data, error };
  }

  static async updateUserProfile(
    userId: string,
    updates: {
      organization_id?: string;
      full_name?: string;
      is_onboarded?: boolean;
    }
  ) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  }

  static async completeOnboarding(
    userId: string,
    onboardingData: OnboardingData
  ): Promise<{ success: boolean; error?: any; organizationId?: string }> {
    try {
      // Step 1: Create organization first
      const { data: organization, error: orgError } = await this.createOrganization(
        onboardingData.organizationName
      );

      if (orgError || !organization) {
        console.error('Organization creation failed:', orgError);
        return { success: false, error: orgError };
      }

      // Step 2: Immediately update user profile with organization_id
      // This is CRITICAL - the user must be associated with the organization before any other operations
      const { error: profileError } = await this.updateUserProfile(userId, {
        organization_id: organization.id,
        is_onboarded: true
      });

      if (profileError) {
        console.error('User profile update failed:', profileError);
        return { success: false, error: profileError };
      }

      // Step 3: Upload logo if provided (after user is associated with organization)
      let logoUrl = undefined;
      if (onboardingData.logoFile) {
        const { url, error: logoError } = await this.uploadLogo(
          onboardingData.logoFile,
          organization.id
        );

        if (logoError) {
          console.warn('Logo upload failed:', logoError);
        } else {
          logoUrl = url;
          
          // Update organization with logo URL
          await supabase
            .from('organizations')
            .update({ logo_url: logoUrl })
            .eq('id', organization.id);
        }
      }

      // Step 4: Create data room (now that user is associated with organization)
      const { error: dataRoomError } = await this.createDataRoom(
        organization.id,
        onboardingData.dataRoomName,
        onboardingData.dataRoomDescription,
        userId
      );

      if (dataRoomError) {
        console.warn('Data room creation failed:', dataRoomError);
      }

      // Step 5: Create team invitations (now that user is associated with organization)
      if (onboardingData.teamInvites.length > 0) {
        const { error: inviteError } = await this.createTeamInvitations(
          organization.id,
          onboardingData.teamInvites,
          userId
        );

        if (inviteError) {
          console.warn('Team invitations failed:', inviteError);
        }
      }

      return { success: true, organizationId: organization.id };
    } catch (error) {
      console.error('Onboarding completion failed:', error);
      return { success: false, error };
    }
  }

  // Helper method to check if user has organization access
  static async checkUserOrganizationAccess(userId: string): Promise<{ hasOrganization: boolean; organizationId?: string }> {
    const { data: profile } = await this.getUserProfile(userId);
    
    return {
      hasOrganization: !!(profile?.organization_id),
      organizationId: profile?.organization_id || undefined
    };
  }
}