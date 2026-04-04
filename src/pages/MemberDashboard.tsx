
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, BookOpen, TrendingUp, MessageSquare, Calendar, Users, Car, UserCircle, FileText, AlertTriangle, Camera, ImageIcon, Upload } from 'lucide-react';
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                <Link to="/admin/blog">
                  <Button variant="outline" className="w-full justify-start text-xs sm:text-sm" size="lg">
                    <BookOpen className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">Blog Management</span>
                  </Button>
                </Link>
                <Link to="/admin/vehicle-rates">
                  <Button variant="outline" className="w-full justify-start text-xs sm:text-sm" size="lg">
                    <TrendingUp className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">Price Scraping</span>
                  </Button>
                </Link>
                <Link to="/admin/feedback">
                  <Button variant="outline" className="w-full justify-start text-xs sm:text-sm" size="lg">
                    <MessageSquare className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">Customer Feedback</span>
                  </Button>
                </Link>
                <Link to="/admin/bookings">
                  <Button variant="outline" className="w-full justify-start text-xs sm:text-sm" size="lg">
                    <Calendar className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">All Bookings</span>
                  </Button>
                </Link>
                <Link to="/admin/customers">
                  <Button variant="outline" className="w-full justify-start text-xs sm:text-sm" size="lg">
                    <Users className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">Customers</span>
                  </Button>
                </Link>
                <Link to="/admin/import-bookings">
                  <Button variant="outline" className="w-full justify-start text-xs sm:text-sm" size="lg">
                    <Upload className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">Import Bookings</span>
                  </Button>
                </Link>
                <Link to="/admin/infringements">
                  <Button variant="outline" className="w-full justify-start text-xs sm:text-sm" size="lg">
                    <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">Infringements</span>
                  </Button>
                </Link>
                <Link to="/photos">
                  <Button variant="outline" className="w-full justify-start text-xs sm:text-sm" size="lg">
                    <Camera className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">Vehicle Photos</span>
                  </Button>
                </Link>
                <Link to="/photo-gallery">
                  <Button variant="outline" className="w-full justify-start text-xs sm:text-sm" size="lg">
                    <ImageIcon className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">Photo Gallery</span>
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
                <Link to="/photos">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Camera className="w-4 h-4 mr-2" />
                    Vehicle Photos
                  </Button>
                </Link>
                <Link to="/photo-gallery">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Photo Gallery
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
