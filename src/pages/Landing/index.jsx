import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FloatingCloud from '../../components/common/FloatingCloud';
import { Rocket, ShieldCheck } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-4 bg-transparent relative overflow-hidden">
      <FloatingCloud />
      
      <motion.div
        initial={{ y: -50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
        className="text-center z-10 w-full max-w-5xl glass-card p-12 md:p-16 flex flex-col items-center"
      >
        <div className="mb-8 relative flex flex-col items-center gap-6">
          <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
          <span className="text-6xl sm:text-[5rem] font-baloo font-black tracking-wide text-gray-800">
            Boilerplate
          </span>
        </div>
        
        <p className="text-2xl md:text-4xl text-gray-600 font-bold font-nunito mb-12 max-w-3xl mx-auto drop-shadow-sm leading-relaxed">
          A clean, reusable starting point for your next great idea.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-3xl mt-4">
          <Link to="/login" className="btn-primary flex-1 text-2xl py-6 flex items-center justify-center gap-4 group bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors">
            Login
          </Link>
          <Link to="/signup" className="btn-secondary flex-1 text-2xl py-6 flex items-center justify-center gap-4 group bg-white text-blue-600 border-2 border-blue-600 rounded-2xl hover:bg-blue-50 transition-colors">
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;