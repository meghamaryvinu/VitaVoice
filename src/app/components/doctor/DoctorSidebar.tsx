import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Calendar, MessageSquare, FileText, Settings, LogOut } from 'lucide-react';

interface DoctorSidebarProps {
    doctorName: string;
    isVerified: boolean;
    onLogout: () => void;
}

export function DoctorSidebar({ doctorName, isVerified, onLogout }: DoctorSidebarProps) {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor/dashboard' },
        { icon: User, label: 'Profile', path: '/doctor/profile' },
        { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
        { icon: MessageSquare, label: 'Patient Chat', path: '/doctor/chat' },
        { icon: FileText, label: 'Research Forum', path: '/doctor/forum' },
    ];

    return (
        <div className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">V</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">VitaVoice</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                        <User className="w-6 h-6 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{doctorName}</p>
                        {isVerified && (
                            <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                                Verified
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}
