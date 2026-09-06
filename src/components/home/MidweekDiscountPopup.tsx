import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Percent, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div className="bg-primary text-primary-foreground px-5 py-3 flex items-center gap-2">
          <Percent className="w-5 h-5 shrink-0" aria-hidden="true" />
          <p className="font-semibold text-sm sm:text-base">Midweek Special — Save 50%</p>
        </div>

        <div className="p-5 pt-4">
          <p className="text-2xl font-bold text-foreground leading-tight">
            50% off trucks &amp; jumbo vans
          </p>
          <p className="mt-2 text-sm text-muted-foreground flex items-start gap-2">
            <CalendarCheck className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            <span>Your hire must start and end between Monday and Thursday. Subject to availability.</span>
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button asChild className="flex-1">
              <Link to="/vehicles" onClick={dismiss}>Book &amp; save 50%</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/hot-deals/midweek-truck-van-discount" onClick={dismiss}>
                See the details
              </Link>
            </Button>
          </div>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Close midweek discount offer"
          className="absolute right-2 top-2 rounded-full p-1.5 text-primary-foreground/90 hover:bg-primary-foreground/20 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default MidweekDiscountPopup;
