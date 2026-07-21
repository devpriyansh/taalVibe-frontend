import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FunLoader from './FunLoader';

const _envUrl = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = _envUrl ? (_envUrl.endsWith('/api/v1') ? _envUrl : _envUrl.replace(/\/$/, '') + '/api/v1') : 'https://kid-s-backend.onrender.com/api/v1';

const WakeUpLoader = ({ children }) => {
  const [isAwake, setIsAwake] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // If running on localhost, skip the wake up check to speed up dev
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      setIsAwake(true);
      return;
    }

    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 15; // Give it ~1 minute to wake up
    
    // Show the "waking up" message if it takes more than 1.5 seconds
    const messageTimer = setTimeout(() => {
      if (isMounted) setShowMessage(true);
    }, 1500);

    const checkServer = async () => {
      try {
        // Derive health check URL from API base
        const healthCheckUrl = API_BASE_URL.replace('/api/v1', '/health-check');
        const res = await fetch(healthCheckUrl, { method: 'GET' });
        
        if (res.ok && isMounted) {
          setIsAwake(true);
        } else {
          throw new Error('Server not ready');
        }
      } catch (err) {
        if (!isMounted) return;
        retryCount++;
        
        if (retryCount >= maxRetries) {
          setHasError(true);
        } else {
          // Wait 3 seconds before retrying
          setTimeout(checkServer, 3000);
        }
      }
    };

    checkServer();

    return () => {
      isMounted = false;
      clearTimeout(messageTimer);
    };
  }, []);

  if (hasError) {
    return (
      <div className="app-frame flex flex-col items-center justify-center p-4 text-center relative bg-kid-bg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-kid-secondary/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-kid-primary/30 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="text-8xl mb-6 drop-shadow-lg z-10 relative">😴
          <div className="absolute inset-0 bg-white/40 blur-2xl rounded-full z-[-1]"></div>
        </div>
        <div className="glass-panel px-8 py-4 mb-6 z-10 border-white/60">
          <h2 className="text-3xl font-black font-baloo gradient-text">Our servers are super sleepy today...</h2>
        </div>
        <p className="text-xl font-bold text-slate-500 mb-8 z-10 max-w-md glass-panel p-4 font-nunito border-white/60 drop-shadow-sm">
          We couldn't wake them up right now. Please try again in a little bit!
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-chunky bg-gradient-to-b from-kid-primary to-kid-primary-dark shadow-[0_8px_16px_rgba(59,130,246,0.3),inset_0_4px_8px_rgba(255,255,255,0.4)] text-2xl z-10"
        >
          Try Again 🚀
        </button>
      </div>
    );
  }

  if (!isAwake) {
    return (
      <div className="app-frame flex flex-col items-center justify-center relative bg-kid-bg overflow-hidden">
        {/* Playful animated background elements */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-kid-primary/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, -180, -270, -360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-kid-yellow/20 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-col items-center max-w-xl text-center p-8 glass-card">
          <AnimatePresence mode="wait">
            {!showMessage ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center"
              >
                <div className="glass-panel px-8 py-3 mb-4 border-white/60">
                  <h2 className="text-3xl font-black font-baloo text-kid-primary-dark tracking-wide drop-shadow-sm">Starting Up...</h2>
                </div>
                <div className="flex gap-3 mt-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -12, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      className="w-4 h-4 bg-kid-primary rounded-full shadow-[0_2px_4px_rgba(59,130,246,0.4)]"
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="waking"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="glass-panel bg-kid-primary/10 px-8 py-4 mb-4 border-white/60">
                  <h2 className="text-2xl md:text-3xl font-black font-baloo text-kid-primary-dark drop-shadow-sm">
                    Waking up the Magic Servers! ✨
                  </h2>
                </div>
                <p className="text-lg font-bold font-nunito text-slate-500 mt-2 glass-panel p-3 drop-shadow-sm border-white/60">
                  This might take a minute!
                </p>
                
                {/* Fun progress indicator */}
                <div className="w-full h-8 glass-panel rounded-full mt-8 shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden relative border border-white/80">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "95%" }}
                    transition={{ duration: 45, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-kid-green to-kid-green-dark rounded-full flex items-center justify-end pr-2 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]"
                  >
                    <motion.span 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="text-white text-sm"
                    >
                      ⭐
                    </motion.span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return children;
};

export default WakeUpLoader;
