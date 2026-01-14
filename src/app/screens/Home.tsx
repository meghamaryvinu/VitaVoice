import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, User, Activity, History, Phone, Home as HomeIcon, MessageSquare, Settings } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';

export const Home = () => {
  const navigate = useNavigate();
  const { isOnline } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMicClick = () => {
    if (isListening) {
      setIsListening(false);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/chat');
      }, 1500);
    } else {
      setIsListening(true);
    }
  };

  const quickActions = [
    { icon: User, label: 'Health Profile', color: '#2563EB', route: '/health-profile' },
    { icon: Activity, label: 'Symptom Checker', color: '#059669', route: '/symptom-checker' },
    { icon: History, label: 'History', color: '#EA580C', route: '/history' },
    { icon: Phone, label: 'Emergency', color: '#DC2626', route: '/emergency' }
  ];

  const bottomNav = [
    { icon: HomeIcon, label: 'Home', route: '/home', active: true },
    { icon: MessageSquare, label: 'Chat', route: '/chat' },
    { icon: User, label: 'Profile', route: '/health-profile' },
    { icon: Settings, label: 'Settings', route: '/settings' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-20">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">VitaVoice</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#059669]' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer"
          >
            <User className="w-6 h-6 text-gray-600" />
          </motion.div>
        </div>
      </div>

      {/* Giant Mic Button */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={handleMicClick}
            className="relative mx-auto mb-6 cursor-pointer"
          >
            {/* Pulse animation rings */}
            <AnimatePresence>
              {isListening && (
                <>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 w-[120px] h-[120px] rounded-full bg-[#2563EB]"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    className="absolute inset-0 w-[120px] h-[120px] rounded-full bg-[#2563EB]"
                  />
                </>
              )}
            </AnimatePresence>

            {/* Main button */}
            <motion.div
              animate={{
                scale: isListening ? [1, 1.1, 1] : 1,
                boxShadow: isListening
                  ? ['0 10px 30px rgba(37, 99, 235, 0.3)', '0 15px 40px rgba(37, 99, 235, 0.5)', '0 10px 30px rgba(37, 99, 235, 0.3)']
                  : '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}
              transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
              className={`w-[120px] h-[120px] rounded-full flex items-center justify-center ${
                isListening ? 'bg-[#DC2626]' : isProcessing ? 'bg-[#EA580C]' : 'bg-[#2563EB]'
              } relative z-10`}
            >
              <Mic className="w-14 h-14 text-white" />
            </motion.div>
          </motion.div>

          {/* Waveform */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-1 mb-4"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [8, 24, 8]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                    className="w-1 bg-[#2563EB] rounded-full"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status text */}
          <motion.p
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-base text-gray-600"
          >
            {isProcessing ? 'Processing...' : isListening ? 'Listening... Tap to stop' : 'Tap to speak'}
          </motion.p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(action.route)}
              className="h-24 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col items-start justify-between hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${action.color}15` }}>
                <action.icon className="w-5 h-5" style={{ color: action.color }} />
              </div>
              <span className="text-sm font-medium text-[#1E293B]">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {bottomNav.map((item) => (
            <motion.button
              key={item.label}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(item.route)}
              className="flex flex-col items-center gap-1 min-w-[48px]"
            >
              <item.icon className={`w-6 h-6 ${item.active ? 'text-[#2563EB]' : 'text-gray-400'}`} />
              <span className={`text-xs ${item.active ? 'text-[#2563EB] font-medium' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
