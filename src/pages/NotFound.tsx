
import React from 'react';
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from '@/components/Header';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col math-pattern-background">
      <Header />
      
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-7xl font-playfair font-bold gradient-text">404</h1>
          <p className="text-2xl font-medium">Page not found</p>
          <p className="text-muted-foreground max-w-md mx-auto">
            The animation you're looking for seems to have transformed into another dimension.
          </p>
          <Link 
            to="/"
            className="inline-block px-6 py-3 mt-6 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
