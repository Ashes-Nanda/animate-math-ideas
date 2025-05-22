import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import VideoPlayer from '@/components/VideoPlayer';
import PromptInput from '@/components/PromptInput';
import { Button } from "@/components/ui/button";
import { getPromptFromHistory } from '@/lib/historyUtils';
import { toast } from '@/hooks/use-toast';
import { getThumbnailUrl } from '@/lib/cloudinary';

interface AnimationData {
  id: string;
  prompt: string;
  videoUrl: string;
  thumbnailUrl?: string;
  timestamp: string;
}

const Result = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [animation, setAnimation] = useState<AnimationData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    // Get animation data from history
    const data = getPromptFromHistory(id);
    if (data) {
      setAnimation(data);
    } else {
      toast({
        title: "Animation not found",
        description: "The requested animation could not be found.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [id, navigate]);

  const handleNewPrompt = (prompt: string) => {
    setLoading(true);
    // Similar implementation to Index page
    // For demo purposes, simulate API call
    setTimeout(() => {
      setLoading(false);
      // Navigate to a new result page
      const newId = Math.random().toString(36).substring(2, 15);
      navigate(`/result/${newId}`);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col math-pattern-background">
      <Header />
      
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-12">
          {animation && (
            <VideoPlayer 
              videoUrl={animation.videoUrl} 
              title={animation.prompt}
            />
          )}
          
          <section className="bg-card/30 backdrop-blur-sm rounded-lg p-6 border border-border">
            <h2 className="text-xl font-medium mb-4">Generate Another Animation</h2>
            <PromptInput onSubmit={handleNewPrompt} isLoading={loading} />
          </section>
          
          {animation && (
            <section className="bg-card/30 backdrop-blur-sm rounded-lg p-6 border border-border">
              <h2 className="text-xl font-medium mb-4">About This Animation</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-muted-foreground">Prompt</h3>
                  <p className="text-md">{animation.prompt}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">Generated On</h3>
                  <p className="text-md">{new Date(animation.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">Topics</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {/* Mock tags - in a real app, these would be generated from the prompt */}
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300">
                      {animation.prompt.includes("Eigen") ? "Eigenvectors" : 
                       animation.prompt.includes("Fourier") ? "Fourier Series" : 
                       animation.prompt.includes("matrix") ? "Matrices" :
                       animation.prompt.includes("vector") ? "Vectors" :
                       animation.prompt.includes("limit") ? "Limits" :
                       animation.prompt.includes("chain rule") ? "Derivatives" :
                       "Mathematics"}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
                      {animation.prompt.toLowerCase().includes("calculus") || 
                       animation.prompt.includes("limit") || 
                       animation.prompt.includes("chain rule") ? "Calculus" : "Linear Algebra"}
                    </span>
                  </div>
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

export default Result;
