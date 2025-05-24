
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';

interface ContactFormProps {
  classmateName: string;
  classmateEmail: string; 
}

export function ContactForm({ classmateName, classmateEmail }: ContactFormProps) {
  const { t } = useLanguage();
  const [yourName, setYourName] = useState('');
  const [yourEmail, setYourEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
    toast({
      title: t('messageSentToastTitle'),
      description: t('messageSentToastDescription', { name: classmateName }),
    });
    setYourName('');
    setYourEmail('');
    setMessage('');
  };

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-accent">{t('contactTitle', { name: classmateName })}</CardTitle>
        <CardDescription>
          {t('contactDescription', { name: classmateName })}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="yourName">{t('yourName')}</Label>
            <Input 
              id="yourName" 
              placeholder="John Doe" 
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yourEmail">{t('yourEmail')}</Label>
            <Input 
              id="yourEmail" 
              type="email" 
              placeholder="you@example.com" 
              value={yourEmail}
              onChange={(e) => setYourEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">{t('message')}</Label>
            <Textarea
              id="message"
              placeholder={`${t('message')} ${classmateName}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? (
              <Loader2 size={20} className="mr-2 animate-spin" />
            ) : (
              <Send size={20} className="mr-2" />
            )}
            {isLoading ? t('sending') : t('sendMessage')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
