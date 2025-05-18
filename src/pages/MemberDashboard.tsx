
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRcmApi } from '@/hooks/use-rcm-api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingHistory from '@/components/member/BookingHistory';

export default function MemberDashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');

  if (!user) {
    return null; // Will be handled by ProtectedRoute
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Member Dashboard</h1>
          <p className="text-gray-500">Welcome, {user.email}</p>
        </div>
        <Button variant="outline" onClick={signOut} className="mt-4 md:mt-0">
          Log Out
        </Button>
      </div>

      <Tabs 
        defaultValue="bookings" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full max-w-md">
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings" className="mt-6">
          <BookingHistory userEmail={user.email || ''} />
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preferences" className="mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            <p className="text-gray-500">
              This section will be available soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
