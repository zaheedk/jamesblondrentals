import { useEffect, useState } from 'react';
import { X, Percent } from 'lucide-react';

const STORAGE_KEY = 'jb-early-week-banner-dismissed-v1';

const EarlyWeekBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setVisible(window.localStorage.getItem(STORAGE_KEY) !== '1');
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {}
    setVisible(false);
  };

  return (
    <aside
      role="region"
      aria-label="Early week discount promotion"
      className="relative w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-10 py-2.5 text-center text-sm sm:text-base font-semibold">
        <Percent className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span>
          <span className="underline underline-offset-2">25% Early Week Discount</span> on Trucks & Jumbo Vans — hire must start & end Mon–Thu
        </span>
        <span className="hidden sm:inline rounded-full bg-white/15 px-3 py-0.5 text-xs uppercase tracking-wide">
          Save Now
        </span>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss early week discount banner"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 hover:bg-white/15 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};

export default EarlyWeekBanner;