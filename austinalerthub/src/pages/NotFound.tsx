
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="inline-flex items-center justify-center bg-muted rounded-full p-6 mb-6">
            <span className="material-icons text-5xl text-safety-yellow">error</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-md">
            We couldn't find the page you were looking for. Let's get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">
                Return to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/report">
                Report an Issue
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
