import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Pill, Clock, CheckCircle, X, Calendar } from 'lucide-react';
import { medicationService, type Medication } from '@/services/medicationService';
import { authService } from '@/services/authService';
import { useApp } from '@/app/context/AppContext';
import { useTranslation } from '@/hooks/useTranslation';

export const MedicationManager = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { familyMembers } = useApp();
    const [medications, setMedications] = useState<Medication[]>([]);
    const [todaySchedule, setTodaySchedule] = useState<{ medication: Medication; time: string; taken: boolean }[]>([]);
    const [stats, setStats] = useState<{ todaySchedule: number; takenToday: number; overallAdherence: number } | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedMember, setSelectedMember] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        frequency: 'twice' as const,
        times: ['09:00', '21:00'],
        instructions: '',
        ongoing: true,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
    });

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            // Default to current user if no member selected
            if (!selectedMember) {
                setSelectedMember(user.id);
            }
        }
    }, []);

    useEffect(() => {
        if (selectedMember) {
            loadData();
        }
    }, [selectedMember]);

    const loadData = async () => {
        await medicationService.init();
        const meds = medicationService.getActiveMedications(selectedMember);
        const schedule = medicationService.getTodaySchedule(selectedMember);
        const statistics = medicationService.getStatistics(selectedMember);

        setMedications(meds);
        setTodaySchedule(schedule);
        setStats(statistics);
    };

    const handleAddMedication = () => {
        const times = formData.frequency === 'once' ? ['09:00'] :
            formData.frequency === 'twice' ? ['09:00', '21:00'] :
                formData.frequency === 'thrice' ? ['09:00', '14:00', '21:00'] :
                    ['08:00', '12:00', '16:00', '20:00'];

        medicationService.addMedication({
            name: formData.name,
            dosage: formData.dosage,
            frequency: formData.frequency,
            times,
            duration: {
                startDate: new Date(formData.startDate),
                endDate: formData.endDate ? new Date(formData.endDate) : undefined,
                ongoing: formData.ongoing,
            },
            instructions: formData.instructions,
            familyMemberId: selectedMember,
            remindersEnabled: true,
        });

        setShowAddForm(false);
        setFormData({
            name: '',
            dosage: '',
            frequency: 'twice',
            times: ['09:00', '21:00'],
            instructions: '',
            ongoing: true,
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
        });
        loadData();
    };

    const handleMarkTaken = (medId: string, time: string) => {
        medicationService.markAsTaken(medId, time);
        loadData();
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] px-4 py-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate('/home')}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </motion.button>
                    <h1 className="text-2xl font-bold">Medication Manager</h1>
                </div>

                {stats && (
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/20 rounded-xl p-3 backdrop-blur">
                            <div className="text-2xl font-bold">{stats.todaySchedule}</div>
                            <div className="text-sm opacity-90">Today's Doses</div>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 backdrop-blur">
                            <div className="text-2xl font-bold">{stats.takenToday}</div>
                            <div className="text-sm opacity-90">Taken</div>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 backdrop-blur">
                            <div className="text-2xl font-bold">{stats.overallAdherence}%</div>
                            <div className="text-sm opacity-90">Adherence</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="px-4 py-6">
                {/* Member Selector */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Managing For</label>
                    <select
                        value={selectedMember}
                        onChange={(e) => setSelectedMember(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                        {currentUser && (
                            <option value={currentUser.id}>{currentUser.name} (Me)</option>
                        )}
                        {familyMembers.map(member => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                    </select>
                </div>

                {/* Today's Schedule */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-[#1E293B] mb-3">Today's Schedule</h2>
                    {todaySchedule.length === 0 ? (
                        <div className="bg-white rounded-xl p-6 text-center text-gray-500">
                            No medications scheduled for today
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {todaySchedule.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`bg-white rounded-xl p-4 flex items-center gap-4 ${item.taken ? 'opacity-60' : ''
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.taken ? 'bg-[#059669]/10' : 'bg-[#2563EB]/10'
                                        }`}>
                                        {item.taken ? (
                                            <CheckCircle className="w-6 h-6 text-[#059669]" />
                                        ) : (
                                            <Clock className="w-6 h-6 text-[#2563EB]" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-[#1E293B]">{item.medication.name}</div>
                                        <div className="text-sm text-gray-600">{item.medication.dosage} • {item.time}</div>
                                    </div>
                                    {!item.taken && (
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleMarkTaken(item.medication.id, item.time)}
                                            className="px-4 py-2 bg-[#059669] text-white rounded-lg text-sm font-medium"
                                        >
                                            Mark Taken
                                        </motion.button>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Active Medications */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-[#1E293B] mb-3">Active Medications</h2>
                    {medications.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center">
                            <Pill className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-600 mb-4">No active medications</p>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAddForm(true)}
                                className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-medium"
                            >
                                Add First Medication
                            </motion.button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {medications.map((med, index) => (
                                    <motion.div
                                        key={med.id}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-xl p-4"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="font-semibold text-lg text-[#1E293B]">{med.name}</div>
                                                <div className="text-sm text-gray-600">{med.dosage}</div>
                                            </div>
                                            <div className="text-xs text-gray-500 capitalize">{med.frequency} daily</div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {med.duration.ongoing ? 'Ongoing' :
                                                    `Until ${new Date(med.duration.endDate!).toLocaleDateString()}`}
                                            </span>
                                        </div>
                                        {med.instructions && (
                                            <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded p-2">
                                                {med.instructions}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAddForm(true)}
                                className="w-full mt-4 h-14 bg-white border-2 border-dashed border-[#2563EB] text-[#2563EB] rounded-xl flex items-center justify-center gap-2 font-medium"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add Medication</span>
                            </motion.button>
                        </>
                    )}
                </div>
            </div>

            {/* Add Medication Dialog */}
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
                            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[#1E293B]">Add Medication</h2>
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Medication Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                        placeholder="e.g., Paracetamol"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Dosage</label>
                                    <input
                                        type="text"
                                        value={formData.dosage}
                                        onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                        placeholder="e.g., 500mg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                                    <select
                                        value={formData.frequency}
                                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                    >
                                        <option value="once">Once daily</option>
                                        <option value="twice">Twice daily</option>
                                        <option value="thrice">Three times daily</option>
                                        <option value="four_times">Four times daily</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                                    <textarea
                                        value={formData.instructions}
                                        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                        placeholder="e.g., Take after meals"
                                        rows={2}
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="ongoing"
                                        checked={formData.ongoing}
                                        onChange={(e) => setFormData({ ...formData, ongoing: e.target.checked })}
                                        className="w-5 h-5"
                                    />
                                    <label htmlFor="ongoing" className="text-sm text-gray-700">Ongoing medication</label>
                                </div>

                                {!formData.ongoing && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                        />
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddMedication}
                                        disabled={!formData.name || !formData.dosage}
                                        className="flex-1 py-3 bg-[#2563EB] text-white rounded-xl font-medium disabled:opacity-50"
                                    >
                                        Add Medication
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
