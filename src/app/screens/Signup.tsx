import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Phone, Lock, Check, Mail } from 'lucide-react';
import { authService, type SignupData } from '@/services/authService';

/* ========================= FORM DATA ========================= */
interface FormData {
  email: string;
  password: string;
  full_name: string;
  age: string;
  blood_type: string;   
  phone: string;       
  gender: string;
  marital_status: string;
  checkup_reason: string;
  specific_problem: string;
  taking_medicines: boolean;
  medicine_names: string;
  allergies: string[];
  other_allergy: string;
  had_surgery: boolean;
  surgery_details: string;
  head_mind_symptoms: string[];
  eye_ear_mouth_symptoms: string[];
  chest_heart_symptoms: string[];
  stomach_digestive_symptoms: string[];
  urinary_symptoms: string[];
  habits: string[];
  other_habit: string;
  diet: string;
  activity_level: string;
  family_history: string[];
  mental_wellbeing: string[];
}

/* ========================= MAIN COMPONENT ========================= */
export const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    full_name: '',
    age: '',
    blood_type: '',   
    phone: '',        
    gender: '',
    marital_status: '',
    checkup_reason: '',
    specific_problem: '',
    taking_medicines: false,
    medicine_names: '',
    allergies: [],
    other_allergy: '',
    had_surgery: false,
    surgery_details: '',
    head_mind_symptoms: [],
    eye_ear_mouth_symptoms: [],
    chest_heart_symptoms: [],
    stomach_digestive_symptoms: [],
    urinary_symptoms: [],
    habits: [],
    other_habit: '',
    diet: 'Vegetarian',
    activity_level: 'Sedentary',
    family_history: [],
    mental_wellbeing: []
  });

  const steps = [
    'About You',
    'Reason for Checkup',
    'Medical History',
    'Symptoms',
    'Lifestyle & Habits',
    'Family History',
    'Mental Wellbeing'
  ];

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const updateField = (field: keyof FormData, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }));

  // ✅ Real-time email validation
  if (field === 'email') {
    if (!value) {
      setEmailError('');
    } else if (!validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  }

  // ✅ Real-time password validation
  if (field === 'password') {
    if (!value) {
      setPasswordError('');
    } else if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  }
};


  const toggleArrayItem = (field: keyof FormData, item: string) => {
    const current = formData[field] as string[];
    updateField(
      field,
      current.includes(item) ? current.filter(i => i !== item) : [...current, item]
    );
  };

