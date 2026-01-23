import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/app/context/AppContext';
import { OfflineBanner } from '@/app/components/OfflineBanner';
import { Splash } from '@/app/screens/Splash';
import { Login } from '@/app/screens/Login';
import { Signup } from '@/app/screens/Signup';
import { LanguageSelect } from '@/app/screens/LanguageSelect';
import { Home } from '@/app/screens/Home';
import { Chat } from '@/app/screens/Chat';
import { HealthProfile } from '@/app/screens/HealthProfile';
import SymptomChecker from '@/app/screens/SymptomChecker';
import { History } from '@/app/screens/History';
import { Emergency } from '@/app/screens/Emergency';
import { Settings } from '@/app/screens/Settings';
import { Allergies } from '@/app/screens/Allergies';
import { DietNutrition } from '@/app/screens/DietNutrition';
import { MedicationManager } from '@/app/screens/MedicationManager';
import VaccinationTracker from '@/app/screens/VaccinationTracker';
import { HealthEducation } from '@/app/screens/HealthEducation';
import { Profile } from '@/app/screens/Profile';
import { Appointments } from '@/app/screens/Appointments';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex justify-center transition-colors duration-300">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-950 min-h-screen shadow-xl relative transition-colors duration-300">
            <OfflineBanner />
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/language-select" element={<LanguageSelect />} />
              <Route path="/home" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/health-profile" element={<HealthProfile />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/history" element={<History />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/allergies" element={<Allergies />} />
              <Route path="/diet-nutrition" element={<DietNutrition />} />
              <Route path="/medications" element={<MedicationManager />} />
              <Route path="/vaccinations" element={<VaccinationTracker />} />
              <Route path="/health-education" element={<HealthEducation />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}