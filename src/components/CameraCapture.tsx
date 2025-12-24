import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, Scan } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CameraCaptureProps {
  onCapture: (imageData: string, language: string) => void;
  isAnalyzing: boolean;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export const CameraCapture = ({ onCapture, isAnalyzing, selectedLanguage, onLanguageChange }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: 'Camera Error',
        description: 'Could not access camera. Please check permissions.',
        variant: 'destructive',
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageData, selectedLanguage);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center gap-4 p-6 bg-card rounded-xl border border-border shadow-card">
      <div className="w-full">
        <label className="block text-sm font-medium mb-2">Select Programming Language</label>
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-full bg-background border-border">
            <SelectValue placeholder="Choose language" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            <SelectItem value="auto">Auto-detect</SelectItem>
            <SelectItem value="JavaScript">JavaScript</SelectItem>

            <SelectItem value="Python">Python</SelectItem>
            <SelectItem value="Java">Java</SelectItem>
            <SelectItem value="C">C</SelectItem>
            <SelectItem value="C++">C++</SelectItem>
            <SelectItem value="C#">C#</SelectItem>
            <SelectItem value="HTML">HTML</SelectItem>
            <SelectItem value="CSS">CSS</SelectItem>
            <SelectItem value="SQL">SQL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative w-full aspect-video bg-background rounded-lg overflow-hidden border border-border">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
            <p className="text-muted-foreground">Camera not active</p>
          </div>
        )}
        {isAnalyzing && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
              <p className="text-sm font-medium">Analyzing handwritten code...</p>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-3">
        {!isStreaming ? (
          <Button
            onClick={startCamera}
            variant="hero"
          >
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        ) : (
          <>
            <Button
              onClick={stopCamera}
              variant="secondary"
            >
              <CameraOff className="mr-2 h-4 w-4" />
              Stop Camera
            </Button>
            <Button
              onClick={captureImage}
              disabled={isAnalyzing}
              variant="hero"
            >
              <Scan className="mr-2 h-4 w-4" />
              Analyze Code
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
