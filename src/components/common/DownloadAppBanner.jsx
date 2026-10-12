import React, { useState } from 'react';
import { usePWAInstall } from '../../contexts/PWAInstallContext';
import { Download, X, Sparkles } from 'lucide-react';

const DownloadAppBanner = () => {
  const { isStandalone, promptInstall } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('dismissed_pwa_banner') === 'true';
    } catch {
      return false;
    }
  });

  // Never render if user is already in the mobile app / standalone mode
  if (isStandalone || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('dismissed_pwa_banner', 'true');
    } catch {}
  };

  return (
    <div className="w-full bg-[#18181b]/95 backdrop-blur-md border-b border-white/10 px-4 py-2 text-white z-40 relative flex items-center justify-between gap-3 shadow-lg transition-all animate-slide-up">
      {/* Left: App icon & info */}
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="relative flex-shrink-0">
          <img 
            src="/taalvibe-splash.png" 
            alt="TaalVibe" 
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border border-white/10 shadow-sm"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-outfit font-bold text-xs sm:text-sm tracking-wide text-white truncate">
              TaalVibe App
            </span>
            <span className="hidden xs:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-pink-500/20 text-pink-300 border border-pink-500/30">
              <Sparkles size={9} /> Mobile & Desktop
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 truncate">
            Install for full-screen music & offline playback
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={promptInstall}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium text-xs shadow-md shadow-pink-500/20 active:scale-95 transition-all"
        >
          <Download size={14} />
          <span>Download App</span>
        </button>

        <button
          onClick={handleDismiss}
          className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Dismiss banner"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};

export default DownloadAppBanner;
