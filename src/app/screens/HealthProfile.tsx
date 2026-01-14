import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, User, AlertCircle, Apple } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';

export const HealthProfile = () => {
  const navigate = useNavigate();
  const { familyMembers } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);

  const quickLinks = [
    { icon: AlertCircle, title: 'Allergies', description: 'Track your allergies', route: '/allergies', color: '#EA580C' },
    { icon: Apple, title: 'Diet & Nutrition', description: 'Meal plans & nutrition', route: '/diet-nutrition', color: '#059669' }
  ];

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
    </div>
  );
};