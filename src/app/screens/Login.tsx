import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Phone, Fingerprint, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { authService } from '@/services/authService';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (email && password) {
      setLoading(true);
      setError('');

      const result = await authService.login({ email, password });

      if (result.success) {
        navigate('/home');
      } else {
        setError(result.error || 'Login failed');
      }
      setLoading(false);
    }
  };

  const handleEmergency = () => {
    navigate('/emergency');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F8FAFC] flex flex-col">
      {/* Emergency Button - Fixed Top Right */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleEmergency}
        className="fixed top-6 right-6 z-50 w-14 h-14 bg-[#DC2626] rounded-full shadow-2xl flex items-center justify-center"
        style={{
          boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.4)'
        }}
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(220, 38, 38, 0.4)',
            '0 0 0 12px rgba(220, 38, 38, 0)',
            '0 0 0 0 rgba(220, 38, 38, 0)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Phone className="w-7 h-7 text-white" />
      </motion.button>

      {/* Logo & Header */}
      <div className="px-8 pt-16 pb-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 mx-auto bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-3xl flex items-center justify-center shadow-xl mb-6"
        >
          <Mail className="w-12 h-12 text-white" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center text-[#1E293B] mb-2"
        >
          Welcome Back
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-600"
        >
          Login to access your health records
        </motion.p>
      </div>

      {/* Form */}
      <div className="flex-1 px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-2 ml-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-14 pl-12 pr-4 bg-white border-2 border-gray-200 rounded-xl text-[#1E293B] placeholder:text-gray-400 focus:border-[#2563EB] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-14 pl-12 pr-12 bg-white border-2 border-gray-200 rounded-xl text-[#1E293B] placeholder:text-gray-400 focus:border-[#2563EB] focus:outline-none transition-colors"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button className="text-sm text-[#2563EB] hover:underline">
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={!email || !password || loading}
            className={`w-full h-14 rounded-xl font-semibold text-base shadow-lg transition-all flex items-center justify-center ${email && password && !loading
                ? 'bg-[#2563EB] text-white hover:bg-[#1E40AF]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Login'
            )}
          </motion.button>

          {/* Biometric Login */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full h-14 border-2 border-gray-200 rounded-xl font-medium text-[#1E293B] flex items-center justify-center gap-2 hover:border-[#2563EB] hover:bg-[#2563EB]/5 transition-all"
          >
            <Fingerprint className="w-6 h-6 text-[#2563EB]" />
            <span>Login with Biometrics</span>
          </motion.button>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600">
            New user?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-[#2563EB] font-semibold hover:underline"
            >
              Sign up
            </button>
          </p>
        </motion.div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 mb-8 flex items-center justify-center gap-2 text-sm text-gray-500"
        >
          <Lock className="w-4 h-4" />
          <span>Your data is securely encrypted</span>
        </motion.div>
      </div>
    </div>
  );
};
