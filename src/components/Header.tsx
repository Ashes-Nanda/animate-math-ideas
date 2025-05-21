
import React from 'react';
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full py-4 border-b border-gray-800/50">
      <div className="container max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <span className="text-xl font-playfair font-bold">
            Visual<span className="gradient-text">Math</span>
          </span>
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/history" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            History
          </Link>
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            About
          </a>
          <a 
            href="#"
            className="px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors"
          >
            Explore Examples
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
