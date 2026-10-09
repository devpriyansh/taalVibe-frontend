import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, UserPlus, CheckCircle2, Loader2 } from 'lucide-react';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';
import { API_BASE_URL } from '../../services/api';

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
      const res = await fetch(`${API_BASE_URL}/user/send-otp`, {
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
      const res = await fetch(`${API_BASE_URL}/user/verify-otp`, {
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
    <div className="flex h-screen w-full bg-sonora-base items-center justify-center p-4 overflow-hidden relative">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sonora-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-sonora-surface/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl p-8 overflow-y-auto max-h-[95vh] z-10 hide-scrollbar">
        <div className="text-center mb-8 flex flex-col items-center pb-2">
          <div className="w-20 h-20 mb-3 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_30px_rgba(30,215,96,0.15)] bg-black flex items-center justify-center p-2">
            <img src="/logo.png" alt="TaalVibe Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <h2 className="text-3xl font-outfit font-black tracking-tight text-white mb-1">Create Account</h2>
          <p className="text-sonora-text-muted font-medium">Join us today.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-sonora-text-muted ml-1 uppercase tracking-wider">First Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-sonora-text-muted group-focus-within:text-sonora-primary transition-colors" />
                </div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 focus:bg-black/60 focus:border-sonora-primary/50 outline-none transition-all text-white font-medium placeholder:text-white/30"
                  placeholder="Jane"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-sonora-text-muted ml-1 uppercase tracking-wider">Last Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-sonora-text-muted group-focus-within:text-sonora-primary transition-colors" />
                </div>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 focus:bg-black/60 focus:border-sonora-primary/50 outline-none transition-all text-white font-medium placeholder:text-white/30"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
          </div>

          <div className="relative z-20">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-sonora-text-muted uppercase tracking-wider">Email Address</label>
                {isEmailVerified && (
                  <span className="text-xs font-bold text-sonora-primary flex items-center gap-1">
                    <CheckCircle2 size={14} /> Verified
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative group flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className={`transition-colors ${isEmailVerified ? 'text-sonora-primary' : 'text-sonora-text-muted group-focus-within:text-sonora-primary'}`} />
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
                    className={`w-full h-11 pl-11 pr-4 rounded-xl border outline-none transition-all text-white font-medium placeholder:text-white/30 ${
                      isEmailVerified 
                        ? 'opacity-80 bg-sonora-primary/10 border-sonora-primary/30 text-sonora-primary' 
                        : 'bg-black/40 border-white/10 focus:bg-black/60 focus:border-sonora-primary/50'
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
                    className="h-11 px-4 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-bold text-sm transition-all flex items-center justify-center disabled:opacity-50"
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
                  className="absolute top-full left-0 right-0 mt-2 p-4 bg-sonora-surface border border-white/10 rounded-xl shadow-2xl z-30"
                >
                  <label className="text-xs uppercase tracking-widest font-bold text-sonora-primary ml-1 mb-2 block">Enter Code</label>
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
                      className="w-full h-11 text-center rounded-xl bg-black/60 border border-white/10 focus:border-sonora-primary outline-none transition-all text-white font-bold tracking-[0.5em]"
                      placeholder="------"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otp.length < 6 || isOtpLoading}
                      className="h-11 px-6 btn-primary rounded-xl font-bold text-sm transition-all flex items-center justify-center disabled:opacity-50"
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
              <label className="text-sm font-bold text-sonora-text-muted ml-1 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-sonora-text-muted group-focus-within:text-sonora-primary transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 focus:bg-black/60 focus:border-sonora-primary/50 outline-none transition-all text-white font-medium placeholder:text-white/30"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-sonora-text-muted ml-1 uppercase tracking-wider">Confirm</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-sonora-text-muted group-focus-within:text-sonora-primary transition-colors" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 focus:bg-black/60 focus:border-sonora-primary/50 outline-none transition-all text-white font-medium placeholder:text-white/30"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isEmailVerified}
            className={`w-full h-12 mt-6 btn-primary rounded-xl flex items-center justify-center gap-2 ${(isLoading || !isEmailVerified) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            ) : !isEmailVerified ? (
              <span className="text-black font-bold">Verify Email to Continue</span>
            ) : (
              <span className="flex items-center gap-2 text-black font-bold">
                Create Account
                <UserPlus size={20} />
              </span>
            )}
          </button>
        </form>

        <div className="relative flex items-center py-6">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-semibold text-sonora-text-muted uppercase tracking-wider">or sign up with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <GoogleAuthButton isSignup={true} onError={setError} />

        <p className="text-center text-sonora-text-muted font-medium mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-sonora-primary hover:text-white font-bold transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
