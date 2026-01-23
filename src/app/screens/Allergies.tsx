import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  AlertCircle,
  Plus,
  Trash2,
  Pill,
  ShieldAlert
} from 'lucide-react';
import { supabase } from '@/config/supabase';

/* -------------------- CONSTANTS -------------------- */

const ALLERGY_OPTIONS = [
  'Peanuts',
  'Dairy',
  'Gluten',
  'Sea food',
  'Eggs',
  'Soy',
  'Dust',
  'Pollen',
  'Penicillin',
  'None'
];

const ALLERGY_SUGGESTIONS: Record<string, string[]> = {
  Peanuts: [
    'Strictly avoid peanuts and peanut-derived products',
    'Check ingredient lists for hidden peanut sources',
    'Ask about cooking oils when eating out',
    'Carry an epinephrine auto-injector if prescribed',
    'Wear a medical alert bracelet for severe allergy'
  ],

  Dairy: [
    'Choose plant-based or lactose-free alternatives',
    'Check labels for milk proteins like casein and whey',
    'Be cautious with baked goods and creamy sauces',
    'Ensure adequate calcium and vitamin D from other sources',
    'Inform restaurants about dairy intolerance or allergy'
  ],

  Gluten: [
    'Choose foods labeled “certified gluten-free”',
    'Avoid cross-contamination from shared cooking surfaces',
    'Be cautious with sauces, soups, and processed foods',
    'Use separate utensils and toasters at home if needed',
    'Consult a dietitian for balanced gluten-free nutrition'
  ],

  'Sea food': [
    'Avoid all forms of the specific seafood you are allergic to',
    'Ask about shared grills, fryers, and cooking equipment',
    'Avoid seafood markets due to airborne exposure',
    'Always inform restaurant staff before ordering',
    'Carry emergency medication if reactions are severe'
  ],

  Eggs: [
    'Avoid foods containing raw or lightly cooked eggs',
    'Watch for egg in baked goods, dressings, and sauces',
    'Check vaccine and medication ingredients if advised by a doctor',
    'Use egg substitutes when cooking or baking at home',
    'Read labels carefully for albumin or egg powder'
  ],

  Soy: [
    'Check packaged foods for soy lecithin and soy protein',
    'Be cautious with Asian sauces and processed meats',
    'Choose soy-free alternatives when available',
    'Ask restaurants about marinades and cooking oils',
    'Read nutrition labels even on “healthy” foods'
  ],

  Dust: [
    'Use HEPA air purifiers indoors',
    'Wash bedding weekly in hot water',
    'Vacuum regularly using a HEPA-filter vacuum',
    'Reduce clutter that collects dust',
    'Use allergen-proof mattress and pillow covers'
  ],

  Pollen: [
    'Monitor daily pollen forecasts',
    'Keep windows closed during high pollen seasons',
    'Shower and change clothes after outdoor activities',
    'Wear sunglasses or masks when outdoors',
    'Dry clothes indoors to avoid pollen buildup'
  ],

  Penicillin: [
    'Always inform healthcare providers about the allergy',
    'Carry a medical alert card or bracelet',
    'Avoid self-medicating with antibiotics',
    'Ask about safe alternative antibiotics',
    'Check medication labels carefully for related drugs'
  ]
};


/* -------------------- TYPES -------------------- */

interface Allergy {
  name: string;
  severe_attack: boolean;
  medication: string;
}

/* -------------------- COMPONENT -------------------- */

