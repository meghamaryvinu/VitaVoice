import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, User, Users, FileText, Activity, Plus, X } from 'lucide-react';
import { authService, type UserProfile } from '@/services/authService';
import { supabase } from '@/config/supabase';

interface FamilyMember {
  id: string;
  name: string;
  age: number;
  relation: string;
  condition: string;
  user_id: string;
}

export const History = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'personal' | 'family'>('personal');
  const [showAddModal, setShowAddModal] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  
  // Form state
  const [newMember, setNewMember] = useState({
    name: '',
    age: '',
    relation: '',
    condition: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await loadFamilyMembers(currentUser.id);
      } else {
        const legacyData = localStorage.getItem('vitavoice_user_data');
        if (legacyData) {
          const parsed = JSON.parse(legacyData);
          setUser({
            id: 'legacy',
            email: 'demo@example.com',
            name: parsed.name || 'User',
            age: parseInt(parsed.age) || 30,
            gender: (parsed.sex?.toLowerCase() as any) || 'male',
            bloodType: 'O+',
            phoneNumber: '',
            allergies: parsed.allergies ? [parsed.allergies] : [],
            chronicConditions: parsed.history ? [parsed.history] : [],
            createdAt: new Date().toISOString(),
            ...parsed
          } as any);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFamilyMembers = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFamilyMembers(data || []);
    } catch (error) {
      console.error('Error loading family members:', error);
      setFamilyMembers([]);
    }
  };

  const handleAddMember = async () => {
    if (!user || !newMember.name || !newMember.age || !newMember.relation) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('family_members')
        .insert({
          user_id: user.id,
          name: newMember.name,
          age: parseInt(newMember.age),
          relation: newMember.relation,
          condition: newMember.condition || 'None'
        })
        .select()
        .single();

      if (error) throw error;

      setFamilyMembers([data, ...familyMembers]);
      setShowAddModal(false);
      setNewMember({ name: '', age: '', relation: '', condition: '' });
      alert('Family member added successfully!');
    } catch (error) {
      console.error('Error adding family member:', error);
      alert('Failed to add family member');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this family member?')) return;

    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', memberId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setFamilyMembers(familyMembers.filter(m => m.id !== memberId));
      alert('Family member removed successfully!');
    } catch (error) {
      console.error('Error deleting family member:', error);
      alert('Failed to remove family member');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please login to view history</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-[#2563EB] text-white rounded-xl"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </motion.button>
        <h1 className="text-xl font-bold text-[#1E293B]">Health History</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex bg-white p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'personal'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            Personal History
          </button>
          <button
            onClick={() => setActiveTab('family')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'family'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            Family History
          </button>
        </div>

        {activeTab === 'personal' ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Basic Info */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#2563EB]" />
                Basic Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">Name</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Age / Gender</span>
                  <span className="font-medium">{user.age} yrs / {user.gender}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Blood Type</span>
                  <span className="font-medium">{user.bloodType}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Phone</span>
                  <span className="font-medium">{user.phoneNumber || 'Not set'}</span>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#059669]" />
                Medical Background
              </h3>
              <div className="space-y-4">
                <InfoItem label="Allergies" value={user.allergies.join(', ') || 'None'} />
                <InfoItem label="Chronic Conditions" value={user.chronicConditions.join(', ') || 'None'} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Family Members */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#1E293B] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#059669]" />
                  Family Members
                </h3>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-sm font-medium text-white bg-[#2563EB] flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Member
                </button>
              </div>

              <div className="space-y-3">
                {familyMembers.length > 0 ? (
                  familyMembers.map(member => (
                    <FamilyMemberCard 
                      key={member.id}
                      member={member}
                      onDelete={() => handleDeleteMember(member.id)}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8 italic">No family members added yet</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add Family Member Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#1E293B]">Add Family Member</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                  <input
                    type="number"
                    value={newMember.age}
                    onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    placeholder="Enter age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relation *</label>
                  <select
                    value={newMember.relation}
                    onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    <option value="">Select relation</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Grandfather">Grandfather</option>
                    <option value="Grandmother">Grandmother</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical Condition (Optional)</label>
                  <input
                    type="text"
                    value={newMember.condition}
                    onChange={(e) => setNewMember({ ...newMember, condition: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    placeholder="e.g., Diabetes, None"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#1d4ed8]"
                >
                  Add Member
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string, value: string }) => {
  if (!value) return null;
  return (
    <div>
      <span className="text-xs text-gray-500 block mb-1 uppercase tracking-wide">{label}</span>
      <p className="text-[#1E293B] text-sm leading-relaxed">{value}</p>
    </div>
  );
};

const FamilyMemberCard = ({ member, onDelete }: { member: FamilyMember, onDelete: () => void }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
        <User className="w-5 h-5 text-gray-400" />
      </div>
      <div>
        <h4 className="font-medium text-[#1E293B]">{member.name}</h4>
        <p className="text-xs text-gray-500">{member.relation} • {member.age} yrs</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-xs px-2 py-1 rounded-lg ${member.condition === 'None'
          ? 'bg-green-100 text-green-700'
          : 'bg-orange-100 text-orange-700'
        }`}>
        {member.condition}
      </span>
      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);