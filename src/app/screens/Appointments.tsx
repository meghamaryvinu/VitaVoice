import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Calendar, Clock, MapPin, Star, User, CheckCircle, AlertCircle, X } from 'lucide-react';
import { appointmentService, type Doctor, type TimeSlot, type Appointment } from '@/services/appointmentService';
import { authService } from '@/services/authService';
import { useTranslation } from '@/hooks/useTranslation';

export const Appointments = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedDoctor) {
            const slots = appointmentService.getAvailableSlots(selectedDoctor.id, selectedDate);
            setAvailableSlots(slots);
            setSelectedSlot(null);
        }
    }, [selectedDoctor, selectedDate]);

    const loadData = async () => {
        setLoading(true);
        await appointmentService.init();
        setDoctors(appointmentService.getDoctors());

        const user = authService.getCurrentUser();
        if (user) {
            setAppointments(appointmentService.getUserAppointments(user.id));
        }
        setLoading(false);
    };

    const handleBookAppointment = () => {
        const user = authService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }

        if (selectedDoctor && selectedSlot) {
            const appointment = appointmentService.bookAppointment(
                user.id,
                selectedDoctor.id,
                selectedSlot.id
            );

            if (appointment) {
                setShowConfirmation(true);
                loadData(); // Refresh appointments
            }
        }
    };

    const handleCancelAppointment = (id: string) => {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            appointmentService.cancelAppointment(id);
            loadData();
        }
    };

    // Generate next 7 days for date selection
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date;
    });

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
                <h1 className="text-xl font-bold text-[#1E293B]">{t('doctor_appointments')}</h1>
            </div>

            <div className="px-4 py-6 space-y-6">
                {/* Upcoming Appointments */}
                {appointments.filter(a => a.status === 'scheduled').length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-[#1E293B] mb-3">{t('upcoming_appointments')}</h2>
                        <div className="space-y-3">
                            {appointments
                                .filter(a => a.status === 'scheduled')
                                .map(appointment => (
                                    <motion.div
                                        key={appointment.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-xl p-4 shadow-sm border border-l-4 border-l-[#2563EB] border-gray-100"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-[#1E293B]">{appointment.doctorName}</h3>
                                                <p className="text-sm text-gray-600">{appointment.specialization}</p>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(appointment.date).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {appointment.time}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleCancelAppointment(appointment.id)}
                                                className="text-xs text-red-600 font-medium px-2 py-1 bg-red-50 rounded-lg hover:bg-red-100"
                                            >
                                                {t('cancel_appointment')}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Book New Appointment */}
                <div>
                    <h2 className="text-lg font-bold text-[#1E293B] mb-3">{t('book_new_appointment')}</h2>

                    {/* Doctor Selection */}
                    <div className="space-y-3 mb-6">
                        <h3 className="text-sm font-medium text-gray-500">{t('select_doctor')}</h3>
                        {doctors.map(doctor => (
                            <motion.div
                                key={doctor.id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedDoctor(doctor)}
                                className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all ${selectedDoctor?.id === doctor.id
                                        ? 'border-[#2563EB] ring-2 ring-[#2563EB]/10'
                                        : 'border-gray-100 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-[#1E293B]">{doctor.name}</h3>
                                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg">
                                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                <span className="text-xs font-bold text-yellow-700">{doctor.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[#2563EB] font-medium">{doctor.specialization}</p>
                                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                            <MapPin className="w-3 h-3" />
                                            {doctor.hospital} • {doctor.experience} years exp
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {selectedDoctor && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-6"
                        >
                            {/* Date Selection */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-3">{t('select_date')}</h3>
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {dates.map((date, i) => {
                                        const isSelected = date.toDateString() === selectedDate.toDateString();
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedDate(date)}
                                                className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center border transition-all ${isSelected
                                                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                                                        : 'bg-white text-gray-600 border-gray-200'
                                                    }`}
                                            >
                                                <span className="text-xs font-medium mb-1">
                                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                </span>
                                                <span className="text-xl font-bold">
                                                    {date.getDate()}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Slot Selection */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-3">{t('select_time')}</h3>
                                {availableSlots.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        {availableSlots.map(slot => (
                                            <button
                                                key={slot.id}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`py-2 rounded-lg text-sm font-medium border transition-all ${selectedSlot?.id === slot.id
                                                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {slot.startTime}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-gray-500 text-sm">{t('no_slots_available')}</p>
                                    </div>
                                )}
                            </div>

                            {/* Book Button */}
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={handleBookAppointment}
                                disabled={!selectedSlot}
                                className={`w-full h-14 rounded-xl font-semibold text-white shadow-lg transition-all ${selectedSlot
                                        ? 'bg-[#2563EB] hover:bg-[#1E40AF]'
                                        : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                {t('book_appointment')}
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirmation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-bold text-[#1E293B] mb-2">{t('appointment_confirmed')}</h2>
                            <p className="text-gray-600 mb-6">
                                Your appointment with {selectedDoctor?.name} is scheduled for {selectedDate.toLocaleDateString()} at {selectedSlot?.startTime}.
                            </p>
                            <button
                                onClick={() => {
                                    setShowConfirmation(false);
                                    setSelectedDoctor(null);
                                    setSelectedSlot(null);
                                }}
                                className="w-full py-3 bg-[#2563EB] text-white rounded-xl font-medium"
                            >
                                {t('done')}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
