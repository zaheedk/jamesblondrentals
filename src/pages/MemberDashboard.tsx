
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, BookOpen, TrendingUp, MessageSquare, Calendar, Users } from 'lucide-react';
import SupabaseBookingHistory from '@/components/member/SupabaseBookingHistory';

export default function MemberDashboard() {
  const { user, signOut } = useAuth();
  const isAdmin = user?.email === 'zaheedk@gmail.com';

  if (!user) {
    return null;
  }

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

      <SupabaseBookingHistory />
    </div>
  );
}
