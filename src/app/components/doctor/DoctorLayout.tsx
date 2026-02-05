import { ReactNode } from 'react';
import { DoctorSidebar } from './DoctorSidebar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/config/supabase';

interface DoctorLayoutProps {
    children: ReactNode;
    doctorName?: string;
    isVerified?: boolean;
}

export function DoctorLayout({ children, doctorName = 'Doctor', isVerified = false }: DoctorLayoutProps) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/doctor/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 w-full">
            <DoctorSidebar
                doctorName={doctorName}
                isVerified={isVerified}
                onLogout={handleLogout}
            />
            <main className="ml-64 p-8 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
