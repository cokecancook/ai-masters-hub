
'use client';

import type { Classmate } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Linkedin, Github, FileText, Tag, Brain, Mail } from 'lucide-react'; // Added Mail
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/language-context';

interface ClassmateProfileProps {
  classmate: Classmate;
}

export function ClassmateProfile({ classmate }: ClassmateProfileProps) {
  const { language, t } = useLanguage();

  return (
    <Card className="overflow-hidden shadow-xl bg-card border-border">
      <CardHeader className="bg-card/50 p-6 md:p-8 border-b border-border">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="relative h-32 w-32 md:h-40 md:w-40 shrink-0 overflow-hidden rounded-lg border-4 border-background shadow-lg">
            <Image
              src={classmate.photoUrl}
              alt={classmate.name}
              width={160}
              height={160}
              className="object-cover"
              data-ai-hint={classmate.photoAiHint}
              priority
            />
          </div>
          <div className="mt-2 text-center md:text-left flex-1">
            <CardTitle className="text-3xl md:text-4xl font-bold text-accent">{classmate.name}</CardTitle>
            {classmate.email && (
              <a href={`mailto:${classmate.email}`} className="mt-1 text-base text-muted-foreground hover:text-accent transition-colors flex items-center justify-center md:justify-start">
                {classmate.email}
              </a>
            )}
            <div className="mt-4 flex justify-center space-x-3 md:justify-start">
              {classmate.email && ( // Conditionally render email button
                <Button variant="outline" size="icon" asChild className="hover:bg-accent/20 hover:border-accent text-muted-foreground hover:text-accent transition-colors">
                  <a href={`mailto:${classmate.email}`} aria-label={t('emailClassmate', { name: classmate.name })}>
                    <Mail size={20} />
                  </a>
                </Button>
              )}
              <Button variant="outline" size="icon" asChild className="hover:bg-accent/20 hover:border-accent text-muted-foreground hover:text-accent transition-colors">
                <a href={classmate.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={t('linkedinClassmate', { name: classmate.name })}>
                  <Linkedin size={20} />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild className="hover:bg-accent/20 hover:border-accent text-muted-foreground hover:text-accent transition-colors">
                <a href={classmate.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={t('githubClassmate', { name: classmate.name })}>
                  <Github size={20} />
                </a>
              </Button>
              {classmate.cvAvailable && (
                <Button variant="outline" size="icon" asChild className="hover:bg-accent/20 hover:border-accent text-muted-foreground hover:text-accent transition-colors">
                  <a href={classmate.actualCvPath} target="_blank" rel="noopener noreferrer" aria-label={t('classmateCV', { name: classmate.name })}>
                    <FileText size={20} />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8 space-y-8">
        <section>
          <h3 className="text-xl font-semibold text-accent mb-3 flex items-center">
            <Brain size={22} className="mr-2 text-accent" />
            {t('aboutMe')}
          </h3>
          <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{classmate.fullDescription}</p>
        </section>
        
        {classmate.interests && classmate.interests.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold text-accent mb-3 flex items-center">
              <Tag size={20} className="mr-2 text-accent" />
              {t('interests')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {classmate.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="px-3 py-1 text-sm bg-accent/10 text-accent border-accent/30 hover:bg-accent/20 transition-colors">
                  {interest}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
