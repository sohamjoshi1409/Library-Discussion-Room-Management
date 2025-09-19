import { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { Navigation } from './components/Navigation';
import { BookingInterface } from './components/BookingInterface';
import { NotificationCenter } from './components/NotificationCenter';
import { MyBookings } from './components/MyBookings';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';
import type { JSX } from 'react/jsx-runtime';

// TypeScript interfaces
export interface User {
  email: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  color: string;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  date: string;
  timeSlot: string;
  members: string[];
  organizer: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Notification {
  id: string;
  bookingId: string;
  recipientEmail: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export type PageType = 'booking' | 'notifications' | 'my-bookings';

export default function App(): JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('booking');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Professional room data
  const rooms: Room[] = [
    { id: 'room-1', name: 'Discussion Room A', capacity: 4, color: 'slate' },
    { id: 'room-2', name: 'Discussion Room B', capacity: 4, color: 'slate' },
    { id: 'room-3', name: 'Discussion Room C', capacity: 4, color: 'slate' },
  ];

  const timeSlots: string[] = [
    '08:00-10:00',
    '10:00-12:00',
    '12:00-14:00',
    '14:00-16:00',
    '16:00-18:00',
    '18:00-20:00',
  ];

  // User mapping for email to name conversion
  const userMap: Record<string, string> = {
    'user@example.com': 'Soham Joshi',
    'john@example.com': 'John Smith',
    'sarah@example.com': 'Sarah Johnson',
    'mike@example.com': 'Mike Wilson',
    'tom@example.com': 'Tom Smith',
    'lisa@example.com': 'Lisa Brown',
    'david@example.com': 'David Davis',
    'kate@example.com': 'Kate Johnson',
    'alex@example.com': 'Alex Miller',
    'sophie@example.com': 'Sophie Clark',
    'alice@example.com': 'Alice White',
    'bob@example.com': 'Bob Green',
    'charlie@example.com': 'Charlie Black',
    'diana@example.com': 'Diana Gray',
    'eve@example.com': 'Eve Blue',
    'frank@example.com': 'Frank Red',
    'grace@example.com': 'Grace Purple',
    'henry@example.com': 'Henry Orange',
    'anna@example.com': 'Anna Pink',
    'peter@example.com': 'Peter Silver',
    'mary@example.com': 'Mary Gold',
    'james@example.com': 'James Bronze',
    'emily@example.com': 'Emily Copper',
    'robert@example.com': 'Robert Steel',
  };

  const getUserName = (email: string): string => {
    return userMap[email] || email.split('@')[0];
  };

  useEffect(() => {
    if (!isInitialized) {
      const mockBookings: Booking[] = [
        {
          id: 'booking-1',
          roomId: 'room-1',
          roomName: 'Discussion Room A',
          date: '2025-09-12',
          timeSlot: '10:00-12:00',
          members: ['bob@example.com', 'charlie@example.com', 'diana@example.com'],
          organizer: 'alice@example.com',
          status: 'confirmed',
          createdAt: '2025-09-10T10:00:00Z',
        },
        {
          id: 'booking-2',
          roomId: 'room-2',
          roomName: 'Discussion Room B',
          date: '2025-09-12',
          timeSlot: '14:00-16:00',
          members: ['frank@example.com', 'grace@example.com', 'henry@example.com'],
          organizer: 'eve@example.com',
          status: 'confirmed',
          createdAt: '2025-09-10T14:00:00Z',
        },
        {
          id: 'booking-3',
          roomId: 'room-3',
          roomName: 'Discussion Room C',
          date: '2025-09-20',
          timeSlot: '08:00-10:00',
          members: ['john@example.com', 'sarah@example.com', 'mike@example.com'],
          organizer: 'user@example.com',
          status: 'pending',
          createdAt: '2025-09-19T15:30:00Z',
        },
        {
          id: 'booking-4',
          roomId: 'room-1',
          roomName: 'Discussion Room A',
          date: '2025-09-21',
          timeSlot: '12:00-14:00',
          members: ['user@example.com', 'lisa@example.com', 'david@example.com'],
          organizer: 'tom@example.com',
          status: 'pending',
          createdAt: '2025-09-19T16:00:00Z',
        },
        {
          id: 'booking-5',
          roomId: 'room-2',
          roomName: 'Discussion Room B',
          date: '2025-09-18',
          timeSlot: '16:00-18:00',
          members: ['anna@example.com', 'peter@example.com', 'mary@example.com'],
          organizer: 'user@example.com',
          status: 'confirmed',
          createdAt: '2025-09-15T11:20:00Z',
        },
        {
          id: 'booking-6',
          roomId: 'room-3',
          roomName: 'Discussion Room C',
          date: '2025-09-15',
          timeSlot: '14:00-16:00',
          members: ['james@example.com', 'emily@example.com', 'robert@example.com'],
          organizer: 'user@example.com',
          status: 'cancelled',
          createdAt: '2025-09-12T09:45:00Z',
        },
        {
          id: 'booking-7',
          roomId: 'room-1',
          roomName: 'Discussion Room A',
          date: '2025-09-25',
          timeSlot: '10:00-12:00',
          members: ['user@example.com', 'alex@example.com', 'sophie@example.com'],
          organizer: 'kate@example.com',
          status: 'pending',
          createdAt: '2025-09-19T14:15:00Z',
        },
        // Test booking with exactly 3 members to test auto-cancellation
        {
          id: 'booking-8',
          roomId: 'room-2',
          roomName: 'Discussion Room B',
          date: '2025-09-24',
          timeSlot: '14:00-16:00',
          members: ['user@example.com', 'john@example.com', 'sarah@example.com'],
          organizer: 'mike@example.com',
          status: 'pending',
          createdAt: '2025-09-19T17:00:00Z',
        },
      ];

      const mockNotifications: Notification[] = [
        {
          id: 'notif-1',
          bookingId: 'booking-3',
          recipientEmail: 'john@example.com',
          message: 'Soham Joshi has invited you to a discussion room booking',
          status: 'pending',
          createdAt: '2025-09-19T15:30:00Z',
        },
        {
          id: 'notif-2',
          bookingId: 'booking-3',
          recipientEmail: 'sarah@example.com',
          message: 'Soham Joshi has invited you to a discussion room booking',
          status: 'pending',
          createdAt: '2025-09-19T15:30:00Z',
        },
        {
          id: 'notif-3',
          bookingId: 'booking-3',
          recipientEmail: 'mike@example.com',
          message: 'Soham Joshi has invited you to a discussion room booking',
          status: 'accepted',
          createdAt: '2025-09-19T15:30:00Z',
        },
        {
          id: 'notif-4',
          bookingId: 'booking-4',
          recipientEmail: 'user@example.com',
          message: 'Tom Smith has invited you to a discussion room booking',
          status: 'pending',
          createdAt: '2025-09-19T16:00:00Z',
        },
        {
          id: 'notif-5',
          bookingId: 'booking-4',
          recipientEmail: 'lisa@example.com',
          message: 'Tom Smith has invited you to a discussion room booking',
          status: 'pending',
          createdAt: '2025-09-19T16:00:00Z',
        },
        {
          id: 'notif-6',
          bookingId: 'booking-4',
          recipientEmail: 'david@example.com',
          message: 'Tom Smith has invited you to a discussion room booking',
          status: 'accepted',
          createdAt: '2025-09-19T16:00:00Z',
        },
        {
          id: 'notif-7',
          bookingId: 'booking-7',
          recipientEmail: 'user@example.com',
          message: 'Kate Johnson has invited you to a discussion room booking',
          status: 'pending',
          createdAt: '2025-09-19T14:15:00Z',
        },
        {
          id: 'notif-8',
          bookingId: 'booking-7',
          recipientEmail: 'alex@example.com',
          message: 'Kate Johnson has invited you to a discussion room booking',
          status: 'pending',
          createdAt: '2025-09-19T14:15:00Z',
        },
        {
          id: 'notif-9',
          bookingId: 'booking-7',
          recipientEmail: 'sophie@example.com',
          message: 'Kate Johnson has invited you to a discussion room booking',
          status: 'accepted',
          createdAt: '2025-09-19T14:15:00Z',
        },
        // Self-notifications for previously accepted bookings
        {
          id: 'notif-self-mike',
          bookingId: 'booking-3',
          recipientEmail: 'mike@example.com',
          message: 'You accepted the invitation for Discussion Room C on 9/20/2025 at 08:00-10:00 organized by Soham Joshi',
          status: 'accepted',
          createdAt: '2025-09-19T15:31:00Z',
        },
        {
          id: 'notif-self-david',
          bookingId: 'booking-4',
          recipientEmail: 'david@example.com',
          message: 'You accepted the invitation for Discussion Room A on 9/21/2025 at 12:00-14:00 organized by Tom Smith',
          status: 'accepted',
          createdAt: '2025-09-19T16:01:00Z',
        },
        {
          id: 'notif-self-sophie',
          bookingId: 'booking-7',
          recipientEmail: 'sophie@example.com',
          message: 'You accepted the invitation for Discussion Room A on 9/25/2025 at 10:00-12:00 organized by Kate Johnson',
          status: 'accepted',
          createdAt: '2025-09-19T14:16:00Z',
        },
        // Notifications for the test booking (booking-8) to test auto-cancellation
        {
          id: 'notif-10',
          bookingId: 'booking-8',
          recipientEmail: 'user@example.com',
          message: 'Mike Wilson has invited you to a discussion room booking',
          status: 'pending',
          createdAt: '2025-09-19T17:00:00Z',
        },
        {
          id: 'notif-11',
          bookingId: 'booking-8',
          recipientEmail: 'john@example.com',
          message: 'Mike Wilson has invited you to a discussion room booking',
          status: 'pending',
          createdAt: '2025-09-19T17:00:00Z',
        },
        {
          id: 'notif-12',
          bookingId: 'booking-8',
          recipientEmail: 'sarah@example.com',
          message: 'Mike Wilson has invited you to a discussion room booking',
          status: 'pending',
          createdAt: '2025-09-19T17:00:00Z',
        },
      ];

      setBookings(mockBookings);
      setNotifications(mockNotifications);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const handleLogin = (email: string, name: string): void => {
    // Always use the mapped name if available, regardless of what the user types
    const correctName = getUserName(email);
    setCurrentUser({ email, name: correctName });
  };

  const handleLogout = (): void => {
    setCurrentUser(null);
    setCurrentPage('booking');
  };

  const addBooking = (booking: Booking): void => {
    setBookings(prev => [...prev, booking]);
  };

  const addNotification = (notification: Notification): void => {
    setNotifications(prev => [...prev, notification]);
  };

  const updateNotification = (notificationId: string, status: 'accepted' | 'declined', currentUser: User): void => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    const booking = bookings.find(b => b.id === notification.bookingId);
    if (!booking) return;

    console.log('Updating notification:', {
      notificationId,
      status,
      bookingId: booking.id,
      bookingMembers: booking.members,
      organizer: booking.organizer
    });

    // Update the notification status first
    setNotifications(prev => {
      const updatedNotifications = prev.map(notif =>
        notif.id === notificationId ? { ...notif, status } : notif
      );

      // Check if all members have accepted using the updated notifications
      if (status === 'accepted') {
        // Get all notifications for this booking that are for actual members (not organizer)
        const memberNotifications = updatedNotifications.filter(n => 
          n.bookingId === notification.bookingId && 
          booking.members.includes(n.recipientEmail) // Only count notifications for actual members
        );
        
        console.log('Member notifications:', memberNotifications);
        
        const allAccepted = memberNotifications.every(n => n.status === 'accepted');
        const hasAllNotifications = memberNotifications.length === booking.members.length;
        
        console.log('Checking confirmation:', {
          allAccepted,
          hasAllNotifications,
          memberNotificationsCount: memberNotifications.length,
          bookingMembersCount: booking.members.length
        });
        
        if (allAccepted && hasAllNotifications) {
          console.log('All members accepted! Confirming booking:', booking.id);
          // Update booking status to confirmed
          setBookings(prevBookings =>
            prevBookings.map(bookingItem =>
              bookingItem.id === notification.bookingId
                ? { ...bookingItem, status: 'confirmed' }
                : bookingItem
            )
          );
        }
      } else if (status === 'declined') {
        // If user declined, remove them from the booking's members array
        setBookings(prevBookings =>
          prevBookings.map(bookingItem => {
            if (bookingItem.id === notification.bookingId) {
              const updatedMembers = bookingItem.members.filter(memberEmail => memberEmail !== currentUser.email);
              
              // If less than 3 members remain (excluding organizer), cancel the booking
              const shouldCancel = updatedMembers.length < 3;
              
              console.log('Member declined, checking cancellation:', {
                bookingId: bookingItem.id,
                originalMembersCount: bookingItem.members.length,
                updatedMembersCount: updatedMembers.length,
                shouldCancel
              });
              
              return {
                ...bookingItem,
                members: updatedMembers,
                status: shouldCancel ? 'cancelled' : bookingItem.status
              };
            }
            return bookingItem;
          })
        );
      }

      return updatedNotifications;
    });

    // Send notification to organizer
    if (status === 'accepted') {
      const organizerNotification: Notification = {
        id: `notification-${Date.now()}-organizer-accept`,
        bookingId: booking.id,
        recipientEmail: booking.organizer,
        message: `${currentUser.name} has accepted your invitation for ${booking.roomName} on ${new Date(booking.date).toLocaleDateString()} at ${booking.timeSlot}`,
        status: 'accepted', // Set as processed notification for recent activity
        createdAt: new Date().toISOString(),
      };
      
      setNotifications(prev => [...prev, organizerNotification]);

      // Send self-notification to the user who accepted
      const selfNotification: Notification = {
        id: `notification-${Date.now()}-self-accept`,
        bookingId: booking.id,
        recipientEmail: currentUser.email,
        message: `You accepted the invitation for ${booking.roomName} on ${new Date(booking.date).toLocaleDateString()} at ${booking.timeSlot} organized by ${getUserName(booking.organizer)}`,
        status: 'accepted', // Set as processed notification for recent activity
        createdAt: new Date().toISOString(),
      };
      
      setNotifications(prev => [...prev, selfNotification]);
    } else if (status === 'declined') {
      const organizerNotification: Notification = {
        id: `notification-${Date.now()}-organizer-decline`,
        bookingId: booking.id,
        recipientEmail: booking.organizer,
        message: `${currentUser.name} has declined your invitation for ${booking.roomName} on ${new Date(booking.date).toLocaleDateString()} at ${booking.timeSlot}`,
        status: 'declined', // Set as processed notification for recent activity
        createdAt: new Date().toISOString(),
      };
      
      setNotifications(prev => [...prev, organizerNotification]);

      // Send self-notification to the user who declined
      const selfNotification: Notification = {
        id: `notification-${Date.now()}-self-decline`,
        bookingId: booking.id,
        recipientEmail: currentUser.email,
        message: `You declined the invitation for ${booking.roomName} on ${new Date(booking.date).toLocaleDateString()} at ${booking.timeSlot} organized by ${getUserName(booking.organizer)}`,
        status: 'declined', // Set as processed notification for recent activity
        createdAt: new Date().toISOString(),
      };
      
      setNotifications(prev => [...prev, selfNotification]);
    }
  };

  const cancelBooking = (bookingId: string): void => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      )
    );
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <LoginForm onLogin={handleLogin} />
        <Toaster />
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'booking':
        return (
          <BookingInterface
            currentUser={currentUser}
            rooms={rooms}
            timeSlots={timeSlots}
            bookings={bookings}
            onAddBooking={addBooking}
            onAddNotification={addNotification}
          />
        );
      case 'notifications':
        return (
          <NotificationCenter
            currentUser={currentUser}
            notifications={notifications.filter(n => n.recipientEmail === currentUser.email)}
            bookings={bookings}
            onUpdateNotification={(notificationId, status) => updateNotification(notificationId, status, currentUser)}
            getUserName={getUserName}
          />
        );
      case 'my-bookings':
        return (
          <MyBookings
            currentUser={currentUser}
            bookings={bookings.filter(b => 
              b.organizer === currentUser.email || b.members.includes(currentUser.email)
            )}
            notifications={notifications}
            onCancelBooking={cancelBooking}
            onAddNotification={addNotification}
            onUpdateNotification={(notificationId, status) => updateNotification(notificationId, status, currentUser)}
            getUserName={getUserName}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        user={currentUser}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-6 py-8 max-w-7xl flex-1">
        <div className="w-full">
          {renderCurrentPage()}
        </div>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
}