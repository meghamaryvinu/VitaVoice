import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Syringe, CheckCircle, AlertTriangle, Calendar, X, Award } from 'lucide-react';
import { vaccinationService, type VaccinationRecord, type Vaccine } from '@/services/vaccinationService';
import { useApp } from '@/app/context/AppContext';
import { authService } from '@/services/authService';

export const VaccinationTracker = () => {
    const navigate = useNavigate();
    const { familyMembers } = useApp();
    const [selectedMember, setSelectedMember] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [records, setRecords] = useState<VaccinationRecord[]>([]);
    const [dueVaccines, setDueVaccines] = useState<Vaccine[]>([]);
    const [overdueVaccines, setOverdueVaccines] = useState<Vaccine[]>([]);
    const [upcomingVaccines, setUpcomingVaccines] = useState<Vaccine[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
    const [formData, setFormData] = useState({
        dateGiven: new Date().toISOString().split('T')[0],
        batchNumber: '',
        location: '',
        notes: '',
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
        await vaccinationService.init();

        if (selectedMember) {
            // Check if selected member is current user or family member
            let age = 0;
            if (currentUser && selectedMember === currentUser.id) {
                age = currentUser.age;
            } else {
                const member = familyMembers.find(m => m.id === selectedMember);
                if (member) age = member.age;
            }

            // Calculate age in months (approximate)
            const ageMonths = age * 12;

            setRecords(vaccinationService.getRecords(selectedMember));
            setDueVaccines(vaccinationService.getDueVaccines(selectedMember, ageMonths));
            setOverdueVaccines(vaccinationService.getOverdueVaccines(selectedMember, ageMonths));
            setUpcomingVaccines(vaccinationService.getUpcomingVaccines(selectedMember, ageMonths));
            setStats(vaccinationService.getStatistics(selectedMember, ageMonths));
        }
    };

    const handleAddRecord = () => {
        if (selectedVaccine && selectedMember) {
            vaccinationService.addRecord({
                vaccineId: selectedVaccine.id,
                familyMemberId: selectedMember,
                dateGiven: new Date(formData.dateGiven),
                doseNumber: 1,
                batchNumber: formData.batchNumber,
                location: formData.location,
                notes: formData.notes,
            });

            setShowAddForm(false);
            setSelectedVaccine(null);
            setFormData({
                dateGiven: new Date().toISOString().split('T')[0],
                batchNumber: '',
                location: '',
                notes: '',
            });
            loadData();
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="bg-gradient-to-r from-[#059669] to-[#047857] px-4 py-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate('/home')}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </motion.button>
                    <h1 className="text-2xl font-bold">Vaccination Tracker</h1>
                </div>

                {stats && (
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/20 rounded-xl p-3 backdrop-blur">
                            <div className="text-2xl font-bold">{stats.completionPercentage}%</div>
                            <div className="text-sm opacity-90">Complete</div>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 backdrop-blur">
                            <div className="text-2xl font-bold">{stats.dueNow}</div>
                            <div className="text-sm opacity-90">Due Now</div>
                        </div>
                        <div className="bg-white/20 rounded-xl p-3 backdrop-blur">
                            <div className="text-2xl font-bold">{stats.overdue}</div>
                            <div className="text-sm opacity-90">Overdue</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="px-4 py-6">
                {/* Member Selector */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tracking For</label>
                    <select
                        value={selectedMember}
                        onChange={(e) => setSelectedMember(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    >
                        {currentUser && (
                            <option value={currentUser.id}>{currentUser.name} (Me)</option>
                        )}
                        {familyMembers.map(member => (
                            <option key={member.id} value={member.id}>{member.name} ({member.age} years)</option>
                        ))}
                    </select>
                </div>

                {selectedMember ? (
                    <>
                        {/* Overdue Vaccines */}
                        {overdueVaccines.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
                                    <h2 className="text-lg font-bold text-[#DC2626]">Overdue Vaccines</h2>
                                </div>
                                <div className="space-y-2">
                                    {overdueVaccines.map((vaccine, index) => (
                                        <motion.div
                                            key={vaccine.id}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-red-50 border-2 border-red-200 rounded-xl p-4"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-[#DC2626]">{vaccine.name}</div>
                                                    <div className="text-sm text-gray-600 mt-1">{vaccine.description}</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Due at {vaccine.ageMonths} months
                                                    </div>
                                                </div>
                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setSelectedVaccine(vaccine);
                                                        setShowAddForm(true);
                                                    }}
                                                    className="px-4 py-2 bg-[#DC2626] text-white rounded-lg text-sm font-medium"
                                                >
                                                    Mark Given
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Due Vaccines */}
                        {dueVaccines.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar className="w-5 h-5 text-[#F59E0B]" />
                                    <h2 className="text-lg font-bold text-[#F59E0B]">Due Now</h2>
                                </div>
                                <div className="space-y-2">
                                    {dueVaccines.map((vaccine, index) => (
                                        <motion.div
                                            key={vaccine.id}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-[#F59E0B]">{vaccine.name}</div>
                                                    <div className="text-sm text-gray-600 mt-1">{vaccine.description}</div>
                                                </div>
                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setSelectedVaccine(vaccine);
                                                        setShowAddForm(true);
                                                    }}
                                                    className="px-4 py-2 bg-[#F59E0B] text-white rounded-lg text-sm font-medium"
                                                >
                                                    Mark Given
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upcoming Vaccines */}
                        {upcomingVaccines.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-[#1E293B] mb-3">Upcoming Vaccines</h2>
                                <div className="space-y-2">
                                    {upcomingVaccines.map((vaccine, index) => (
                                        <motion.div
                                            key={vaccine.id}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white rounded-xl p-4 border border-gray-200"
                                        >
                                            <div className="font-semibold text-[#1E293B]">{vaccine.name}</div>
                                            <div className="text-sm text-gray-600 mt-1">{vaccine.description}</div>
                                            <div className="text-xs text-[#2563EB] mt-1">
                                                Due at {vaccine.ageMonths} months
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Vaccination History */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-[#1E293B] mb-3">Vaccination History</h2>
                            {records.length === 0 ? (
                                <div className="bg-white rounded-xl p-8 text-center">
                                    <Syringe className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-600">No vaccination records yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {records.map((record, index) => {
                                        const vaccine = vaccinationService.getSchedule().find(v => v.id === record.vaccineId);
                                        return (
                                            <motion.div
                                                key={record.id}
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-white rounded-xl p-4 border border-gray-200"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#059669]/10 flex items-center justify-center flex-shrink-0">
                                                        <CheckCircle className="w-5 h-5 text-[#059669]" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-[#1E293B]">{vaccine?.name}</div>
                                                        <div className="text-sm text-gray-600 mt-1">
                                                            Given on {new Date(record.dateGiven).toLocaleDateString()}
                                                        </div>
                                                        {record.location && (
                                                            <div className="text-xs text-gray-500 mt-1">Location: {record.location}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Completion Badge */}
                        {stats && stats.completionPercentage === 100 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-gradient-to-r from-[#059669] to-[#047857] rounded-2xl p-6 text-white text-center mb-6"
                            >
                                <Award className="w-16 h-16 mx-auto mb-3" />
                                <h3 className="text-xl font-bold mb-2">Fully Vaccinated!</h3>
                                <p className="text-sm opacity-90">All age-appropriate vaccines completed</p>
                            </motion.div>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-xl p-8 text-center">
                        <Syringe className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">Select a family member to view vaccination records</p>
                    </div>
                )}
            </div>

            {/* Add Vaccination Record Dialog */}
            <AnimatePresence>
                {showAddForm && selectedVaccine && (
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
                            className="bg-white rounded-2xl p-6 max-w-md w-full"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[#1E293B]">Record Vaccination</h2>
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            <div className="bg-[#059669]/10 rounded-xl p-4 mb-6">
                                <div className="font-semibold text-[#059669]">{selectedVaccine.name}</div>
                                <div className="text-sm text-gray-600 mt-1">{selectedVaccine.description}</div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Given</label>
                                    <input
                                        type="date"
                                        value={formData.dateGiven}
                                        onChange={(e) => setFormData({ ...formData, dateGiven: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Batch Number (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.batchNumber}
                                        onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                                        placeholder="e.g., BATCH123"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                                        placeholder="e.g., Primary Health Center"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                                        placeholder="Any additional notes"
                                        rows={2}
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddRecord}
                                        className="flex-1 py-3 bg-[#059669] text-white rounded-xl font-medium"
                                    >
                                        Save Record
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
