import { useEffect, useState } from 'react';
import { DoctorLayout } from '@/app/components/doctor/DoctorLayout';
import { doctorAuthService, DoctorProfile } from '@/services/doctor/doctorAuthService';
import { Calendar, MessageSquare, Users, TrendingUp, Clock, ChevronRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DoctorDashboard() {
    const [profile, setProfile] = useState<DoctorProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        doctorAuthService.getCurrentDoctor().then(data => {
            setProfile(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <DoctorLayout doctorName={profile?.full_name || 'Doctor'} isVerified={profile?.is_verified || false}>
            {!profile?.is_verified ? (
                // Pending Verification View
                <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">

                    <div className="w-24 h-24 bg-yellow-50 dark:bg-yellow-900/10 rounded-full flex items-center justify-center mb-6 relative animate-pulse">
                        <Clock className="w-10 h-10 text-yellow-600 dark:text-yellow-500" />
                        <div className="absolute top-0 right-0 p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                        Account Verification Pending
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                        Thank you for registering, <span className="font-semibold text-slate-900 dark:text-white">{profile?.full_name}</span>.
                        Your medical license <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 text-sm">
                            {profile?.license_number}
                        </span> is currently being reviewed by our administrative team.
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-6 py-4 rounded-2xl flex items-start gap-3 max-w-lg text-left">
                        <div className="shrink-0 mt-1">
                            <Users className="w-5 h-5" />
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold mb-1">What happens next?</p>
                            <p className="opacity-90">
                                Access to patient appointments and prescriptions is restricted until verification is complete. This typically takes 24-48 hours. You will be notified via email.
                            </p>
                        </div>
                    </div>

                </div>
            ) : (
                <div className="space-y-8">
                    <header className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, Dr. {profile?.full_name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </header>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Today's Appointments", value: "12", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
                            { label: "Pending Messages", value: "5", icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
                            { label: "Total Patients", value: "1,240", icon: Users, color: "text-green-600", bg: "bg-green-50" },
                            { label: "Forum Activity", value: "+18%", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} dark:bg-slate-800`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.color} bg-opacity-10 dark:bg-slate-800`}>+2.5%</span>
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                                <p className="text-sm text-slate-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Today's Schedule */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Today's Schedule</h2>
                                <Link to="/doctor/appointments" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    View All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { time: "09:00 AM", patient: "Sarah Johnson", type: "Video Consultation", status: "In 15 mins", color: "bg-blue-100 text-blue-700" },
                                    { time: "10:30 AM", patient: "Michael Chen", type: "General Checkup", status: "Confirmed", color: "bg-green-100 text-green-700" },
                                    { time: "11:45 AM", patient: "Emma Davis", type: "Follow up", status: "Confirmed", color: "bg-green-100 text-green-700" },
                                    { time: "02:00 PM", patient: "James Wilson", type: "Report Analysis", status: "Pending", color: "bg-yellow-100 text-yellow-700" }
                                ].map((appt, i) => (
                                    <div key={i} className="flex items-center p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group cursor-pointer">
                                        <div className="w-16 text-center mr-6">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{appt.time.split(' ')[0]}</p>
                                            <p className="text-xs text-slate-500">{appt.time.split(' ')[1]}</p>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{appt.patient}</h4>
                                            <p className="text-sm text-slate-500">{appt.type}</p>
                                        </div>
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${appt.color}`}>
                                            {appt.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity / Quick Actions */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link to="/doctor/chat" className="block w-full text-left p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-white/20 p-2 rounded-lg">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <span className="font-semibold">Check Messages</span>
                                    </div>
                                    <p className="text-blue-100 text-sm">3 new messages from patients</p>
                                </Link>

                                <Link to="/doctor/forum" className="block w-full text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 dark:bg-slate-800 dark:border-slate-700 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/80">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-orange-100 text-orange-600 p-2 rounded-lg dark:bg-orange-900/30">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <span className="font-semibold text-slate-900 dark:text-white">Write Research Post</span>
                                    </div>
                                </Link>

                                <Link to="/doctor/appointments" className="block w-full text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 dark:bg-slate-800 dark:border-slate-700 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/80">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 text-green-600 p-2 rounded-lg dark:bg-green-900/30">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <span className="font-semibold text-slate-900 dark:text-white">Manage Schedule</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DoctorLayout>
    );
}
