import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Languages, Volume2, Accessibility, Database, Shield, Info, ChevronRight } from 'lucide-react';
import { Switch } from '@/app/components/ui/switch';

export const Settings = () => {
  const navigate = useNavigate();
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const settingsSections = [
    {
      title: 'Language & Voice',
      items: [
        { icon: Languages, label: 'App Language', value: 'English', hasChevron: true },
        { icon: Volume2, label: 'Voice Speed', value: 'Normal', hasChevron: true },
        { icon: Volume2, label: 'Auto-play Responses', toggle: true, value: autoPlay, onChange: setAutoPlay }
      ]
    },
    {
      title: 'Accessibility',
      items: [
        { icon: Accessibility, label: 'Text Size', value: 'Medium', hasChevron: true },
        { icon: Accessibility, label: 'High Contrast', toggle: true, value: highContrast, onChange: setHighContrast },
        { icon: Accessibility, label: 'Reduce Animations', toggle: true, value: false, onChange: () => {} }
      ]
    },
    {
      title: 'Data & Storage',
      items: [
        { icon: Database, label: 'Offline Mode', toggle: true, value: offlineMode, onChange: setOfflineMode },
        { icon: Database, label: 'Storage Used', value: '12.5 MB', hasChevron: true },
        { icon: Database, label: 'Clear Cache', hasChevron: true }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        { icon: Shield, label: 'Data Encryption', value: 'Enabled' },
        { icon: Shield, label: 'Backup Data', hasChevron: true }
      ]
    },
    {
      title: 'About',
      items: [
        { icon: Info, label: 'App Version', value: '1.0.0' },
        { icon: Info, label: 'Privacy Policy', hasChevron: true },
        { icon: Info, label: 'Terms of Service', hasChevron: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </motion.button>
        <h1 className="text-xl font-bold text-[#1E293B]">Settings</h1>
      </div>

      <div className="px-6 py-6 space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3 px-2">{section.title}</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.label}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-4 flex items-center justify-between ${
                    itemIndex < section.items.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <span className="font-medium text-[#1E293B]">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.toggle ? (
                      <Switch checked={item.value as boolean} onCheckedChange={item.onChange} />
                    ) : (
                      <>
                        {item.value && <span className="text-sm text-gray-500">{item.value}</span>}
                        {item.hasChevron && <ChevronRight className="w-5 h-5 text-gray-400" />}
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="text-center text-sm text-gray-500 py-8">
          <p>VitaVoice Healthcare Assistant</p>
          <p className="mt-1">Made with ❤️ for better healthcare access</p>
        </div>
      </div>
    </div>
  );
};
