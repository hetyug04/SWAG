# Content Management

This project uses a file-based content management system. All content is stored in the `content/` directory.

## Directory Structure

```
content/
├── papers/
│   ├── _template.json
│   └── your-paper.json
├── projects/
│   ├── _template.json
│   └── your-project.json
├── notebooks/
│   ├── _template.json
│   └── your-notebook.json
└── blogs/
    ├── _template.json
    └── your-blog-post.json
```

## Creating New Content

### Quick Start

Run the content generator:

```bash
npm run new
```

This will:
1. Ask you to choose a content type (paper, project, notebook, or blog)
2. Ask for a slug (URL-friendly identifier)
3. Create a new file from the template
4. Show you the next steps

### Example

```bash
$ npm run new

🎨 Content Generator

Content types:
1. Paper
2. Project
3. Notebook
4. Blog

Select content type (1-4): 4
Enter slug (lowercase-with-hyphens): my-first-blog-post

✅ Created: content/blogs/my-first-blog-post.json

📝 Edit the file to add your content, then:
   git add content/blogs/my-first-blog-post.json
   git commit -m "Add new blog: my-first-blog-post"
   git push

🚀 Vercel will automatically deploy your changes!
```

## Manual Creation

You can also manually create content files:

1. Copy a `_template.json` file in the appropriate directory
2. Rename it (e.g., `my-post.json`)
3. Edit the content
4. Commit and push to GitHub

## Content Format

All content files are JSON with specific fields:

### Papers
```json
{
  "slug": "paper-slug",
  "title": "Paper Title",
  "authors": "Author Name et al.",
  "date": "2025",
  "tags": ["Tag1", "Tag2"],
  "abstract": "Brief summary...",
  "link": "https://arxiv.org/abs/XXXX.XXXXX",
  "content": "Full content with Markdown..."
}
```

### Projects
```json
{
  "slug": "project-slug",
  "name": "project-name",
  "description": "Short description...",
  "stars": 0,
  "forks": 0,
  "language": "TypeScript",
  "content": "Full documentation...",
  "github": "https://github.com/username/repo"
}
```

### Notebooks
```json
{
  "slug": "notebook-slug",
  "title": "Notebook Title",
  "description": "Brief description...",
  "date": "Dec 03, 2025",
  "content": "Notebook content..."
}
```

### Blogs
```json
{
  "slug": "blog-slug",
  "title": "Blog Title",
  "excerpt": "Brief summary...",
  "date": "Dec 03, 2025",
  "readTime": "5 min read",
  "content": "Full blog post with Markdown..."
}
```

## Markdown Support

The `content` field supports full Markdown formatting:

- **Headings**: `# H1`, `## H2`, etc.
- **Bold/Italic**: `**bold**`, `*italic*`
- **Lists**: `- item` or `1. item`
- **Links**: `[text](url)`
- **Images**: `![alt](url)`
- **Code blocks**: Triple backticks with language
- **Inline code**: Single backticks

## Deployment

After creating or editing content:

```bash
git add content/
git commit -m "Add/update content"
git push
```

Vercel will automatically rebuild and deploy your site with the new content within 1-2 minutes.

## Tips

- **Slugs**: Use lowercase with hyphens (e.g., `my-awesome-post`)
- **Dates**: Papers use year only, others use "Month DD, YYYY"
- **Images**: Use absolute URLs for images in content
- **Testing**: Run `npm run dev` locally to preview before pushing
