
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

interface HistoryCardProps {
  id: string;
  title: string;
  timestamp: string;
  thumbnailUrl?: string;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ id, title, timestamp, thumbnailUrl }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/result/${id}`);
  };

  return (
    <Card 
      className="cursor-pointer hover:scale-105 transition-transform duration-300 bg-card/60 backdrop-blur-sm border-primary/20"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="aspect-video relative overflow-hidden rounded-t-md">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={title} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-sm text-muted-foreground">No preview</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm truncate" title={title}>{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{timestamp}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
