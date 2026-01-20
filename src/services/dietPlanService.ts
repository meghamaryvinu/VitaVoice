// Personalized diet plan generator for VitaVoice

import type { UserProfile } from './authService';

export interface DietPlan {
    id: string;
    userId: string;
    generatedAt: Date;
    duration: '1_week' | '2_weeks' | '1_month';
    meals: DailyMeal[];
    nutritionGoals: NutritionGoals;
    restrictions: string[];
    recommendations: string[];
}

export interface DailyMeal {
    day: string;
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal[];
}

export interface Meal {
    name: string;
    ingredients: string[];
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    instructions?: string;
}

export interface NutritionGoals {
    dailyCalories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
}

class DietPlanService {
    /**
     * Generate personalized diet plan
     */
    generateDietPlan(user: UserProfile, duration: DietPlan['duration'] = '1_week'): DietPlan {
        // Analyze user health profile
        const restrictions = this.getRestrictions(user);
        const nutritionGoals = this.calculateNutritionGoals(user);
        const meals = this.generateMeals(user, duration, restrictions);

        return {
            id: Date.now().toString(),
            userId: user.id,
            generatedAt: new Date(),
            duration,
            meals,
            nutritionGoals,
            restrictions,
            recommendations: this.generateRecommendations(user),
        };
    }

    /**
     * Get dietary restrictions based on user profile
     */
    private getRestrictions(user: UserProfile): string[] {
        const restrictions: string[] = [];

        // Add allergies
        if (user.allergies) {
            restrictions.push(...user.allergies);
        }

        // Add restrictions based on chronic conditions
        if (user.chronicConditions) {
            user.chronicConditions.forEach(condition => {
                const lower = condition.toLowerCase();
                if (lower.includes('diabetes')) {
                    restrictions.push('high sugar', 'refined carbs', 'white rice');
                }
                if (lower.includes('hypertension') || lower.includes('blood pressure')) {
                    restrictions.push('high salt', 'pickles', 'processed foods');
                }
                if (lower.includes('heart') || lower.includes('cardiac')) {
                    restrictions.push('saturated fats', 'fried foods', 'red meat');
                }
                if (lower.includes('kidney')) {
                    restrictions.push('high protein', 'high potassium');
                }
            });
        }

        return restrictions;
    }

    /**
     * Calculate nutrition goals
     */
    private calculateNutritionGoals(user: UserProfile): NutritionGoals {
        // Base calculation on age, gender, and health conditions
        let baseCalories = 2000;

        if (user.gender === 'male') {
            baseCalories = 2200;
        } else if (user.gender === 'female') {
            baseCalories = 1800;
        }

        // Adjust for age
        if (user.age > 60) {
            baseCalories -= 200;
        } else if (user.age < 30) {
            baseCalories += 200;
        }

        // Adjust for chronic conditions
        const hasHeartDisease = user.chronicConditions?.some(c =>
            c.toLowerCase().includes('heart') || c.toLowerCase().includes('cardiac')
        );

        if (hasHeartDisease) {
            baseCalories -= 100;
        }

        return {
            dailyCalories: baseCalories,
            protein: Math.round(baseCalories * 0.15 / 4), // 15% of calories, 4 cal/g
            carbs: Math.round(baseCalories * 0.55 / 4), // 55% of calories
            fats: Math.round(baseCalories * 0.30 / 9), // 30% of calories, 9 cal/g
            fiber: 30, // grams
        };
    }

    /**
     * Generate meals
     */
    private generateMeals(user: UserProfile, duration: string, restrictions: string[]): DailyMeal[] {
        const days = duration === '1_week' ? 7 : duration === '2_weeks' ? 14 : 30;
        const meals: DailyMeal[] = [];

        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        for (let i = 0; i < days; i++) {
            const dayName = dayNames[i % 7];

            meals.push({
                day: `Day ${i + 1} (${dayName})`,
                breakfast: this.getBreakfast(restrictions),
                lunch: this.getLunch(restrictions),
                dinner: this.getDinner(restrictions),
                snacks: this.getSnacks(restrictions),
            });
        }

        return meals;
    }

