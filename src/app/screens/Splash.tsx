import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mic, Languages, WifiOff } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export const Splash = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      const isLoggedIn = localStorage.getItem('vitavoice_logged_in');
      const hasSeenIntro = localStorage.getItem('vitavoice_intro_seen');
      
      if (isLoggedIn) {
        navigate('/home');
      } else if (hasSeenIntro) {
        navigate('/login');
      } else {
        navigate('/language-select');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  const features = [
    { icon: Mic, labelKey: 'voice_enabled', color: '#2563EB' },
    { icon: Languages, labelKey: 'multi_language', color: '#059669' },
    { icon: WifiOff, labelKey: 'offline_ready', color: '#EA580C' }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-[#2563EB] to-[#1E40AF] flex flex-col items-center justify-center px-8">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
          <Mic className="w-16 h-16 text-[#2563EB]" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-bold text-white mb-2 font-['Poppins']"
      >
        VitaVoice
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xl text-white/90 mb-12 text-center"
      >
        {t('your_healthcare_companion')}
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex gap-8 mb-16"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.labelKey}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-white/80 text-center whitespace-nowrap">{t(feature.labelKey)}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        className="w-2 h-2 bg-white rounded-full"
      />
    </div>
  );
};