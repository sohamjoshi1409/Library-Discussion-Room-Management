import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Clock, MapPin, Users, Eye, Activity, BarChart3, Check, X, LucideIcon } from 'lucide-react';
import { Room, Booking } from '../App';

interface BookingTransparencyProps {
  bookings: Booking[];
  rooms: Room[];
}

interface StatCard {
  label: string;
  value: number;
  icon: LucideIcon;
  description: string;
}

export function BookingTransparency({ bookings, rooms }: BookingTransparencyProps): JSX.Element {
  const availableDates = Array.from(
    new Set(bookings.map(booking => booking.date))
  ).sort();

  const todayDate = new Date().toISOString().split('T')[0];
  if (availableDates.length === 0) {
    availableDates.push(todayDate);
  }

  const [selectedDate, setSelectedDate] = useState<string>(
    availableDates.includes(todayDate) ? todayDate : availableDates[0]
  );
  const [selectedTiming, setSelectedTiming] = useState<string>('all');

  const timeSlots: string[] = [
    '08:00-10:00',
    '10:00-12:00',
    '12:00-14:00',
    '14:00-16:00',
    '16:00-18:00',
    '18:00-20:00',
  ];

  const filteredBookings = bookings.filter(booking => {
    const matchesDate = booking.date === selectedDate;
    const matchesTiming = selectedTiming === 'all' || booking.timeSlot === selectedTiming;
    
    return matchesDate && matchesTiming;
  });

  const getBookingForSlot = (roomId: string, timeSlot: string): Booking | undefined => {
    return filteredBookings.find(
      booking => booking.roomId === roomId && booking.timeSlot === timeSlot
    );
  };

  const getRoomColor = (color: string): string => {
    return 'bg-primary';
  };

  const statsCards: StatCard[] = [
    { 
      label: "Total Bookings", 
      value: bookings.length, 
      icon: BarChart3, 
      description: "All confirmed bookings"
    },
    { 
      label: "Today's Bookings", 
      value: filteredBookings.length, 
      icon: Eye, 
      description: "Selected date bookings"
    },
    { 
      label: "Rooms in Use", 
      value: new Set(filteredBookings.map(b => b.roomId)).size, 
      icon: MapPin, 
      description: "Occupied rooms today"
    },
    { 
      label: "Active Users", 
      value: new Set([
        ...filteredBookings.map(b => b.organizer),
        ...filteredBookings.flatMap(b => b.members)
      ]).size, 
      icon: Users, 
      description: "Unique participants"
    },
  ];

  return (
    <div className="space-y-12">
      <motion.div 
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-4xl font-semibold text-foreground mb-4">
            All Bookings
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          View all confirmed discussion room reservations with complete transparency and real-time availability
        </p>
      </motion.div>

      {/* Filters */}
      <Card className="shadow-sm border-border">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="flex items-center gap-2 text-xl text-foreground">
            <Clock className="h-5 w-5" />
            Filter Bookings
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Adjust filters to view specific bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="h-11 bg-input-background border-border focus:border-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableDates.map(date => (
                    <SelectItem key={date} value={date}>
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Slot
              </label>
              <Select value={selectedTiming} onValueChange={setSelectedTiming}>
                <SelectTrigger className="h-11 bg-input-background border-border focus:border-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time Slots</SelectItem>
                  {timeSlots.map(slot => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={stat.label} className="shadow-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Schedule Grid */}
      <Card className="shadow-sm border-border">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="flex items-center gap-2 text-xl text-foreground">
            <Activity className="h-5 w-5" />
            Schedule Overview
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Room availability for {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Schedule Grid */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-7 gap-3 mb-6">
              <div className="font-semibold p-3 text-foreground">Room</div>
              {timeSlots.map(slot => (
                <div key={slot} className="font-medium p-3 text-center text-sm bg-accent/50 rounded-lg text-foreground">
                  {slot}
                </div>
              ))}
            </div>

            {rooms.map((room, roomIndex) => (
                <div key={room.id} className="grid grid-cols-7 gap-3 mb-4">
                  <div className="p-4 bg-primary text-primary-foreground rounded-lg font-semibold text-center flex items-center justify-center">
                    {room.name}
                  </div>
                  
                  {timeSlots.map((slot, slotIndex) => {
                    const booking = getBookingForSlot(room.id, slot);
                    
                    return (
                      <div
                        key={slot}
                        className={`p-3 rounded-lg border text-sm ${
                          booking
                            ? 'bg-red-50 border-red-200'
                            : 'bg-green-50 border-green-200'
                        }`}
                      >
                        {booking ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-1">
                              <X className="h-3 w-3 text-red-500" />
                              <Badge className="bg-red-100 text-red-800 text-xs border-red-200">
                                Booked
                              </Badge>
                            </div>
                            <div className="text-xs">
                              <div className="font-medium text-red-700 truncate">
                                {booking.organizer.split('@')[0]}
                              </div>
                              <div className="text-red-600">
                                +{booking.members.length} members
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center space-y-1">
                            <div className="flex items-center justify-center gap-1">
                              <Check className="h-3 w-3 text-green-500" />
                              <Badge className="bg-green-100 text-green-800 text-xs border-green-200">
                                Available
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
          </div>

          {/* Mobile/Tablet Schedule - Card Layout */}
          <div className="lg:hidden space-y-6">
            {rooms.map((room) => (
                <div key={room.id} className="border border-border rounded-lg p-4 bg-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-4 h-4 rounded-full ${getRoomColor(room.color)}`}></div>
                    <h3 className="font-semibold text-lg text-foreground">{room.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {timeSlots.map((slot) => {
                      const booking = getBookingForSlot(room.id, slot);
                      
                      return (
                        <div
                          key={slot}
                          className={`p-4 rounded-lg border ${
                            booking
                              ? 'bg-red-50 border-red-200'
                              : 'bg-green-50 border-green-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm text-foreground">{slot}</span>
                            {booking ? (
                              <Badge className="bg-red-100 text-red-800 text-xs border-red-200">
                                Booked
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800 text-xs border-green-200">
                                Available
                              </Badge>
                            )}
                          </div>
                          
                          {booking && (
                            <div className="text-xs space-y-1">
                              <div className="font-medium text-red-700">
                                {booking.organizer.split('@')[0]}
                              </div>
                              <div className="text-red-600">
                                +{booking.members.length} members
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Booking List */}
      <Card className="shadow-sm border-border">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="flex items-center gap-2 text-xl text-foreground">
            <BarChart3 className="h-5 w-5" />
            Booking Details
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Complete information about all bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg text-muted-foreground mb-2">No bookings found for the selected filters</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="border border-border rounded-lg p-6 bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Confirmed
                        </Badge>
                        <span className="font-semibold text-lg text-foreground">{booking.roomName}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

                      <div className="bg-accent/30 rounded-lg p-4 space-y-2">
                        <p className="text-sm">
                          <span className="font-medium text-foreground">Organizer:</span> 
                          <span className="ml-2 text-muted-foreground">{booking.organizer}</span>
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-foreground">Members:</span> 
                          <span className="ml-2 text-muted-foreground break-all">{booking.members.join(', ')}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}