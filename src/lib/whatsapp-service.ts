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
    try {
      console.log('Sending WhatsApp message:', {
        phoneNumberId: this.phoneNumberId,
        to: message.to,
        messageType: message.type
      });

      if (!this.phoneNumberId || !this.accessToken) {
        console.error('WhatsApp configuration missing:', {
          hasPhoneNumberId: !!this.phoneNumberId,
          hasAccessToken: !!this.accessToken
        });
        return false;
      }

      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      console.log('WhatsApp API URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const responseText = await response.text();
      console.log('WhatsApp API response status:', response.status);
      console.log('WhatsApp API response:', responseText);

      if (!response.ok) {
        console.error('WhatsApp API error:', responseText);
        return false;
      }

      console.log('WhatsApp message sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  async sendBookingConfirmation(bookingDetails: BookingDetails): Promise<boolean> {
    const message: WhatsAppMessage = {
      messaging_product: 'whatsapp',
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

    return this.sendMessage(message);
  }

  async sendPaymentConfirmation(customerPhone: string, customerName: string, amount: number, bookingRef: string): Promise<boolean> {
    const message: WhatsAppMessage = {
      messaging_product: 'whatsapp',
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

    return this.sendMessage(message);
  }

  async sendPickupReminder(customerPhone: string, customerName: string, vehicleName: string, pickupDate: string, pickupLocation: string): Promise<boolean> {
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