    /**
     * Get breakfast options
     */
    private getBreakfast(restrictions: string[]): Meal {
        const breakfastOptions = [
            {
                name: 'Oats Porridge with Fruits',
                ingredients: ['Oats (50g)', 'Milk (200ml)', 'Banana (1)', 'Almonds (10)', 'Honey (1 tsp)'],
                calories: 350,
                protein: 12,
                carbs: 55,
                fats: 8,
            },
            {
                name: 'Idli with Sambar',
                ingredients: ['Idli (3 pieces)', 'Sambar (1 bowl)', 'Coconut chutney (2 tbsp)', 'Curry leaves'],
                calories: 320,
                protein: 10,
                carbs: 60,
                fats: 4,
            },
            {
                name: 'Vegetable Poha',
                ingredients: ['Poha (100g)', 'Mixed vegetables (50g)', 'Peanuts (20g)', 'Curry leaves', 'Mustard seeds'],
                calories: 340,
                protein: 8,
                carbs: 58,
                fats: 10,
            },
            {
                name: 'Moong Dal Cheela',
                ingredients: ['Moong dal (100g)', 'Onion (1)', 'Tomato (1)', 'Green chili (1)', 'Coriander leaves'],
                calories: 300,
                protein: 15,
                carbs: 45,
                fats: 6,
            },
        ];

        return this.filterMeal(breakfastOptions, restrictions);
    }

    /**
     * Get lunch options
     */
    private getLunch(restrictions: string[]): Meal {
        const lunchOptions = [
            {
                name: 'Brown Rice with Dal and Vegetables',
                ingredients: ['Brown rice (150g)', 'Moong dal (100g)', 'Mixed vegetables (100g)', 'Salad', 'Curd (100g)'],
                calories: 520,
                protein: 18,
                carbs: 85,
                fats: 10,
            },
            {
                name: 'Roti with Paneer Curry',
                ingredients: ['Whole wheat roti (3)', 'Paneer (100g)', 'Tomato gravy', 'Green salad', 'Buttermilk'],
                calories: 550,
                protein: 22,
                carbs: 70,
                fats: 18,
            },
            {
                name: 'Quinoa Pulao with Raita',
                ingredients: ['Quinoa (150g)', 'Mixed vegetables (100g)', 'Curd (150g)', 'Cucumber', 'Spices'],
                calories: 480,
                protein: 16,
                carbs: 75,
                fats: 12,
            },
            {
                name: 'Vegetable Khichdi',
                ingredients: ['Rice (100g)', 'Moong dal (50g)', 'Mixed vegetables (100g)', 'Ghee (1 tsp)', 'Curd'],
                calories: 450,
                protein: 14,
                carbs: 78,
                fats: 8,
            },
        ];

        return this.filterMeal(lunchOptions, restrictions);
    }

    /**
     * Get dinner options
     */
    private getDinner(restrictions: string[]): Meal {
        const dinnerOptions = [
            {
                name: 'Vegetable Soup with Roti',
                ingredients: ['Mixed vegetable soup (300ml)', 'Whole wheat roti (2)', 'Grilled vegetables', 'Salad'],
                calories: 380,
                protein: 12,
                carbs: 60,
                fats: 8,
            },
            {
                name: 'Dal Tadka with Rice',
                ingredients: ['Toor dal (100g)', 'Brown rice (100g)', 'Ghee (1 tsp)', 'Salad', 'Lemon'],
                calories: 420,
                protein: 16,
                carbs: 68,
                fats: 10,
            },
            {
                name: 'Palak Paneer with Roti',
                ingredients: ['Spinach (200g)', 'Paneer (80g)', 'Whole wheat roti (2)', 'Salad'],
                calories: 450,
                protein: 20,
                carbs: 55,
                fats: 16,
            },
            {
                name: 'Mixed Vegetable Curry with Millet',
                ingredients: ['Millet (150g)', 'Mixed vegetables (150g)', 'Coconut (20g)', 'Spices', 'Curd'],
                calories: 400,
                protein: 12,
                carbs: 70,
                fats: 9,
            },
        ];

        return this.filterMeal(dinnerOptions, restrictions);
    }

