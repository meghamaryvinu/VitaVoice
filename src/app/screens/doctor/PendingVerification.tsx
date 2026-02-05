import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorAuthService } from '@/services/doctor/doctorAuthService';
import { supabase } from '@/config/supabase';
import { Clock, RefreshCw, LogOut, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export function PendingVerification() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState<any>(null);

    const checkStatus = async () => {
        setLoading(true);
        const doctor = await doctorAuthService.getCurrentDoctor();

        if (doctor) {
            setDetails(doctor);
            if (doctor.is_verified) {
                toast.success("You are verified!");
                navigate('/doctor/dashboard');
            } else {
                // Check if rejected? (Implicitly handled if verification status is checked)
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkStatus();
        const interval = setInterval(checkStatus, 30000); // Auto check every 30s
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/doctor/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-950 rounded-2xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <Clock className="w-10 h-10 text-yellow-600 dark:text-yellow-500" />
                    <div className="absolute top-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                        <ShieldCheck className="w-3 h-3 text-white" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Application Under Review</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Thanks for applying, Dr. {details?.full_name || 'Doctor'}. Your credentials are being verified by our administrative team.
                </p>

                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-left mb-6 space-y-2 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">License Number:</span>
                        <span className="font-medium">{details?.license_number || '...'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Specialization:</span>
                        <span className="font-medium">{details?.specialization || '...'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Submitted:</span>
                        <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={checkStatus}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Status
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium h-10 flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>

                <p className="text-xs text-slate-400 mt-6">
                    Verification typically takes 24-48 hours. You will receive an email once approved.
                </p>
            </div>
        </div>
    );
}
