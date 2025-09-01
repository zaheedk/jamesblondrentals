import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Star, MessageSquare, Calendar, User, FileText, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface FeedbackEntry {
  id: string;
  rating: number;
  suggestions: string | null;
  booking_reference: string | null;
  created_at: string;
  user_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
}

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('booking_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setFeedback(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast({
        title: "Error",
        description: "Failed to load feedback data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const averageRating = feedback.length > 0 
    ? (feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length).toFixed(1)
    : '0';

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Customer Feedback</h1>
          <p className="text-muted-foreground">View and analyze customer booking experience feedback</p>
        </div>
        <Button onClick={fetchFeedback} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedback.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}</div>
            <div className="flex items-center mt-1">
              {renderStars(Math.round(parseFloat(averageRating)))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Suggestions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedback.filter(f => f.suggestions?.trim()).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading feedback...</div>
        ) : feedback.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No feedback submitted yet</p>
            </CardContent>
          </Card>
        ) : (
          feedback.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getRatingColor(item.rating)}>
                        {item.rating}/5 stars
                      </Badge>
                      <div className="flex items-center">
                        {renderStars(item.rating)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(item.created_at), 'MMM d, yyyy at h:mm a')}
                      </div>
                      {item.customer_name && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.customer_name}
                        </div>
                      )}
                      {item.customer_email && (
                        <div className="flex items-center gap-1">
                          <span>📧</span>
                          {item.customer_email}
                        </div>
                      )}
                      {item.booking_reference && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          Booking: {item.booking_reference}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              {item.suggestions?.trim() && (
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Customer Suggestions
                    </h4>
                    <p className="text-sm text-muted-foreground">{item.suggestions}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;