    /**
     * Get snack options
     */
    private getSnacks(restrictions: string[]): Meal[] {
        const snackOptions = [
            {
                name: 'Fruit Salad',
                ingredients: ['Apple (1)', 'Banana (1)', 'Orange (1)', 'Pomegranate (50g)'],
                calories: 150,
                protein: 2,
                carbs: 38,
                fats: 1,
            },
            {
                name: 'Roasted Chana',
                ingredients: ['Roasted chickpeas (50g)', 'Lemon juice', 'Chaat masala'],
                calories: 180,
                protein: 8,
                carbs: 30,
                fats: 3,
            },
            {
                name: 'Vegetable Sandwich',
                ingredients: ['Whole wheat bread (2 slices)', 'Cucumber', 'Tomato', 'Lettuce', 'Mint chutney'],
                calories: 200,
                protein: 6,
                carbs: 35,
                fats: 4,
            },
        ];

        return [this.filterMeal(snackOptions, restrictions)];
    }

    /**
     * Filter meal based on restrictions
     */
    private filterMeal(options: Meal[], restrictions: string[]): Meal {
        // Filter out meals with restricted ingredients
        const filtered = options.filter(meal => {
            return !meal.ingredients.some(ingredient =>
                restrictions.some(restriction =>
                    ingredient.toLowerCase().includes(restriction.toLowerCase())
                )
            );
        });

        // Return random meal from filtered options, or first option if all filtered
        const availableOptions = filtered.length > 0 ? filtered : options;
        return availableOptions[Math.floor(Math.random() * availableOptions.length)];
    }

    /**
     * Generate recommendations
     */
    private generateRecommendations(user: UserProfile): string[] {
        const recommendations: string[] = [
            'Drink at least 8 glasses of water daily',
            'Eat meals at regular times',
            'Include seasonal fruits and vegetables',
        ];

        // Add condition-specific recommendations
        if (user.chronicConditions) {
            user.chronicConditions.forEach(condition => {
                const lower = condition.toLowerCase();
                if (lower.includes('diabetes')) {
                    recommendations.push('Monitor blood sugar before and after meals');
                    recommendations.push('Avoid skipping meals');
                    recommendations.push('Choose whole grains over refined grains');
                }
                if (lower.includes('hypertension')) {
                    recommendations.push('Limit salt intake to less than 5g per day');
                    recommendations.push('Avoid processed and packaged foods');
                }
                if (lower.includes('heart')) {
                    recommendations.push('Include omega-3 rich foods (walnuts, flaxseeds)');
                    recommendations.push('Limit saturated fats');
                    recommendations.push('Exercise for 30 minutes daily');
                }
            });
        }

        return recommendations;
    }

    /**
     * Save diet plan
     */
    saveDietPlan(plan: DietPlan): void {
        const saved = localStorage.getItem('vitavoice_diet_plans');
        const plans = saved ? JSON.parse(saved) : [];
        plans.push(plan);
        localStorage.setItem('vitavoice_diet_plans', JSON.stringify(plans));
    }

    /**
     * Get user diet plans
     */
    getUserDietPlans(userId: string): DietPlan[] {
        const saved = localStorage.getItem('vitavoice_diet_plans');
        if (!saved) return [];

        const plans = JSON.parse(saved, (key, value) => {
            if (key === 'generatedAt') return new Date(value);
            return value;
        });

        return plans.filter((p: DietPlan) => p.userId === userId);
    }
}

export const dietPlanService = new DietPlanService();
