# Publishing content

S.W.A.G uses one Markdown file per standard entry and one structured JSON file per visual research diary. Both are discovered automatically at build time.

## Create an entry

```bash
npm run new -- paper "Paper title"
npm run new -- project "Project title"
npm run new -- notebook "Notebook title"
npm run new -- blog "Post title"
npm run new -- research-diary "Diary title"
```

The command creates a file from the matching `_template.md`. Edit the frontmatter and write the content below it.

The generator never prompts for input and never overwrites an existing entry. Its optional flags are:

```text
--slug <slug>        Override the title-derived slug
--date <YYYY-MM-DD>  Override today's UTC date
--pdf <path>         For papers, copy a local PDF to the upload directory
--preview <path>     For papers, copy a PNG/JPG/JPEG/WEBP/AVIF preview image
--assets <dir>       Copy a directory of figures or other entry assets
```

## Upload files

Put images, PDFs, datasets, or notebook exports in:

```text
public/uploads/<entry-slug>/
```

Reference them from Markdown or frontmatter with:

```text
/uploads/<entry-slug>/filename.ext
```

For a paper PDF, set:

```yaml
download: "/uploads/<entry-slug>/paper.pdf"
```

The paper page will embed that PDF and keep a direct download link. An optional static card preview uses:

```yaml
preview: "/uploads/<entry-slug>/preview.webp"
```

For the common paper workflow, one command creates the Markdown entry, copies supplied assets to deterministic names under `public/uploads/<slug>/`, and sets only the paths for assets that were supplied:

```bash
npm run new -- paper "Paper title" --pdf "C:\path\to\paper.pdf" --preview "C:\path\to\preview.webp"
```

Without `--pdf` or `--preview`, the generated `download` and `preview` values are empty, so the site does not request nonexistent files.

## Research diary template

Research diaries live in `content/research-diaries/` and use `_template.json`. The JSON is the page content: adding a diary does not require editing React or a TypeScript array.

```bash
npm run new -- research-diary "Ablating the Memory Path" --assets "C:\research\figures"
npm run validate:content
```

Each diary is a sequence of research entries. Entries accept the following blocks:

- `prose`: Markdown with inline or display LaTeX
- `math`: one or more labeled display equations
- `figure`: an original image, dimensions, caption, and provenance
- `stats`: consistently styled quantitative results
- `note`: a decision, interpretation, or negative result
- `claims`: supported and unsupported conclusions
- `nextStudies`: decision-ordered follow-up experiments
- `status`: scientific scope and review status
- `quote`: a closing reflection

Figure paths must use `/uploads/<slug>/filename` and should point to assets copied with `--assets` or placed in that directory manually.

## Equations

Use standard LaTeX delimiters:

```md
Inline: $E = mc^2$

Display:

$$
\mathcal{L}(\theta) = \sum_i (y_i - f_\theta(x_i))^2
$$
```

## AI-assisted publishing and API

Give an AI assistant the source material and ask it to:

1. Read `GET /api/ai/content-contract` when working through the deployed site, or inspect `_template.json` in the repository.
2. Run the appropriate `npm run new` command, including paper assets or research-diary `--assets` when available.
3. Copy any other attachments into `public/uploads/<slug>/`.
4. Fill the generated Markdown or research-diary JSON without changing application code.
5. For diaries, run `npm run validate:content`; then run `npm run lint` and `npm run build`.

The public AI interface is intentionally read/validate only:

```text
GET  /api/ai/content-contract
GET  /api/research-diaries
GET  /api/research-diaries/<slug>
POST /api/ai/research-diaries/validate
```

Publishing through an unauthenticated HTTP write endpoint is not supported. Vercel's deployed filesystem is immutable, and a public write route would let arbitrary visitors alter the site. An AI assistant publishes through a reviewed repository change instead.

Root-level `AGENTS.md` contains the same machine-readable contract for coding agents.
