import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Bell, Check, X, Calendar, Clock, MapPin, Users, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { User, Booking, Notification } from '../App';

interface NotificationCenterProps {
  currentUser: User;
  notifications: Notification[];
  bookings: Booking[];
  onUpdateNotification: (notificationId: string, status: 'accepted' | 'declined', currentUser: User) => void;
  getUserName: (email: string) => string;
}

export function NotificationCenter({
  currentUser,
  notifications,
  bookings,
  onUpdateNotification,
  getUserName,
}: NotificationCenterProps): JSX.Element {
  const handleAccept = (notificationId: string): void => {
    onUpdateNotification(notificationId, 'accepted', currentUser);
    toast.success('Booking request accepted');
  };

  const handleDecline = (notificationId: string): void => {
    onUpdateNotification(notificationId, 'declined', currentUser);
    toast.success('Booking request declined');
  };

  const getBookingDetails = (bookingId: string): Booking | undefined => {
    return bookings.find(booking => booking.id === bookingId);
  };

  const pendingNotifications = notifications.filter(n => n.status === 'pending');
  const processedNotifications = notifications.filter(n => n.status !== 'pending');

  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-4xl font-semibold text-foreground">
            Notification Center
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Manage your booking requests and stay updated with team invitations and confirmations
        </p>
      </div>

      {/* Pending Notifications */}
      <div>
        <Card className="shadow-sm border border-border bg-card">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-foreground">
            <div className="p-2 bg-primary rounded-lg">
              <Bell className="h-6 w-6 text-primary-foreground" />
            </div>
            Pending Requests
            {pendingNotifications.length > 0 && (
              <Badge className="bg-destructive text-destructive-foreground">
                {pendingNotifications.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Booking requests that require your response
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg text-muted-foreground mb-2">No pending notifications</p>
              <p className="text-sm text-muted-foreground">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingNotifications.map((notification, index) => {
                const booking = getBookingDetails(notification.bookingId);
                if (!booking) return null;

                return (
                  <div
                    key={notification.id}
                    className="border border-border rounded-lg p-6 bg-card"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-primary text-primary-foreground">
                            New Request
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="font-medium text-foreground text-lg">{notification.message}</p>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          <div className="flex items-center gap-2 text-sm bg-accent/50 p-3 rounded-lg">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{booking.roomName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm bg-accent/50 p-3 rounded-lg">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm bg-accent/50 p-3 rounded-lg">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{booking.timeSlot}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm bg-accent/50 p-3 rounded-lg">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{booking.members.length + 1} members</span>
                          </div>
                        </div>

                        <div className="bg-accent/30 rounded-lg p-4 space-y-3">
                          <div className="text-sm">
                            <span className="font-medium text-foreground">Organizer:</span> 
                            <span className="ml-2 text-muted-foreground">{getUserName(booking.organizer)}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-foreground">Members:</span>
                            <div className="mt-1 text-muted-foreground break-all">
                              {booking.members.join(', ')}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end w-full sm:w-auto">
                        <Button
                          onClick={() => handleAccept(notification.id)}
                          className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 sm:flex-none border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Decline Booking Request?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to decline this booking request for {booking.roomName} on {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}? The organizer will be notified of your decision.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDecline(notification.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Decline Request
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-sm border-border">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="flex items-center gap-2 text-xl text-foreground">
            <CheckCircle className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your recent notification responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {processedNotifications.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg text-muted-foreground mb-2">No recent activity</p>
              <p className="text-sm text-muted-foreground">Your notification responses will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {processedNotifications
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 10)
                .map((notification, index) => {
                  const booking = getBookingDetails(notification.bookingId);
                  if (!booking) return null;

                  return (
                    <div
                      key={notification.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors gap-3"
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {(() => {
                            // Check if this is a notification generated from the current user's action
                            const isUserAction = notification.message.includes('You have been invited') ||
                                                notification.message.includes('has invited you');
                            
                            // If it's a user invitation notification, show user's action
                            if (isUserAction) {
                              return notification.status === 'accepted' 
                                ? `You accepted the invitation for ${booking.roomName} on ${new Date(booking.date).toLocaleDateString()} at ${booking.timeSlot}`
                                : notification.status === 'declined'
                                ? `You declined the invitation for ${booking.roomName} on ${new Date(booking.date).toLocaleDateString()} at ${booking.timeSlot}`
                                : notification.message;
                            }
                            
                            // If it's an organizer notification (someone else's action), show their name
                            return notification.message;
                          })()}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {booking.roomName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(booking.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {booking.timeSlot}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-shrink-0">
                        <Badge
                          className={`${
                            notification.status === 'accepted' 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-red-100 text-red-800 border-red-200'
                          } text-xs`}
                        >
                          {notification.status === 'accepted' ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Accepted
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Declined
                            </>
                          )}
                        </Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}