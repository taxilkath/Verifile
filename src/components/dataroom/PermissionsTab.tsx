import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import {
  Users,
  UserPlus,
  Crown,
  Shield,
  Edit3,
  Eye,
  Mail,
  MoreVertical,
  Trash2,
  Check,
  X,
  ChevronDown,
  Clock,
  AlertCircle
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
}

interface PermissionsTabProps {
  teamMembers: TeamMember[];
}

const PermissionsTab: React.FC<PermissionsTabProps> = ({ teamMembers }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [inviteMessage, setInviteMessage] = useState('');
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return Crown;
      case 'admin': return Shield;
      case 'editor': return Edit3;
      case 'viewer': return Eye;
      default: return Eye;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'admin': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'editor': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'viewer': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-400';
      case 'pending': return 'bg-yellow-400';
      case 'inactive': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  const handleInviteTeamMember = () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }

    // Simulate sending invitation
    console.log('Inviting:', { email: inviteEmail, role: inviteRole, message: inviteMessage });
    
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteRole('viewer');
    setInviteMessage('');
    
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  const handleRoleChange = (memberId: string, newRole: string) => {
    console.log('Changing role:', { memberId, newRole });
    toast.success('Role updated successfully');
  };

  const handleRemoveMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowRemoveModal(true);
  };

  const confirmRemoveMember = () => {
    if (selectedMember) {
      console.log('Removing member:', selectedMember.id);
      toast.success(`${selectedMember.name} removed from the team`);
      setShowRemoveModal(false);
      setSelectedMember(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Team Access
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Manage who has access to your data room and their permissions
          </p>
        </div>
        
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          <UserPlus className="h-4 w-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Team Members List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="p-6">
          <div className="space-y-4">
            {teamMembers.map((member, index) => {
              const RoleIcon = getRoleIcon(member.role);
              const roleColorClasses = getRoleColor(member.role);
              const statusColorClass = getStatusColor(member.status);
              
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColorClass} rounded-full border-2 border-white dark:border-slate-800`}></div>
                    </div>
                    
                    {/* Member Info */}
                    <div>
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {member.name}
                        </h4>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${roleColorClasses}`}>
                          <RoleIcon className="h-3 w-3" />
                          <span className="capitalize">{member.role}</span>
                        </span>
                        {member.status === 'pending' && (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                            <Clock className="h-3 w-3" />
                            <span>Pending</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                        <span>{member.email}</span>
                        <span>•</span>
                        <span>Last active {member.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {member.role !== 'owner' && (
                      <>
                        <Select.Root
                          value={member.role}
                          onValueChange={(value) => handleRoleChange(member.id, value)}
                        >
                          <Select.Trigger className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200">
                            <span className="text-sm">Change Role</span>
                            <ChevronDown className="h-4 w-4" />
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                              <Select.Item value="admin" className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                <Shield className="h-4 w-4 text-red-500" />
                                <span>Admin</span>
                              </Select.Item>
                              <Select.Item value="editor" className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                <Edit3 className="h-4 w-4 text-blue-500" />
                                <span>Editor</span>
                              </Select.Item>
                              <Select.Item value="viewer" className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                <Eye className="h-4 w-4 text-green-500" />
                                <span>Viewer</span>
                              </Select.Item>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                        
                        <button
                          onClick={() => handleRemoveMember(member)}
                          className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    
                    {member.role === 'owner' && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 px-3 py-2">
                        Owner
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Role Permissions Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
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

      {/* Invite Team Member Modal */}
      <Dialog.Root open={showInviteModal} onOpenChange={setShowInviteModal}>
        <AnimatePresence>
          {showInviteModal && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
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
                      <Dialog.Title className="text-xl font-semibold text-slate-900 dark:text-white">
                        Invite Team Member
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200">
                          <X className="h-5 w-5" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="space-y-4">
                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="colleague@company.com"
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      {/* Role */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Role
                        </label>
                        <Select.Root value={inviteRole} onValueChange={setInviteRole}>
                          <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <Select.Value />
                            <ChevronDown className="h-4 w-4" />
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                              <Select.Item value="viewer" className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                <Eye className="h-4 w-4 text-green-500" />
                                <span>Viewer</span>
                              </Select.Item>
                              <Select.Item value="editor" className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                <Edit3 className="h-4 w-4 text-blue-500" />
                                <span>Editor</span>
                              </Select.Item>
                              <Select.Item value="admin" className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                <Shield className="h-4 w-4 text-red-500" />
                                <span>Admin</span>
                              </Select.Item>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Personal Message (Optional)
                        </label>
                        <textarea
                          value={inviteMessage}
                          onChange={(e) => setInviteMessage(e.target.value)}
                          placeholder="Add a personal message to the invitation..."
                          rows={3}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <Dialog.Close asChild>
                        <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button
                        onClick={handleInviteTeamMember}
                        disabled={!inviteEmail}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Send Invitation</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* Remove Member Modal */}
      <Dialog.Root open={showRemoveModal} onOpenChange={setShowRemoveModal}>
        <AnimatePresence>
          {showRemoveModal && selectedMember && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
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
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
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
                        Are you sure you want to remove <strong>{selectedMember.name}</strong> ({selectedMember.email}) from this data room? 
                        They will lose access to all documents in this data room.
                      </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Dialog.Close asChild>
                        <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button
                        onClick={confirmRemoveMember}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
};

export default PermissionsTab;