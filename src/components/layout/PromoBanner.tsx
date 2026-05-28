import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Trophy } from 'lucide-react';

const STORAGE_KEY = 'jb-promo-banner-dismissed-v1';

const PromoBanner = () => {
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
      aria-label="Monthly rental giveaway promotion"
      className="relative w-full bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground"
    >
      <Link
        to="/win"
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-10 py-2.5 text-center text-sm sm:text-base font-semibold hover:opacity-95 transition"
      >
        <Trophy className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span>
          Win up to <span className="underline underline-offset-2">$200 back</span> on your rental — 5 winners drawn every month!
        </span>
        <span className="hidden sm:inline rounded-full bg-primary-foreground/15 px-3 py-0.5 text-xs uppercase tracking-wide">
          See how to enter
        </span>
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss promotion banner"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 hover:bg-primary-foreground/15 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};

export default PromoBanner;