import { useEffect, useState } from 'react';
import { X, CheckCircle2, MapPin } from 'lucide-react';

type Notification = {
  name: string;
  vehicle: string;
  location: string;
  timeAgo: string;
};

const FIRST_NAMES = ['Sarah', 'James', 'Liam', 'Emma', 'Oliver', 'Charlotte', 'Noah', 'Mia', 'Jack', 'Ava', 'Hemi', 'Aroha', 'Tane', 'Kiri', 'Wiremu', 'Ben', 'Sophie', 'Lucas', 'Isla', 'Daniel'];
const VEHICLES = [
  '2-Tonne Box Truck',
  '3-Tonne Furniture Truck',
  'Standard Cargo Van',
  'Jumbo Van',
  '12-Seater Minibus',
  '10-Seater Minibus',
  '7-Seater SUV',
  'Compact Car',
  'Hilux Ute',
  'Premium Midsize Car',
  'AWD SUV',
];
const LOCATIONS = [
  'Auckland Airport',
  'Wellington City',
  'Christchurch Airport',
  'Hamilton',
  'West Auckland',
  'Christchurch Central',
  'South Auckland',
  'Wellington Airport',
  'North Shore',
  'Tauranga',
  'Rotorua',
  'Queenstown',
  'Dunedin',
  'Palmerston North',
  'New Plymouth',
  'Napier',
];
const TIMES = ['just now', '2 minutes ago', '8 minutes ago', '14 minutes ago', '23 minutes ago', '1 hour ago', '2 hours ago'];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const buildNotification = (): Notification => ({
  name: pick(FIRST_NAMES),
  vehicle: pick(VEHICLES),
  location: pick(LOCATIONS),
  timeAgo: pick(TIMES),
});

const SocialProofNotifications = ({ maxToShow = 4 }: { maxToShow?: number }) => {
  const [current, setCurrent] = useState<Notification | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [shownCount, setShownCount] = useState(0);

  useEffect(() => {
    if (dismissed || shownCount >= maxToShow) return;

    const initialDelay = shownCount === 0 ? 6000 : 12000 + Math.random() * 6000;
    const showTimer = setTimeout(() => {
      setCurrent(buildNotification());
      setVisible(true);
      setShownCount((c) => c + 1);

      const hideTimer = setTimeout(() => setVisible(false), 5500);
      return () => clearTimeout(hideTimer);
    }, initialDelay);

    return () => clearTimeout(showTimer);
  }, [shownCount, dismissed, maxToShow, visible === false]);

  if (dismissed || !current) return null;

  return (
    <div
      aria-live="polite"
      className={`fixed left-4 bottom-4 sm:left-6 sm:bottom-6 z-40 max-w-xs transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-background border border-border rounded-xl shadow-2xl shadow-black/10 p-3 pr-8 flex gap-3 items-start relative">
        <div className="shrink-0 mt-0.5 bg-primary/10 rounded-full p-1.5">
          <CheckCircle2 className="w-4 h-4 text-primary" />
        </div>
        <div className="text-xs leading-snug">
          <p className="text-foreground">
            <span className="font-semibold">{current.name}</span> just booked a{' '}
            <span className="font-semibold">{current.vehicle}</span>
          </p>
          <p className="text-muted-foreground mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {current.location} · {current.timeAgo}
          </p>
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => setDismissed(true)}
          className="absolute top-1.5 right-1.5 text-muted-foreground hover:text-foreground p-1 rounded"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SocialProofNotifications;