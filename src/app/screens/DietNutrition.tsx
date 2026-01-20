import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Apple, TrendingUp, Calendar, Heart, ChevronRight, Info, AlertCircle } from 'lucide-react';
import { dietPlanService, type DietPlan, type DailyMeal } from '@/services/dietPlanService';
import { authService, type UserProfile } from '@/services/authService';

export const DietNutrition = () => {
  const navigate = useNavigate();
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadDietPlan();
  }, []);

  const loadDietPlan = () => {
    setLoading(true);
    // Try to get user from auth service
    let currentUser = authService.getCurrentUser();

    // Fallback: Try to get from legacy signup data if auth user not found
    if (!currentUser) {
      const legacyData = localStorage.getItem('vitavoice_user_data');
      if (legacyData) {
        const parsed = JSON.parse(legacyData);
        // Convert legacy data to UserProfile format temporarily
        currentUser = {
          id: 'legacy_user',
          email: 'user@example.com',
          name: parsed.name || 'User',
          age: parseInt(parsed.age) || 30,
          gender: (parsed.sex?.toLowerCase() as any) || 'male',
          bloodType: 'O+',
          phoneNumber: '',
          allergies: parsed.allergies ? [parsed.allergies] : [],
          chronicConditions: parsed.history ? [parsed.history] : [],
          medications: [],
          createdAt: new Date(),
        };
      }
    }

    setUser(currentUser);

    if (currentUser) {
      // Generate a new plan or load existing
      // For now, we'll generate a fresh one to ensure it reflects latest profile
      const plan = dietPlanService.generateDietPlan(currentUser, '1_week');
      setDietPlan(plan);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#059669]"></div>
      </div>
    );
  }

  if (!user || !dietPlan) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Apple className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-[#1E293B] mb-2">Profile Needed</h2>
        <p className="text-gray-600 mb-6">
          Please complete your health profile to get a personalized diet plan tailored to your needs.
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="px-6 py-3 bg-[#059669] text-white rounded-xl font-medium"
        >
          Complete Profile
        </button>
        <button
          onClick={() => navigate('/home')}
          className="mt-4 text-gray-500 font-medium"
        >
          Go Home
        </button>
      </div>
    );
  }

  const currentMeal = dietPlan.meals[selectedDay];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
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

      <div className="px-4 py-6 space-y-6">
        {/* Nutrition Goals Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-[#059669] to-[#10B981] rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{dietPlan.nutritionGoals.dailyCalories}</h2>
              <p className="text-white/80 text-sm">Daily Calorie Target</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="text-lg font-bold">{dietPlan.nutritionGoals.protein}g</div>
              <div className="text-xs text-white/80">Protein</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="text-lg font-bold">{dietPlan.nutritionGoals.carbs}g</div>
              <div className="text-xs text-white/80">Carbs</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="text-lg font-bold">{dietPlan.nutritionGoals.fats}g</div>
              <div className="text-xs text-white/80">Fats</div>
            </div>
          </div>
        </motion.div>

        {/* Restrictions & Recommendations */}
        {(dietPlan.restrictions.length > 0 || dietPlan.recommendations.length > 0) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#1E293B] mb-2">Personalized for You</h3>
                {dietPlan.restrictions.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Restrictions:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {dietPlan.restrictions.map((r, i) => (
                        <span key={i} className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-md border border-red-100">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {dietPlan.recommendations.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tips:</span>
                    <ul className="mt-1 space-y-1">
                      {dietPlan.recommendations.slice(0, 2).map((r, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mt-1.5 flex-shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Day Selector */}
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
          {dietPlan.meals.map((meal, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedDay === index
                  ? 'bg-[#059669] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200'
                }`}
            >
              Day {index + 1}
            </button>
          ))}
        </div>

        {/* Meal Plan */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-[#1E293B] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#059669]" />
            {currentMeal.day}
          </h3>

          <MealCard
            title="Breakfast"
            meal={currentMeal.breakfast}
            color="#F59E0B"
            delay={0.2}
          />
          <MealCard
            title="Lunch"
            meal={currentMeal.lunch}
            color="#EA580C"
            delay={0.3}
          />
          <MealCard
            title="Dinner"
            meal={currentMeal.dinner}
            color="#2563EB"
            delay={0.4}
          />

          {currentMeal.snacks.length > 0 && (
            <MealCard
              title="Snacks"
              meal={currentMeal.snacks[0]}
              color="#8B5CF6"
              delay={0.5}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const MealCard = ({ title, meal, color, delay }: { title: string, meal: any, color: string, delay: number }) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay }}
    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-3 h-8 rounded-full" style={{ backgroundColor: color }} />
        <div>
          <h4 className="font-bold text-[#1E293B]">{title}</h4>
          <p className="text-sm text-gray-500">{meal.calories} kcal</p>
        </div>
      </div>
      <div className="px-2 py-1 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 border border-gray-100">
        P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
      </div>
    </div>

    <div className="pl-5">
      <h5 className="font-medium text-[#1E293B] mb-2">{meal.name}</h5>
      <div className="flex flex-wrap gap-2">
        {meal.ingredients.map((ing: string, i: number) => (
          <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100">
            {ing}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);
