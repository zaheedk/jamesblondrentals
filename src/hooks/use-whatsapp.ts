
import { whatsAppService, type BookingDetails } from '@/lib/whatsapp-service';
import { toast } from 'sonner';

export const useWhatsApp = () => {
  const sendBookingConfirmation = async (bookingDetails: BookingDetails) => {
    try {
      const formattedPhone = whatsAppService.formatPhoneNumber(bookingDetails.customerPhone);
      const success = await whatsAppService.sendBookingConfirmation({
        ...bookingDetails,
        customerPhone: formattedPhone
      });

      if (success) {
        toast.success('WhatsApp confirmation sent!', {
          description: 'Customer will receive booking details via WhatsApp'
        });
      } else {
        toast.error('Failed to send WhatsApp notification', {
          description: 'Booking confirmed but WhatsApp message failed'
        });
      }

      return success;
    } catch (error) {
      console.error('WhatsApp notification error:', error);
      toast.error('WhatsApp notification failed');
      return false;
    }
  };

  const sendPaymentConfirmation = async (customerPhone: string, customerName: string, amount: number, bookingRef: string) => {
    try {
      const formattedPhone = whatsAppService.formatPhoneNumber(customerPhone);
      const success = await whatsAppService.sendPaymentConfirmation(formattedPhone, customerName, amount, bookingRef);

      if (success) {
        toast.success('Payment confirmation sent via WhatsApp');
      }

      return success;
    } catch (error) {
      console.error('WhatsApp payment confirmation error:', error);
      return false;
    }
  };

  const sendPickupReminder = async (customerPhone: string, customerName: string, vehicleName: string, pickupDate: string, pickupLocation: string) => {
    try {
      const formattedPhone = whatsAppService.formatPhoneNumber(customerPhone);
      const success = await whatsAppService.sendPickupReminder(formattedPhone, customerName, vehicleName, pickupDate, pickupLocation);

      if (success) {
        toast.success('Pickup reminder sent via WhatsApp');
      }

      return success;
    } catch (error) {
      console.error('WhatsApp pickup reminder error:', error);
      return false;
    }
  };

  return {
    sendBookingConfirmation,
    sendPaymentConfirmation,
    sendPickupReminder
  };
};
