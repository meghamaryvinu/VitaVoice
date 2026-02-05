import { useState, useEffect } from 'react';
import { DoctorLayout } from '@/app/components/doctor/DoctorLayout';
import { supabase } from '@/config/supabase';
import { doctorAuthService } from '@/services/doctor/doctorAuthService';
import { Calendar, Clock, Video, MapPin, CheckCircle, XCircle, FileText, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export function DoctorAppointments() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        const doctor = await doctorAuthService.getCurrentDoctor();
        if (!doctor) return;

        // Mocking query since table might not have data during dev
        // const { data, error } = await supabase
        //   .from('appointments')
        //   .select('*, patient:patient_id(*)')
        //   .eq('doctor_id', doctor.id)

        // Using mock data for UI demo
        setAppointments([
            { id: 1, patient: { full_name: 'Sarah Johnson' }, appointment_date: '2025-05-12', appointment_time: '09:00:00', type: 'video', status: 'confirmed' },
            { id: 2, patient: { full_name: 'Michael Chen' }, appointment_date: '2025-05-12', appointment_time: '14:30:00', type: 'in-person', status: 'pending' },
            { id: 3, patient: { full_name: 'Emma Davis' }, appointment_date: '2025-05-13', appointment_time: '11:00:00', type: 'video', status: 'completed' },
        ]);
        setLoading(false);
    };

    const updateStatus = async (id: number, status: string) => {
        // In real app, call supabase update
        toast.success(`Appointment marked as ${status}`);
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    };

    const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

    return (
        <DoctorLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Appointments</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm" placeholder="Search patient..." />
                    </div>
                    <div className="flex rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1">
                        {['all', 'pending', 'confirmed', 'completed'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${filter === f
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm">Patient</th>
                            <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm">Date & Time</th>
                            <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm">Type</th>
                            <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm">Status</th>
                            <th className="text-right py-4 px-6 font-semibold text-slate-500 text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filtered.map(apt => (
                            <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="py-4 px-6">
                                    <div className="font-medium text-slate-900 dark:text-white">{apt.patient.full_name}</div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex flex-col text-sm">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> {apt.appointment_date}</span>
                                        <span className="flex items-center gap-1 text-slate-500"><Clock className="w-3 h-3" /> {apt.appointment_time}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2 text-sm">
                                        {apt.type === 'video' ? <Video className="w-4 h-4 text-purple-500" /> : <MapPin className="w-4 h-4 text-orange-500" />}
                                        <span className="capitalize">{apt.type}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                    ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                apt.status === 'completed' ? 'bg-slate-100 text-slate-800' : 'bg-red-100 text-red-800'}`}>
                                        {apt.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    {apt.status === 'pending' && (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => updateStatus(apt.id, 'confirmed')} className="p-1 hover:bg-green-100 rounded text-green-600" title="Confirm">
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => updateStatus(apt.id, 'cancelled')} className="p-1 hover:bg-red-100 rounded text-red-600" title="Cancel">
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                    {apt.status === 'confirmed' && (
                                        <button onClick={() => updateStatus(apt.id, 'completed')} className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg">
                                            Complete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="p-8 text-center text-slate-500">No appointments found</div>}
            </div>
        </DoctorLayout>
    );
}
