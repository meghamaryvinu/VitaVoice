import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Phone, Lock, Check, Plus } from 'lucide-react';
import { authService, type SignupData } from '@/services/authService';

/* =========================
   FORM DATA
========================= */
interface FormData {
  // Account
  email: string;
  password: string;

  // Patient Details
  name: string;
  age: string;
  sex: string;
  bloodType: string;
  phoneNumber: string;

  // Health Problems
  allergies: string[];
  history: string[]; // Chronic conditions
  chiefComplaints: string[];

  // Lifestyle
  habits: string[];
  diet: string;
  activityLevel: string;
}

/* =========================
   MAIN COMPONENT
========================= */
export const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    age: '',
    sex: '',
    bloodType: 'O+',
    phoneNumber: '',

    allergies: [],
    history: [],
    chiefComplaints: [],

    habits: [],
    diet: 'Vegetarian',
    activityLevel: 'Moderate'
  });

  const steps = [
    'Account Setup',
    'Personal Details',
    'Health Profile',
    'Lifestyle & Habits'
  ];

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof FormData, item: string) => {
    const current = formData[field] as string[];
    updateField(
      field,
      current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item]
    );
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      // Validation for step 0 (Account)
      if (currentStep === 0) {
        if (!formData.email || !formData.password) {
          setError('Please fill in all fields');
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }
      }
      setError('');
      setCurrentStep(currentStep + 1);
    } else {
      // Submit Signup
      const signupData: SignupData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        age: parseInt(formData.age) || 0,
        gender: (formData.sex.toLowerCase() as any) || 'other',
        bloodType: formData.bloodType,
        phoneNumber: formData.phoneNumber,
        allergies: formData.allergies,
        chronicConditions: formData.history,
      };

      const result = await authService.signup(signupData);

      if (result.success) {
        navigate('/home');
      } else {
        setError(result.error || 'Signup failed');
      }
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
          onClick={() =>
            currentStep > 0 ? setCurrentStep(currentStep - 1) : navigate('/login')
          }
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </motion.button>

        <div className="flex-1">
          <h1 className="text-lg font-bold text-[#1E293B]">Create Account</h1>
          <p className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <Lock className="w-5 h-5 text-[#059669]" />
      </div>

      {/* Progress */}
      <div className="px-6 py-4 bg-white border-b">
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full ${i <= currentStep ? 'bg-[#2563EB]' : 'bg-gray-200'
                }`}
            />
          ))}
        </div>
        <p className="text-center text-sm mt-2 font-medium text-[#1E293B]">{steps[currentStep]}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {currentStep === 0 && <StepAccount formData={formData} updateField={updateField} />}
          {currentStep === 1 && <StepPersonal formData={formData} updateField={updateField} />}
          {currentStep === 2 && <StepHealth formData={formData} toggleArrayItem={toggleArrayItem} />}
          {currentStep === 3 && <StepLifestyle formData={formData} updateField={updateField} toggleArrayItem={toggleArrayItem} />}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-white px-6 py-4 border-t">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full h-14 rounded-xl font-semibold bg-[#2563EB] text-white flex items-center justify-center gap-2"
        >
          {currentStep === steps.length - 1 ? 'Create Account' : 'Next'}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

/* =========================
   STEPS
========================= */

const StepAccount = ({ formData, updateField }: any) => (
  <motion.div className="space-y-4">
    <Input label="Email Address" type="email" value={formData.email} onChange={v => updateField('email', v)} placeholder="you@example.com" />
    <Input label="Password" type="password" value={formData.password} onChange={v => updateField('password', v)} placeholder="Min. 6 characters" />
    <Input label="Phone Number" type="tel" value={formData.phoneNumber} onChange={v => updateField('phoneNumber', v)} placeholder="+91 98765 43210" />
  </motion.div>
);

const StepPersonal = ({ formData, updateField }: any) => (
  <motion.div className="space-y-4">
    <Input label="Full Name" value={formData.name} onChange={v => updateField('name', v)} />

    <div className="grid grid-cols-2 gap-4">
      <Input label="Age" type="number" value={formData.age} onChange={v => updateField('age', v)} />
      <div>
        <label className="block text-sm font-medium mb-1">Blood Type</label>
        <select
          value={formData.bloodType}
          onChange={e => updateField('bloodType', e.target.value)}
          className="w-full h-12 px-4 border-2 rounded-xl bg-white focus:border-[#2563EB] focus:outline-none"
        >
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Gender</label>
      <div className="flex gap-3">
        {['Male', 'Female', 'Other'].map(s => (
          <button
            key={s}
            onClick={() => updateField('sex', s)}
            className={`flex-1 h-12 rounded-xl transition-colors font-medium ${formData.sex === s ? 'bg-[#2563EB] text-white' : 'border-2 hover:bg-gray-50'
              }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  </motion.div>
);

