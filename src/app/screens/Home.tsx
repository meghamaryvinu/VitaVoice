import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic, User, Activity, History, Phone, Home as HomeIcon,
  MessageSquare, Settings, Pill, Syringe, LogOut, Calendar,
  Bell, ChevronRight, Heart, Sparkles
} from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { authService } from '@/services/authService';

export const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOnline, selectedLanguageCode } = useApp();
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [userName, setUserName] = useState('User');
  const [greeting, setGreeting] = useState('Good Morning');

useEffect(() => {
  const loadUser = async () => {
    const user = await authService.getCurrentUser();

    if (!user) {
      navigate('/login');
      return;
    }

    const name =
      user?.name ||
      user.email?.split('@')[0] ||
      'User';

    setUserName(name.split(' ')[0]);
  };

  loadUser();

  const hour = new Date().getHours();
  const greetingKey = hour < 12 ? 'good_morning' : hour < 18 ? 'good_afternoon' : 'good_evening';
  setGreeting(t(greetingKey));
}, [selectedLanguageCode, t]);


  const handleMicClick = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        navigate('/chat');
      }, 1500);
    }
  };

  const quickActions = [
    { icon: Pill, labelKey: 'medications', color: 'text-blue-600', bg: 'bg-blue-50', route: '/medications' },
    { icon: Syringe, labelKey: 'vaccines', color: 'text-emerald-600', bg: 'bg-emerald-50', route: '/vaccinations' },
    { icon: Calendar, labelKey: 'appointments', color: 'text-purple-600', bg: 'bg-purple-50', route: '/appointments' },
    { icon: Activity, labelKey: 'symptoms', color: 'text-orange-600', bg: 'bg-orange-50', route: '/symptom-checker' },
    { icon: Heart, labelKey: 'diet_plan', color: 'text-rose-600', bg: 'bg-rose-50', route: '/diet-nutrition' },
    { icon: History, labelKey: 'history', color: 'text-amber-600', bg: 'bg-amber-50', route: '/history' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 font-sans transition-colors duration-300">

      {/* Top Header */}
      <header className="bg-white dark:bg-slate-900 px-6 pt-8 pb-6 rounded-b-[2rem] shadow-sm relative z-10 transition-colors duration-300">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{greeting}</p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{userName}</h1>
          </div>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold"
            >
              {userName[0]}
            </button>
          </div>
        </div>

        {/* Daily Insight Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-200 dark:shadow-none relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-90">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">{t('daily_insight')}</span>
            </div>
            <p className="text-lg font-medium leading-snug mb-3">
              {t('stay_hydrated')}
            </p>
            <button className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors backdrop-blur-sm">
              {t('view_health_tips')}
            </button>
          </div>

          {/* Decorative Circles */}
          <div className="absolute -right-4 -bottom-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6 space-y-8">

        {/* Quick Actions Grid */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('health_services')}</h2>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1">
              {t('view_all')} <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-4">
            {quickActions.map((action, idx) => (
              <motion.button
                key={action.labelKey}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(action.route)}
                className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${action.bg} ${action.color} flex items-center justify-center dark:bg-opacity-10`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">{t(action.labelKey)}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Emergency Section */}
        <section>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/emergency')}
            className="w-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-4 flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-base font-bold text-red-900 dark:text-red-300">{t('need_emergency')}</h3>
              <p className="text-xs text-red-700 dark:text-red-400">{t('call_108')}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
              <ChevronRight className="w-4 h-4 text-red-400" />
            </div>
          </motion.button>
        </section>
      </main>

      {/* Floating Mic Button (FAB) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleMicClick}
          className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-red-500 scale-110 shadow-red-500/50' : 'bg-blue-600 shadow-blue-600/40 hover:bg-blue-700'
            }`}
        >
          <Mic className="w-7 h-7 text-white" />
        </motion.button>

        {/* Pulse Effect */}
        {isListening && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 bg-red-500 rounded-full -z-10"
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-2 pb-6 z-20 rounded-t-[1.5rem] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-colors duration-300">
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          <NavIcon icon={HomeIcon} label="Home" active={location.pathname === '/home'} onClick={() => navigate('/home')} />
          <NavIcon icon={Calendar} label="Appts" active={location.pathname === '/appointments'} onClick={() => navigate('/appointments')} />

          {/* Spacer for FAB */}
          <div className="w-12" />

          <NavIcon icon={MessageSquare} label="Chat" active={location.pathname === '/chat'} onClick={() => navigate('/chat')} />
          <NavIcon icon={Settings} label="Settings" active={location.pathname === '/settings'} onClick={() => navigate('/settings')} />
        </div>
      </nav>
    </div>
  );
};

const NavIcon = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 transition-colors ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
      }`}
  >
    <Icon className={`w-6 h-6 ${active ? 'fill-current' : ''}`} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);
