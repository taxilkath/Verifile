import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import * as Select from '@radix-ui/react-select';
import {
  Users,
  UserPlus,
  Mail,
  X,
  MoreVertical,
  ChevronDown,
  Search,
  Shield,
  Eye,
  Edit3,
  Trash2,
  AlertTriangle,
  Check,
  Info,
  Globe,
  Building2,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar?: string;
  lastActive: string;
  status: 'active' | 'pending' | 'inactive';
  documentsCount: number;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@company.com',
    role: 'owner',
    lastActive: '2 minutes ago',
    status: 'active',
    documentsCount: 24
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'admin',
    lastActive: '1 hour ago',
    status: 'active',
    documentsCount: 18
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@company.com',
    role: 'editor',
    lastActive: '3 hours ago',
    status: 'active',
    documentsCount: 12
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa@investor.com',
    role: 'viewer',
    lastActive: '1 day ago',
    status: 'pending',
    documentsCount: 0
  }
];

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [activeTab, setActiveTab] = useState('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = (memberId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
    toast.success(`Role updated successfully`);
  };

  const handleRemoveMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowRemoveModal(true);
  };

  const confirmRemoveMember = () => {
    if (selectedMember) {
      setTeamMembers(prev => prev.filter(member => member.id !== selectedMember.id));
      toast.success(`${selectedMember.name} has been removed from the team`);
      setShowRemoveModal(false);
      setSelectedMember(null);
    }
  };

  const handleInviteMember = (email: string, role: string) => {
    const newMember: TeamMember = {
      id: Math.random().toString(36).substring(7),
      name: email.split('@')[0],
      email,
      role: role as 'admin' | 'editor' | 'viewer',
      lastActive: 'Never',
      status: 'pending',
      documentsCount: 0
    };
    
    setTeamMembers(prev => [...prev, newMember]);
    toast.success(`Invitation sent to ${email}`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Team Members</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your team members and their access to your organization
        </p>
      </div>

      {/* Tabs */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
          <Tabs.Trigger
            value="members"
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'members'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Team Members
          </Tabs.Trigger>
          <Tabs.Trigger
            value="domains"
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'domains'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Domains
          </Tabs.Trigger>
          <Tabs.Trigger
            value="agreements"
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'agreements'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Agreements
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="members">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Header with search and invite */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <UserPlus className="h-4 w-4" />
                <span>Invite Team Member</span>
              </button>
            </div>

            {/* Team Members Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${
                              member.status === 'active' ? 'bg-green-400' : 
                              member.status === 'pending' ? 'bg-yellow-400' : 'bg-slate-400'
                            } rounded-full border-2 border-white dark:border-slate-800`}></div>
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {member.name}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {member.role === 'owner' ? (
                          <div className="flex items-center space-x-2">
                            <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full flex items-center">
                              <Crown className="h-3 w-3 mr-1" />
                              <span>Owner</span>
                            </div>
                          </div>
                        ) : (
                          <Select.Root 
                            value={member.role} 
                            onValueChange={(value) => handleRoleChange(member.id, value as 'admin' | 'editor' | 'viewer')}
                          >
                            <Select.Trigger className="flex items-center space-x-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm">
                              <div className="flex items-center space-x-1">
                                {member.role === 'admin' && <Shield className="h-3 w-3 text-red-500" />}
                                {member.role === 'editor' && <Edit3 className="h-3 w-3 text-blue-500" />}
                                {member.role === 'viewer' && <Eye className="h-3 w-3 text-green-500" />}
                                <Select.Value />
                              </div>
                              <ChevronDown className="h-3 w-3 text-slate-400" />
                            </Select.Trigger>
                            <Select.Portal>
                              <Select.Content className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 p-1">
                                <Select.Item value="admin" className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer text-sm">
                                  <Shield className="h-4 w-4 text-red-500" />
                                  <span>Admin</span>
                                </Select.Item>
                                <Select.Item value="editor" className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer text-sm">
                                  <Edit3 className="h-4 w-4 text-blue-500" />
                                  <span>Editor</span>
                                </Select.Item>
                                <Select.Item value="viewer" className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer text-sm">
                                  <Eye className="h-4 w-4 text-green-500" />
                                  <span>Viewer</span>
                                </Select.Item>
                              </Select.Content>
                            </Select.Portal>
                          </Select.Root>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                        {member.documentsCount}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {member.lastActive}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                            : member.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {member.status === 'pending' ? 'Invitation Sent' : member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {member.role !== 'owner' && (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleRemoveMember(member)}
                              className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No team members found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  {searchQuery ? 'Try adjusting your search criteria' : 'Invite team members to collaborate'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Invite Team Member
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Role Permissions Info */}
          <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
              Role Permissions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  role: 'Owner',
                  icon: Crown,
                  color: 'text-yellow-600 dark:text-yellow-400',
                  permissions: ['Full access', 'Manage team', 'Delete data room']
                },
                {
                  role: 'Admin',
                  icon: Shield,
                  color: 'text-red-600 dark:text-red-400',
                  permissions: ['Manage documents', 'Invite members', 'View analytics']
                },
                {
                  role: 'Editor',
                  icon: Edit3,
                  color: 'text-blue-600 dark:text-blue-400',
                  permissions: ['Upload documents', 'Edit documents', 'View analytics']
                },
                {
                  role: 'Viewer',
                  icon: Eye,
                  color: 'text-green-600 dark:text-green-400',
                  permissions: ['View documents', 'Download files', 'Basic access']
                }
              ].map((roleInfo) => (
                <div key={roleInfo.role} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2 mb-3">
                    <roleInfo.icon className={`h-5 w-5 ${roleInfo.color}`} />
                    <span className="font-medium text-slate-900 dark:text-white">
                      {roleInfo.role}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {roleInfo.permissions.map((permission) => (
                      <li key={permission} className="text-sm text-slate-600 dark:text-slate-400 flex items-center space-x-2">
                        <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span>{permission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="domains">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Email Domains</h3>
                  <p className="text-slate-600 dark:text-slate-400">Manage which email domains can join your organization</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Auto-join with verified domains</h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        Users with email addresses from your verified domains can automatically join your organization.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Verified Domains</h4>
                  <div className="flex items-center space-x-3 mb-4">
                    <input
                      type="text"
                      placeholder="Add a domain (e.g. company.com)"
                      className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
                      Add Domain
                    </button>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-700/50 rounded-xl p-8 text-center">
                    <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      No verified domains yet. Add a domain to allow users with that email domain to join automatically.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Domain Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-200 dark:bg-slate-600 rounded-lg">
                          <Users className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">Auto-approve new members</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Automatically approve users with verified domains</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-200 dark:bg-slate-600 rounded-lg">
                          <Mail className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">Email notifications</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Notify admins when new members join</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="agreements">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Agreements</h3>
                  <p className="text-slate-600 dark:text-slate-400">Require viewers to accept agreements before accessing documents</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Pro Feature</h4>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Custom agreements are available on the Pro plan. Upgrade to require NDAs or custom agreements.
                    </p>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Default Agreement</h4>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-medium text-slate-900 dark:text-white">Standard Confidentiality Notice</div>
                      <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-lg">
                        Active
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      This document contains confidential information. By viewing this document, you agree to maintain its confidentiality and not to share its contents with any third party without explicit permission.
                    </p>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Applied to all documents by default
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Custom Agreements</h4>
                  <div className="bg-slate-100 dark:bg-slate-700/50 rounded-xl p-8 text-center">
                    <Shield className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Upgrade to Pro to create custom agreements like NDAs or terms of service.
                    </p>
                    <button className="bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors disabled:opacity-50" disabled>
                      Create Custom Agreement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Invite Modal */}
      <InviteTeamMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInviteMember}
      />

      {/* Remove Member Modal */}
      <RemoveTeamMemberModal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        member={selectedMember}
        onConfirm={confirmRemoveMember}
      />
    </div>
  );
};

// Invite Team Member Modal
const InviteTeamMemberModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: string) => void;
}> = ({ isOpen, onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [emailError, setEmailError] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');
  const [inviteMode, setInviteMode] = useState<'single' | 'bulk'>('single');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInvite = () => {
    if (inviteMode === 'single') {
      if (!email) {
        setEmailError('Email is required');
        return;
      }
      
      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email address');
        return;
      }
      
      onInvite(email, role);
      setEmail('');
      setRole('viewer');
      onClose();
    } else {
      // Handle bulk invites
      const emails = bulkEmails
        .split(/[\n,;]/)
        .map(e => e.trim())
        .filter(e => e && validateEmail(e));
      
      if (emails.length === 0) {
        setEmailError('Please enter at least one valid email address');
        return;
      }
      
      emails.forEach(email => onInvite(email, role));
      setBulkEmails('');
      setRole('viewer');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>
            
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md z-50"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title className="text-xl font-bold text-slate-900 dark:text-white">
                      Invite Team Member
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200">
                        <X className="h-5 w-5" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="space-y-4">
                    {/* Invite Mode Tabs */}
                    <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg mb-4">
                      <button
                        onClick={() => setInviteMode('single')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                          inviteMode === 'single'
                            ? 'bg-white dark:bg-slate-600 shadow-sm'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Single Invite
                      </button>
                      <button
                        onClick={() => setInviteMode('bulk')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                          inviteMode === 'bulk'
                            ? 'bg-white dark:bg-slate-600 shadow-sm'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Bulk Invite
                      </button>
                    </div>

                    {inviteMode === 'single' ? (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError('');
                          }}
                          placeholder="colleague@company.com"
                          className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            emailError ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                          }`}
                        />
                        {emailError && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email Addresses (one per line or comma-separated)
                        </label>
                        <textarea
                          value={bulkEmails}
                          onChange={(e) => {
                            setBulkEmails(e.target.value);
                            setEmailError('');
                          }}
                          placeholder="colleague1@company.com&#10;colleague2@company.com&#10;colleague3@company.com"
                          rows={5}
                          className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                            emailError ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'
                          }`}
                        />
                        {emailError && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Role
                      </label>
                      <Select.Root value={role} onValueChange={setRole}>
                        <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                          <div className="flex items-center space-x-2">
                            {role === 'admin' && <Shield className="h-4 w-4 text-red-500" />}
                            {role === 'editor' && <Edit3 className="h-4 w-4 text-blue-500" />}
                            {role === 'viewer' && <Eye className="h-4 w-4 text-green-500" />}
                            <Select.Value />
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 p-1">
                            <Select.Item value="admin" className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                              <Shield className="h-4 w-4 text-red-500" />
                              <span>Admin</span>
                            </Select.Item>
                            <Select.Item value="editor" className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                              <Edit3 className="h-4 w-4 text-blue-500" />
                              <span>Editor</span>
                            </Select.Item>
                            <Select.Item value="viewer" className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                              <Eye className="h-4 w-4 text-green-500" />
                              <span>Viewer</span>
                            </Select.Item>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
                      <div className="flex items-start space-x-3">
                        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium mb-1">Role permissions:</p>
                          <ul className="space-y-1 pl-1">
                            <li><strong>Admin:</strong> Can manage documents, invite members, and view analytics</li>
                            <li><strong>Editor:</strong> Can upload and edit documents, and view analytics</li>
                            <li><strong>Viewer:</strong> Can view and download documents</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <Dialog.Close asChild>
                      <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                        Cancel
                      </button>
                    </Dialog.Close>
                    <button
                      onClick={handleInvite}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Send Invitation</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
};

// Remove Team Member Modal
const RemoveTeamMemberModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onConfirm: () => void;
}> = ({ isOpen, onClose, member, onConfirm }) => {
  if (!member) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>
            
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md z-50"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <Dialog.Title className="text-xl font-bold text-slate-900 dark:text-white">
                        Remove Team Member
                      </Dialog.Title>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      Are you sure you want to remove <strong>{member.name}</strong> ({member.email}) from your team? 
                      They will lose access to all documents and data rooms.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Dialog.Close asChild>
                      <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                        Cancel
                      </button>
                    </Dialog.Close>
                    <button
                      onClick={onConfirm}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
};

export default TeamManagement;