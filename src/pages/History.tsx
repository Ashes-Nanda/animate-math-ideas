
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HistoryCard from '@/components/HistoryCard';
import { getAllPromptHistory } from '@/lib/historyUtils';

interface AnimationData {
  id: string;
  prompt: string;
  videoUrl: string;
  thumbnailUrl?: string;
  timestamp: string;
}

const History = () => {
  const [history, setHistory] = useState<AnimationData[]>([]);

  useEffect(() => {
    const historyData = getAllPromptHistory();
    setHistory(historyData);
  }, []);

  return (
    <div className="min-h-screen flex flex-col math-pattern-background">
      <Header />
      
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <section>
            <h1 className="text-3xl font-playfair font-bold mb-6">Your Animation History</h1>
            
            {history.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {history.map((item) => (
                  <HistoryCard 
                    key={item.id}
                    id={item.id}
                    title={item.prompt}
                    timestamp={new Date(item.timestamp).toLocaleString()}
                    thumbnailUrl={item.thumbnailUrl}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card/30 backdrop-blur-sm rounded-lg p-8 border border-border text-center">
                <p className="text-lg font-medium mb-2">No animations yet</p>
                <p className="text-muted-foreground mb-6">
                  Your animation history will appear here once you generate your first animation.
                </p>
                <a 
                  href="/"
                  className="px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors"
                >
                  Create Your First Animation
                </a>
              </div>
            )}
          </section>
          
          {history.length > 0 && (
            <section className="bg-card/30 backdrop-blur-sm rounded-lg p-6 border border-border">
              <h2 className="text-xl font-medium mb-2">Animation Stats</h2>
              <p className="text-muted-foreground mb-4">Your math visualization journey at a glance.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground">Total Animations</p>
                  <p className="text-2xl font-medium">{history.length}</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground">Most Common Topic</p>
                  <p className="text-2xl font-medium">Linear Algebra</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground">Latest Animation</p>
                  <p className="text-md font-medium truncate">
                    {history.length > 0 ? history[0].prompt : "None"}
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
      
      <footer className="container max-w-7xl mx-auto px-4 py-6 border-t border-gray-800/50">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2025 Visual Math Animator</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default History;
