
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useWhatsApp } from '@/hooks/use-whatsapp';
import { MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

const WhatsAppNotifications = () => {
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { sendPickupReminder, sendBookingConfirmation } = useWhatsApp();

  const handleSendReminder = async () => {
    if (!phone || !customerName || !vehicleName || !pickupDate || !pickupLocation) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await sendPickupReminder(phone, customerName, vehicleName, pickupDate, pickupLocation);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendBookingConfirmation = async () => {
    if (!phone || !customerName || !vehicleName) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsLoading(true);
    try {
      await sendBookingConfirmation({
        customerName,
        customerPhone: phone,
        vehicleName,
        pickupDate: pickupDate || 'TBC',
        dropoffDate: 'TBC',
        pickupLocation: pickupLocation || 'TBC',
        bookingReference: 'ADMIN-' + Date.now(),
        totalAmount: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          WhatsApp Notifications
        </CardTitle>
        <CardDescription>
          Send manual WhatsApp notifications to customers
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Customer Phone</Label>
            <Input
              id="phone"
              placeholder="+64 21 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              placeholder="John Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="vehicleName">Vehicle Name</Label>
            <Input
              id="vehicleName"
              placeholder="Toyota Corolla"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="pickupDate">Pickup Date</Label>
            <Input
              id="pickupDate"
              placeholder="Monday, 25 June 2024"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="pickupLocation">Pickup Location</Label>
          <Input
            id="pickupLocation"
            placeholder="Auckland Airport"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSendBookingConfirmation}
            disabled={isLoading}
            className="flex-1"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Booking Confirmation
          </Button>
          
          <Button
            onClick={handleSendReminder}
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Pickup Reminder
          </Button>
        </div>
        
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <strong>Setup Required:</strong> To use WhatsApp notifications, you need to:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Get WhatsApp Business API access</li>
            <li>Set WHATSAPP_ACCESS_TOKEN environment variable</li>
            <li>Set WHATSAPP_PHONE_NUMBER_ID environment variable</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppNotifications;
