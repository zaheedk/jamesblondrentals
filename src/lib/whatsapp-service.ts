interface WhatsAppMessage {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template' | 'text';
  template?: {
    name: string;
    language: {
      code: string;
    };
    components: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text: string;
      }>;
    }>;
  };
  text?: {
    body: string;
  };
}

interface BookingDetails {
  customerName: string;
  customerPhone: string;
  vehicleName: string;
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  bookingReference: string;
  totalAmount: number;
}

class WhatsAppService {
  private baseUrl = 'https://graph.facebook.com/v18.0';
  private phoneNumberId = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '';
  private accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || '';

  private async sendMessage(message: WhatsAppMessage): Promise<boolean> {
    console.log('WhatsApp functionality is disabled');
    return false;
  }

  async sendBookingConfirmation(bookingDetails: BookingDetails): Promise<boolean> {
    // Format and validate phone number before creating message
    const formattedPhone = this.formatPhoneNumber(bookingDetails.customerPhone);
    
    if (!formattedPhone) {
      console.error('Cannot send WhatsApp: Invalid phone number', bookingDetails.customerPhone);
      return false;
    }

    const message: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'text',
      text: {
        body: `🚗 *James Blond Car Rentals - Booking Confirmed*

Hi ${bookingDetails.customerName}!

Your booking has been confirmed:

📋 *Booking Reference:* ${bookingDetails.bookingReference}
🚙 *Vehicle:* ${bookingDetails.vehicleName}
📅 *Pickup:* ${bookingDetails.pickupDate}
📅 *Return:* ${bookingDetails.dropoffDate}
📍 *Location:* ${bookingDetails.pickupLocation}
💰 *Total:* $${bookingDetails.totalAmount.toFixed(2)}

We'll send you pickup details closer to your rental date.

Need help? Reply to this message or call 0800 525 663.

Thank you for choosing James Blond Car Rentals! 🌟`
      }
    };

    return this.sendMessage(message);
  }

  async sendPaymentConfirmation(customerPhone: string, customerName: string, amount: number, bookingRef: string): Promise<boolean> {
    const formattedPhone = this.formatPhoneNumber(customerPhone);
    
    if (!formattedPhone) {
      console.error('Cannot send WhatsApp payment confirmation: Invalid phone number', customerPhone);
      return false;
    }

    const message: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'text',
      text: {
        body: `💳 *Payment Confirmed - James Blond Car Rentals*

Hi ${customerName}!

Your payment has been successfully processed:

📋 *Booking:* ${bookingRef}
💰 *Amount:* $${amount.toFixed(2)}
✅ *Status:* Confirmed

Your rental is all set! We'll be in touch with pickup details soon.

James Blond Car Rentals Team 🚗`
      }
    };

    return this.sendMessage(message);
  }

  async sendPickupReminder(customerPhone: string, customerName: string, vehicleName: string, pickupDate: string, pickupLocation: string): Promise<boolean> {
    const formattedPhone = this.formatPhoneNumber(customerPhone);
    
    if (!formattedPhone) {
      console.error('Cannot send WhatsApp pickup reminder: Invalid phone number', customerPhone);
      return false;
    }

    const message: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      to: customerPhone,
      type: 'text',
      text: {
        body: `⏰ *Pickup Reminder - James Blond Car Rentals*

Hi ${customerName}!

Just a friendly reminder about your upcoming rental:

🚙 *Vehicle:* ${vehicleName}
📅 *Pickup:* ${pickupDate}
📍 *Location:* ${pickupLocation}

What to bring:
• Valid driver's license
• Credit card for security deposit
• Booking confirmation

See you soon! 🌟`
      }
    };

    return this.sendMessage(message);
  }

  formatPhoneNumber(phone: string): string {
    if (!phone) {
      console.warn('Empty phone number provided to formatPhoneNumber');
      return '';
    }

    console.log('Formatting phone number:', phone);
    
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');
    console.log('Cleaned phone number:', cleaned);
    
    // Handle empty string after cleaning
    if (!cleaned) {
      console.warn('No digits found in phone number');
      return '';
    }
    
    // If it starts with 0, replace with NZ country code (64)
    if (cleaned.startsWith('0')) {
      cleaned = '64' + cleaned.substring(1);
      console.log('Applied NZ country code for 0 prefix:', cleaned);
    }
    
    // If it doesn't start with 64 (NZ country code), add it
    if (!cleaned.startsWith('64')) {
      cleaned = '64' + cleaned;
      console.log('Added NZ country code:', cleaned);
    }
    
    // Ensure the number has a reasonable length (NZ mobile numbers are typically 11 digits with country code)
    if (cleaned.length < 10 || cleaned.length > 15) {
      console.warn('Phone number length seems invalid:', cleaned.length, 'digits');
    }
    
    console.log('Final formatted phone number:', cleaned);
    return cleaned;
  }
}

export const whatsAppService = new WhatsAppService();
export type { BookingDetails };
