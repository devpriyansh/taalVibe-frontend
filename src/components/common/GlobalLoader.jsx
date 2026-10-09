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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300">
      <div className="bg-sonora-surface p-6 rounded-2xl shadow-2xl border border-sonora-border flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-200">
        <Loader2 size={40} className="text-sonora-primary animate-spin" />
        <p className="text-sonora-text font-outfit font-medium">Processing...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
