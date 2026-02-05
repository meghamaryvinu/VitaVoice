import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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

// Doctor Portal Imports
import { DoctorSignup } from '@/app/screens/doctor/DoctorSignup';
import { DoctorLogin } from '@/app/screens/doctor/DoctorLogin';
import { PendingVerification } from '@/app/screens/doctor/PendingVerification';
import { DoctorDashboard } from '@/app/screens/doctor/DoctorDashboard';
import { DoctorProfileScreen } from '@/app/screens/doctor/DoctorProfile';
import { DoctorAppointments } from '@/app/screens/doctor/DoctorAppointments';
import { DoctorChat } from '@/app/screens/doctor/DoctorChat';
import { DoctorForum } from '@/app/screens/doctor/DoctorForum';
import { VerifyDoctors } from '@/app/screens/admin/VerifyDoctors';

import { Outlet } from 'react-router-dom';

// Layout wrapper for Patient App (Mobile View)
const PatientLayout = () => (
  <div className="w-full max-w-3xl bg-white dark:bg-slate-950 min-h-screen shadow-xl relative transition-colors duration-300">
    <OfflineBanner />
    <Outlet />
  </div>
);

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex justify-center transition-colors duration-300">
          <Toaster position="top-center" />

          <Routes>
            {/* Doctor Portal Routes - Full Width */}
            <Route path="/doctor/signup" element={<DoctorSignup />} />
            <Route path="/doctor/login" element={<DoctorLogin />} />
            <Route path="/doctor/pending" element={<PendingVerification />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/profile" element={<DoctorProfileScreen />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/chat" element={<DoctorChat />} />
            <Route path="/doctor/forum" element={<DoctorForum />} />

            {/* Admin Routes - Full Width */}
            <Route path="/admin/verify" element={<VerifyDoctors />} />

            {/* Patient App Routes - Constrained Layout */}
            <Route element={<PatientLayout />}>
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
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}