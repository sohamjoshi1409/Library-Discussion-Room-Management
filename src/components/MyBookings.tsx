import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Calendar, Clock, MapPin, Users, Crown, User as UserIcon, TrendingUp, Activity, BarChart3, type LucideIcon, X, Check, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { User, Booking, Notification } from '../App';
import type { JSX } from 'react/jsx-runtime';

interface MyBookingsProps {
  currentUser: User;
  bookings: Booking[];
  notifications: Notification[];
  onCancelBooking: (bookingId: string) => void;
  onAddNotification: (notification: Notification) => void;
  onUpdateNotification: (notificationId: string, status: 'accepted' | 'declined') => void;
  getUserName: (email: string) => string;
}

interface StatusBadge {
  bg: string;
  label: string;
}

interface StatCard {
  label: string;
  value: number;
  icon: LucideIcon;
  description: string;
}

interface BookingCardProps {
  booking: Booking;
  index: number;
  currentUser: User;
  onCancelBooking?: (bookingId: string) => void;
  onAddNotification?: (notification: Notification) => void;
  isUpcoming?: boolean;
  notifications: Notification[];
  getUserName: (email: string) => string;
}

interface BookingListProps {
  bookings: Booking[];
  emptyMessage: string;
  emptyIcon: LucideIcon;
  currentUser: User;
}

