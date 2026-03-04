export type MovieStatus = 'released' | 'upcoming' | 'in production';
export type MovieLanguage = 'en' | 'ja' | 'ko' | 'fr' | 'es' | 'pr';

export interface Movie {
  id: number;
  title: string;
  director: string;
  cast: string[];
  genres: string[];
  year: number;
  duration: number;
  rating: number;
  language: MovieLanguage;
  synopsis: string;
  status: MovieStatus;
}

export const MOVIE_STATUSES: MovieStatus[] = [
  'released',
  'upcoming',
  'in production',
];

export const MOVIE_LANGUAGES: MovieLanguage[] = [
  'en',
  'ja',
  'ko',
  'fr',
  'es',
  'pr',
];
