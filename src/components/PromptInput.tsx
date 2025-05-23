import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  value: string;
  onChange: (value: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  onSubmit, 
  isLoading = false,
  value,
  onChange
}) => {
  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="w-full space-y-4">
      <Textarea
        placeholder="Try typing 'Linear Transformation' or 'What is an Eigenvector?'"
        className="min-h-32 bg-secondary/40 border-secondary placeholder:text-muted-foreground/70 text-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <div className="flex items-center gap-2">
        <Button 
          onClick={handleSubmit} 
          disabled={!value.trim() || isLoading}
          className="w-full md:w-auto text-md px-6 py-6 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
        >
          {isLoading ? 'Generating Animation...' : 'Generate Animation'}
        </Button>
        <p className="text-xs text-muted-foreground hidden md:block">
          Press Ctrl+Enter to submit
        </p>
      </div>
    </div>
  );
};

export default PromptInput;
