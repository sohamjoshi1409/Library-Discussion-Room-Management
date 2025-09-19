import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { BookOpen, Mail, Lock, ArrowRight } from 'lucide-react';
import type { JSX } from 'react/jsx-runtime';

interface LoginFormProps {
  onLogin: (email: string, name: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    
    setTimeout(() => {
      // Extract name from email for user object
      const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
      onLogin(email, name);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative">
      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-lg border border-border bg-card relative">
          <CardHeader className="text-center space-y-6 pb-8 relative z-10">
            <div className="flex justify-center">
              <div className="bg-primary p-4 rounded-lg">
                <BookOpen className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-2xl text-foreground">
                Library Room Booking System
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to manage your discussion room reservations
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-input-background border-border focus:border-ring focus:ring-ring/20"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    className="pl-10 h-11 bg-input-background border-border focus:border-ring focus:ring-ring/20"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}