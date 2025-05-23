import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { getAllPromptHistory } from '@/lib/historyUtils';
import { getVideoUrl } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const Result = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    // Get animation data from history
    const history = getAllPromptHistory();
    const animation = history.find(item => item.id === id);

    if (!animation) {
      toast({
        title: "Error",
        description: "Animation not found",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    setPrompt(animation.prompt);
    setVideoUrl(animation.videoUrl);
  }, [id, navigate]);

  return (
    <div className="min-h-screen flex flex-col math-pattern-background">
      <Header />
      
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-playfair font-bold">Your Animation</h1>
            <p className="text-lg text-muted-foreground">{prompt}</p>
          </div>
          
          <div className="aspect-video bg-card/30 backdrop-blur-sm rounded-lg overflow-hidden border border-border">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                className="w-full h-full"
                autoPlay
                loop
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground">Loading animation...</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Create Another
            </button>
            <button
              onClick={() => navigate('/history')}
              className="px-6 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
            >
              View History
            </button>
          </div>
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

export default Result;
