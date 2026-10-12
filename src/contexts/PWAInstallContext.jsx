import React, { createContext, useContext, useState, useEffect } from 'react';
import InstallGuideModal from '../components/common/InstallGuideModal';

const PWAInstallContext = createContext({
  isStandalone: false,
  canInstall: false,
  isIOS: false,
  promptInstall: async () => {},
});

export const isRunningStandalone = () => {
  if (typeof window === 'undefined') return false;

  // Standard CSS display-mode check
  const isDisplayStandalone = window.matchMedia && (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches
  );

  // iOS Safari standalone check
  const isIOSStandalone = window.navigator && window.navigator.standalone === true;

  // Android Trusted Web Activity / Webview referrer check
  const isAndroidApp = typeof document !== 'undefined' && document.referrer && document.referrer.startsWith('android-app://');

  // URL query parameter check
  const isUrlStandalone = typeof window !== 'undefined' && window.location && window.location.search && (
    window.location.search.includes('source=pwa') ||
    window.location.search.includes('mode=standalone')
  );

  return Boolean(isDisplayStandalone || isIOSStandalone || isAndroidApp || isUrlStandalone);
};

export const PWAInstallProvider = ({ children }) => {
  const [isStandalone, setIsStandalone] = useState(isRunningStandalone);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    const checkStandalone = () => {
      setIsStandalone(isRunningStandalone());
    };

    checkStandalone();

    // Listen for display mode changes
    const mql = window.matchMedia('(display-mode: standalone)');
    if (mql?.addEventListener) {
      mql.addEventListener('change', checkStandalone);
    } else if (mql?.addListener) {
      mql.addListener(checkStandalone);
    }

    // Capture beforeinstallprompt event (Chromium, Android, Edge, Desktop)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      setShowGuide(false);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      if (mql?.removeEventListener) {
        mql.removeEventListener('change', checkStandalone);
      } else if (mql?.removeListener) {
        mql.removeListener(checkStandalone);
      }
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult?.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.error('Error triggering PWA install prompt:', err);
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  const canInstall = !isStandalone;

  return (
    <PWAInstallContext.Provider
      value={{
        isStandalone,
        canInstall,
        isIOS,
        promptInstall,
      }}
    >
      {children}
      <InstallGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        isIOS={isIOS}
      />
    </PWAInstallContext.Provider>
  );
};

export const usePWAInstall = () => useContext(PWAInstallContext);

export default PWAInstallContext;
