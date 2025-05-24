
'use client';

import type { Classmate } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Linkedin, Github, FileText, UserCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface ClassmateCardProps {
  classmate: Classmate;
}

export function ClassmateCard({ classmate }: ClassmateCardProps) {
  const { language, t } = useLanguage();
  const actualCvUrl = classmate.cvFileName ? `/resumes/${language}/${classmate.cvFileName}` : '#';

  const displayBio = classmate.bio?.endsWith('.') ? classmate.bio.slice(0, -1) : classmate.bio;

  return (
    <Card className="group flex flex-col overflow-hidden bg-card rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-accent">
      <CardHeader className="p-0">
        <Link href={`/classmates/${classmate.id}`} aria-label={`${t('viewProfile')} ${classmate.name}`}>
          <div className="aspect-[4/3] relative w-full overflow-hidden">
            <Image
              src={classmate.photoUrl}
              alt={classmate.name}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
              className="object-cover transition-all duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
              data-ai-hint={classmate.photoAiHint}
              priority={false}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/classmates/${classmate.id}`} aria-label={`${t('viewProfile')} ${classmate.name}`}>
          <CardTitle className="text-xl mb-2 text-accent group-hover:text-accent/80 transition-colors">{classmate.name}</CardTitle>
        </Link>
        <Link href={`/classmates/${classmate.id}`} aria-label={`${t('viewProfile')} ${classmate.name}`}>
          <p className="text-sm text-foreground line-clamp-3 group-hover:text-foreground/80 transition-colors mb-2">{displayBio}</p>
        </Link>
        {classmate.interests && classmate.interests.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {classmate.interests.slice(0, 5).map((interest) => ( 
              <Badge
                key={interest}
                variant="secondary"
                className="px-2 py-0.5 text-xs bg-accent/10 text-accent border-accent/30 hover:bg-accent/20 transition-colors"
              >
                {interest}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2 flex flex-col items-start space-y-3">
        <div className="flex gap-2 w-full">
          {classmate.email && (
            <Button variant="outline" asChild className="flex-1 h-10 px-2 border-border hover:border-accent hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors">
              <a href={`mailto:${classmate.email}`} aria-label={t('emailClassmate', { name: classmate.name })} className="flex items-center justify-center">
                <Mail size={18} />
              </a>
            </Button>
          )}
          <Button variant="outline" asChild className="flex-1 h-10 px-2 border-border hover:border-accent hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors">
            <a href={classmate.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={t('linkedinClassmate', { name: classmate.name })} className="flex items-center justify-center">
              <Linkedin size={18} />
            </a>
          </Button>
          <Button variant="outline" asChild className="flex-1 h-10 px-2 border-border hover:border-accent hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors">
            <a href={classmate.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={t('githubClassmate', { name: classmate.name })} className="flex items-center justify-center">
              <Github size={18} />
            </a>
          </Button>
          {classmate.cvFileName && (
            <Button variant="outline" asChild className="flex-1 h-10 px-2 border-border hover:border-accent hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors">
              <a href={actualCvUrl} target="_blank" rel="noopener noreferrer" aria-label={t('classmateCV', { name: classmate.name })} className="flex items-center justify-center">
                <FileText size={18} />
              </a>
            </Button>
          )}
        </div>
        <Button asChild variant="outline" className="w-full hover:bg-accent/20 hover:border-accent hover:text-accent transition-colors">
          <Link href={`/classmates/${classmate.id}`} className="flex items-center justify-center">
            <UserCircle2 size={18} className="mr-2" />
            {t('viewProfile')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
