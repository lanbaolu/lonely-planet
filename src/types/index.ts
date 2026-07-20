export type Source = 'github' | 'producthunt';

export interface Project {
  id: string;
  name: string;
  nameCn?: string;
  description: string;
  descriptionCn?: string;
  url: string;
  source: Source;
  sources?: Source[];
  stars?: number;
  dailyStars?: number;
  votes?: number;
  language?: string;
  owner?: string;
}

export interface CacheData {
  projects: Project[];
  timestamp: number;
  version: string;
}
