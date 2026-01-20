import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, AlertCircle, Plus } from 'lucide-react';

export const Allergies = () => {
  const navigate = useNavigate();

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

      {/* Empty State */}
      <div className="px-6 py-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          {/* Illustration */}
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#EA580C]/20 to-[#F59E0B]/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-16 h-16 text-[#EA580C]" />
          </div>

          {/* Empty State Text */}
          <h2 className="text-2xl font-bold text-[#1E293B] mb-3">
            No Allergy Data Available Yet
          </h2>
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            Keep track of your allergies and sensitivities to help healthcare providers give you better care
          </p>

          {/* Disabled Add Button */}
          <motion.button
            disabled
            className="px-8 py-4 bg-gray-200 text-gray-400 rounded-xl font-semibold flex items-center gap-2 mx-auto cursor-not-allowed opacity-60"
          >
            <Plus className="w-5 h-5" />
            <span>Add Allergy</span>
          </motion.button>

          <p className="text-sm text-gray-500 mt-4">
            This feature will be available after completing your health profile
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white rounded-2xl p-6 shadow-md border-l-4 border-[#EA580C]"
        >
          <h3 className="font-bold text-lg text-[#1E293B] mb-3">
            What to track?
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-[#EA580C] mt-1">•</span>
              <span>Food allergies (nuts, dairy, shellfish, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#EA580C] mt-1">•</span>
              <span>Medicine allergies (antibiotics, painkillers, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#EA580C] mt-1">•</span>
              <span>Environmental allergies (pollen, dust, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#EA580C] mt-1">•</span>
              <span>Skin sensitivities (latex, fragrances, etc.)</span>
            </li>
          </ul>
        </motion.div>

        {/* Link to Health Profile */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/health-profile')}
          className="w-full mt-6 h-14 bg-[#2563EB] text-white rounded-xl font-semibold hover:bg-[#1E40AF] transition-colors"
        >
          Go to Health Profile
        </motion.button>
      </div>
    </div>
  );
};
