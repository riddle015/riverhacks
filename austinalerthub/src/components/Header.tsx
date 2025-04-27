
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Top header */}
      <header className="sticky top-0 z-30 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo that links to home */}
            <Link to="/" className="flex items-center gap-2">
              <span className="font-bold text-xl text-safety-blue">Safety</span>
              <span className="font-bold text-xl text-safety-yellow">Spotlight</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t py-2">
        <div className="container flex justify-around items-center">
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
        </div>
      </footer>
    </>
  );
};

export default Header;
