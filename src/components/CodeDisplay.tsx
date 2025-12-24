import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Code2, Play, Wrench } from 'lucide-react';

interface CodeError {
  line: number;
  message: string;
  type: 'error' | 'warning';
}

interface CodeDisplayProps {
  code: string;
  errors: CodeError[];
  language?: string;
  correctedCode?: string;
  expectedOutput?: string;
}

export const CodeDisplay = ({ code, errors, language = 'Unknown', correctedCode, expectedOutput }: CodeDisplayProps) => {
  const lines = code.split('\n');
  const hasErrors = errors.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Detected Code</h3>
          <Badge variant="secondary">{language}</Badge>
        </div>
        {!hasErrors && code && (
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">No errors found</span>
          </div>
        )}
      </div>

      <Card className="p-4 bg-code-bg border-border shadow-card">
        {code ? (
          <pre className="text-sm font-mono text-code-text overflow-x-auto">
            {lines.map((line, idx) => {
              const lineErrors = errors.filter(e => e.line === idx + 1);
              const hasLineError = lineErrors.length > 0;
              
              return (
                <div 
                  key={idx}
                  className={`flex gap-4 px-2 py-1 rounded ${
                    hasLineError ? 'bg-destructive/20 border-l-4 border-destructive' : ''
                  }`}
                >
                  <span className="text-muted-foreground select-none min-w-[2rem] text-right">
                    {idx + 1}
                  </span>
                  <span className="flex-1">{line || ' '}</span>
                </div>
              );
            })}
          </pre>
        ) : (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <p>Capture an image to see detected code here</p>
          </div>
        )}
      </Card>

      {hasErrors && (
        <Card className="p-4 border-destructive/50 bg-destructive/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h4 className="font-semibold text-destructive">
              {errors.length} {errors.length === 1 ? 'Error' : 'Errors'} Found
            </h4>
          </div>
          <div className="space-y-2">
            {errors.map((error, idx) => (
              <div 
                key={idx}
                className="flex gap-3 p-3 bg-card rounded-lg border border-border"
              >
                <Badge 
                  variant={error.type === 'error' ? 'destructive' : 'secondary'}
                  className="shrink-0"
                >
                  Line {error.line}
                </Badge>
                <p className="text-sm">{error.message}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {correctedCode && hasErrors && (
        <Card className="p-4 border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-green-600">Corrected Code</h4>
          </div>
          <pre className="text-sm font-mono bg-card p-3 rounded-lg border border-border overflow-x-auto">
            {correctedCode.split('\n').map((line, idx) => (
              <div key={idx} className="flex gap-4 px-2 py-1">
                <span className="text-muted-foreground select-none min-w-[2rem] text-right">
                  {idx + 1}
                </span>
                <span className="flex-1">{line || ' '}</span>
              </div>
            ))}
          </pre>
        </Card>
      )}

      {expectedOutput && (
        <Card className="p-4 border-primary/30 bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <Play className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-primary">Expected Output</h4>
          </div>
          <pre className="text-sm font-mono bg-card p-3 rounded-lg border border-border whitespace-pre-wrap">
            {expectedOutput}
          </pre>
        </Card>
      )}
    </div>
  );
};
