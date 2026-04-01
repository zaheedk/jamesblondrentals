
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, BookOpen, TrendingUp, MessageSquare, Calendar, Users, Car, UserCircle, FileText, AlertTriangle, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import SupabaseBookingHistory from '@/components/member/SupabaseBookingHistory';
import ProfileForm from '@/components/member/ProfileForm';
import { useUserRole } from '@/hooks/use-user-role';

export default function MemberDashboard() {
  const { user, signOut } = useAuth();
  const { isAdmin, isOfficeAdmin, isLoading: isRoleLoading } = useUserRole();
  const [savoLoading, setSavoLoading] = useState(false);

  const handleReportAccident = async () => {
    if (!user?.email) return;
    setSavoLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-to-savo', {
        body: {
          email: user.email,
          fullName: user.user_metadata?.full_name || user.email,
          regoNumber: '',
        },
      });
      if (error) throw error;
      if (data?.login_url) {
        window.open(data.login_url, '_blank', 'noopener,noreferrer');
      } else {
        window.open('https://savo.co.nz', '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('Savo login error:', err);
      window.open('https://savo.co.nz', '_blank', 'noopener,noreferrer');
    } finally {
      setSavoLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  console.log('MemberDashboard role state:', { isAdmin, isOfficeAdmin, isRoleLoading });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Member Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user.email}</p>
        </div>
        <Button variant="outline" onClick={signOut} className="mt-4 md:mt-0">
          Log Out
        </Button>
      </div>

      {isAdmin && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Admin Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                <Link to="/admin/blog">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Blog Management
                  </Button>
                </Link>
                <Link to="/admin/vehicle-rates">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Price Scraping
                  </Button>
                </Link>
                <Link to="/admin/feedback">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Customer Feedback
                  </Button>
                </Link>
                <Link to="/admin/bookings">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    All Bookings
                  </Button>
                </Link>
                <Link to="/admin/customers">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Users className="w-4 h-4 mr-2" />
                    Customers
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isOfficeAdmin && !isAdmin && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Office Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Link to="/ra">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <FileText className="w-4 h-4 mr-2" />
                    Rental Agreements
                  </Button>
                </Link>
                <Link to="/admin/bookings">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    Bookings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Car className="w-4 h-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserCircle className="w-4 h-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <SupabaseBookingHistory />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>
      </Tabs>

      {/* Report an Accident - Savo Integration */}
      <div className="mt-8">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-semibold">Had an accident?</p>
                <p className="text-sm text-muted-foreground">Report it quickly through our accident reporting tool</p>
              </div>
            </div>
            <Button
              onClick={handleReportAccident}
              disabled={savoLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {savoLoading ? 'Opening...' : 'Report an Accident'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
