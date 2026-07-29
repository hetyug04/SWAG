#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const allowedBlockTypes = new Set([
  "prose",
  "math",
  "figure",
  "stats",
  "note",
  "claims",
  "nextStudies",
  "status",
  "quote",
]);

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateDiary(document, filePath) {
  const errors = [];
  const label = path.relative(process.cwd(), filePath);

  if (!isObject(document)) {
    return [`${label}: document must be a JSON object.`];
  }

  for (const field of [
    "slug",
    "title",
    "subtitle",
    "excerpt",
    "date",
    "readTime",
    "lede",
  ]) {
    if (typeof document[field] !== "string" || !document[field].trim()) {
      errors.push(`${label}: ${field} must be a non-empty string.`);
    }
  }

  if (document.schemaVersion !== "1.0") {
    errors.push(`${label}: schemaVersion must be "1.0".`);
  }

  if (document.documentType !== "research-diary") {
    errors.push(`${label}: documentType must be "research-diary".`);
  }

  if (!Array.isArray(document.entries) || document.entries.length === 0) {
    errors.push(`${label}: entries must contain at least one entry.`);
    return errors;
  }

  const entryIds = new Set();
  document.entries.forEach((entry, entryIndex) => {
    if (!isObject(entry)) {
      errors.push(`${label}: entries[${entryIndex}] must be an object.`);
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id ?? "")) {
      errors.push(`${label}: entries[${entryIndex}].id must be a URL-safe slug.`);
    } else if (entryIds.has(entry.id)) {
      errors.push(`${label}: duplicate entry id "${entry.id}".`);
    }
    entryIds.add(entry.id);

    if (!Array.isArray(entry.blocks) || entry.blocks.length === 0) {
      errors.push(`${label}: entries[${entryIndex}].blocks cannot be empty.`);
      return;
    }

    entry.blocks.forEach((block, blockIndex) => {
      if (!isObject(block) || !allowedBlockTypes.has(block.type)) {
        errors.push(
          `${label}: entries[${entryIndex}].blocks[${blockIndex}] has an unsupported type.`,
        );
        return;
      }

      if (block.type === "figure") {
        if (!Number.isInteger(block.width) || !Number.isInteger(block.height)) {
          errors.push(
            `${label}: figure blocks require integer width and height.`,
          );
        }

        if (typeof block.src !== "string" || !block.src.startsWith("/uploads/")) {
          errors.push(
            `${label}: figure src must use /uploads/<slug>/filename.`,
          );
        } else {
          const assetPath = path.join(
            process.cwd(),
            "public",
            ...block.src.split("/").filter(Boolean),
          );
          if (!fs.existsSync(assetPath)) {
            errors.push(`${label}: missing figure asset ${block.src}.`);
          }
        }
      }
    });
  });

  return errors;
}

function diaryFiles(args) {
  if (args.length) {
    return args.map((argument) => path.resolve(process.cwd(), argument));
  }

  const directory = path.join(process.cwd(), "content", "research-diaries");
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".json") && !file.startsWith("_"))
    .map((file) => path.join(directory, file));
}

const errors = [];
let checked = 0;

for (const filePath of diaryFiles(process.argv.slice(2))) {
  let document;

  try {
    document = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(
      `${path.relative(process.cwd(), filePath)}: ${
        error instanceof Error ? error.message : error
      }`,
    );
    continue;
  }

  if (document.documentType !== "research-diary") {
    continue;
  }

  checked += 1;
  errors.push(...validateDiary(document, filePath));
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${checked} research diar${checked === 1 ? "y" : "ies"}.`);
}
