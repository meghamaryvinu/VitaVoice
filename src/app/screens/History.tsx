import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Search } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';

export const History = () => {
  const navigate = useNavigate();
  const { medicalHistory } = useApp();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#DC2626';
      case 'medium': return '#F59E0B';
      case 'low': return '#059669';
      default: return '#6B7280';
    }
  };

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
        <h1 className="text-xl font-bold text-[#1E293B]">Medical History</h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="ml-auto w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <Search className="w-6 h-6 text-gray-600" />
        </motion.button>
      </div>

      <div className="px-6 py-6">
        {medicalHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Clock className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No History Yet</h3>
            <p className="text-gray-500">Your medical consultations will appear here</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {medicalHistory.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#1E293B]">{entry.complaint}</h3>
                    <p className="text-sm text-gray-600 mt-1">{entry.diagnosis}</p>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getSeverityColor(entry.severity) }}
                  />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{entry.duration}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
