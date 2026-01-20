import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, User, AlertCircle, Apple, X } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';

export const HealthProfile = () => {
  const navigate = useNavigate();
  const { familyMembers, addFamilyMember } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    bloodType: 'O+',
  });

  const quickLinks = [
    { icon: AlertCircle, title: 'Allergies', description: 'Track your allergies', route: '/allergies', color: '#EA580C' },
    { icon: Apple, title: 'Diet & Nutrition', description: 'Meal plans & nutrition', route: '/diet-nutrition', color: '#059669' }
  ];

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.age) {
      addFamilyMember({
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        bloodType: formData.bloodType,
        conditions: [],
        allergies: [],
      });
      setFormData({ name: '', age: '', gender: 'male', bloodType: 'O+' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </motion.button>
        <h1 className="text-xl font-bold text-[#1E293B]">Health Profiles</h1>
      </div>

      <div className="px-6 py-6">
        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {quickLinks.map((link, index) => (
            <motion.button
              key={link.title}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(link.route)}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100 text-left"
            >
              <div className="w-10 h-10 rounded-lg mb-2 flex items-center justify-center" style={{ backgroundColor: `${link.color}15` }}>
                <link.icon className="w-5 h-5" style={{ color: link.color }} />
              </div>
              <h3 className="font-semibold text-[#1E293B] text-sm mb-1">{link.title}</h3>
              <p className="text-xs text-gray-500">{link.description}</p>
            </motion.button>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Family Members</h2>

        {familyMembers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <User className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Profiles Yet</h3>
            <p className="text-gray-500 mb-6">Add family members to track their health</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-medium"
            >
              Add First Member
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {familyMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-md flex items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-[#2563EB]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#1E293B]">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.age} years • {member.gender}</p>
                    <p className="text-xs text-gray-500 mt-1">Blood: {member.bloodType}</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-[#059669]" />
                </motion.div>
              ))}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="w-full h-14 bg-white border-2 border-dashed border-[#2563EB] text-[#2563EB] rounded-xl flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Add Family Member</span>
            </motion.button>
          </>
        )}
      </div>

      {/* Add Member Dialog */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1E293B]">Add Family Member</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    placeholder="Enter name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    placeholder="Enter age"
                    min="0"
                    max="120"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['male', 'female', 'other'].map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender })}
                        className={`py-3 rounded-xl border-2 transition-all capitalize ${formData.gender === gender
                            ? 'border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]'
                            : 'border-gray-300 hover:border-gray-400'
                          }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-[#1d4ed8]"
                  >
                    Add Member
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};