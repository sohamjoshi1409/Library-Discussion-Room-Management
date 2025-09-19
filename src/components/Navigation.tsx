import { Button } from './ui/button';
import type { User, PageType } from '../App';
import type { JSX } from 'react/jsx-runtime';

interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  user: User;
  onLogout: () => void;
}

export function Navigation({ 
  currentPage, 
  onPageChange, 
  user, 
  onLogout 
}: NavigationProps): JSX.Element {
  const navItems: { key: PageType; label: string }[] = [
    { key: 'booking', label: 'Book Room' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'my-bookings', label: 'My Bookings' },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-2 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="bg-black text-white px-4 py-2 rounded-lg font-medium">
              Library Room Booking
            </h1>
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.key}
                  variant={currentPage === item.key ? "secondary" : "ghost"}
                  onClick={() => onPageChange(item.key)}
                  className="px-4 py-2"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground hidden sm:inline">
              {user.name.split(' ')[0]}
            </span>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden mt-4 flex space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.key}
              variant={currentPage === item.key ? "secondary" : "ghost"}
              onClick={() => onPageChange(item.key)}
              className="flex-1 text-sm py-2"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}