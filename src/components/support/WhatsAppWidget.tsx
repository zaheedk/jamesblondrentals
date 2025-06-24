
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const whatsappNumber = '+6480025663'; // James Blond support number
  
  const quickMessages = [
    {
      title: "General Inquiry",
      message: "Hi! I'd like to know more about your car rental services."
    },
    {
      title: "Booking Help",
      message: "Hi! I need help with making a booking on your website."
    },
    {
      title: "Existing Booking",
      message: "Hi! I have a question about my existing booking."
    },
    {
      title: "Pricing Information",
      message: "Hi! Can you provide pricing information for vehicle rentals?"
    }
  ];

  const sendWhatsAppMessage = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 shadow-lg"
            size="icon"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        )}
        
        {/* WhatsApp Chat Widget */}
        {isOpen && (
          <Card className="w-80 shadow-xl border-2 border-green-500">
            <CardHeader className="bg-green-500 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">WhatsApp Support</CardTitle>
                  <CardDescription className="text-green-100">
                    Chat with James Blond team
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-green-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Choose a quick message or start a custom chat:
              </p>
              
              {quickMessages.map((msg, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-3"
                  onClick={() => sendWhatsAppMessage(msg.message)}
                >
                  <div>
                    <div className="font-medium text-sm">{msg.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {msg.message.substring(0, 50)}...
                    </div>
                  </div>
                </Button>
              ))}
              
              <Button
                className="w-full bg-green-500 hover:bg-green-600 mt-4"
                onClick={() => sendWhatsAppMessage("Hi! I have a question about James Blond Car Rentals.")}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Custom Chat
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                Available: Mon-Fri 8AM-5PM NZT
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default WhatsAppWidget;
