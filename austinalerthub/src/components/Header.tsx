import React from 'react';
import { Bell, Search, Home, ListTodo, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-safety-blue">Safety</span>
            <span className="font-bold text-xl text-safety-yellow">Spotlight</span>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost"
            className="flex flex-col items-center text-xs" 
            onClick={() => navigate('/')}
          >
            <span className="material-icons text-lg mb-1">home</span>
            Home
          </Button>
          
          <Button 
            variant="ghost"
            className="flex flex-col items-center text-xs" 
            onClick={() => navigate('/report')}
          >
            <span className="material-icons text-lg mb-1">add_circle</span>
            Report
          </Button>
          
          <Button 
            variant="ghost"
            className="flex flex-col items-center text-xs" 
            onClick={() => navigate('/my-reports')}
          >
            <span className="material-icons text-lg mb-1">list</span>
            My Reports
          </Button>
          
          {/* 🆕 Events Button */}
          <Button 
            variant="ghost"
            className="flex flex-col items-center text-xs" 
            onClick={() => navigate('/events')}
          >
            <span className="material-icons text-lg mb-1">event</span>
            Events
          </Button>
          
          {/* Utility Buttons */}
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center text-xs"
            onClick={() => navigate('/heat-map')}
          >
            <span className="material-icons text-lg mb-1">map</span>
            Heat Map
          </Button>
          
          {/* Auth Buttons */}
          {token ? (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Log Out
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;