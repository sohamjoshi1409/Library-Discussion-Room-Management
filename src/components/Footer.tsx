import { BookOpen, Building, Phone, Mail } from 'lucide-react';

export function Footer(): JSX.Element {
  return (
    <footer className="bg-secondary/50 border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Library Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">University Library</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Official room booking system for discussion rooms and study spaces. 
              Manage your reservations efficiently and professionally.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Building className="h-4 w-4" />
              Contact Information
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>library@university.edu</span>
              </div>
            </div>
          </div>

          {/* Hours & Policies */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Room Booking Hours</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
              <p>Saturday - Sunday: 10:00 AM - 6:00 PM</p>
              <p className="pt-2 text-xs">
                All bookings require 4 confirmed members. 
                Cancellations must be made 2 hours in advance.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 University Library. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="hover:text-foreground transition-colors cursor-pointer">Support</span>
              <span className="hover:text-foreground transition-colors cursor-pointer">Policy</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}