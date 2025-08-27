import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Send } from "lucide-react";

const EmailTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    to: "zaheedk@gmail.com",
    subject: "Test Email from James Blond Website",
    message: "Hello! This is a test email sent from the James Blond website using Office 365 SMTP. If you receive this, the email system is working correctly!"
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendTestEmail = async () => {
    setIsLoading(true);
    
    try {
      console.log('Sending test email via Office 365 SMTP...');
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Test Email from James Blond Website
          </h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; line-height: 1.6;">${formData.message}</p>
          </div>
          <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0056b3;">Technical Details:</h3>
            <ul style="margin: 10px 0;">
              <li>Sent via: Office 365 SMTP</li>
              <li>Timestamp: ${new Date().toLocaleString()}</li>
              <li>From: James Blond Car Rentals</li>
            </ul>
          </div>
          <hr style="margin: 30px 0; border: 1px solid #dee2e6;">
          <p style="color: #666; font-size: 14px; text-align: center;">
            This email was sent from jamesblond.co.nz email testing system
          </p>
        </div>
      `;

      const { data, error } = await supabase.functions.invoke('send-office365-email', {
        body: {
          to: formData.to,
          subject: formData.subject,
          html: emailHtml,
          from_name: 'Email Test System',
          from_email: 'test@jamesblond.co.nz'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to send email');
      }

      console.log('Email function response:', data);

      if (data?.success) {
        toast({
          title: "✅ Email Sent Successfully!",
          description: `Test email sent to ${formData.to} via Office 365 SMTP`,
        });
      } else {
        throw new Error(data?.error || 'Email sending failed');
      }
      
    } catch (error: any) {
      console.error('Error sending test email:', error);
      toast({
        title: "❌ Email Failed",
        description: error.message || "Failed to send test email. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendQuickTest = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-office365-email', {
        body: {
          to: "zaheedk@gmail.com",
          subject: "TEST_EMAIL", // This triggers the built-in test email
          html: "quick test"
        }
      });

      if (error) throw new Error(error.message);

      if (data?.success) {
        toast({
          title: "✅ Quick Test Email Sent!",
          description: "Built-in test email sent to zaheedk@gmail.com",
        });
      } else {
        throw new Error(data?.error || 'Quick test failed');
      }
      
    } catch (error: any) {
      console.error('Error sending quick test:', error);
      toast({
        title: "❌ Quick Test Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <Mail className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Email Test System</h1>
          <p className="text-gray-600">Test Office 365 SMTP email functionality</p>
        </div>

        <div className="space-y-6">
          {/* Quick Test Card */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Quick Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                Send a pre-configured test email to zaheedk@gmail.com to verify SMTP setup.
              </p>
              <Button 
                onClick={sendQuickTest}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Quick Test...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Quick Test Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Custom Test Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Custom Test Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="to">To Email Address</Label>
                <Input
                  id="to"
                  name="to"
                  type="email"
                  value={formData.to}
                  onChange={handleInputChange}
                  placeholder="recipient@example.com"
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Email subject"
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your test message..."
                  rows={6}
                />
              </div>

              <Button 
                onClick={sendTestEmail}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Custom Test Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Uses your Office 365 SMTP credentials</li>
                <li>• Connects to smtp.office365.com:587</li>
                <li>• Sends via TLS encrypted connection</li>
                <li>• Check the browser console for detailed SMTP logs</li>
                <li>• Check the edge function logs for server-side details</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailTest;