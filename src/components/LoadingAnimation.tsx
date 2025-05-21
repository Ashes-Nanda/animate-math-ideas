
import React, { useEffect, useState } from 'react';

const loadingMessages = [
  "🌀 Thinking like a mathematician...",
  "🎬 Drawing your idea...",
  "📽️ Rendering the magic...",
  "🧮 Calculating vectors...",
  "📐 Aligning coordinates...",
  "🔢 Processing equations...",
];

const LoadingAnimation = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-28 h-28 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400/30 animate-spin duration-1000"></div>
        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-transparent border-purple-400/40 animate-spin duration-700 direction-reverse"></div>
        <div className="absolute inset-4 rounded-full border-4 border-b-transparent border-l-transparent border-blue-400/50 animate-spin duration-500"></div>
        <div className="absolute inset-6 rounded-full border-4 border-t-transparent border-purple-400/60 animate-spin duration-1000"></div>
      </div>
      <p className="text-lg font-medium animate-pulse-subtle">
        {loadingMessages[messageIndex]}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        This may take up to 30 seconds
      </p>
    </div>
  );
};

export default LoadingAnimation;
