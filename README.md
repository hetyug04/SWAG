# S.W.A.G

A small research and software portfolio built with Next.js. Papers, projects, notebooks, and regular blog posts live as Markdown under `content/`; visual research diaries use structured JSON.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Quality checks:

```bash
npm run lint
npm run build
```

## Add content

```bash
npm run new -- paper "Paper title"
npm run new -- project "Project title"
npm run new -- notebook "Notebook title"
npm run new -- blog "Post title"
npm run new -- research-diary "Diary title" --assets "C:\path\to\figures"
```

Create a paper and copy its PDF and optional static preview into the correct public upload folder in one command:

```bash
npm run new -- paper "Paper title" --pdf "C:\path\to\paper.pdf" --preview "C:\path\to\preview.webp"
```

Run `npm run new -- --help` for deterministic `--slug` and `--date` overrides. Validate research-diary documents with `npm run validate:content`.

The AI-facing content contract is available at `/api/ai/content-contract`. It exposes diary discovery, read, and validation endpoints; publishing remains a repository workflow because Vercel deployments have an immutable filesystem.

See [content/README.md](content/README.md) for frontmatter, file uploads, equations, PDFs, and the AI-assisted workflow.

## Deployment

The repository is hosted on Vercel. A push to the connected production branch triggers a rebuild; local edits do not affect the live site.
