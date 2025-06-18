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
      // 1. Create organization
      const { data: organization, error: orgError } = await this.createOrganization(
        onboardingData.organizationName
      );

      if (orgError || !organization) {
        return { success: false, error: orgError };
      }

      let logoUrl = undefined;

      // 2. Upload logo if provided
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

      // 3. Update user profile
      const { error: profileError } = await this.updateUserProfile(userId, {
        organization_id: organization.id,
        is_onboarded: true
      });

      if (profileError) {
        return { success: false, error: profileError };
      }

      // 4. Create data room
      const { error: dataRoomError } = await this.createDataRoom(
        organization.id,
        onboardingData.dataRoomName,
        onboardingData.dataRoomDescription,
        userId
      );

      if (dataRoomError) {
        console.warn('Data room creation failed:', dataRoomError);
      }

      // 5. Create team invitations
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
      return { success: false, error };
    }
  }
}