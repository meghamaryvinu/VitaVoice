import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, User as UserIcon, Thermometer, AlertTriangle } from 'lucide-react';

const steps = ['Body Part', 'Symptoms', 'Duration & Severity', 'Results'];

export const SymptomChecker = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [severity, setSeverity] = useState(5);

  const severityEmojis = ['😊', '🙂', '😐', '😟', '😰', '😣', '😖', '😫', '😩', '😱'];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </motion.button>
        <h1 className="text-xl font-bold text-[#1E293B]">Symptom Checker</h1>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="flex gap-2 mb-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full ${
                index <= currentStep ? 'bg-[#2563EB]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 text-center">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
        </p>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {currentStep === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xl font-bold text-[#1E293B] mb-4">Where does it hurt?</h2>
            <div className="bg-white rounded-2xl p-8 text-center shadow-md">
              <UserIcon className="w-48 h-48 text-gray-300 mx-auto" />
              <p className="text-gray-600 mt-4">Tap on the body part</p>
            </div>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xl font-bold text-[#1E293B] mb-4">Select Symptoms</h2>
            <div className="space-y-2">
              {['Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea'].map((symptom, index) => (
                <motion.button
                  key={symptom}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white p-4 rounded-xl text-left shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                >
                  {symptom}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xl font-bold text-[#1E293B] mb-4">Pain Severity</h2>
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="text-center mb-6">
                <span className="text-6xl">{severityEmojis[severity - 1]}</span>
                <p className="text-xl font-bold text-[#1E293B] mt-2">{severity}/10</p>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #059669 0%, #F59E0B 50%, #DC2626 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Mild</span>
                <span>Severe</span>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-[#FEF2F2] border-2 border-[#DC2626] rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-8 h-8 text-[#DC2626]" />
                <h2 className="text-xl font-bold text-[#DC2626]">Seek Medical Attention</h2>
              </div>
              <p className="text-gray-700">Based on your symptoms, we recommend consulting a doctor soon.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-lg text-[#1E293B] mb-3">Matched Symptoms</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-[#DC2626]" />
                  <span>Fever (High Priority)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-[#F59E0B]" />
                  <span>Headache (Medium Priority)</span>
                </li>
              </ul>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/emergency')}
              className="w-full h-14 bg-[#DC2626] text-white rounded-xl font-semibold mt-6"
            >
              Find Nearby Clinic
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      {currentStep < 3 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-200">
          <div className="flex gap-3">
            {currentStep > 0 && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 h-14 bg-gray-200 text-gray-700 rounded-xl font-semibold"
              >
                Back
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex-1 h-14 bg-[#2563EB] text-white rounded-xl font-semibold"
            >
              {currentStep === 2 ? 'Get Results' : 'Continue'}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};
