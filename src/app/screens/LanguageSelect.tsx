import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useApp } from '@/app/context/AppContext';
import { Check, Volume2 } from 'lucide-react';
import { languageService } from '@/services/languageService';
import { speechService } from '@/services/speechService';

export const LanguageSelect = () => {
  const navigate = useNavigate();
  const { setSelectedLanguage } = useApp();
  const [selected, setSelected] = useState('');
  const languages = languageService.getSupportedLanguages();

  useEffect(() => {
    // Get previously selected language if any
    const savedLang = languageService.getLanguage();
    if (savedLang) {
      setSelected(savedLang);
    }
  }, []);

  const handleLanguageSelect = (code: string) => {
    setSelected(code);
    // Play a sample greeting in the selected language
    const greeting = languageService.translate('greeting', code as any);
    if (speechService.isSpeechSynthesisSupported()) {
      speechService.speak(greeting, { language: code as any, rate: 0.9 });
    }
  };

  const handleContinue = () => {
    if (selected) {
      languageService.setLanguage(selected as any);
      const language = languages.find(l => l.code === selected);
      setSelectedLanguage(language?.name || 'English');
      localStorage.setItem('vitavoice_intro_seen', 'true');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <div className="px-6 py-8">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-[#1E293B] mb-2"
        >
          Select Your Language
        </motion.h1>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-base text-gray-600"
        >
          Choose your preferred language for voice interactions
        </motion.p>
      </div>

      <div className="flex-1 px-6 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {languages.map((lang, index) => (
            <motion.button
              key={lang.code}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(lang.code)}
              className={`h-[100px] rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 relative ${selected === lang.code
                  ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-lg'
                  : 'bg-white border-gray-200 text-[#1E293B] hover:border-[#2563EB]'
                }`}
            >
              {selected === lang.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-[#2563EB]" />
                </motion.div>
              )}
              <span className="text-2xl font-semibold">{lang.nativeName}</span>
              <span className={`text-sm ${selected === lang.code ? 'text-white/80' : 'text-gray-500'}`}>
                {lang.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8">
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          disabled={!selected}
          className={`w-full h-14 rounded-xl font-semibold text-base transition-all ${selected
              ? 'bg-[#059669] text-white shadow-lg hover:bg-[#047857]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
};