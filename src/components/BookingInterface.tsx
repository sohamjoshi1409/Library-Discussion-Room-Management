import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar, Clock, Users, MapPin, Plus, Check, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { type User, type Room, type Booking, type Notification } from '../App';

interface BookingInterfaceProps {
  currentUser: User;
  rooms: Room[];
  timeSlots: string[];
  bookings: Booking[];
  onAddBooking: (booking: Booking) => void;
  onAddNotification: (notification: Notification) => void;
}

export function BookingInterface({
  currentUser,
  rooms,
  timeSlots,
  bookings,
  onAddBooking,
  onAddNotification,
}: BookingInterfaceProps): JSX.Element {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [members, setMembers] = useState<string[]>(['', '', '']);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const today = new Date().toISOString().split('T')[0];

  const isSlotAvailable = (roomId: string, date: string, timeSlot: string): boolean => {
    return !bookings.some(
      booking =>
        booking.roomId === roomId &&
        booking.date === date &&
        booking.timeSlot === timeSlot &&
        booking.status !== 'cancelled'
    );
  };

  const hasGroupBookedToday = (date: string, memberEmails: string[]): boolean => {
    const groupSet = new Set([currentUser.email, ...memberEmails.filter(email => email)]);
    
    return bookings.some(booking => {
      if (booking.date !== date || booking.status === 'cancelled') return false;
      
      const bookingMembers = new Set([booking.organizer, ...booking.members]);
      
      for (const member of groupSet) {
        if (bookingMembers.has(member)) return true;
      }
      return false;
    });
  };

  const getAvailableTimeSlots = (): string[] => {
    if (!selectedRoom || !selectedDate) return [];
    
    return timeSlots.filter(slot =>
      isSlotAvailable(selectedRoom, selectedDate, slot)
    );
  };

  const getRoomColorClass = (color: string): string => {
    return 'bg-muted text-muted-foreground border-border';
  };

  const handleMemberChange = (index: number, value: string): void => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const addMember = (): void => {
    setMembers([...members, '']);
  };

  const removeMember = (index: number): void => {
    if (index < 3) {
      toast.error('Cannot remove required members. First 3 members are mandatory.');
      return;
    }
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!selectedRoom || !selectedDate || !selectedTimeSlot) {
      toast.error('Please select room, date, and time slot');
      return;
    }

    const validMembers = members.filter(email => email.trim() !== '');
    if (validMembers.length < 3) {
      toast.error('Please enter at least 3 additional member email addresses');
      return;
    }

    const allEmails = [currentUser.email, ...validMembers];
    const uniqueEmails = new Set(allEmails);
    if (uniqueEmails.size !== allEmails.length) {
      toast.error('Each member email must be unique');
      return;
    }

    if (hasGroupBookedToday(selectedDate, validMembers)) {
      toast.error('This group has already booked a room for this day');
      return;
    }

    if (!isSlotAvailable(selectedRoom, selectedDate, selectedTimeSlot)) {
      toast.error('This time slot is no longer available');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingId = `booking-${Date.now()}`;
      const selectedRoomData = rooms.find(r => r.id === selectedRoom);
      
      const newBooking: Booking = {
        id: bookingId,
        roomId: selectedRoom,
        roomName: selectedRoomData?.name || 'Unknown Room',
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        members: validMembers,
        organizer: currentUser.email,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      validMembers.forEach(email => {
        const notification: Notification = {
          id: `notification-${Date.now()}-${email}`,
          bookingId,
          recipientEmail: email,
          message: `${currentUser.name} has invited you to a discussion room booking`,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        onAddNotification(notification);
      });

      onAddBooking(newBooking);

      setSelectedRoom('');
      setSelectedTimeSlot('');
      setMembers(['', '', '']);

      toast.success('Booking created! Notifications sent to all members.');
    } catch (error) {
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSlots = getAvailableTimeSlots();

  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-4xl font-semibold text-foreground mb-4">
            Book a Discussion Room
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Reserve a discussion room for your study group. All members must confirm the booking to ensure everyone is available.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="xl:col-span-2">
          <Card className="shadow-sm border border-border bg-card">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-foreground">
                <div className="p-2 bg-primary rounded-lg">
                  <Plus className="h-6 w-6 text-primary-foreground" />
                </div>
                Create New Booking
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Fill in the details below to reserve a discussion room for your team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Date Selection - Today Only */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date (Today Only)
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    min={today}
                    max={today}
                    value={selectedDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
                    className="h-11 bg-input-background border-border focus:border-ring focus:ring-ring/20"
                    disabled
                    required
                  />
                </div>

                {/* Room Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Room
                  </Label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger className="h-11 bg-input-background border-border focus:border-ring">
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span>{room.name}</span>
                            <span className="text-muted-foreground text-xs">(Capacity: {room.capacity})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Slot Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time Slot
                  </Label>
                  <Select 
                    value={selectedTimeSlot} 
                    onValueChange={setSelectedTimeSlot}
                    disabled={!selectedRoom || !selectedDate}
                  >
                    <SelectTrigger className="h-11 bg-input-background border-border focus:border-ring">
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots.map(slot => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedRoom && selectedDate && availableSlots.length === 0 && (
                    <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                      No available time slots for this room and date
                    </p>
                  )}
                </div>

                {/* Member Emails */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Team Members
                    </Label>
                    {members.length < 6 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addMember}
                        className="h-8 px-3"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Member
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg border border-border">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-foreground">
                        Organizer: {currentUser.email}
                      </span>
                    </div>
                    {members.map((email, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="email"
                          placeholder={`Member ${index + 1} email address${index < 3 ? ' (required)' : ' (optional)'}`}
                          value={email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMemberChange(index, e.target.value)}
                          className="h-11 bg-input-background border-border focus:border-ring focus:ring-ring/20 flex-1"
                          required={index < 3}
                        />
                        {index >= 3 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeMember(index)}
                            className="h-11 w-11 p-0 border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {members.length > 6 && (
                      <p className="text-sm text-muted-foreground">
                        Maximum 6 additional members allowed (7 total including organizer)
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg transition-colors duration-200"
                    disabled={isSubmitting || availableSlots.length === 0}
                  >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                    {isSubmitting ? 'Creating Booking...' : 'Create Booking'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <div>
          <Card className="shadow-sm border border-border bg-card">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                <div className="p-2 bg-secondary rounded-lg">
                  <Calendar className="h-5 w-5 text-secondary-foreground" />
                </div>
                Today's Schedule
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Current reservations for {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {rooms.map(room => {
                const roomBookings = bookings.filter(
                  booking =>
                    booking.roomId === room.id &&
                    booking.date === selectedDate &&
                    booking.status !== 'cancelled'
                );

                return (
                  <div key={room.id} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <h4 className="font-medium text-foreground">{room.name}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map(slot => {
                        const booking = roomBookings.find(b => b.timeSlot === slot);
                        const isAvailable = !booking;

                        return (
                          <div
                            key={slot}
                            className={`p-3 rounded-lg border text-sm ${
                              isAvailable
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                            }`}
                          >
                            <div className="font-medium text-xs mb-1">{slot}</div>
                            <div className="text-xs">
                              {isAvailable ? (
                                <div className="flex items-center gap-1">
                                  <Check className="h-3 w-3" />
                                  Available
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1">
                                    <X className="h-3 w-3" />
                                    <Badge variant="secondary" className="text-[10px] px-1">
                                      {booking!.status}
                                    </Badge>
                                  </div>
                                  <div className="font-medium truncate">
                                    {booking!.organizer.split('@')[0]}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}