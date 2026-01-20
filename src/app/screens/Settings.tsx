import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Languages, Volume2, Accessibility, Database, Shield, Info, ChevronRight, X, Bell, Moon, Sun, Trash2, Download, FileText } from 'lucide-react';
import { Switch } from '@/app/components/ui/switch';
import { languageService } from '@/services/languageService';
import { speechService } from '@/services/speechService';
import { notificationService } from '@/services/notificationService';
import { useApp } from '@/app/context/AppContext';

export const Settings = () => {
  const navigate = useNavigate();
  const { selectedLanguage, setSelectedLanguage, isOnline } = useApp();
  const [autoPlay, setAutoPlay] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [storageUsed, setStorageUsed] = useState('0 KB');
  const [showClearCacheConfirm, setShowClearCacheConfirm] = useState(false);
  const [showPolicy, setShowPolicy] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    // Check notification permission on mount
    if (notificationService.isSupported()) {
      setNotificationsEnabled(notificationService.isGranted());
    }
    calculateStorage();

    // Check if dark mode is already active
    if (document.documentElement.classList.contains('dark')) {
      setHighContrast(true);
    }
  }, []);

  const calculateStorage = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += (localStorage[key].length + key.length) * 2;
      }
    }
    setStorageUsed(`${(total / 1024).toFixed(2)} KB`);
  };

  const handleClearCache = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleExportData = () => {
    const data: any = {};
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        try {
          data[key] = JSON.parse(localStorage[key]);
        } catch {
          data[key] = localStorage[key];
        }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitavoice_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const languages = languageService.getSupportedLanguages();
  const currentLang = languageService.getLanguage();

  const handleLanguageChange = (code: string) => {
    // @ts-ignore
    languageService.setLanguage(code);
    const lang = languages.find(l => l.code === code);
    if (lang) {
      setSelectedLanguage(lang.name);
      // @ts-ignore
      const greeting = languageService.translate('greeting', code);
      if (speechService.isSpeechSynthesisSupported()) {
        // @ts-ignore
        speechService.speak(greeting, { language: code });
      }
    }
    setShowLanguageDialog(false);
  };

  const handleVoiceSpeedChange = (speed: number) => {
    setVoiceSpeed(speed);
    speechService.setRate(speed);
    speechService.speak('This is the voice speed', { rate: speed });
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await notificationService.requestPermission();
      setNotificationsEnabled(granted);
      if (granted) {
        notificationService.show({
          title: 'Notifications Enabled',
          body: 'You will now receive health reminders',
        });
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const settingsSections = [
    {
      title: 'Language & Voice',
      items: [
        {
          icon: Languages,
          label: 'App Language',
          value: selectedLanguage,
          hasChevron: true,
          onClick: () => setShowLanguageDialog(true)
        },
        {
          icon: Volume2,
          label: 'Voice Speed',
          customControl: (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Slow</span>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={voiceSpeed}
                onChange={(e) => handleVoiceSpeedChange(parseFloat(e.target.value))}
                className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">Fast</span>
            </div>
          )
        },
        {
          icon: Volume2,
          label: 'Auto-play Responses',
          toggle: true,
          value: autoPlay,
          onChange: setAutoPlay
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Health Reminders',
          toggle: true,
          value: notificationsEnabled,
          onChange: handleNotificationToggle
        }
      ]
    },
    {
      title: 'Appearance',
      items: [
        {
          icon: Accessibility,
          label: 'Text Size',
          customControl: (
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2">A</span>
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={textSize === 'small' ? 0 : textSize === 'medium' ? 1 : 2}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  const size = val === 0 ? 'small' : val === 1 ? 'medium' : 'large';
                  setTextSize(size);
                  document.documentElement.style.fontSize = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
                }}
                className="w-24 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
              />
              <span className="text-lg font-bold text-gray-900 dark:text-white px-2">A</span>
            </div>
          )
        },
        {
          icon: highContrast ? Sun : Moon,
          label: 'Dark Mode',
          toggle: true,
          value: highContrast,
          onChange: (val: boolean) => {
            setHighContrast(val);
            if (val) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
        },
      ]
    },
    {
      title: 'Data & Storage',
      items: [
        {
          icon: Database,
          label: 'Offline Mode',
          toggle: true,
          value: !isOnline,
          onChange: () => { },
          disabled: true,
          description: isOnline ? 'App is online' : 'App is running offline'
        },
        { icon: Database, label: 'Storage Used', value: storageUsed, hasChevron: false },
        {
          icon: Trash2,
          label: 'Clear Cache',
          hasChevron: true,
          onClick: () => setShowClearCacheConfirm(true),
          color: 'text-red-600'
        }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        { icon: Shield, label: 'Data Encryption', value: 'Enabled' },
        {
          icon: Download,
          label: 'Backup Data',
          hasChevron: true,
          onClick: handleExportData
        }
      ]
    },
    {
      title: 'About',
      items: [
        { icon: Info, label: 'App Version', value: '1.0.0' },
        {
          icon: FileText,
          label: 'Privacy Policy',
          hasChevron: true,
          onClick: () => setShowPolicy({
            title: 'Privacy Policy',
            content: 'VitaVoice is committed to protecting your privacy. All your health data is stored locally on your device and is not shared with any third parties without your explicit consent. We use industry-standard encryption to secure your personal information.'
          })
        },
        {
          icon: FileText,
          label: 'Terms of Service',
          hasChevron: true,
          onClick: () => setShowPolicy({
            title: 'Terms of Service',
            content: 'By using VitaVoice, you agree to our terms. This app provides health information but is not a substitute for professional medical advice. Always consult with a doctor for medical decisions.'
          })
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-10 transition-colors duration-300">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </motion.button>
        <h1 className="text-xl font-bold text-[#1E293B] dark:text-white">Settings</h1>
      </div>

      <div className="px-6 py-6 space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 px-2">{section.title}</h2>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden transition-colors duration-300">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.label}
                  whileTap={item.onClick || item.hasChevron ? { scale: 0.98 } : {}}
                  onClick={item.onClick}
                  className={`px-4 py-4 flex items-center justify-between ${itemIndex < section.items.length - 1 ? 'border-b border-gray-100 dark:border-slate-800' : ''
                    } ${item.onClick || item.hasChevron ? 'cursor-pointer' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${(item as any).color ? 'bg-red-50 dark:bg-red-900/20' : 'bg-[#2563EB]/10 dark:bg-blue-900/20'} flex items-center justify-center`}>
                      <item.icon className={`w-5 h-5 ${(item as any).color || 'text-[#2563EB] dark:text-blue-400'}`} />
                    </div>
                    <div>
                      <span className={`font-medium block ${(item as any).color || 'text-[#1E293B] dark:text-white'}`}>{item.label}</span>
                      {(item as any).description && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">{(item as any).description}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.customControl ? (
                      item.customControl
                    ) : item.toggle ? (
                      <Switch
                        checked={item.value as boolean}
                        onCheckedChange={item.onChange}
                        disabled={item.disabled}
                      />
                    ) : (
                      <>
                        {item.value && <span className="text-sm text-gray-500 dark:text-gray-400">{item.value as string}</span>}
                        {item.hasChevron && <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />}
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
          <p>VitaVoice Healthcare Assistant</p>
          <p className="mt-1">Made with ❤️ for better healthcare access</p>
        </div>
      </div>

      {/* Language Selection Dialog */}
      <AnimatePresence>
        {showLanguageDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowLanguageDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1E293B] dark:text-white">Select Language</h2>
                <button
                  onClick={() => setShowLanguageDialog(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-2">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${currentLang === lang.code
                      ? 'border-[#2563EB] bg-[#2563EB]/10 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-[#2563EB] dark:text-blue-400" />
                      <div className="text-left">
                        <div className="font-semibold text-[#1E293B] dark:text-white">{lang.nativeName}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{lang.name}</div>
                      </div>
                    </div>
                    {currentLang === lang.code && (
                      <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Cache Confirmation Dialog */}
      <AnimatePresence>
        {showClearCacheConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowClearCacheConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Clear All Data?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">This will remove all your local data, including login session and health records. This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearCacheConfirm(false)}
                  className="flex-1 py-2.5 border border-gray-300 dark:border-slate-700 rounded-xl font-medium text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearCache}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium"
                >
                  Clear Data
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Policy/Terms Dialog */}
      <AnimatePresence>
        {showPolicy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPolicy(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{showPolicy.title}</h3>
                <button onClick={() => setShowPolicy(null)}>
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {showPolicy.content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
