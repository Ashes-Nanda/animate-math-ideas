
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title }) => {
  const handleDownload = () => {
    // In a real implementation, this would trigger download of the video
    console.log('Download video:', videoUrl);
    // For now, we'll just open the video in a new tab
    window.open(videoUrl, '_blank');
    
    toast({
      title: "Download started",
      description: "Your animation is downloading",
    });
  };

  const handleShare = () => {
    // In a real implementation, this would open a share dialog
    console.log('Share video:', title);
    
    // For now, we'll just copy a mock URL to clipboard
    navigator.clipboard.writeText(`https://visualmath.app/share/${encodeURIComponent(title)}`)
      .then(() => {
        toast({
          title: "Link copied",
          description: "Animation link copied to clipboard",
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Failed to copy",
          description: "Could not copy the link to clipboard",
          variant: "destructive"
        });
      });
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-muted">
        {/* Placeholder for actual video - would be replaced with actual video element */}
        {videoUrl ? (
          <video 
            src={videoUrl} 
            className="w-full h-full object-contain" 
            controls
            autoPlay
            loop
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Video not available</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl font-medium">{title || 'Math Animation'}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
