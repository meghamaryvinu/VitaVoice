import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Phone, Lock, Check } from 'lucide-react';

/* =========================
   FORM DATA
========================= */
interface FormData {
  // Patient Details
  name: string;
  age: string;
  sex: string;

  // Health Problems
  allergies: string;
  history: string;
  chiefComplaints: string;
  presentIllness: string;

  // Body Systems
  cvs: string[];
  rs: string[];
  dental: string;
  gyn: string;
  eyes: string;
  ent: string;

  // Past & Social Life
  pastMedical: string;
  pastSurgical: string;
  habits: string[];
  children: string;

  // Family
  familyHistory: string[];

  // Check-up Notes
  generalExam: string;
  cvsExam: string;
  rsExam: string;
  abdomen: string;
  psychological: string;
}

/* =========================
   MAIN COMPONENT
========================= */
export const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    sex: '',

    allergies: '',
    history: '',
    chiefComplaints: '',
    presentIllness: '',

    cvs: [],
    rs: [],
    dental: '',
    gyn: '',
    eyes: '',
    ent: '',

    pastMedical: '',
    pastSurgical: '',
    habits: [],
    children: '',

    familyHistory: [],

    generalExam: '',
    cvsExam: '',
    rsExam: '',
    abdomen: '',
    psychological: ''
  });

  const steps = [
    'Your Details',
    'Your Health Problem',
    'Body Symptoms',
    'Past & Daily Life',
    'Family Health',
    'Health Worker Notes'
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

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('vitavoice_user_data', JSON.stringify(formData));
      navigate('/home');
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
          <h1 className="text-lg font-bold text-[#1E293B]">Health Check</h1>
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
              className={`flex-1 h-1.5 rounded-full ${
                i <= currentStep ? 'bg-[#2563EB]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm mt-2">{steps[currentStep]}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {currentStep === 0 && <Step1 formData={formData} updateField={updateField} />}
          {currentStep === 1 && <Step2 formData={formData} updateField={updateField} />}
          {currentStep === 2 && (
            <Step3
              formData={formData}
              toggleArrayItem={toggleArrayItem}
              updateField={updateField}
            />
          )}
          {currentStep === 3 && (
            <Step4
              formData={formData}
              updateField={updateField}
              toggleArrayItem={toggleArrayItem}
            />
          )}
          {currentStep === 4 && (
            <Step5 formData={formData} toggleArrayItem={toggleArrayItem} />
          )}
          {currentStep === 5 && (
            <Step6 formData={formData} updateField={updateField} />
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-white px-6 py-4 border-t">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full h-14 rounded-xl font-semibold bg-[#2563EB] text-white flex items-center justify-center gap-2"
        >
          {currentStep === steps.length - 1 ? 'Save Details' : 'Next'}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

/* =========================
   STEPS
========================= */

const Step1 = ({ formData, updateField }: any) => (
  <motion.div className="space-y-4">
    <Input label="What is your full name?" value={formData.name} onChange={v => updateField('name', v)} />
    <Input label="How old are you?" value={formData.age} onChange={v => updateField('age', v)} />

    <div>
      <label className="block text-sm font-medium mb-2">Are you male or female?</label>
      <div className="flex gap-3">
        {['Male', 'Female'].map(s => (
          <button
            key={s}
            onClick={() => updateField('sex', s)}
            className={`flex-1 h-12 rounded-xl ${
              formData.sex === s ? 'bg-[#2563EB] text-white' : 'border-2'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  </motion.div>
);

const Step2 = ({ formData, updateField }: any) => (
  <motion.div className="space-y-4">
    <Textarea label="Do you have any allergy to food or medicine?" value={formData.allergies} onChange={v => updateField('allergies', v)} />
    <Textarea label="Have you been sick before? Please explain." value={formData.history} onChange={v => updateField('history', v)} />
    <Textarea label="What problem are you facing now?" value={formData.chiefComplaints} onChange={v => updateField('chiefComplaints', v)} />
    <Textarea label="When did this problem start and how did it begin?" value={formData.presentIllness} onChange={v => updateField('presentIllness', v)} />
  </motion.div>
);

const Step3 = ({ formData, toggleArrayItem, updateField }: any) => (
  <motion.div className="space-y-4">
    <Checklist label="Do you have any of these problems?" items={['Chest pain', 'Breathlessness', 'Fast heartbeat', 'Swelling of legs']} selected={formData.cvs} toggle={i => toggleArrayItem('cvs', i)} />
    <Checklist label="Do you have breathing or nose problems?" items={['Cold / Sneezing', 'Running nose', 'Cough', 'Wheezing']} selected={formData.rs} toggle={i => toggleArrayItem('rs', i)} />
    <Textarea label="Do you have any teeth or mouth problem?" value={formData.dental} onChange={v => updateField('dental', v)} />
    <Textarea label="Any menstrual or women's health problems?" value={formData.gyn} onChange={v => updateField('gyn', v)} />
    <Input label="Any problem with eyesight or wearing glasses?" value={formData.eyes} onChange={v => updateField('eyes', v)} />
    <Input label="Any hearing problem or ear pain?" value={formData.ent} onChange={v => updateField('ent', v)} />
  </motion.div>
);

const Step4 = ({ formData, updateField, toggleArrayItem }: any) => (
  <motion.div className="space-y-4">
    <Textarea label="Have you had any long-term illness before?" value={formData.pastMedical} onChange={v => updateField('pastMedical', v)} />
    <Textarea label="Have you ever had any operation or surgery?" value={formData.pastSurgical} onChange={v => updateField('pastSurgical', v)} />
    <Checklist label="Do you have any of these habits?" items={['Smoking', 'Chewing tobacco', 'Alcohol']} selected={formData.habits} toggle={i => toggleArrayItem('habits', i)} />
    <Input label="How many children do you have?" value={formData.children} onChange={v => updateField('children', v)} />
  </motion.div>
);

const Step5 = ({ formData, toggleArrayItem }: any) => (
  <motion.div className="space-y-4">
    <Checklist label="Does anyone in your family have these illnesses?" items={['Diabetes', 'Heart disease', 'Cancer', 'High blood pressure', 'Fits / epilepsy']} selected={formData.familyHistory} toggle={i => toggleArrayItem('familyHistory', i)} />
  </motion.div>
);

const Step6 = ({ formData, updateField }: any) => (
  <motion.div className="space-y-4">
    <Textarea label="General check-up notes" value={formData.generalExam} onChange={v => updateField('generalExam', v)} />
    <Textarea label="Heart and blood pressure notes" value={formData.cvsExam} onChange={v => updateField('cvsExam', v)} />
    <Textarea label="Lungs and breathing notes" value={formData.rsExam} onChange={v => updateField('rsExam', v)} />
    <Textarea label="Stomach or abdominal notes" value={formData.abdomen} onChange={v => updateField('abdomen', v)} />

    <div>
      <label className="block text-sm font-medium mb-2">Patient mental state</label>
      <div className="flex gap-3">
        {['Normal', 'Anxious', 'Depressed'].map(p => (
          <button
            key={p}
            onClick={() => updateField('psychological', p)}
            className={`px-4 py-2 rounded-xl ${
              formData.psychological === p ? 'bg-[#2563EB] text-white' : 'border-2'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  </motion.div>
);

/* =========================
   UI HELPERS
========================= */

const Input = ({ label, value, onChange }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input value={value} onChange={e => onChange(e.target.value)} className="w-full h-12 px-4 border-2 rounded-xl" />
  </div>
);

const Textarea = ({ label, value, onChange }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className="w-full px-4 py-3 border-2 rounded-xl" />
  </div>
);

const Checklist = ({ label, items, selected, toggle }: any) => (
  <div>
    <p className="text-sm font-medium mb-2">{label}</p>
    <div className="flex flex-wrap gap-3">
      {items.map((i: string) => (
        <button
          key={i}
          onClick={() => toggle(i)}
          className={`px-4 py-2 rounded-full ${
            selected.includes(i) ? 'bg-[#2563EB] text-white' : 'border-2'
          }`}
        >
          {selected.includes(i) && <Check className="inline w-4 h-4 mr-1" />}
          {i}
        </button>
      ))}
    </div>
  </div>
);
