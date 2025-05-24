
'use client';

import type { Classmate } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, Linkedin, Github, FileText, UserCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/language-context';

interface ClassmateListItemProps {
  classmate: Classmate;
}

export function ClassmateListItem({ classmate }: ClassmateListItemProps) {
  const { language, t } = useLanguage();
  const actualCvUrl = classmate.cvFileName ? `/resumes/${language}/${classmate.cvFileName}` : '#';

  const displayBio = classmate.bio?.endsWith('.') ? classmate.bio.slice(0, -1) : classmate.bio;

  return (
    <Card className="flex items-start p-4 gap-4 bg-card rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:border-accent group">
      <Link
        href={`/classmates/${classmate.id}`}
        aria-label={`${t('viewProfile')} ${classmate.name}`}
        className="shrink-0 hidden sm:block"
      >
        <div className="relative h-20 w-20 md:h-24 md:w-24 overflow-hidden rounded-lg shadow-md">
          <Image
            src={classmate.photoUrl}
            alt={classmate.name}
            fill
            sizes="(max-width: 768px) 80px, 96px"
            className="object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
            data-ai-hint={classmate.photoAiHint}
          />
        </div>
      </Link>

      <div className="flex-grow flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
        <div className="text-left md:flex-grow">
          <Link href={`/classmates/${classmate.id}`} aria-label={`${t('viewProfile')} ${classmate.name}`}>
            <h3 className="text-lg font-semibold text-accent group-hover:text-accent/80 transition-colors">{classmate.name}</h3>
          </Link>
          <Link href={`/classmates/${classmate.id}`} aria-label={`${t('viewProfile')} ${classmate.name}`}>
            <p className="text-sm text-foreground line-clamp-2 mt-1 group-hover:text-foreground/80 transition-colors">{displayBio}</p>
          </Link>
          {classmate.interests && classmate.interests.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {classmate.interests.map((interest) => (
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
        </div>

        <div className="flex flex-wrap items-center justify-start gap-2 w-full mt-3 md:mt-0 md:w-auto md:justify-end md:shrink-0">
          {classmate.email && (
            <Button variant="outline" size="icon" asChild className="h-8 w-8 border-border hover:border-accent hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors">
              <a href={`mailto:${classmate.email}`} aria-label={t('emailClassmate', { name: classmate.name })}>
                <Mail size={16} className="mr-0" />
              </a>
            </Button>
          )}
          <Button variant="outline" size="icon" asChild className="h-8 w-8 border-border hover:border-accent hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors">
            <a href={classmate.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={t('linkedinClassmate', { name: classmate.name })}>
              <Linkedin size={16} />
            </a>
          </Button>
          <Button variant="outline" size="icon" asChild className="h-8 w-8 border-border hover:border-accent hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors">
            <a href={classmate.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={t('githubClassmate', { name: classmate.name })}>
              <Github size={16} />
            </a>
          </Button>
          {classmate.cvFileName && (
            <Button variant="outline" size="icon" asChild className="h-8 w-8 border-border hover:border-accent hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors">
              <a href={actualCvUrl} target="_blank" rel="noopener noreferrer" aria-label={t('classmateCV', { name: classmate.name })}>
                <FileText size={16} />
              </a>
            </Button>
          )}
          <Button variant="outline" size="icon" asChild className="h-8 w-8 hover:bg-accent/20 hover:border-accent hover:text-accent transition-colors">
            <Link href={`/classmates/${classmate.id}`} aria-label={`${t('viewProfile')} ${classmate.name}`}>
              <UserCircle2 size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