const handleNext = async () => {
  /* ================= STEP VALIDATIONS ================= */

  // STEP 0 – ABOUT YOU
  if (currentStep === 0) {
    if (!formData.email || !formData.password || !formData.full_name) {
      setError('Please fill all required fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      setError('Please enter a valid age');
      return;
    }
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (!formData.blood_type) {
      setError('Please select your blood type');
      return;
    }


    if (!formData.gender) {
      setError('Please select your gender');
      return;
    }

    if (!formData.marital_status) {
      setError('Please select your marital status');
      return;
    }
  }

  // STEP 1 – CHECKUP REASON
  if (currentStep === 1) {
    if (!formData.checkup_reason) {
      setError('Please select a reason for checkup');
      return;
    }

    if (
      formData.checkup_reason === 'I have a specific problem' &&
      !formData.specific_problem.trim()
    ) {
      setError('Please describe your specific problem');
      return;
    }
  }

  // STEP 2 – MEDICAL HISTORY
  if (currentStep === 2) {
    if (formData.taking_medicines && !formData.medicine_names.trim()) {
      setError('Please mention the medicines you are taking');
      return;
    }

    if (formData.had_surgery && !formData.surgery_details.trim()) {
      setError('Please provide surgery details');
      return;
    }

    if (
      formData.allergies.length > 0 &&
      !formData.allergies.includes('None') &&
      !formData.other_allergy.trim()
    ) {
      setError('Please specify your other allergies');
      return;
    }
  }

  // STEP 3 – SYMPTOMS
  if (currentStep === 3) {
    const symptomGroups = [
      formData.head_mind_symptoms,
      formData.eye_ear_mouth_symptoms,
      formData.chest_heart_symptoms,
      formData.stomach_digestive_symptoms,
      formData.urinary_symptoms,
    ];

    const invalid = symptomGroups.some(group => group.length === 0);

    if (invalid) {
      setError('Please select symptoms or choose "None" in each section');
      return;
    }
  }

  // STEP 4 – LIFESTYLE
  if (currentStep === 4) {
    if (!formData.diet) {
      setError('Please select your diet');
      return;
    }

    if (!formData.activity_level) {
      setError('Please select your activity level');
      return;
    }

    if (
      formData.habits.length > 0 &&
      !formData.habits.includes('None') &&
      !formData.other_habit.trim()
    ) {
      setError('Please specify your other habits');
      return;
    }
  }

  // STEP 5 – FAMILY HISTORY
  if (currentStep === 5 && formData.family_history.length === 0) {
    setError('Please select at least one family history option');
    return;
  }

  // STEP 6 – MENTAL WELLBEING
  if (currentStep === 6 && formData.mental_wellbeing.length === 0) {
    setError('Please select at least one option');
    return;
  }

  /* ================= NAVIGATION ================= */

  setError('');
  setEmailError('');

  if (currentStep < steps.length - 1) {
    setCurrentStep(currentStep + 1);
    return;
  }

  /* ================= SUBMIT ================= */

  const signupData: SignupData = {
    email: formData.email,
    password: formData.password,
    full_name: formData.full_name,
    age: parseInt(formData.age) || 0,
    phone: formData.phone,        
    blood_type: formData.blood_type,
    gender: formData.gender.toLowerCase() as 'male' | 'female' | 'other',
    marital_status: formData.marital_status,
    checkup_reason: formData.checkup_reason,
    specific_problem: formData.specific_problem,
    taking_medicines: formData.taking_medicines,
    medicine_names: formData.medicine_names,
    allergies: formData.allergies,
    other_allergy: formData.other_allergy,
    had_surgery: formData.had_surgery,
    surgery_details: formData.surgery_details,
    head_mind_symptoms: formData.head_mind_symptoms,
    eye_ear_mouth_symptoms: formData.eye_ear_mouth_symptoms,
    chest_heart_symptoms: formData.chest_heart_symptoms,
    stomach_digestive_symptoms: formData.stomach_digestive_symptoms,
    urinary_symptoms: formData.urinary_symptoms,
    habits: formData.habits,
    other_habit: formData.other_habit,
    diet: formData.diet,
    activity_level: formData.activity_level,
    family_history: formData.family_history,
    mental_wellbeing: formData.mental_wellbeing,
  };

  const result = await authService.signup(signupData);

  if (result.success) navigate('/home');
  else setError(result.error || 'Signup failed');
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Emergency Button */}
      <button
        onClick={() => navigate('/emergency')}
        className="fixed top-6 right-6 z-50 w-14 h-14 bg-[#DC2626] rounded-full shadow-2xl flex items-center justify-center hover:bg-[#B91C1C] transition-all hover:scale-110"
      >
        <Phone className="w-6 h-6 text-white" />
      </button>

      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : navigate('/login')}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Health Profile</h1>
              <p className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</p>
            </div>
            <Lock className="w-5 h-5 text-gray-400" />
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Steps */}
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <StepAbout
                formData={formData}
                updateField={updateField}
                emailError={emailError}
                passwordError={passwordError}
              />
            )}
            {currentStep === 1 && <StepReason key="reason" formData={formData} updateField={updateField} />}
            {currentStep === 2 && <StepHistory key="history" formData={formData} toggleArrayItem={toggleArrayItem} updateField={updateField} />}
            {currentStep === 3 && <StepSymptoms key="symptoms" formData={formData} toggleArrayItem={toggleArrayItem} />}
            {currentStep === 4 && <StepLifestyle key="lifestyle" formData={formData} toggleArrayItem={toggleArrayItem} updateField={updateField} />}
            {currentStep === 5 && <StepFamily key="family" formData={formData} toggleArrayItem={toggleArrayItem} />}
            {currentStep === 6 && <StepMental key="mental" formData={formData} toggleArrayItem={toggleArrayItem} />}
          </AnimatePresence>

          {/* Next Button */}
          <motion.button
            onClick={handleNext}
            className="w-full mt-8 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
            {currentStep === steps.length - 1 ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

/* ====================================================== 
   STEP COMPONENTS
====================================================== */

const StepAbout = ({ formData, updateField, emailError,passwordError }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="email"
          value={formData.email}
          onChange={e => updateField('email', e.target.value)}
          className={`w-full h-12 pl-12 pr-4 border-2 rounded-xl focus:outline-none transition-colors ${
            emailError 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-200 focus:border-blue-500'
          }`}
          placeholder="your.email@example.com"
        />
      </div>
      {emailError && (
        <p className="mt-1 text-sm text-red-600">{emailError}</p>
      )}
    </div>
    
    <Input
        label="Password *"
        type="password"
        value={formData.password}
        onChange={(v: string) => updateField('password', v)}
        placeholder="Minimum 6 characters"
      />

      {passwordError && (
        <p className="mt-1 text-sm text-red-500">{passwordError}</p>
      )}

    <Input 
      label="Full Name *" 
      value={formData.full_name} 
      onChange={(v: string) => updateField('full_name', v)}
      placeholder="John Doe"
    />
    <Input 
      label="Age" 
      type="number" 
      value={formData.age} 
      onChange={(v: string) => updateField('age', v)}
      placeholder="25"
    />
    <Input 
      label="Phone Number *"
      type="tel"
      value={formData.phone}
      onChange={(v: string) => updateField('phone', v)}
      placeholder="9876543210"
    />
    <SelectionGroup 
      label="Blood Group *"
      items={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
      selected={formData.blood_type ? [formData.blood_type] : []}
      toggle={(v: string) => updateField('blood_type', v)}
      single
    />


    <SelectionGroup 
      label="Gender" 
      items={['Male', 'Female', 'Other']} 
      selected={formData.gender ? [formData.gender] : []} 
      toggle={(v: string) => updateField('gender', v)} 
      single 
    />
    <SelectionGroup 
      label="Marital Status" 
      items={['Single', 'Married', 'Widowed']} 
      selected={formData.marital_status ? [formData.marital_status] : []} 
      toggle={(v: string) => updateField('marital_status', v)} 
      single 
    />
  </motion.div>
);

const StepReason = ({ formData, updateField }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <SelectionGroup
      label="Why are you here for a checkup?"
      items={['General health checkup', 'I have a specific problem', 'Follow-up visit', 'Routine screening']}
      selected={formData.checkup_reason ? [formData.checkup_reason] : []}
      toggle={(v: string) => updateField('checkup_reason', v)}
      single
    />
    {formData.checkup_reason === 'I have a specific problem' && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Please describe your problem</label>
        <textarea
          value={formData.specific_problem}
          onChange={(e) => updateField('specific_problem', e.target.value)}
          className="w-full h-24 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
          placeholder="Describe your symptoms or concerns..."
        />
      </div>
    )}
  </motion.div>
);

const StepHistory = ({ formData, toggleArrayItem, updateField }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <SelectionGroup
      label="Are you currently taking any medicines?"
      items={['Yes', 'No']}
      selected={formData.taking_medicines ? ['Yes'] : ['No']}
      toggle={(v: string) => updateField('taking_medicines', v === 'Yes')}
      single
    />
    {formData.taking_medicines && (
      <Input label="Medicine names" value={formData.medicine_names} onChange={(v: string) => updateField('medicine_names', v)} placeholder="e.g., Aspirin, Metformin" />
    )}

    <SelectionGroup
      label="Are you allergic to anything?"
      items={['Peanuts', 'Dairy', 'Gluten', 'Sea food', 'Eggs', 'Soy', 'Dust', 'Pollen', 'Penicillin', 'None']}
      selected={formData.allergies}
      toggle={(i: string) => toggleArrayItem('allergies', i)}
    />
    {formData.allergies.length > 0 && !formData.allergies.includes('None') && (
      <Input label="Other allergy (if any)" value={formData.other_allergy} onChange={(v: string) => updateField('other_allergy', v)} placeholder="Specify other allergies" />
    )}

    <SelectionGroup
      label="Have you had any major surgeries?"
      items={['Yes', 'No']}
      selected={formData.had_surgery ? ['Yes'] : ['No']}
      toggle={(v: string) => updateField('had_surgery', v === 'Yes')}
      single
    />
    {formData.had_surgery && (
      <Input label="Surgery details" value={formData.surgery_details} onChange={(v: string) => updateField('surgery_details', v)} placeholder="e.g., Appendectomy in 2020" />
    )}
  </motion.div>
);

const StepSymptoms = ({ formData, toggleArrayItem }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <SelectionGroup
      label="Head & Mind"
      items={['Frequent Headaches', 'Dizziness or giddiness', 'Memory problems or trouble concentrating', 'Trouble sleeping', 'None']}
      selected={formData.head_mind_symptoms}
      toggle={(i: string) => toggleArrayItem('head_mind_symptoms', i)}
    />

    <SelectionGroup
      label="Eyes, Ears & Mouth"
      items={['Blurry vision (or need new glasses)', 'Hearing loss', 'Tooth pain or mouth ulcers', 'Runny nose, sneezing, or blocked nose', 'None']}
      selected={formData.eye_ear_mouth_symptoms}
      toggle={(i: string) => toggleArrayItem('eye_ear_mouth_symptoms', i)}
    />

    <SelectionGroup
      label="Chest & Heart"
      items={['Chest pain', 'Shortness of breath (Dyspnoea)', 'Fast or fluttering heartbeat (Palpitations)', 'Cough or wheezing', 'Swelling in the feet', 'None']}
      selected={formData.chest_heart_symptoms}
      toggle={(i: string) => toggleArrayItem('chest_heart_symptoms', i)}
    />

    <SelectionGroup
      label="Stomach & Digestion"
      items={['Stomach pain', 'Gas, bloating, or heartburn (Dyspepsia/Flatulence)', 'Loss of appetite', 'Constipation or diarrhea', 'Piles or rectal bleeding', 'None']}
      selected={formData.stomach_digestive_symptoms}
      toggle={(i: string) => toggleArrayItem('stomach_digestive_symptoms', i)}
    />

    <SelectionGroup
      label="Urinary"
      items={['Burning sensation when urinating', 'Need to go very often (Frequency)', 'Difficulty controlling urine (Dribbling/Urgency)', 'Waking up at night to urinate often', 'None']}
      selected={formData.urinary_symptoms}
      toggle={(i: string) => toggleArrayItem('urinary_symptoms', i)}
    />
  </motion.div>
);

const StepLifestyle = ({ formData, toggleArrayItem, updateField }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <SelectionGroup
      label="Habits"
      items={['Smoking', 'Alcohol', 'Tobacco', 'Caffeine', 'None']}
      selected={formData.habits}
      toggle={(i: string) => toggleArrayItem('habits', i)}
    />
    {formData.habits.length > 0 && !formData.habits.includes('None') && (
      <Input label="Other habit (if any)" value={formData.other_habit} onChange={(v: string) => updateField('other_habit', v)} placeholder="Specify other habits" />
    )}

    <SelectionGroup
      label="Diet"
      items={['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian']}
      selected={[formData.diet]}
      toggle={(i: string) => updateField('diet', i)}
      single
    />

    <SelectionGroup
      label="Physical activity level"
      items={['Sedentary', 'Light activity (Walking)', 'Active (Exercise/Sports)']}
      selected={[formData.activity_level]}
      toggle={(i: string) => updateField('activity_level', i)}
      single
    />
  </motion.div>
);

const StepFamily = ({ formData, toggleArrayItem }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <SelectionGroup
      label="Family history of conditions"
      items={['Diabetes', 'High Blood Pressure (BP)', 'Heart Disease', 'Cancer', 'Asthma / Allergies', 'Stroke', 'None of the above']}
      selected={formData.family_history}
      toggle={(i: string) => toggleArrayItem('family_history', i)}
    />
  </motion.div>
);

const StepMental = ({ formData, toggleArrayItem }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <SelectionGroup
      label="Over the last 2 weeks, how have you been feeling?"
      items={['I feel normal/good', 'I feel anxious or worried often', 'I feel down, depressed, or hopeless', 'Trouble Sleeping']}
      selected={formData.mental_wellbeing}
      toggle={(i: string) => toggleArrayItem('mental_wellbeing', i)}
    />
  </motion.div>
);

/* ========================= UI HELPERS ========================= */

const Input = ({ label, value, onChange, type = 'text', placeholder = '' }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
    />
  </div>
);

const SelectionGroup = ({ label, items, selected, toggle, single = false }: any) => (
  <div>
    <p className="text-sm font-medium text-gray-700 mb-3">{label}</p>
    <div className="flex flex-wrap gap-2">
      {items.map((item: string) => (
        <button
          key={item}
          onClick={() => toggle(item)}
          className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
            selected.includes(item)
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  </div>
);