import React from 'react';
import { X, Share, PlusSquare, ArrowDownToLine, Sparkles } from 'lucide-react';

const InstallGuideModal = ({ isOpen, onClose, isIOS }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-sonora-surface border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-sonora-text animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-sonora-text-muted hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* App Icon & Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-black">
              <img 
                src="/taalvibe-splash.png" 
                alt="TaalVibe" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-white shadow-md">
              <Sparkles size={12} />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-outfit font-bold text-white">
            Install TaalVibe App
          </h3>
          <p className="text-sm text-sonora-text-muted mt-1 max-w-xs">
            Enjoy full-screen music playback, lightning-fast streaming, and zero browser bars.
          </p>
        </div>

        {/* Instructions */}
        {isIOS ? (
          <div className="space-y-3.5 mb-6 bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 font-bold text-xs flex items-center justify-center border border-pink-500/30">
                1
              </span>
              <p className="text-sonora-text leading-snug">
                Tap the <span className="inline-flex items-center gap-1 font-semibold text-blue-400 mx-0.5"><Share size={15} /> Share</span> button in Safari's bottom toolbar.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 font-bold text-xs flex items-center justify-center border border-pink-500/30">
                2
              </span>
              <p className="text-sonora-text leading-snug">
                Scroll down and tap <span className="inline-flex items-center gap-1 font-semibold text-pink-400 mx-0.5"><PlusSquare size={15} /> Add to Home Screen</span>.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 font-bold text-xs flex items-center justify-center border border-pink-500/30">
                3
              </span>
              <p className="text-sonora-text leading-snug">
                Tap <span className="font-semibold text-white">Add</span> in the top-right corner to install TaalVibe on your home screen.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 mb-6 bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 font-bold text-xs flex items-center justify-center border border-pink-500/30">
                1
              </span>
              <p className="text-sonora-text leading-snug">
                Open your browser menu (the <span className="font-semibold text-white">⋮</span> or <span className="font-semibold text-white">⋯</span> icon in the top/bottom corner).
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 font-bold text-xs flex items-center justify-center border border-pink-500/30">
                2
              </span>
              <p className="text-sonora-text leading-snug">
                Select <span className="inline-flex items-center gap-1 font-semibold text-pink-400 mx-0.5"><ArrowDownToLine size={15} /> Install app</span> or <span className="font-semibold text-white">Add to Home screen</span>.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 font-bold text-xs flex items-center justify-center border border-pink-500/30">
                3
              </span>
              <p className="text-sonora-text leading-snug">
                Confirm to install and launch directly from your home screen.
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-outfit font-semibold transition-all shadow-lg shadow-pink-500/20 active:scale-[0.98]"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default InstallGuideModal;
