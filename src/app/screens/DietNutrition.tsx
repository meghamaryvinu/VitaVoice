import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Apple, TrendingUp, Calendar, Heart } from 'lucide-react';

export const DietNutrition = () => {
  const navigate = useNavigate();

  const placeholderCards = [
    { icon: Apple, title: 'Diet Plan', description: 'Personalized meal recommendations' },
    { icon: TrendingUp, title: 'Calorie Tracking', description: 'Monitor your daily intake' },
    { icon: Calendar, title: 'Meal Schedule', description: 'Plan your meals ahead' },
    { icon: Heart, title: 'Nutrition Goals', description: 'Track vitamins & minerals' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0FDF4] to-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </motion.button>
        <h1 className="text-xl font-bold text-[#1E293B]">Diet & Nutrition</h1>
      </div>

      {/* Hero Section */}
      <div className="px-6 py-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#059669] to-[#10B981] rounded-full flex items-center justify-center shadow-xl">
            <Apple className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E293B] mb-3">
            Coming Soon
          </h2>
          <p className="text-gray-600 max-w-sm mx-auto">
            Personalized diet recommendations will appear here based on your health profile
          </p>
        </motion.div>

        {/* Placeholder Feature Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {placeholderCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 relative overflow-hidden"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#059669]/5 to-transparent" />
              
              <div className="relative">
                <div className="w-12 h-12 bg-[#059669]/10 rounded-xl flex items-center justify-center mb-3">
                  <card.icon className="w-6 h-6 text-[#059669]" />
                </div>
                <h3 className="font-bold text-[#1E293B] mb-1">{card.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-md"
        >
          <h3 className="font-bold text-lg text-[#1E293B] mb-4">
            What's Coming?
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-[#1E293B] mb-1">Customized Diet Charts</h4>
                <p className="text-sm text-gray-600">Based on your age, health conditions, and activity level</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-[#1E293B] mb-1">Calorie Intake Tracking</h4>
                <p className="text-sm text-gray-600">Monitor what you eat and get smart recommendations</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-[#1E293B] mb-1">Nutrient Guidelines</h4>
                <p className="text-sm text-gray-600">Essential vitamins, minerals, and macronutrients for you</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-[#1E293B] mb-1">Regional Recipes</h4>
                <p className="text-sm text-gray-600">Healthy traditional Indian recipes tailored to your needs</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 bg-gradient-to-r from-[#059669] to-[#10B981] rounded-2xl p-6 text-white text-center shadow-lg"
        >
          <h3 className="font-bold text-lg mb-2">Stay Tuned!</h3>
          <p className="text-sm text-white/90">
            We're working hard to bring you the best nutrition guidance. Complete your health profile to get personalized recommendations when this feature launches.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/health-profile')}
          className="w-full mt-6 h-14 bg-[#2563EB] text-white rounded-xl font-semibold shadow-lg hover:bg-[#1E40AF] transition-colors"
        >
          Complete Health Profile
        </motion.button>
      </div>
    </div>
  );
};