export const Allergies = () => {
  const navigate = useNavigate();

  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [selectedAllergy, setSelectedAllergy] = useState('');
  const [severeAttack, setSevereAttack] = useState(false);
  const [medication, setMedication] = useState('');
  const [loading, setLoading] = useState(true);

  /* -------------------- HELPERS -------------------- */

  const getUserId = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user?.id;
  };

  /* -------------------- FETCH EXISTING DATA -------------------- */

  const fetchAllergies = async () => {
    try {
      const userId = await getUserId();
      if (!userId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('patient_health_records')
        .select('allergies, other_allergy')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching allergies:', error);
        setLoading(false);
        return;
      }

      // Convert the allergies array from patient_health_records into the format we need
      const allergyList: Allergy[] = [];
      
      if (data?.allergies && Array.isArray(data.allergies)) {
        data.allergies.forEach((allergyName: string) => {
          allergyList.push({
            name: allergyName,
            severe_attack: false,
            medication: ''
          });
        });
      }

      // Add other_allergy if it exists
      if (data?.other_allergy) {
        allergyList.push({
          name: data.other_allergy,
          severe_attack: false,
          medication: ''
        });
      }

      setAllergies(allergyList);
    } catch (error) {
      console.error('Error in fetchAllergies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllergies();
  }, []);

  /* -------------------- ADD ALLERGY -------------------- */

  const addAllergy = async () => {
    if (!selectedAllergy) {
      alert('Please select an allergy');
      return;
    }

    // Check if already exists
    if (allergies.some(a => a.name === selectedAllergy)) {
      alert('This allergy is already added');
      return;
    }

    const userId = await getUserId();
    if (!userId) return;

    const newAllergy: Allergy = {
      name: selectedAllergy,
      severe_attack: severeAttack,
      medication
    };

    const updatedAllergies = [...allergies, newAllergy];

    // Update the allergies array in patient_health_records
    const allergyNames = updatedAllergies.map(a => a.name);

    const { error } = await supabase
      .from('patient_health_records')
      .update({ allergies: allergyNames })
      .eq('user_id', userId);

    if (error) {
      console.error('Error adding allergy:', error);
      alert('Failed to add allergy');
      return;
    }

    setAllergies(updatedAllergies);
    setSelectedAllergy('');
    setSevereAttack(false);
    setMedication('');
    alert('Allergy added successfully!');
  };

  /* -------------------- DELETE ALLERGY -------------------- */

  const deleteAllergy = async (name: string) => {
    if (!confirm('Are you sure you want to delete this allergy?')) return;

    const userId = await getUserId();
    if (!userId) return;

    const updated = allergies.filter(a => a.name !== name);
    const allergyNames = updated.map(a => a.name);

    const { error } = await supabase
      .from('patient_health_records')
      .update({ allergies: allergyNames })
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting allergy:', error);
      alert('Failed to delete allergy');
      return;
    }

    setAllergies(updated);
    alert('Allergy deleted successfully!');
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/health-profile')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </motion.button>
        <h1 className="text-xl font-bold text-[#1E293B]">Allergies</h1>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Add Allergy */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#2563EB]" />
            Add Allergy
          </h3>

          <div className="space-y-4">
            <select
              value={selectedAllergy}
              onChange={e => setSelectedAllergy(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="">Select allergy</option>
              {ALLERGY_OPTIONS.filter(a => a !== 'None').map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={severeAttack}
                onChange={e => setSevereAttack(e.target.checked)}
                className="w-4 h-4"
              />
              <ShieldAlert className="w-5 h-5 text-red-500" />
              Severe allergic attack in the past
            </label>

            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-green-600" />
              <input
                type="text"
                placeholder="Current medication (optional)"
                value={medication}
                onChange={e => setMedication(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={addAllergy}
              className="w-full h-12 bg-[#2563EB] text-white rounded-xl font-semibold hover:bg-[#1d4ed8] transition-colors"
            >
              Add Allergy
            </motion.button>
          </div>
        </div>

        {/* Allergy List */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
            <p className="text-gray-500">Loading allergies…</p>
          </div>
        ) : allergies.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
            <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">No allergies added yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your allergies to keep track</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allergies.map(allergy => (
              <div key={allergy.name} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1E293B]">{allergy.name}</h4>
                    {allergy.severe_attack && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <ShieldAlert className="w-4 h-4" />
                        Severe reaction reported
                      </p>
                    )}
                    {allergy.medication && (
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                        <Pill className="w-4 h-4" />
                        Medication: {allergy.medication}
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteAllergy(allergy.name)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Suggestions */}
                {ALLERGY_SUGGESTIONS[allergy.name] && (
                  <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="font-semibold text-sm mb-2 text-[#2563EB]">💡 Suggestions</p>
                    <ul className="text-sm space-y-1 text-gray-700">
                      {ALLERGY_SUGGESTIONS[allergy.name].map((tip, i) => (
                        <li key={i}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};