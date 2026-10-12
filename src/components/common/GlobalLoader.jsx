import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const GlobalLoader = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeout;
    const handleStart = () => {
      // Small delay to prevent flickering on very fast requests
      timeout = setTimeout(() => setLoading(true), 150);
    };
    
    const handleStop = () => {
      clearTimeout(timeout);
      setLoading(false);
    };

    window.addEventListener('api_load_start', handleStart);
    window.addEventListener('api_load_end', handleStop);

    return () => {
      window.removeEventListener('api_load_start', handleStart);
      window.removeEventListener('api_load_end', handleStop);
      clearTimeout(timeout);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 pointer-events-none overflow-hidden">
      <div className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse w-full shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
    </div>
  );
};

export default GlobalLoader;
