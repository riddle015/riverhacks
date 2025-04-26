
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default Footer;
