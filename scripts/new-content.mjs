#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const kindAliases = {
  paper: "papers",
  papers: "papers",
  project: "projects",
  projects: "projects",
  notebook: "notebooks",
  notebooks: "notebooks",
  blog: "blogs",
  blogs: "blogs",
  diary: "research-diaries",
  "research-diary": "research-diaries",
  "research-diaries": "research-diaries",
};

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function usage() {
  console.log(`
Create a S.W.A.G content file

  npm run new -- <paper|project|notebook|blog|research-diary> "Title" [options]

Options:

  --slug <slug>       Override the title-derived slug
  --date <YYYY-MM-DD> Override today's UTC date
  --pdf <path>        Copy a local PDF to the paper's upload directory
  --preview <path>    Copy a PNG, JPG, JPEG, WEBP, or AVIF paper preview
  --assets <dir>      Copy a directory of diary figures or other entry assets
  --help              Show this help

Examples:

  npm run new -- paper "A Small Study of Learned Optimizers"
  npm run new -- paper "A Small Study" --pdf "C:\\papers\\study.pdf" --preview "C:\\papers\\preview.webp"
  npm run new -- research-diary "Ablating the Memory Path" --assets "C:\\research\\figures"
`);
}

function parseArguments(args) {
  const options = {};
  const positional = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === "--help" || argument === "-h") {
      options.help = true;
      continue;
    }

    if (
      argument === "--slug"
      || argument === "--date"
      || argument === "--pdf"
      || argument === "--preview"
      || argument === "--assets"
    ) {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${argument} requires a value.`);
      }
      options[argument.slice(2)] = value;
      index += 1;
      continue;
    }

    if (argument.startsWith("--")) {
      throw new Error(`Unknown option: ${argument}`);
    }

    positional.push(argument);
  }

  return { positional, options };
}

function createContent(args) {
  const { positional, options } = parseArguments(args);

  if (options.help) {
    usage();
    return;
  }

  const [rawKind, ...titleParts] = positional;
  const kind = kindAliases[rawKind];
  const title = titleParts.join(" ").trim();

  if (!kind || !title) {
    usage();
    throw new Error("A content type and title are required.");
  }

  if ((options.pdf || options.preview) && kind !== "papers") {
    throw new Error("--pdf and --preview can only be used when creating a paper.");
  }

  if (options.date && !/^\d{4}-\d{2}-\d{2}$/.test(options.date)) {
    throw new Error("--date must use YYYY-MM-DD.");
  }

  const slug = slugify(options.slug ?? title);
  if (!slug) {
    throw new Error("The title or --slug value must contain at least one letter or number.");
  }

  const directory = path.join(process.cwd(), "content", kind);
  const extension = kind === "research-diaries" ? ".json" : ".md";
  const templatePath = path.join(directory, `_template${extension}`);
  const outputPath = path.join(directory, `${slug}${extension}`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Missing template: content/${kind}/_template${extension}`);
  }

  if (fs.existsSync(outputPath)) {
    throw new Error(`Content already exists: content/${kind}/${slug}${extension}`);
  }

  const uploads = [];

  if (options.pdf) {
    const sourcePdf = path.resolve(process.cwd(), options.pdf);

    if (!fs.existsSync(sourcePdf) || !fs.statSync(sourcePdf).isFile()) {
      throw new Error(`PDF not found: ${sourcePdf}`);
    }

    if (path.extname(sourcePdf).toLowerCase() !== ".pdf") {
      throw new Error(`--pdf must point to a .pdf file: ${sourcePdf}`);
    }

    const uploadDirectory = path.join(process.cwd(), "public", "uploads", slug);
    const uploadedPdf = path.join(uploadDirectory, "paper.pdf");

    if (
      path.resolve(sourcePdf).toLowerCase() !== path.resolve(uploadedPdf).toLowerCase()
      && fs.existsSync(uploadedPdf)
    ) {
      throw new Error(`Upload already exists: public/uploads/${slug}/paper.pdf`);
    }

    uploads.push({
      source: sourcePdf,
      destination: uploadedPdf,
      publicPath: `/uploads/${slug}/paper.pdf`,
      label: "PDF",
    });
  }

  if (options.preview) {
    const sourcePreview = path.resolve(process.cwd(), options.preview);

    if (!fs.existsSync(sourcePreview) || !fs.statSync(sourcePreview).isFile()) {
      throw new Error(`Preview not found: ${sourcePreview}`);
    }

    const extension = path.extname(sourcePreview).toLowerCase().slice(1);
    if (!["png", "jpg", "jpeg", "webp", "avif"].includes(extension)) {
      throw new Error("--preview must point to a PNG, JPG, JPEG, WEBP, or AVIF file.");
    }

    const uploadDirectory = path.join(process.cwd(), "public", "uploads", slug);
    const uploadedPreview = path.join(uploadDirectory, `preview.${extension}`);

    if (
      path.resolve(sourcePreview).toLowerCase() !== path.resolve(uploadedPreview).toLowerCase()
      && fs.existsSync(uploadedPreview)
    ) {
      throw new Error(`Upload already exists: public/uploads/${slug}/preview.${extension}`);
    }

    uploads.push({
      source: sourcePreview,
      destination: uploadedPreview,
      publicPath: `/uploads/${slug}/preview.${extension}`,
      label: "preview",
    });
  }

  if (options.assets) {
    const sourceDirectory = path.resolve(process.cwd(), options.assets);

    if (!fs.existsSync(sourceDirectory) || !fs.statSync(sourceDirectory).isDirectory()) {
      throw new Error(`Asset directory not found: ${sourceDirectory}`);
    }

    const collectAssets = (directoryPath) => {
      for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
        const source = path.join(directoryPath, entry.name);
        if (entry.isDirectory()) {
          collectAssets(source);
          continue;
        }

        if (!entry.isFile()) {
          continue;
        }

        const relative = path.relative(sourceDirectory, source);
        const destination = path.join(
          process.cwd(),
          "public",
          "uploads",
          slug,
          relative,
        );

        if (
          path.resolve(source).toLowerCase() !== path.resolve(destination).toLowerCase()
          && fs.existsSync(destination)
        ) {
          throw new Error(
            `Upload already exists: public/uploads/${slug}/${relative.replaceAll("\\", "/")}`,
          );
        }

        uploads.push({
          source,
          destination,
          publicPath: `/uploads/${slug}/${relative.replaceAll("\\", "/")}`,
          label: `asset ${relative}`,
        });
      }
    };

    collectAssets(sourceDirectory);
  }

  const date = options.date ?? new Date().toISOString().slice(0, 10);
  const download = uploads.find((upload) => upload.label === "PDF")?.publicPath ?? "";
  const preview = uploads.find((upload) => upload.label === "preview")?.publicPath ?? "";
  const jsonEscape = (value) => JSON.stringify(value).slice(1, -1);
  const replacement = (value) =>
    kind === "research-diaries" ? jsonEscape(value) : value;
  const template = fs
    .readFileSync(templatePath, "utf8")
    .replaceAll("{{slug}}", replacement(slug))
    .replaceAll("{{title}}", replacement(title))
    .replaceAll("{{date}}", replacement(date))
    .replaceAll("{{download}}", replacement(download))
    .replaceAll("{{preview}}", replacement(preview));

  if (uploads.length) {
    for (const upload of uploads) {
      fs.mkdirSync(path.dirname(upload.destination), { recursive: true });
      if (
        path.resolve(upload.source).toLowerCase()
        !== path.resolve(upload.destination).toLowerCase()
      ) {
        fs.copyFileSync(upload.source, upload.destination, fs.constants.COPYFILE_EXCL);
      }
    }
  }

  fs.writeFileSync(outputPath, template);

  console.log(`Created content/${kind}/${slug}${extension}`);
  if (uploads.length) {
    for (const upload of uploads) {
      console.log(`Copied ${upload.label} to public${upload.publicPath}`);
    }
  } else {
    console.log(`Add media to public/uploads/${slug}/ and reference it as /uploads/${slug}/filename.ext`);
  }
  console.log("The site will discover the new file automatically.");
  if (kind === "research-diaries") {
    console.log(`Validate it with: npm run validate:content -- content/${kind}/${slug}${extension}`);
  }
}

try {
  createContent(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
