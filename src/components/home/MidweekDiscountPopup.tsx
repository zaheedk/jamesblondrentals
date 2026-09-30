import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import midweekHappyLady from '@/assets/midweek-happy-lady.jpg';

const STORAGE_KEY = 'jb-midweek50-popup-seen-v1';

const MidweekDiscountPopup = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem(STORAGE_KEY) === '1') return;
    const timer = window.setTimeout(() => setVisible(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-label="50% midweek discount offer"
      className="fixed z-50 bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 sm:max-w-sm animate-slide-in-right"
    >
      <div className="relative rounded-2xl border bg-card shadow-2xl overflow-hidden">
        {/* Image banner with badge overlay */}
        <div className="relative">
          <img
            src={midweekHappyLady}
            alt="Happy customer celebrating moving day"
            className="w-full h-36 sm:h-40 object-cover"
            width={1024}
            height={640}
            loading="lazy"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute top-3 left-3 rounded-full bg-primary text-primary-foreground px-3 py-1.5 shadow-lg rotate-[-3deg]">
            <p className="text-sm font-extrabold tracking-wide leading-none">50% OFF</p>
          </div>
          <p className="absolute bottom-3 left-4 right-4 text-white font-bold text-lg leading-tight drop-shadow">
            Midweek Special — trucks &amp; jumbo vans
          </p>
        </div>

        <div className="p-5 pt-4">
          <p className="text-xl font-bold text-foreground leading-tight">
            Half price moves, Monday to Thursday
          </p>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Close midweek discount offer"
          className="absolute right-2 top-2 rounded-full p-1.5 bg-black/40 text-white hover:bg-black/60 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default MidweekDiscountPopup;