export function MyBookings({ currentUser, bookings, notifications, onCancelBooking, onAddNotification, onUpdateNotification, getUserName }: MyBookingsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const upcomingBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate >= today && booking.status !== 'cancelled';
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate < today || booking.status === 'cancelled';
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const organizedBookings = bookings.filter(booking => 
    booking.organizer === currentUser.email
  );

  const memberBookings = bookings.filter(booking => 
    booking.organizer !== currentUser.email && booking.members.includes(currentUser.email)
  );

  const getStatusBadge = (status: Booking['status']): StatusBadge => {
    const statusMap: Record<Booking['status'], StatusBadge> = {
      confirmed: { bg: 'bg-green-100 text-green-800 border-green-200', label: 'Confirmed' },
      pending: { bg: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
      cancelled: { bg: 'bg-red-100 text-red-800 border-red-200', label: 'Cancelled' },
    };
    return statusMap[status] || statusMap.confirmed;
  };

  const BookingCard = ({ booking, index, currentUser, onCancelBooking, onAddNotification, isUpcoming, notifications, getUserName }: BookingCardProps): JSX.Element => {
    const statusBadge = getStatusBadge(booking.status);
    const isOrganizer = booking.organizer === currentUser.email;

    // Check if user has pending notification for this booking
    const pendingNotification = notifications.find(notification => 
      notification.bookingId === booking.id && 
      notification.recipientEmail === currentUser.email && 
      notification.status === 'pending'
    );

    // Get member acceptance status for organizers
    const getMemberAcceptanceStatus = () => {
      if (!isOrganizer) return [];
      
      return booking.members.map(memberEmail => {
        const memberNotification = notifications.find(notification => 
          notification.bookingId === booking.id && 
          notification.recipientEmail === memberEmail
        );
        
        let status: 'accepted' | 'declined' | 'pending' = 'pending';
        if (memberNotification) {
          status = memberNotification.status;
        }
        
        return {
          email: memberEmail,
          name: getUserName(memberEmail),
          status: status
        };
      });
    };

    const memberStatuses = getMemberAcceptanceStatus();

    const getStatusIcon = (status: 'accepted' | 'declined' | 'pending') => {
      switch (status) {
        case 'accepted':
          return <CheckCircle className="h-4 w-4 text-green-600" />;
        case 'declined':
          return <XCircle className="h-4 w-4 text-red-600" />;
        case 'pending':
          return <ClockIcon className="h-4 w-4 text-yellow-600" />;
        default:
          return <ClockIcon className="h-4 w-4 text-yellow-600" />;
      }
    };

    const getStatusText = (status: 'accepted' | 'declined' | 'pending') => {
      switch (status) {
        case 'accepted':
          return 'Accepted';
        case 'declined':
          return 'Declined';
        case 'pending':
          return 'Pending';
        default:
          return 'Pending';
      }
    };

    const getStatusColor = (status: 'accepted' | 'declined' | 'pending') => {
      switch (status) {
        case 'accepted':
          return 'text-green-700';
        case 'declined':
          return 'text-red-700';
        case 'pending':
          return 'text-yellow-700';
        default:
          return 'text-yellow-700';
      }
    };

    const handleAcceptInvitation = () => {
      if (pendingNotification && onUpdateNotification) {
        onUpdateNotification(pendingNotification.id, 'accepted');
        toast.success('Invitation accepted!');
      }
    };

    const handleDeclineInvitation = () => {
      if (pendingNotification && onUpdateNotification) {
        onUpdateNotification(pendingNotification.id, 'declined');
        toast.success('Invitation declined');
      }
    };

    const handleCancelBooking = () => {
      if (onCancelBooking && onAddNotification) {
        // Send notifications before canceling
        if (isOrganizer) {
          // Organizer cancelling - notify all members
          booking.members.forEach(memberEmail => {
            const notification: Notification = {
              id: `notification-${Date.now()}-${memberEmail}-cancel`,
              bookingId: booking.id,
              recipientEmail: memberEmail,
              message: `${currentUser.name} has cancelled the booking for ${booking.roomName} on ${new Date(booking.date).toLocaleDateString()} at ${booking.timeSlot}`,
              status: 'declined', // Set as processed notification
              createdAt: new Date().toISOString(),
            };
            onAddNotification(notification);
          });
        } else {
          // Member leaving - notify organizer
          const notification: Notification = {
            id: `notification-${Date.now()}-${booking.organizer}-leave`,
            bookingId: booking.id,
            recipientEmail: booking.organizer,
            message: `${currentUser.name} has left the booking for ${booking.roomName} on ${new Date(booking.date).toLocaleDateString()} at ${booking.timeSlot}`,
            status: 'declined', // Set as processed notification
            createdAt: new Date().toISOString(),
          };
          onAddNotification(notification);
        }

        onCancelBooking(booking.id);
        
        if (isOrganizer) {
          toast.success('Booking cancelled successfully');
        } else {
          toast.success('You have left this booking');
        }
      }
    };

    const getCancelButtonText = () => {
      return isOrganizer ? 'Cancel Booking' : 'Leave Booking';
    };

    const getConfirmationTitle = () => {
      return isOrganizer ? 'Cancel Booking?' : 'Leave Booking?';
    };

    const getConfirmationDescription = () => {
      if (isOrganizer) {
        return `Are you sure you want to cancel this booking for ${booking.roomName} on ${new Date(booking.date).toLocaleDateString()}? This action cannot be undone and will notify all members.`;
      } else {
        return `Are you sure you want to leave this booking for ${booking.roomName} on ${new Date(booking.date).toLocaleDateString()}? The organizer will be notified.`;
      }
    };

    return (
      <div>
        <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {isOrganizer ? (
                    <Crown className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <UserIcon className="h-4 w-4 text-blue-600" />
                  )}
                  <h3 className="font-semibold text-lg text-foreground">{booking.roomName}</h3>
                  <Badge className={`${statusBadge.bg} border`}>
                    {statusBadge.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isOrganizer ? (
                    <span className="flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      You organized this booking
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <UserIcon className="h-3 w-3" />
                      Organized by {getUserName(booking.organizer)}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm bg-accent/50 p-3 rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  {new Date(booking.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
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

            <div className="space-y-3 bg-accent/30 p-4 rounded-lg">
              <div className="text-sm">
                <span className="font-medium text-foreground">Organizer:</span> 
                <span className="ml-2 text-muted-foreground">{getUserName(booking.organizer)}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-foreground">Members:</span>
                <div className="mt-1 text-muted-foreground break-all">
                  {booking.members.map(email => getUserName(email)).join(', ')}
                </div>
              </div>
            </div>

            {isOrganizer && (
              <div className="space-y-3 bg-accent/30 p-4 rounded-lg mt-4">
                <div className="text-sm">
                  <span className="font-medium text-foreground">Member Acceptance Status:</span>
                </div>
                <div className="space-y-2">
                  {memberStatuses.map(memberStatus => (
                    <div key={memberStatus.email} className="flex items-center justify-between p-2 bg-background rounded-md">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(memberStatus.status)}
                        <span className="text-foreground">{memberStatus.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        memberStatus.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        memberStatus.status === 'declined' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {getStatusText(memberStatus.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Created {new Date(booking.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              {isUpcoming && booking.status !== 'cancelled' && (
                <div className="flex gap-2">
                  {/* Show accept/decline buttons if user has pending notification */}
                  {pendingNotification && !isOrganizer ? (
                    <>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="ml-4"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Decline Invitation?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to decline the invitation for {booking.roomName} on {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}? This booking will be removed from your list and the organizer will be notified.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeclineInvitation}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Decline Invitation
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Accept Invitation?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to accept the invitation for {booking.roomName} on {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}? You will be committed to attend this discussion session.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleAcceptInvitation}
                              className="bg-green-600 text-white hover:bg-green-700"
                            >
                              Accept Invitation
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  ) : (
                    /* Show cancel/leave button only if no pending notification */
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive"
                          size="sm"
                          className="ml-4"
                        >
                          <X className="h-4 w-4 mr-2" />
                          {getCancelButtonText()}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{getConfirmationTitle()}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {getConfirmationDescription()}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleCancelBooking}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isOrganizer ? 'Cancel Booking' : 'Leave Booking'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const BookingList = ({ bookings, emptyMessage, emptyIcon: EmptyIcon, currentUser }: BookingListProps): JSX.Element => (
    <div className="space-y-6">
      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <EmptyIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg text-muted-foreground mb-2">{emptyMessage}</p>
          <p className="text-sm text-muted-foreground">Start booking rooms to see them here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((booking, index) => (
            <BookingCard key={booking.id} booking={booking} index={index} currentUser={currentUser} onCancelBooking={onCancelBooking} onAddNotification={onAddNotification} isUpcoming={activeTab === 'upcoming'} notifications={notifications} getUserName={getUserName} />
          ))}
        </div>
      )}
    </div>
  );

  const statsCards: StatCard[] = [
    { 
      label: "Total Bookings", 
      value: bookings.length, 
      icon: BarChart3, 
      description: "All your bookings"
    },
    { 
      label: "Upcoming", 
      value: upcomingBookings.length, 
      icon: TrendingUp, 
      description: "Future reservations"
    },
    { 
      label: "Organized", 
      value: organizedBookings.length, 
      icon: Crown, 
      description: "Bookings you created"
    },
    { 
      label: "Member of", 
      value: memberBookings.length, 
      icon: Users, 
      description: "Bookings you joined"
    },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-4xl font-semibold text-foreground mb-4">
            My Bookings
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          View and manage your discussion room reservations, track your booking history
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={stat.label}>
            <Card className="shadow-sm border border-border bg-card hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary rounded-lg">
                  <stat.icon className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upcoming' | 'past')}>
        <TabsList className="grid w-full grid-cols-2 bg-accent/50">
          <TabsTrigger 
            value="upcoming"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger 
            value="past"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Activity className="h-4 w-4 mr-2" />
            Past ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-8">
          <div>
            <BookingList 
              bookings={upcomingBookings}
              emptyMessage="No upcoming bookings"
              emptyIcon={TrendingUp}
              currentUser={currentUser}
            />
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-8">
          <div>
            <BookingList 
              bookings={pastBookings}
              emptyMessage="No past bookings"
              emptyIcon={Activity}
              currentUser={currentUser}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}