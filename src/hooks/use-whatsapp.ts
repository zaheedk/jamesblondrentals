
import { whatsAppService, type BookingDetails } from '@/lib/whatsapp-service';
import { toast } from 'sonner';

export const useWhatsApp = () => {
  const sendBookingConfirmation = async (bookingDetails: BookingDetails) => {
    try {
      // Check if phone number exists before attempting to send
      if (!bookingDetails.customerPhone || bookingDetails.customerPhone.trim() === '') {
        toast.error('Cannot send WhatsApp notification', {
          description: 'Customer phone number is required'
        });
        return false;
      }

      console.log('Attempting to send WhatsApp with phone:', bookingDetails.customerPhone);
      
      const success = await whatsAppService.sendBookingConfirmation(bookingDetails);

      if (success) {
        toast.success('WhatsApp confirmation sent!', {
          description: 'Customer will receive booking details via WhatsApp'
        });
      } else {
        toast.error('Failed to send WhatsApp notification', {
          description: 'Please check the customer phone number and try again'
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
      if (!customerPhone || customerPhone.trim() === '') {
        console.error('Cannot send payment confirmation: No phone number provided');
        return false;
      }

      const success = await whatsAppService.sendPaymentConfirmation(customerPhone, customerName, amount, bookingRef);

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
      if (!customerPhone || customerPhone.trim() === '') {
        console.error('Cannot send pickup reminder: No phone number provided');
        return false;
      }

      const success = await whatsAppService.sendPickupReminder(customerPhone, customerName, vehicleName, pickupDate, pickupLocation);

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
