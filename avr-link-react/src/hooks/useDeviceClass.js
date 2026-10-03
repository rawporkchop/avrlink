import { useEffect } from 'react';

// Adds "device-ios" / "device-macos" to <html> so CSS can show the right
// App Store button (Mac App Store badge on Macs, hidden promo on iOS).
export function useDeviceClass() {
  useEffect(() => {
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isMac = /Macintosh|Mac OS X/.test(ua) && !isIOS;

    const root = document.documentElement;
    root.classList.toggle('device-ios', isIOS);
    root.classList.toggle('device-macos', isMac);
    return () => root.classList.remove('device-ios', 'device-macos');
  }, []);
}
