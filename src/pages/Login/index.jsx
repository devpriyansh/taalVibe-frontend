import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);
    if (res.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex h-screen w-full bg-sonora-base items-center justify-center p-4 overflow-hidden relative">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sonora-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-sonora-surface/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl p-8 z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_30px_rgba(30,215,96,0.15)] bg-black flex items-center justify-center p-2">
            <img src="/logo.png" alt="TaalVibe Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <h2 className="text-3xl font-outfit font-black tracking-tight text-white mb-2">Welcome Back</h2>
          <p className="text-sonora-text-muted font-medium">Please sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-sonora-text-muted ml-1 uppercase tracking-wider">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-sonora-text-muted group-focus-within:text-sonora-primary transition-colors" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 focus:bg-black/60 focus:border-sonora-primary/50 outline-none transition-all text-white font-medium placeholder:text-white/30"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

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
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 focus:bg-black/60 focus:border-sonora-primary/50 outline-none transition-all text-white font-medium placeholder:text-white/30"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-12 mt-4 btn-primary rounded-xl flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <span className="flex items-center gap-2">Sign In <LogIn size={20} /></span>
            )}
          </button>
        </form>

        <div className="relative flex items-center py-6">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-semibold text-sonora-text-muted uppercase tracking-wider">or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <GoogleAuthButton onError={setError} />

        <p className="text-center text-sonora-text-muted font-medium mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-sonora-primary hover:text-white font-bold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;