import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import PromptInput from '@/components/PromptInput';
import ExampleCard from '@/components/ExampleCard';
import { generateAnimation, getVideoUrl } from '@/lib/api';
import { savePromptToHistory } from '@/lib/historyUtils';
import { toast } from '@/hooks/use-toast';

// Lazy load LoadingAnimation
const LoadingAnimation = lazy(() => import('@/components/LoadingAnimation'));

const examplePrompts = [
  { title: "Draw a right-angled triangle", category: "Geometry" },
  { title: "Show the Pythagorean theorem", category: "Geometry" },
  { title: "Visualize a sine wave", category: "Trigonometry" },
  { title: "Animate a circle's area", category: "Geometry" },
  { title: "Show matrix multiplication", category: "Linear Algebra" },
  { title: "Visualize the chain rule", category: "Calculus" },
];

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const navigate = useNavigate();

  const handleSubmitPrompt = async (prompt: string) => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt is empty",
        description: "Please enter a math concept before submitting.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Generate animation using Manim backend with default level and style
      const response = await generateAnimation(prompt, "intermediate", "educational");
      
      // Save to history
      savePromptToHistory({
        id: response.id,
        prompt,
        timestamp: new Date().toISOString(),
        videoUrl: getVideoUrl(response.id, response.video_url.split('/').pop() || ''),
        thumbnailUrl: '' // We'll add thumbnail generation later
      });

      toast({
        title: "Animation created!",
        description: "Your math animation is ready to view.",
      });

      navigate(`/result/${response.id}`);
    } catch (error: any) {
      console.error('Error creating animation:', error);
      const message = error?.response?.data?.message || error.message || "Failed to create animation.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (prompt: string) => {
    setCurrentPrompt(prompt);
  };

  return (
    <>
      <Helmet>
        <title>Visual Math Animator</title>
        <meta name="description" content="Turn any math idea into a beautiful animation using natural language and Manim." />
        <meta name="keywords" content="math animation, manim, mathematics visualization, educational animation" />
      </Helmet>

      <div className="min-h-screen flex flex-col math-pattern-background">
        <Header />
        
        <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
                  <LoadingAnimation />
                </Suspense>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-16"
              >
                <section className="text-center space-y-6 py-12">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold max-w-4xl mx-auto" aria-label="App headline">
                    Turn any math idea into a <span className="gradient-text">beautiful animation</span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Generate stunning visual explanations of complex mathematical concepts with natural language.
                    Perfect for students, educators, and the mathematically curious.
                  </p>
                  
                  <div className="max-w-3xl mx-auto pt-4">
                    <PromptInput 
                      onSubmit={handleSubmitPrompt} 
                      value={currentPrompt}
                      onChange={setCurrentPrompt}
                    />
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
                        Visual Math Animator uses Manim to create beautiful mathematical animations.
                        Simply describe what you want to visualize, and we'll generate a high-quality
                        animation for you.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="inline-block mr-2 text-primary">1.</span>
                          <span>Type your math concept or question</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block mr-2 text-primary">2.</span>
                          <span>Our AI converts your prompt into Manim code</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block mr-2 text-primary">3.</span>
                          <span>Manim renders a beautiful, high-quality animation</span>
                        </li>
                      </ul>
                    </div>
                    <div className="md:w-1/2 bg-secondary/30 rounded-lg aspect-video flex items-center justify-center p-4 border border-border">
                      <div className="text-center">
                        <p className="text-lg font-medium gradient-text">Animation Preview</p>
                        <div className="mt-4 w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg animate-pulse" />
                      </div>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="container max-w-7xl mx-auto px-4 py-6 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© 2025 Visual Math Animator</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href="#" 
                className="hover:text-primary transition-colors"
                aria-label="Terms of Service"
              >
                Terms
              </a>
              <a 
                href="#" 
                className="hover:text-primary transition-colors"
                aria-label="Privacy Policy"
              >
                Privacy
              </a>
              <a 
                href="#" 
                className="hover:text-primary transition-colors"
                aria-label="Contact Us"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
