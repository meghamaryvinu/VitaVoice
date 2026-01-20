import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Phone, MapPin, Navigation, ChevronDown, ChevronUp } from 'lucide-react';

const facilities = [
  { name: 'City General Hospital', distance: '1.2 km', phone: '+91 98765 43210', emergency: true },
  { name: 'Community Health Center', distance: '2.5 km', phone: '+91 98765 43211', emergency: false },
  { name: 'Apollo Clinic', distance: '3.1 km', phone: '+91 98765 43212', emergency: true }
];

const firstAidSteps = [
  {
    title: 'Bleeding',
    steps: ['Apply direct pressure', 'Elevate the wound', 'Keep the person calm', 'Call for help if severe']
  },
  {
    title: 'Choking',
    steps: ['Encourage coughing', 'Give 5 back blows', 'Perform 5 abdominal thrusts', 'Call 108 if unsuccessful']
  },
  {
    title: 'Burns',
    steps: ['Cool the burn with water', 'Remove jewelry', 'Cover with clean cloth', 'Seek medical help']
  }
];

export const Emergency = () => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen bg-[#FEF2F2]">
      {/* Header */}
      <div className="bg-[#DC2626] px-4 py-4 flex items-center gap-3 text-white shadow-lg">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>
        <h1 className="text-xl font-bold">Emergency Services</h1>
      </div>

      {/* Emergency Call Button */}
      <div className="px-6 py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-xl text-center"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(220, 38, 38, 0.4)',
                '0 0 0 20px rgba(220, 38, 38, 0)',
                '0 0 0 0 rgba(220, 38, 38, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCall('108')}
              className="w-40 h-40 rounded-full bg-[#DC2626] flex flex-col items-center justify-center text-white shadow-2xl"
            >
              <Phone className="w-12 h-12 mb-2" />
              <span className="text-5xl font-bold">108</span>
            </motion.button>
          </motion.div>
          <p className="mt-6 text-lg text-gray-600">Emergency Medical Services</p>
          <p className="text-sm text-gray-500 mt-1">Tap to call immediately</p>
        </motion.div>
      </div>

      {/* Location & Nearest Facilities */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-[#DC2626]" />
            <span className="font-semibold text-[#1E293B]">Your Location</span>
          </div>
          <div className="h-32 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
            <MapPin className="w-8 h-8" />
          </div>
        </div>

        <h2 className="font-bold text-lg text-[#1E293B] mb-3">Nearest Facilities</h2>
        <div className="space-y-3">
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-md"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1E293B]">{facility.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{facility.distance} away</p>
                  {facility.emergency && (
                    <span className="inline-block mt-1 px-2 py-1 bg-[#DC2626]/10 text-[#DC2626] text-xs rounded-full">
                      24/7 Emergency
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCall(facility.phone)}
                  className="flex-1 h-10 bg-[#059669] text-white rounded-lg flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 h-10 bg-[#2563EB] text-white rounded-lg flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Directions</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* First Aid Guide */}
        <h2 className="font-bold text-lg text-[#1E293B] mt-6 mb-3">First Aid Guide</h2>
        <div className="space-y-2">
          {firstAidSteps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-md"
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full px-4 py-4 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-[#1E293B]">{item.title}</span>
                {expandedIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="px-4 pb-4"
                >
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    {item.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
