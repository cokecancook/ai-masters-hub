'use client';

import { useState } from 'react';
import { generateAiIntroduction, type GenerateAiIntroductionInput } from '@/ai/flows/generate-ai-introduction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


interface AiIntroGeneratorProps {
  classmateName: string;
  classmateDescription: string;
}

export function AiIntroGenerator({ classmateName, classmateDescription }: AiIntroGeneratorProps) {
  const [introduction, setIntroduction] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateIntro = async () => {
    setIsLoading(true);
    setError(null);
    setIntroduction('');

    const input: GenerateAiIntroductionInput = {
      name: classmateName,
      description: classmateDescription,
    };

    try {
      const result = await generateAiIntroduction(input);
      if (result && result.introduction) {
        setIntroduction(result.introduction);
        toast({
          title: 'Introduction Generated!',
          description: `AI crafted an intro for ${classmateName}.`,
          variant: 'default',
        });
      } else {
        throw new Error('No introduction was generated.');
      }
    } catch (err) {
      console.error('Error generating AI introduction:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate introduction: ${errorMessage}`);
      toast({
        title: 'Error Generating Introduction',
        description: `Could not generate an intro for ${classmateName}. Please try again. Details: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-8 shadow-lg border-accent">
      <CardHeader>
        <CardTitle className="flex items-center text-accent">
          <Lightbulb size={24} className="mr-2" />
          AI Introduction Generator
        </CardTitle>
        <CardDescription>
          Generate a personalized introduction for {classmateName} using AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
           <Alert variant="destructive" className="mb-4">
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>{error}</AlertDescription>
           </Alert>
        )}
        {introduction && (
          <Textarea
            readOnly
            value={introduction}
            className="h-32 text-sm bg-background border-primary/20"
            aria-label="Generated AI Introduction"
          />
        )}
        {!introduction && !isLoading && (
          <div className="text-center text-muted-foreground p-4 border border-dashed rounded-md">
            Click the button below to generate an introduction.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateIntro} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? (
            <Loader2 size={20} className="mr-2 animate-spin" />
          ) : (
            <Wand2 size={20} className="mr-2" />
          )}
          {isLoading ? 'Generating...' : `Generate Intro for ${classmateName}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
