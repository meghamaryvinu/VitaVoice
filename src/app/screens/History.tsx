import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, User, Users, FileText, Activity, AlertCircle, Calendar, Plus } from 'lucide-react';
import { authService, type UserProfile } from '@/services/authService';

export const History = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'family'>('personal');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      // Fallback for demo if not logged in
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
          medications: [],
          createdAt: new Date(),
          // Add extra fields for history view
          ...parsed
        } as any);
      }
    }
  }, []);

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
                <InfoItem label="Past Medical History" value={(user as any).pastMedical} />
                <InfoItem label="Past Surgeries" value={(user as any).pastSurgical} />
                <InfoItem label="Habits" value={(user as any).habits?.join(', ')} />
                <InfoItem label="Allergies" value={user.allergies.join(', ')} />
              </div>
            </div>

            {/* Current Health */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#EA580C]" />
                Current Health Status
              </h3>
              <div className="space-y-4">
                <InfoItem label="Chief Complaints" value={(user as any).chiefComplaints} />
                <InfoItem label="History of Present Illness" value={(user as any).presentIllness} />

                {(user as any).cvs?.length > 0 && (
                  <InfoItem label="Cardiovascular Symptoms" value={(user as any).cvs.join(', ')} />
                )}
                {(user as any).rs?.length > 0 && (
                  <InfoItem label="Respiratory Symptoms" value={(user as any).rs.join(', ')} />
                )}
              </div>
            </div>

            {/* Examination Notes */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#7C3AED]" />
                Examination Notes
              </h3>
              <div className="space-y-4">
                <InfoItem label="General Exam" value={(user as any).generalExam} />
                <InfoItem label="Systemic Exam" value={(user as any).cvsExam} />
                <InfoItem label="Mental State" value={(user as any).psychological} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Family History */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#2563EB]" />
                Family Medical History
              </h3>

              {(user as any).familyHistory?.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-2">Conditions present in immediate family:</p>
                  <div className="flex flex-wrap gap-2">
                    {(user as any).familyHistory.map((condition: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No family history recorded</p>
              )}
            </div>

            {/* Family Members */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#1E293B] flex items-center gap-2">
                  <User className="w-5 h-5 text-[#059669]" />
                  Family Members
                </h3>
                <button
                  onClick={() => navigate('/health-profile')}
                  className="text-xs font-medium text-[#2563EB] flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg"
                >
                  <Plus className="w-3 h-3" />
                  Add Member
                </button>
              </div>

              <div className="space-y-3">
                {/* Demo Family Members */}
                <FamilyMemberCard name="Father" age={65} relation="Father" condition="Hypertension" />
                <FamilyMemberCard name="Mother" age={60} relation="Mother" condition="Diabetes" />
                <FamilyMemberCard name="Rahul" age={8} relation="Son" condition="None" />
              </div>
            </div>
          </motion.div>
        )}
      </div>
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

const FamilyMemberCard = ({ name, age, relation, condition }: any) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200">
        <User className="w-5 h-5 text-gray-400" />
      </div>
      <div>
        <h4 className="font-medium text-[#1E293B]">{name}</h4>
        <p className="text-xs text-gray-500">{relation} • {age} yrs</p>
      </div>
    </div>
    <span className={`text-xs px-2 py-1 rounded-lg ${condition === 'None'
        ? 'bg-green-100 text-green-700'
        : 'bg-orange-100 text-orange-700'
      }`}>
      {condition}
    </span>
  </div>
);
