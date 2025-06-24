
interface WhatsAppMessage {
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
  private phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  private accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';

  async sendBookingConfirmation(bookingDetails: BookingDetails): Promise<boolean> {
    try {
      const message: WhatsAppMessage = {
        to: bookingDetails.customerPhone,
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

      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        console.error('WhatsApp API error:', await response.text());
        return false;
      }

      console.log('WhatsApp booking confirmation sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  async sendPaymentConfirmation(customerPhone: string, customerName: string, amount: number, bookingRef: string): Promise<boolean> {
    try {
      const message: WhatsAppMessage = {
        to: customerPhone,
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

      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending payment confirmation:', error);
      return false;
    }
  }

  async sendPickupReminder(customerPhone: string, customerName: string, vehicleName: string, pickupDate: string, pickupLocation: string): Promise<boolean> {
    try {
      const message: WhatsAppMessage = {
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

      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending pickup reminder:', error);
      return false;
    }
  }

  formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');
    
    // If it starts with 0, replace with country code (64 for NZ)
    if (cleaned.startsWith('0')) {
      cleaned = '64' + cleaned.substring(1);
    }
    
    // If it doesn't start with country code, add NZ country code
    if (!cleaned.startsWith('64')) {
      cleaned = '64' + cleaned;
    }
    
    return cleaned;
  }
}

export const whatsAppService = new WhatsAppService();
export type { BookingDetails };
