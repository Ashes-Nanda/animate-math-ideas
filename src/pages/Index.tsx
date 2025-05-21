import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import PromptInput from '@/components/PromptInput';
import ExampleCard from '@/components/ExampleCard';
import LoadingAnimation from '@/components/LoadingAnimation';
import { generateUUID } from '@/lib/utils';
import { savePromptToHistory } from '@/lib/historyUtils';
import { generateMathAnimation } from '@/lib/gemini';
import { uploadVideo } from '@/lib/cloudinary';
import { toast } from '@/hooks/use-toast';

const examplePrompts = [
  { title: "Visualize Eigenvectors and Eigenvalues", category: "Linear Algebra" },
  { title: "Explain Fourier Series visually", category: "Calculus" },
  { title: "Show matrix multiplication geometrically", category: "Linear Algebra" },
  { title: "Animate limit as x approaches infinity", category: "Calculus" },
  { title: "Visualize vector projection in 3D", category: "Linear Algebra" },
  { title: "Show chain rule differentiation", category: "Calculus" },
];

const Index = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmitPrompt = async (prompt: string) => {
    setLoading(true);
    
    try {
      // Generate animation script using Gemini
      const animationScript = await generateMathAnimation(prompt);
      
      // In a real implementation, this would:
      // 1. Send the script to a backend service that renders the animation
      // 2. Get back a video file
      // 3. Upload that video to Cloudinary
      
      // For demo purposes, we'll simulate this process
      const animationId = generateUUID();
      
      // Mock video URL - in reality this would come from Cloudinary
      const videoUrl = 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
      
      // Save to history
      savePromptToHistory({
        id: animationId,
        prompt,
        timestamp: new Date().toISOString(),
        videoUrl,
        thumbnailUrl: 'https://placehold.co/600x400/112238/FFFFFF/png?text=Math+Animation'
      });

      toast({
        title: "Animation created!",
        description: "Your math animation is ready to view.",
      });

      navigate(`/result/${animationId}`);
    } catch (error) {
      console.error('Error creating animation:', error);
      toast({
        title: "Error",
        description: "Failed to create animation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (prompt: string) => {
    handleSubmitPrompt(prompt);
  };

  return (
    <div className="min-h-screen flex flex-col math-pattern-background">
      <Header />
      
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <LoadingAnimation />
        ) : (
          <div className="space-y-16">
            <section className="text-center space-y-6 py-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold max-w-4xl mx-auto">
                Turn any math idea into a <span className="gradient-text">beautiful animation</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Generate stunning visual explanations of complex mathematical concepts with natural language.
                Perfect for students, educators, and the mathematically curious.
              </p>
              
              <div className="max-w-3xl mx-auto pt-4">
                <PromptInput onSubmit={handleSubmitPrompt} />
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-medium mb-6">Example Prompts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {examplePrompts.map((example, index) => (
                  <ExampleCard 
                    key={index}
                    title={example.title} 
                    category={example.category}
                    onClick={() => handleExampleClick(example.title)}
                  />
                ))}
              </div>
            </section>
            
            <section className="bg-card/30 backdrop-blur-sm rounded-lg p-8 border border-border">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2 space-y-4">
                  <h2 className="text-2xl font-playfair font-bold">How It Works</h2>
                  <p className="text-muted-foreground">
                    Visual Math Animator uses AI to understand your math concept and generates 
                    a custom animation that brings it to life. Perfect for visualizing abstract 
                    concepts in Linear Algebra and Calculus.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="inline-block mr-2 text-primary">1.</span>
                      <span>Type your math concept or question</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block mr-2 text-primary">2.</span>
                      <span>Our AI translates your prompt into a Manim animation script</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block mr-2 text-primary">3.</span>
                      <span>Watch your custom animation render in seconds</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2 bg-secondary/30 rounded-lg aspect-video flex items-center justify-center p-4 border border-border">
                  <div className="text-center">
                    <p className="text-lg font-medium gradient-text">Animation Preview</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      (Placeholder for demo animation)
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
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

export default Index;