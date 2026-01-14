import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Phone, Lock, Mic, Check } from 'lucide-react';

interface FormData {
  // Step 1: Personal Info
  name: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  
  // Step 2: Medical History
  pastIllnesses: string[];
  hadSurgery: boolean;
  surgeryDetails: string;
  allergies: string[];
  currentMedications: string;
  
  // Step 3: Family History
  familyConditions: string[];
  
  // Step 4: Lifestyle
  dietType: string;
  smoking: boolean;
  alcohol: boolean;
  activityLevel: string;
  
  // Step 5: Insurance
  insuranceProvider: string;
  policyNumber: string;
  
  // Step 6: Emergency Contact
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
}

export const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '', dob: '', gender: '', address: '', phone: '',
    pastIllnesses: [], hadSurgery: false, surgeryDetails: '', allergies: [], currentMedications: '',
    familyConditions: [],
    dietType: '', smoking: false, alcohol: false, activityLevel: '',
    insuranceProvider: '', policyNumber: '',
    emergencyName: '', emergencyRelation: '', emergencyPhone: ''
  });

  const steps = [
    'Personal Info',
    'Medical History',
    'Family History',
    'Lifestyle',
    'Insurance',
    'Emergency Contact'
  ];

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof FormData, item: string) => {
    const current = formData[field] as string[];
    updateField(
      field,
      current.includes(item) ? current.filter(i => i !== item) : [...current, item]
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save and navigate to home
      localStorage.setItem('vitavoice_logged_in', 'true');
      localStorage.setItem('vitavoice_user_data', JSON.stringify(formData));
      navigate('/home');
    }
  };

  const handleSkip = () => {
    if (currentStep === 4) { // Insurance step
      handleNext();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.name && formData.dob && formData.gender && formData.phone;
      case 1: return true; // All optional
      case 2: return true; // All optional
      case 3: return formData.dietType && formData.activityLevel;
      case 4: return true; // Optional insurance
      case 5: return formData.emergencyName && formData.emergencyPhone;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Emergency Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/emergency')}
        className="fixed top-6 right-6 z-50 w-14 h-14 bg-[#DC2626] rounded-full shadow-2xl flex items-center justify-center"
      >
        <Phone className="w-7 h-7 text-white" />
      </motion.button>

      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : navigate('/login')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-[#1E293B]">Create Account</h1>
          <p className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</p>
        </div>
        <Lock className="w-5 h-5 text-[#059669]" />
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex gap-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                index <= currentStep ? 'bg-[#2563EB]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">{steps[currentStep]}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <Step1PersonalInfo formData={formData} updateField={updateField} />
          )}
          {currentStep === 1 && (
            <Step2MedicalHistory formData={formData} updateField={updateField} toggleArrayItem={toggleArrayItem} />
          )}
          {currentStep === 2 && (
            <Step3FamilyHistory formData={formData} toggleArrayItem={toggleArrayItem} />
          )}
          {currentStep === 3 && (
            <Step4Lifestyle formData={formData} updateField={updateField} />
          )}
          {currentStep === 4 && (
            <Step5Insurance formData={formData} updateField={updateField} />
          )}
          {currentStep === 5 && (
            <Step6EmergencyContact formData={formData} updateField={updateField} />
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="bg-white px-6 py-4 border-t border-gray-200 space-y-3">
        {currentStep === steps.length - 1 && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-[#059669]/10 p-3 rounded-lg">
            <Lock className="w-4 h-4 text-[#059669]" />
            <span>Your data is securely encrypted and reused for future visits</span>
          </div>
        )}
        <div className="flex gap-3">
          {currentStep === 4 && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSkip}
              className="px-6 h-14 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold"
            >
              Skip for now
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex-1 h-14 rounded-xl font-semibold flex items-center justify-center gap-2 ${
              canProceed()
                ? 'bg-[#2563EB] text-white shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>{currentStep === steps.length - 1 ? 'Save & Continue' : 'Next'}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Step 1: Personal Information
const Step1PersonalInfo = ({ formData, updateField }: any) => {
  const genderOptions = ['Male', 'Female', 'Other'];

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-2">Full Name *</label>
        <div className="relative">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Enter your full name"
            className="w-full h-14 px-4 pr-12 bg-white border-2 border-gray-200 rounded-xl focus:border-[#2563EB] outline-none"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
            <Mic className="w-4 h-4 text-[#2563EB]" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-2">Date of Birth *</label>
        <input
          type="date"
          value={formData.dob}
          onChange={(e) => updateField('dob', e.target.value)}
          className="w-full h-14 px-4 bg-white border-2 border-gray-200 rounded-xl focus:border-[#2563EB] outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-2">Gender *</label>
        <div className="flex gap-3">
          {genderOptions.map(option => (
            <button
              key={option}
              onClick={() => updateField('gender', option)}
              className={`flex-1 h-12 rounded-xl font-medium transition-all ${
                formData.gender === option
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-2">Address</label>
        <div className="relative">
          <textarea
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="Enter your address"
            rows={3}
            className="w-full px-4 py-3 pr-12 bg-white border-2 border-gray-200 rounded-xl focus:border-[#2563EB] outline-none resize-none"
          />
          <button className="absolute right-3 top-3 w-8 h-8 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
            <Mic className="w-4 h-4 text-[#2563EB]" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-2">Phone Number *</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="+91 98765 43210"
          className="w-full h-14 px-4 bg-white border-2 border-gray-200 rounded-xl focus:border-[#2563EB] outline-none"
        />
      </div>
    </motion.div>
  );
};

// Step 2: Medical History
const Step2MedicalHistory = ({ formData, updateField, toggleArrayItem }: any) => {
  const illnesses = ['Diabetes', 'Hypertension', 'Asthma', 'Thyroid', 'Heart Disease', 'None'];

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-3">Past Illnesses (Select all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {illnesses.map(illness => (
            <button
              key={illness}
              onClick={() => toggleArrayItem('pastIllnesses', illness)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                formData.pastIllnesses.includes(illness)
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700'
              }`}
            >
              {formData.pastIllnesses.includes(illness) && <Check className="w-4 h-4 inline mr-1" />}
              {illness}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-2">Had any surgeries?</label>
        <div className="flex gap-3">
          <button
            onClick={() => updateField('hadSurgery', true)}
            className={`flex-1 h-12 rounded-xl font-medium ${
              formData.hadSurgery ? 'bg-[#2563EB] text-white' : 'bg-white border-2 border-gray-200'
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => updateField('hadSurgery', false)}
            className={`flex-1 h-12 rounded-xl font-medium ${
              !formData.hadSurgery ? 'bg-[#2563EB] text-white' : 'bg-white border-2 border-gray-200'
            }`}
          >
            No
          </button>
        </div>
      </div>

      {formData.hadSurgery && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
        >
          <label className="block text-sm font-medium text-[#1E293B] mb-2">Surgery Details</label>
          <textarea
            value={formData.surgeryDetails}
            onChange={(e) => updateField('surgeryDetails', e.target.value)}
            placeholder="Describe the surgery and year"
            rows={3}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#2563EB] outline-none resize-none"
          />
        </motion.div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-2">Current Medications (Optional)</label>
        <textarea
          value={formData.currentMedications}
          onChange={(e) => updateField('currentMedications', e.target.value)}
          placeholder="List any medications you're currently taking"
          rows={3}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#2563EB] outline-none resize-none"
        />
      </div>
    </motion.div>
  );
};

// Step 3: Family History
const Step3FamilyHistory = ({ formData, toggleArrayItem }: any) => {
  const conditions = ['Diabetes', 'High Blood Pressure', 'Heart Disease', 'Asthma', 'Cancer', 'None'];

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="space-y-4"
    >
      <p className="text-gray-600">Select conditions that run in your family</p>
      <div className="flex flex-wrap gap-2">
        {conditions.map(condition => (
          <button
            key={condition}
            onClick={() => toggleArrayItem('familyConditions', condition)}
            className={`px-4 py-3 rounded-xl font-medium transition-all ${
              formData.familyConditions.includes(condition)
                ? 'bg-[#059669] text-white'
                : 'bg-white border-2 border-gray-200 text-gray-700'
            }`}
          >
            {formData.familyConditions.includes(condition) && <Check className="w-4 h-4 inline mr-1" />}
            {condition}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// Step 4: Lifestyle
const Step4Lifestyle = ({ formData, updateField }: any) => {
  const dietTypes = ['Vegetarian', 'Non-Vegetarian', 'Mixed'];
  const activityLevels = ['Low', 'Medium', 'High'];

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-3">Diet Type *</label>
        <div className="grid grid-cols-3 gap-3">
          {dietTypes.map(type => (
            <button
              key={type}
              onClick={() => updateField('dietType', type)}
              className={`h-20 rounded-xl font-medium transition-all ${
                formData.dietType === type
                  ? 'bg-[#059669] text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700'
              }`}
            >
              {type.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between">
          <span className="font-medium text-[#1E293B]">Do you smoke?</span>
          <div className="flex gap-2">
            <button
              onClick={() => updateField('smoking', true)}
              className={`w-16 h-10 rounded-lg font-medium ${
                formData.smoking ? 'bg-[#EA580C] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => updateField('smoking', false)}
              className={`w-16 h-10 rounded-lg font-medium ${
                !formData.smoking ? 'bg-[#059669] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              No
            </button>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between">
          <span className="font-medium text-[#1E293B]">Consume alcohol?</span>
          <div className="flex gap-2">
            <button
              onClick={() => updateField('alcohol', true)}
              className={`w-16 h-10 rounded-lg font-medium ${
                formData.alcohol ? 'bg-[#EA580C] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => updateField('alcohol', false)}
              className={`w-16 h-10 rounded-lg font-medium ${
                !formData.alcohol ? 'bg-[#059669] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-3">Activity Level *</label>
        <div className="grid grid-cols-3 gap-3">
          {activityLevels.map(level => (
            <button
              key={level}
              onClick={() => updateField('activityLevel', level)}
              className={`h-16 rounded-xl font-medium transition-all ${
                formData.activityLevel === level
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Step 5: Insurance
const Step5Insurance = ({ formData, updateField }: any) => (
  <motion.div
    initial={{ x: 300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -300, opacity: 0 }}
    className="space-y-4"
  >
    <p className="text-gray-600">Add your insurance details (optional)</p>
    <div>
      <label className="block text-sm font-medium text-[#1E293B] mb-2">Insurance Provider</label>
      <input
        type="text"
        value={formData.insuranceProvider}
        onChange={(e) => updateField('insuranceProvider', e.target.value)}
        placeholder="e.g., Star Health, HDFC Ergo"
        className="w-full h-14 px-4 bg-white border-2 border-gray-200 rounded-xl focus:border-[#2563EB] outline-none"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-[#1E293B] mb-2">Policy Number</label>
      <input
        type="text"
        value={formData.policyNumber}
        onChange={(e) => updateField('policyNumber', e.target.value)}
        placeholder="Enter policy number"
        className="w-full h-14 px-4 bg-white border-2 border-gray-200 rounded-xl focus:border-[#2563EB] outline-none"
      />
    </div>
  </motion.div>
);

// Step 6: Emergency Contact
const Step6EmergencyContact = ({ formData, updateField }: any) => {
  const relationships = ['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other'];

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-2">Contact Name *</label>
        <input
          type="text"
          value={formData.emergencyName}
          onChange={(e) => updateField('emergencyName', e.target.value)}
          placeholder="Full name"
          className="w-full h-14 px-4 bg-white border-2 border-gray-200 rounded-xl focus:border-[#2563EB] outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-3">Relationship *</label>
        <div className="flex flex-wrap gap-2">
          {relationships.map(rel => (
            <button
              key={rel}
              onClick={() => updateField('emergencyRelation', rel)}
              className={`px-4 py-2 rounded-full font-medium ${
                formData.emergencyRelation === rel
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700'
              }`}
            >
              {rel}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-2">Phone Number *</label>
        <input
          type="tel"
          value={formData.emergencyPhone}
          onChange={(e) => updateField('emergencyPhone', e.target.value)}
          placeholder="+91 98765 43210"
          className="w-full h-14 px-4 bg-white border-2 border-gray-200 rounded-xl focus:border-[#2563EB] outline-none"
        />
      </div>
    </motion.div>
  );
};
