import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, User, Phone, Mail, Droplet, Calendar, AlertCircle, Edit2, Save, LogOut } from 'lucide-react';
import { authService, type UserProfile } from '@/services/authService';

export const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<UserProfile>>({});

useEffect(() => {
  const loadUser = async () => {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setFormData(currentUser);
  };
  loadUser();
}, [navigate]);



    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const handleSave = () => {
        if (authService.updateProfile(formData)) {
            setUser(formData as UserProfile);
            setIsEditing(false);
        }
    };

    if (!user) return null;

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
                <h1 className="text-xl font-bold text-[#1E293B]">My Profile</h1>
                <div className="flex-1" />
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLogout}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                >
                    <LogOut className="w-5 h-5" />
                </motion.button>
            </div>

            <div className="px-4 py-6 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center relative">
                    <div className="w-24 h-24 mx-auto bg-[#2563EB]/10 rounded-full flex items-center justify-center mb-4">
                        <User className="w-12 h-12 text-[#2563EB]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1E293B]">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(!isEditing)}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-full"
                    >
                        {isEditing ? <Save className="w-5 h-5" onClick={handleSave} /> : <Edit2 className="w-5 h-5" />}
                    </motion.button>
                </div>

                {/* Personal Details */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-[#2563EB]" />
                        Personal Details
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Age</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                ) : (
                                    <p className="font-medium text-[#1E293B]">{user.age} years</p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Gender</label>
                                <p className="font-medium text-[#1E293B] capitalize">{user.gender}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Blood Type</label>
                                {isEditing ? (
                                    <select
                                        value={formData.bloodType}
                                        onChange={e => setFormData({ ...formData, bloodType: e.target.value })}
                                        className="w-full p-2 border rounded-lg"
                                    >
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Droplet className="w-4 h-4 text-[#DC2626]" />
                                        <p className="font-medium text-[#1E293B]">{user.bloodType}</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Phone</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-[#059669]" />
                                        <p className="font-medium text-[#1E293B]">{user.phoneNumber}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Health Information */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-[#EA580C]" />
                        Health Information
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 block mb-2">Allergies</label>
                            <div className="flex flex-wrap gap-2">
                                {user.allergies.length > 0 ? (
                                    user.allergies.map((allergy, i) => (
                                        <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm border border-red-100">
                                            {allergy}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No allergies recorded</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 block mb-2">Chronic Conditions</label>
                            <div className="flex flex-wrap gap-2">
                                {user.chronicConditions.length > 0 ? (
                                    user.chronicConditions.map((condition, i) => (
                                        <span key={i} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm border border-orange-100">
                                            {condition}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No chronic conditions recorded</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#64748B]" />
                        Account Info
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Member Since</span>
                        <span className="font-medium text-[#1E293B]">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
