import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePWAInstall } from '../../contexts/PWAInstallContext';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const { user } = useAuth();
  const { isStandalone, promptInstall } = usePWAInstall();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-sonora-base items-center justify-center p-4 overflow-hidden relative">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sonora-primary/20 rounded-full blur-[150px] pointer-events-none"></div>

      <motion.div
        initial={{ y: -50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
        className="text-center z-10 w-full max-w-4xl bg-sonora-surface/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl p-12 md:p-16 flex flex-col items-center"
      >
        <div className="mb-6 relative flex flex-col items-center gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_50px_rgba(30,215,96,0.2)] bg-black flex items-center justify-center p-3">
            <img src="/logo.png" alt="TaalVibe Logo" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-outfit font-black tracking-tight text-white">TaalVibe</h1>
        </div>
        
        <p className="text-xl md:text-3xl text-sonora-text-muted font-medium font-outfit mb-12 max-w-2xl mx-auto drop-shadow-sm leading-relaxed">
          Your music. Your memories. Your journey.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-xl mt-4">
          <Link to="/login" className="btn-primary flex-1 text-2xl py-5 rounded-2xl flex items-center justify-center gap-4 transition-colors">
            Login
          </Link>
          <Link to="/signup" className="btn-secondary flex-1 text-2xl py-5 rounded-2xl flex items-center justify-center gap-4 transition-colors">
            Sign Up
          </Link>
        </div>

        {!isStandalone && (
          <button
            onClick={promptInstall}
            className="mt-6 px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/30 text-white font-outfit font-semibold flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-pink-500/10 active:scale-95 group text-lg"
          >
            <Download size={20} className="text-pink-400 group-hover:translate-y-0.5 transition-transform" />
            <span>Download App</span>
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default Landing;