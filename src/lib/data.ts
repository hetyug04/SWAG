import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type Paper = {
  slug: string;
  title: string;
  authors: string;
  date: string;
  tags: string[];
  abstract: string;
  link: string;
  content: string;
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

export type Notebook = {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
};

export type Blog = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string;
};

function loadContent<T>(directory: string): T[] {
  const contentDir = path.join(process.cwd(), 'content', directory);
  
  // Check if directory exists
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  
  const files = fs.readdirSync(contentDir);
  
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
      const content = parsed.content;
      // Merge frontmatter with content field
      return { ...data, content } as T;
    });
}

export const papers = loadContent<Paper>('papers');
export const projects = loadContent<Project>('projects');
export const notebooks = loadContent<Notebook>('notebooks');
export const blogs = loadContent<Blog>('blogs');
