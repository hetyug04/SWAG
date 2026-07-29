import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getResearchDiaries } from '@/lib/researchDiary';

export type Paper = {
  slug: string;
  title: string;
  authors: string;
  date: string;
  tags: string[];
  abstract: string;
  link: string;
  content: string;
  pdf?: string;
  download?: string;
  preview?: string;
};

export type Project = {
  slug: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  content: string;
  github: string;
};

export type Repo = {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
  github?: string;
  diary?: string;
};

export type Blog = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string;
};

function dateValue(item: unknown): number {
  if (!item || typeof item !== 'object' || !('date' in item)) {
    return Number.NEGATIVE_INFINITY;
  }

  const value = item.date;

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value !== 'string' && typeof value !== 'number') {
    return Number.NEGATIVE_INFINITY;
  }

  const text = String(value).trim();
  const yearOnly = text.match(/^\d{4}$/);

  if (yearOnly) {
    return Date.UTC(Number(yearOnly[0]), 0, 1);
  }

  const parsed = Date.parse(text);
  return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed;
}

function loadContent<T>(directory: string): T[] {
  const contentDir = path.join(process.cwd(), 'content', directory);

  // Check if directory exists
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = fs.readdirSync(contentDir).sort();

  return files
    .filter(file => (file.endsWith('.json') || file.endsWith('.md')) && !file.startsWith('_'))
    .map(file => {
      const filePath = path.join(contentDir, file);
      const raw = fs.readFileSync(filePath, 'utf8');

      if (file.endsWith('.json')) {
        return JSON.parse(raw) as T;
      }

      // .md with frontmatter
      const parsed = matter(raw);
      const data = parsed.data as Record<string, unknown>;
      const legacyContent = typeof data.content === 'string' ? data.content : '';
      const content = parsed.content.trim() ? parsed.content : legacyContent;
      const slug = typeof data.slug === 'string'
        ? data.slug
        : path.basename(file, path.extname(file));

      // Keep the public data shapes used by the original UI while accepting the
      // shorter field names used by the AI-friendly Markdown templates.
      const normalized: Record<string, unknown> = { ...data, slug, content };

      if (directory === 'papers') {
        normalized.abstract = data.abstract ?? data.summary ?? '';
        normalized.link = data.link ?? data.externalUrl ?? '';
      } else if (directory === 'projects') {
        normalized.name = data.name ?? data.title ?? '';
        normalized.description = data.description ?? data.summary ?? '';
        normalized.github = data.github ?? data.externalUrl ?? '';
        normalized.stars = data.stars ?? 0;
        normalized.forks = data.forks ?? 0;
      } else if (directory === 'notebooks') {
        normalized.description = data.description ?? data.summary ?? '';
        normalized.github = data.github ?? data.externalUrl ?? '';
        normalized.diary = data.diary ?? '';
      } else if (directory === 'blogs') {
        normalized.excerpt = data.excerpt ?? data.summary ?? '';
      }

      return normalized as T;
    })
    .sort((first, second) => dateValue(second) - dateValue(first));
}

export const papers = loadContent<Paper>('papers');
export const projects = loadContent<Project>('projects');
export const repos = loadContent<Repo>('notebooks');
const markdownBlogs = loadContent<Blog>('blogs');
const researchDiaryBlogs = getResearchDiaries().map<Blog>((diary) => ({
  slug: diary.slug,
  title: diary.title,
  excerpt: diary.excerpt,
  date: diary.date,
  readTime: diary.readTime,
  content: '',
}));

export const blogs = [...researchDiaryBlogs, ...markdownBlogs]
  .filter(
    (blog, index, entries) =>
      entries.findIndex((candidate) => candidate.slug === blog.slug) === index,
  )
  .sort((first, second) => dateValue(second) - dateValue(first));

export function paperPdfUrl(paper: Pick<Paper, 'download' | 'pdf'>): string | undefined {
  if (paper.download?.trim()) {
    return paper.download;
  }

  if (!paper.pdf?.trim()) {
    return undefined;
  }

  return paper.pdf.startsWith('/') ? paper.pdf : `/papers/${paper.pdf}`;
}
