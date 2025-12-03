# Content Templates

This folder contains JSON templates for creating new content on your portfolio website.

## How to Use

1. Copy the appropriate template file
2. Fill in your content details
3. Copy the JSON object to `src/lib/data.ts` into the corresponding array

## Template Files

### `paper-template.json`
Template for adding research papers. Includes:
- Basic metadata (title, authors, date)
- Tags for categorization
- Abstract and full content
- External link (e.g., arXiv)

### `project-template.json`
Template for adding projects. Includes:
- Project name and description
- GitHub link and stats (stars, forks)
- Programming language
- Detailed documentation

### `notebook-template.json`
Template for adding Jupyter notebooks or tutorials. Includes:
- Title and description
- Date published
- Full notebook content with code examples

### `blog-template.json`
Template for adding blog posts. Includes:
- Title and excerpt
- Date and read time
- Full markdown content with formatting support

## Adding Content

**Example: Adding a new paper**

1. Open `templates/paper-template.json`
2. Copy the entire JSON object
3. Fill in your paper details
4. Open `src/lib/data.ts`
5. Add your paper object to the `papers` array:

```typescript
export const papers = [
  {
    slug: "my-amazing-paper",
    title: "My Amazing Paper",
    // ... rest of your content
  },
];
```

## Content Guidelines

- **Slugs**: Use lowercase with hyphens (e.g., `my-blog-post`)
- **Dates**: For papers use year (e.g., "2025"), for blogs use "Month DD, YYYY"
- **Content**: Supports full Markdown formatting including headings, lists, code blocks, images, and links
- **Images**: Use absolute URLs for images in blog posts and notebooks
