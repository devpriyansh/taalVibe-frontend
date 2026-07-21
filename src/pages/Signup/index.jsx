import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, UserPlus, CheckCircle2, Loader2 } from 'lucide-react';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP Verification State
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter an email address first.');
      return;
    }
    setError('');
    setIsOtpLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_URL}/user/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const resData = await res.json();
      if (res.ok && resData.data && resData.data.status === 200) {
        setIsOtpSent(true);
      } else {
        const errorMessage = resData.errors && resData.errors.length > 0 ? resData.errors[0].customMessage || resData.errors[0].message : 'Failed to send OTP.';
        setError(errorMessage);
      }
    } catch (err) {
      setError('Failed to connect to server.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }
    setError('');
    setIsOtpLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await fetch(`${API_URL}/user/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const resData = await res.json();
      if (res.ok && resData.data && resData.data.status === 200) {
        setIsEmailVerified(true);
        setIsOtpSent(false); // Hide OTP field
      } else {
        const errorMessage = resData.errors && resData.errors.length > 0 ? resData.errors[0].customMessage || resData.errors[0].message : 'Invalid OTP.';
        setError(errorMessage);
      }
    } catch (err) {
      setError('Failed to connect to server.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isEmailVerified) {
      setError("Please verify your email address first.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    const res = await register(email, password, confirmPassword, firstName, lastName);
    setIsLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 overflow-y-auto max-h-[95vh]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Create Account</h2>
          <p className="text-slate-500 font-medium">Join us today.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">First Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all text-slate-800 font-medium"
                  placeholder="Jane"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all text-slate-800 font-medium"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
          </div>

          <div className="relative z-20">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                {isEmailVerified && (
                  <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Verified
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative group flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className={`transition-colors ${isEmailVerified ? 'text-green-500' : 'text-slate-400 group-focus-within:text-blue-600'}`} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isEmailVerified && !isOtpSent) {
                        e.preventDefault();
                        handleSendOtp(e);
                      }
                    }}
                    disabled={isEmailVerified || isOtpSent}
                    className={`w-full h-11 pl-11 pr-4 rounded-xl border bg-slate-50 outline-none transition-all text-slate-800 font-medium ${
                      isEmailVerified 
                        ? 'opacity-80 bg-green-50/50 border-green-200' 
                        : 'border-slate-200 focus:bg-white focus:border-blue-600'
                    }`}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                {!isEmailVerified && !isOtpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!email || isOtpLoading}
                    className="h-11 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {isOtpLoading ? <Loader2 size={16} className="animate-spin" /> : 'Verify'}
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {isOtpSent && !isEmailVerified && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-slate-200 rounded-xl shadow-lg z-30"
                >
                  <label className="text-xs uppercase tracking-widest font-bold text-blue-700 ml-1 mb-2 block">Enter Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleVerifyOtp(e);
                        }
                      }}
                      maxLength={6}
                      className="w-full h-11 text-center rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all text-blue-900 font-bold tracking-widest"
                      placeholder="------"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otp.length < 6 || isOtpLoading}
                      className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center disabled:opacity-50"
                    >
                      {isOtpLoading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all text-slate-800 font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Confirm</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-all text-slate-800 font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isEmailVerified}
            className={`w-full h-12 mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 ${(isLoading || !isEmailVerified) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : !isEmailVerified ? (
              <>Verify Email to Continue</>
            ) : (
              <>
                Create Account
                <UserPlus size={20} />
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center py-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">or sign up with</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <GoogleAuthButton isSignup={true} onError={setError} />

        <p className="text-center text-slate-600 font-medium mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
