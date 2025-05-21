
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface ExampleCardProps {
  title: string;
  category: string;
  onClick: () => void;
}

const ExampleCard: React.FC<ExampleCardProps> = ({ title, category, onClick }) => {
  return (
    <Card 
      className="cursor-pointer hover:scale-105 transition-transform duration-300 bg-card/60 backdrop-blur-sm border-primary/20"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="rounded-sm px-2 py-1 text-xs font-medium inline-block mb-2" 
          style={{
            backgroundColor: category === "Linear Algebra" ? "rgba(138, 75, 245, 0.2)" : 
                           category === "Calculus" ? "rgba(75, 192, 245, 0.2)" : 
                           "rgba(245, 158, 75, 0.2)",
            color: category === "Linear Algebra" ? "#a687ff" : 
                 category === "Calculus" ? "#87d0ff" : 
                 "#ffb987"
          }}
        >
          {category}
        </div>
        <h3 className="font-medium text-sm">{title}</h3>
      </CardContent>
    </Card>
  );
};

export default ExampleCard;
