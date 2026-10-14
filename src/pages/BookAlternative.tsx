import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRcmApi } from '@/hooks/use-rcm-api';
import { saveBookingData } from '@/lib/booking-session';
import { Loader2 } from 'lucide-react';

// Landing page for the "Book this instead" button in the quote-alternatives
// email. Re-checks the offered vehicle against live availability, saves the
// booking session exactly like picking a vehicle on /vehicles, then forwards
// to step 3 of the booking flow. Falls back to the pre-filtered search if the
// vehicle is no longer available.
const BookAlternative = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { rcmApi } = useRcmApi();
  const started = useRef(false);
  const [message, setMessage] = useState('Checking availability for your dates…');

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const pickupLocation = searchParams.get('pickupLocation') || '';
    const dropoffLocation = searchParams.get('dropoffLocation') || pickupLocation;
    const pickupDate = searchParams.get('pickupDate') || '';
    const dropoffDate = searchParams.get('dropoffDate') || '';
    const pickupTime = searchParams.get('pickupTime') || '10:00';
    const dropoffTime = searchParams.get('dropoffTime') || '10:00';
    const age = searchParams.get('age') || '';
    const carCategory = searchParams.get('carCategory') || '';

    const fallback = () => {
      const qs = new URLSearchParams();
      for (const k of ['pickupLocation', 'dropoffLocation', 'pickupDate', 'dropoffDate', 'pickupTime', 'dropoffTime', 'age', 'carCategory']) {
        const v = searchParams.get(k);
        if (v) qs.set(k, v);
      }
      navigate(`/vehicles?${qs.toString()}`, { replace: true });
    };

    if (!pickupLocation || !pickupDate || !dropoffDate || !age || !carCategory) {
      fallback();
      return;
    }

    (async () => {
      try {
        const response = await rcmApi.getStep2({
          vehiclecategorytypeid: 0,
          pickuplocationid: pickupLocation,
          dropofflocationid: dropoffLocation,
          pickupdate: pickupDate,
          pickuptime: pickupTime,
          dropoffdate: dropoffDate,
          dropofftime: dropoffTime,
          ageid: age,
        });
        const cars = response?.results?.availablecars ?? [];
        const car = cars.find(
          (c) =>
            String(c.vehiclecategorytypeid) === carCategory &&
            (c.available === 1 || c.available === 2)
        );
        if (!car) {
          fallback();
          return;
        }

        const name = car.vehiclecategory || 'Vehicle';
        const isHourly =
          /truck|box|tipper|jumbo/i.test(name) ||
          (/van/i.test(name) && !/premium/i.test(name));

        saveBookingData({
          vehicleId: String(car.vehiclecategoryid),
          vehicleName: name,
          vehicleCategoryId: car.vehiclecategoryid,
          vehicleCategoryTypeId: String(car.vehiclecategorytypeid),
          pickupLocationId: pickupLocation,
          dropoffLocationId: dropoffLocation,
          pickupDate,
          pickupTime,
          dropoffDate,
          dropoffTime,
          ageId: age,
          driverageId: age,
          basePrice: Number(car.totalrateafterdiscount) || 0,
          totalRateAfterDiscount: Number(car.totalrateafterdiscount) || 0,
          totalDiscountAmount: Number(car.totaldiscountamount) || 0,
          vehicleImage: car.imageurl || undefined,
          rateType: isHourly ? 'hourly' : 'daily',
          numberofdays: Number(car.numberofdays) || 1,
        });

        setMessage('Taking you to your booking…');
        navigate('/booking', { replace: true });
      } catch (e) {
        console.error('BookAlternative failed:', e);
        fallback();
      }
    })();
  }, [searchParams, navigate, rcmApi]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-lg font-medium text-foreground">{message}</p>
    </div>
  );
};

export default BookAlternative;
