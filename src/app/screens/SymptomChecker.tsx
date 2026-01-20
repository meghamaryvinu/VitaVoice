import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, User as UserIcon, Thermometer, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { symptomEngine } from '@/services/symptomEngine';
import { languageService } from '@/services/languageService';
import type { Symptom, PatientInfo, DiagnosticResult } from '@/types/health';
import { useApp } from '@/app/context/AppContext';

const steps = ['Body Part', 'Symptoms', 'Duration & Severity', 'Results'];

const commonSymptoms = [
  { name: 'Fever', icon: '🌡️' },
  { name: 'Headache', icon: '🤕' },
  { name: 'Cough', icon: '😷' },
  { name: 'Fatigue', icon: '😴' },
  { name: 'Nausea', icon: '🤢' },
  { name: 'Body Ache', icon: '💪' },
  { name: 'Sore Throat', icon: '🗣️' },
  { name: 'Dizziness', icon: '😵' },
];

export const SymptomChecker = () => {
  const navigate = useNavigate();
  const { familyMembers, addHistoryEntry } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState('1-2 days');
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

  const severityEmojis = ['😊', '🙂', '😐', '😟', '😰', '😣', '😖', '😫', '😩', '😱'];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleAnalyze = () => {
    // Build symptom assessment
    const symptoms: Symptom[] = selectedSymptoms.map((name, index) => ({
      id: `symptom_${index}`,
      name,
      severity,
      duration,
      bodyPart: selectedBodyPart,
    }));

    const patientInfo: PatientInfo = {
      age: 30, // Default, could be from family member selection
      gender: 'other',
      chronicConditions: [],
      allergies: [],
      currentMedications: [],
    };

    const assessment = {
      symptoms,
      patientInfo,
      timestamp: new Date(),
      mainComplaint: selectedSymptoms[0] || 'General discomfort',
    };

    // Analyze symptoms
    const result = symptomEngine.analyzeSymptoms(assessment);
    setDiagnosticResult(result);

    // Save to history
    if (result.possibleConditions.length > 0) {
      addHistoryEntry({
        complaint: selectedSymptoms.join(', '),
        diagnosis: result.possibleConditions[0].diseaseName,
        severity: result.possibleConditions[0].severity.toLowerCase() as 'low' | 'medium' | 'high',
        duration,
      });
    }

    setCurrentStep(3);
  };

  const getRiskColor = () => {
    if (!diagnosticResult) return '#059669';
    const category = diagnosticResult.recommendation.category;
    if (category === 'EMERGENCY') return '#DC2626';
    if (category === 'VISIT_PHC') return '#F59E0B';
    return '#059669';
  };

  const getRiskLabel = () => {
    if (!diagnosticResult) return 'Safe';
    const category = diagnosticResult.recommendation.category;
    if (category === 'EMERGENCY') return 'Emergency';
    if (category === 'VISIT_PHC') return 'Visit Doctor';
    return 'Home Care';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
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
              className={`flex-1 h-2 rounded-full transition-colors ${index <= currentStep ? 'bg-[#2563EB]' : 'bg-gray-200'
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
              <div className="mt-6 grid grid-cols-2 gap-3">
                {['Head', 'Chest', 'Stomach', 'Back', 'Arms', 'Legs'].map((part) => (
                  <motion.button
                    key={part}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedBodyPart(part)}
                    className={`p-3 rounded-xl border-2 transition-colors ${selectedBodyPart === part
                        ? 'border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    {part}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xl font-bold text-[#1E293B] mb-4">Select Symptoms</h2>
            <p className="text-sm text-gray-600 mb-4">You can select multiple symptoms</p>
            <div className="grid grid-cols-2 gap-3">
              {commonSymptoms.map((symptom, index) => (
                <motion.button
                  key={symptom.name}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSymptom(symptom.name)}
                  className={`p-4 rounded-xl border-2 transition-all ${selectedSymptoms.includes(symptom.name)
                      ? 'border-[#2563EB] bg-[#2563EB]/10 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                >
                  <div className="text-3xl mb-2">{symptom.icon}</div>
                  <div className="text-sm font-medium text-[#1E293B]">{symptom.name}</div>
                  {selectedSymptoms.includes(symptom.name) && (
                    <CheckCircle className="w-5 h-5 text-[#2563EB] mx-auto mt-2" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xl font-bold text-[#1E293B] mb-6">Pain Severity & Duration</h2>

            {/* Severity */}
            <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
              <h3 className="font-semibold text-[#1E293B] mb-4">How severe is it?</h3>
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

            {/* Duration */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-semibold text-[#1E293B] mb-4">How long have you had this?</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Few hours', '1-2 days', '3-5 days', '1 week', '2 weeks', 'More than 2 weeks'].map((dur) => (
                  <motion.button
                    key={dur}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDuration(dur)}
                    className={`p-3 rounded-xl border-2 text-sm transition-colors ${duration === dur
                        ? 'border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    {dur}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && diagnosticResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Risk Alert */}
            <div
              className={`rounded-2xl p-6 mb-6 border-2`}
              style={{
                backgroundColor: `${getRiskColor()}15`,
                borderColor: getRiskColor()
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                {diagnosticResult.isEmergency ? (
                  <AlertTriangle className="w-8 h-8" style={{ color: getRiskColor() }} />
                ) : (
                  <Activity className="w-8 h-8" style={{ color: getRiskColor() }} />
                )}
                <h2 className="text-xl font-bold" style={{ color: getRiskColor() }}>
                  {getRiskLabel()}
                </h2>
              </div>
              <p className="text-gray-700">
                {diagnosticResult.recommendation.advice[0]}
              </p>
            </div>

            {/* Possible Conditions */}
            <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
              <h3 className="font-bold text-lg text-[#1E293B] mb-4 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-[#2563EB]" />
                Possible Conditions
              </h3>
              {diagnosticResult.possibleConditions.slice(0, 3).map((condition, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#1E293B]">{condition.diseaseName}</span>
                    <span className="text-sm text-gray-600">
                      {Math.round(condition.confidence * 100)}% match
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#2563EB] h-2 rounded-full transition-all"
                      style={{ width: `${condition.confidence * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{condition.description}</p>
                </div>
              ))}
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Confidence: {diagnosticResult.confidence}</strong> - This is a preliminary assessment. Please consult a doctor for accurate diagnosis.
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
              <h3 className="font-bold text-lg text-[#1E293B] mb-4">Recommendations</h3>

              {diagnosticResult.recommendation.homeCareTips && (
                <div className="mb-4">
                  <h4 className="font-semibold text-[#1E293B] mb-2">Home Care:</h4>
                  <ul className="space-y-2">
                    {diagnosticResult.recommendation.homeCareTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-[#059669] mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {diagnosticResult.recommendation.warningSign && (
                <div className="mb-4">
                  <h4 className="font-semibold text-[#DC2626] mb-2">Warning Signs:</h4>
                  <ul className="space-y-2">
                    {diagnosticResult.recommendation.warningSign.map((sign, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <AlertTriangle className="w-4 h-4 text-[#DC2626] mt-0.5 flex-shrink-0" />
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Follow-up:</strong> {diagnosticResult.recommendation.followUpTiming}
                </p>
              </div>
            </div>

            {diagnosticResult.isEmergency && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/emergency')}
                className="w-full h-14 bg-[#DC2626] text-white rounded-xl font-semibold shadow-lg"
              >
                Call Emergency Services (108)
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      {currentStep < 3 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-200 max-w-md mx-auto">
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
              onClick={() => {
                if (currentStep === 2) {
                  handleAnalyze();
                } else {
                  setCurrentStep(currentStep + 1);
                }
              }}
              disabled={
                (currentStep === 0 && !selectedBodyPart) ||
                (currentStep === 1 && selectedSymptoms.length === 0)
              }
              className="flex-1 h-14 bg-[#2563EB] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 2 ? 'Get Results' : 'Continue'}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};