const StepHealth = ({ formData, toggleArrayItem }: any) => (
  <motion.div className="space-y-6">
    <SelectionGroup
      label="Do you have any allergies?"
      items={['Peanuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy', 'Dust', 'Pollen', 'Penicillin']}
      selected={formData.allergies}
      toggle={i => toggleArrayItem('allergies', i)}
    />

    <SelectionGroup
      label="Chronic Conditions"
      items={['Diabetes', 'Hypertension', 'Asthma', 'Arthritis', 'Thyroid', 'Migraine', 'Heart Disease']}
      selected={formData.history}
      toggle={i => toggleArrayItem('history', i)}
    />

    <SelectionGroup
      label="Current Symptoms"
      items={['Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 'Body Pain', 'Sore Throat']}
      selected={formData.chiefComplaints}
      toggle={i => toggleArrayItem('chiefComplaints', i)}
    />
  </motion.div>
);

const StepLifestyle = ({ formData, updateField, toggleArrayItem }: any) => (
  <motion.div className="space-y-6">
    <SelectionGroup
      label="Habits"
      items={['Smoking', 'Alcohol', 'Tobacco', 'Caffeine', 'None']}
      selected={formData.habits}
      toggle={i => toggleArrayItem('habits', i)}
    />

    <div>
      <label className="block text-sm font-medium mb-2">Diet Preference</label>
      <div className="grid grid-cols-2 gap-3">
        {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian'].map(d => (
          <button
            key={d}
            onClick={() => updateField('diet', d)}
            className={`h-12 rounded-xl transition-colors font-medium ${formData.diet === d ? 'bg-[#2563EB] text-white' : 'border-2 hover:bg-gray-50'
              }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Activity Level</label>
      <div className="space-y-2">
        {['Sedentary', 'Moderate', 'Active', 'Athletic'].map(a => (
          <button
            key={a}
            onClick={() => updateField('activityLevel', a)}
            className={`w-full h-12 rounded-xl transition-colors font-medium flex items-center px-4 ${formData.activityLevel === a ? 'bg-[#2563EB] text-white' : 'border-2 hover:bg-gray-50'
              }`}
          >
            {a}
            {formData.activityLevel === a && <Check className="ml-auto w-5 h-5" />}
          </button>
        ))}
      </div>
    </div>
  </motion.div>
);

/* =========================
   UI HELPERS
========================= */

const Input = ({ label, value, onChange, type = 'text', placeholder }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-12 px-4 border-2 rounded-xl focus:border-[#2563EB] focus:outline-none transition-colors"
    />
  </div>
);

const SelectionGroup = ({ label, items, selected, toggle }: any) => (
  <div>
    <p className="text-sm font-medium mb-3">{label}</p>
    <div className="flex flex-wrap gap-2">
      {items.map((item: string) => (
        <button
          key={item}
          onClick={() => toggle(item)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${selected.includes(item)
              ? 'bg-[#2563EB] text-white border-[#2563EB]'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
        >
          {item}
        </button>
      ))}
      <button className="px-4 py-2 rounded-full text-sm font-medium border-2 border-dashed border-gray-300 text-gray-500 hover:border-[#2563EB] hover:text-[#2563EB] flex items-center gap-1">
        <Plus className="w-4 h-4" /> Other
      </button>
    </div>
  </div>
);
