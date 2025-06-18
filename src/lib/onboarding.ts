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
      // Step 1: Create organization first to get an ID
      const { data: organization, error: orgError } = await this.createOrganization(
        onboardingData.organizationName
      );

      if (orgError || !organization) {
        console.error('Organization creation failed:', orgError);
        return { success: false, error: orgError };
      }

      // Step 2: Upload logo if provided and update organization
      if (onboardingData.logoFile) {
        const { url, error: logoError } = await this.uploadLogo(
          onboardingData.logoFile,
          organization.id
        );
        if (logoError) {
          console.warn('Logo upload failed, continuing without it:', logoError);
        } else {
          // Update the organization with the logo URL
          await supabase
            .from('organizations')
            .update({ logo_url: url })
            .eq('id', organization.id);
        }
      }

      // Step 3: Call the single RPC function for the rest of the onboarding
      const { error: rpcError } = await supabase.rpc('complete_onboarding', {
        p_user_id: userId,
        p_org_id: organization.id,
        p_dr_name: onboardingData.dataRoomName,
        p_dr_desc: onboardingData.dataRoomDescription || null,
        p_invites: onboardingData.teamInvites
      });

      if (rpcError) {
        console.error('Onboarding RPC failed:', rpcError);
        // Attempt to clean up the organization if the rest fails
        await supabase.from('organizations').delete().eq('id', organization.id);
        return { success: false, error: rpcError };
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