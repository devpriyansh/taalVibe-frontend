import React, { useState, useEffect } from 'react';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fading out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2000);

    // Completely remove from DOM after 2.5 seconds
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[99999] bg-[#0a0a0a] flex items-center justify-center transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center animate-pulse duration-[2000ms]">
        <img 
          src="/taalvibe-splash.jpg" 
          alt="TaalVibe" 
          className="w-48 sm:w-64 md:w-80 h-auto object-contain drop-shadow-[0_0_30px_rgba(255,15,123,0.4)]"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
