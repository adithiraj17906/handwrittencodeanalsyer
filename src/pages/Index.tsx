import { useState } from 'react';
import { CameraCapture } from '@/components/CameraCapture';
import { CodeDisplay } from '@/components/CodeDisplay';
import { useToast } from '@/hooks/use-toast';
import { Code2, Sparkles } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  code: string;
  errors: Array<{
    line: number;
    message: string;
    type: 'error' | 'warning';
  }>;
  language: string;
  correctedCode: string;
  expectedOutput: string;
}

export default function Index() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const { toast } = useToast();

  const handleCapture = async (imageData: string, language: string) => {
    setIsAnalyzing(true);

    try {
      // Invoke Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-code', {
        body: { image: imageData, language: language === 'auto' ? null : language }
      });

      if (error) throw error;

      setResult({
        code: data.code || '',
        errors: data.errors || [],
        language: data.language || 'Unknown',
        correctedCode: data.correctedCode || '',
        expectedOutput: data.expectedOutput || ''
      });

      toast({
        title: 'Analysis Complete',
        description: data.errors && data.errors.length > 0
          ? `Found ${data.errors.length} error(s) in the code`
          : 'No errors found in the code',
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Could not analyze the code',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with gradient glow effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
        <header className="relative border-b border-border backdrop-blur-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
                <Code2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Handwritten Code Analyzer
                </h1>
                <p className="text-sm text-muted-foreground">
                  Real-time AI-powered code detection and error analysis
                </p>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Camera section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-semibold">Capture Code</h2>
            </div>
            <CameraCapture
              onCapture={handleCapture}
              isAnalyzing={isAnalyzing}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>

          {/* Results section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Analysis Results</h2>
            </div>
            <CodeDisplay
              code={result?.code || ''}
              errors={result?.errors || []}
              language={result?.language}
              correctedCode={result?.correctedCode}
              expectedOutput={result?.expectedOutput}
            />
          </div>
        </div>

        {/* Info section */}
        <div className="mt-12 p-6 bg-card rounded-xl border border-border shadow-card">
          <h3 className="text-lg font-semibold mb-3">How It Works</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-semibold">1.</span>
              <span>Select your programming language (or use auto-detect)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">2.</span>
              <span>Click "Start Camera" to enable your device camera</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">3.</span>
              <span>Position your handwritten code in the camera view</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">4.</span>
              <span>Click "Analyze Code" to detect and check for syntax errors</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">5.</span>
              <span>View the detected code and any errors in real-time</span>
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
};

