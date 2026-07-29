import fs from "node:fs";
import path from "node:path";

export type ResearchDiaryAuthor = {
  name: string;
  role: string;
};

export type ResearchDiaryProseBlock = {
  type: "prose";
  markdown: string;
};

export type ResearchDiaryMathBlock = {
  type: "math";
  equations: Array<{
    formula: string;
    label: string;
  }>;
};

export type ResearchDiaryFigureBlock = {
  type: "figure";
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  provenance: string;
  compact?: boolean;
};

export type ResearchDiaryStatsBlock = {
  type: "stats";
  items: Array<{
    value: string;
    label: string;
    latex?: boolean;
  }>;
};

export type ResearchDiaryNoteBlock = {
  type: "note";
  label: string;
  markdown: string;
};

export type ResearchDiaryClaimsBlock = {
  type: "claims";
  groups: Array<{
    title: string;
    tone: "supported" | "unsupported";
    items: string[];
  }>;
};

export type ResearchDiaryNextStudiesBlock = {
  type: "nextStudies";
  title: string;
  items: Array<{
    priority: number;
    name: string;
    design: string;
    decisionValue: string;
  }>;
};

export type ResearchDiaryStatusBlock = {
  type: "status";
  title: string;
  body: string;
  meta?: string;
};

export type ResearchDiaryQuoteBlock = {
  type: "quote";
  markdown: string;
  attribution?: string;
};

export type ResearchDiaryBlock =
  | ResearchDiaryProseBlock
  | ResearchDiaryMathBlock
  | ResearchDiaryFigureBlock
  | ResearchDiaryStatsBlock
  | ResearchDiaryNoteBlock
  | ResearchDiaryClaimsBlock
  | ResearchDiaryNextStudiesBlock
  | ResearchDiaryStatusBlock
  | ResearchDiaryQuoteBlock;

export type ResearchDiaryEntry = {
  id: string;
  navLabel: string;
  label: string;
  phase: string;
  title: string;
  dek: string;
  blocks: ResearchDiaryBlock[];
};

export type ResearchDiaryDocument = {
  schemaVersion: "1.0";
  documentType: "research-diary";
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  author: ResearchDiaryAuthor;
  lede: string;
  notebook?: {
    label: string;
    githubUrl: string;
  };
  figureProvenance?: string;
  entries: ResearchDiaryEntry[];
  footer?: string[];
};

export type ResearchDiaryValidation = {
  valid: boolean;
  errors: string[];
};

const diaryDirectory = path.join(
  process.cwd(),
  "content",
  "research-diaries",
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(
  value: Record<string, unknown>,
  field: string,
  errors: string[],
  prefix = "",
) {
  if (typeof value[field] !== "string" || !value[field].trim()) {
    errors.push(`${prefix}${field} must be a non-empty string.`);
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function validateResearchDiary(
  value: unknown,
): ResearchDiaryValidation {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return { valid: false, errors: ["Document must be a JSON object."] };
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
    requireString(value, field, errors);
  }

  if (
    typeof value.slug === "string"
    && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug)
  ) {
    errors.push("slug must be a lowercase URL-safe slug.");
  }

  if (
    typeof value.date === "string"
    && !/^\d{4}-\d{2}-\d{2}$/.test(value.date)
  ) {
    errors.push("date must use YYYY-MM-DD.");
  }

  if (value.schemaVersion !== "1.0") {
    errors.push('schemaVersion must be "1.0".');
  }

  if (value.documentType !== "research-diary") {
    errors.push('documentType must be "research-diary".');
  }

  if (!isStringArray(value.tags) || value.tags.length === 0) {
    errors.push("tags must contain at least one string.");
  }

  if (!isRecord(value.author)) {
    errors.push("author must be an object.");
  } else {
    requireString(value.author, "name", errors, "author.");
    requireString(value.author, "role", errors, "author.");
  }

  if (value.notebook !== undefined) {
    if (!isRecord(value.notebook)) {
      errors.push("notebook must be an object.");
    } else {
      requireString(value.notebook, "label", errors, "notebook.");
      requireString(value.notebook, "githubUrl", errors, "notebook.");
      if (
        typeof value.notebook.githubUrl === "string"
        && !value.notebook.githubUrl.startsWith("https://github.com/")
      ) {
        errors.push("notebook.githubUrl must be a GitHub URL.");
      }
    }
  }

  if (!Array.isArray(value.entries) || value.entries.length === 0) {
    errors.push("entries must contain at least one diary entry.");
  } else {
    const ids = new Set<string>();

    value.entries.forEach((entry, entryIndex) => {
      const prefix = `entries[${entryIndex}].`;
      if (!isRecord(entry)) {
        errors.push(`${prefix.slice(0, -1)} must be an object.`);
        return;
      }

      for (const field of ["id", "navLabel", "label", "phase", "title", "dek"]) {
        requireString(entry, field, errors, prefix);
      }

      if (typeof entry.id === "string") {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id)) {
          errors.push(`${prefix}id must be a lowercase URL-safe slug.`);
        } else if (ids.has(entry.id)) {
          errors.push(`${prefix}id must be unique.`);
        }
        ids.add(entry.id);
      }

      if (!Array.isArray(entry.blocks) || entry.blocks.length === 0) {
        errors.push(`${prefix}blocks must contain at least one block.`);
        return;
      }

      entry.blocks.forEach((block, blockIndex) => {
        const blockPrefix = `${prefix}blocks[${blockIndex}].`;
        if (!isRecord(block) || typeof block.type !== "string") {
          errors.push(`${blockPrefix.slice(0, -1)} must have a block type.`);
          return;
        }

        const allowed = new Set([
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

        if (!allowed.has(block.type)) {
          errors.push(`${blockPrefix}type "${block.type}" is not supported.`);
          return;
        }

        switch (block.type) {
          case "prose":
          case "quote":
            requireString(block, "markdown", errors, blockPrefix);
            if (
              block.type === "quote"
              && block.attribution !== undefined
              && (typeof block.attribution !== "string" || !block.attribution.trim())
            ) {
              errors.push(`${blockPrefix}attribution must be a non-empty string.`);
            }
            break;
          case "math":
            if (!Array.isArray(block.equations) || block.equations.length === 0) {
              errors.push(`${blockPrefix}equations must contain at least one equation.`);
            } else {
              block.equations.forEach((equation, equationIndex) => {
                if (!isRecord(equation)) {
                  errors.push(
                    `${blockPrefix}equations[${equationIndex}] must be an object.`,
                  );
                  return;
                }
                requireString(
                  equation,
                  "formula",
                  errors,
                  `${blockPrefix}equations[${equationIndex}].`,
                );
                requireString(
                  equation,
                  "label",
                  errors,
                  `${blockPrefix}equations[${equationIndex}].`,
                );
              });
            }
            break;
          case "figure":
            for (const field of ["src", "alt", "caption", "provenance"]) {
              requireString(block, field, errors, blockPrefix);
            }
            if (typeof block.src === "string" && !block.src.startsWith("/uploads/")) {
              errors.push(`${blockPrefix}src must use /uploads/<slug>/filename.`);
            }
            if (
              !Number.isInteger(block.width)
              || Number(block.width) < 1
              || !Number.isInteger(block.height)
              || Number(block.height) < 1
            ) {
              errors.push(`${blockPrefix}width and height must be positive integers.`);
            }
            break;
          case "stats":
            if (!Array.isArray(block.items) || block.items.length === 0) {
              errors.push(`${blockPrefix}items must contain at least one statistic.`);
            } else {
              block.items.forEach((item, itemIndex) => {
                if (!isRecord(item)) {
                  errors.push(`${blockPrefix}items[${itemIndex}] must be an object.`);
                  return;
                }
                requireString(item, "value", errors, `${blockPrefix}items[${itemIndex}].`);
                requireString(item, "label", errors, `${blockPrefix}items[${itemIndex}].`);
              });
            }
            break;
          case "note":
            requireString(block, "label", errors, blockPrefix);
            requireString(block, "markdown", errors, blockPrefix);
            break;
          case "claims":
            if (!Array.isArray(block.groups) || block.groups.length === 0) {
              errors.push(`${blockPrefix}groups must contain at least one claim group.`);
            } else {
              block.groups.forEach((group, groupIndex) => {
                if (!isRecord(group)) {
                  errors.push(`${blockPrefix}groups[${groupIndex}] must be an object.`);
                  return;
                }
                requireString(
                  group,
                  "title",
                  errors,
                  `${blockPrefix}groups[${groupIndex}].`,
                );
                if (group.tone !== "supported" && group.tone !== "unsupported") {
                  errors.push(
                    `${blockPrefix}groups[${groupIndex}].tone must be supported or unsupported.`,
                  );
                }
                if (!isStringArray(group.items) || group.items.length === 0) {
                  errors.push(
                    `${blockPrefix}groups[${groupIndex}].items must contain strings.`,
                  );
                }
              });
            }
            break;
          case "nextStudies":
            requireString(block, "title", errors, blockPrefix);
            if (!Array.isArray(block.items) || block.items.length === 0) {
              errors.push(`${blockPrefix}items must contain at least one study.`);
            } else {
              block.items.forEach((item, itemIndex) => {
                if (!isRecord(item)) {
                  errors.push(`${blockPrefix}items[${itemIndex}] must be an object.`);
                  return;
                }
                for (const field of ["name", "design", "decisionValue"]) {
                  requireString(
                    item,
                    field,
                    errors,
                    `${blockPrefix}items[${itemIndex}].`,
                  );
                }
                if (!Number.isInteger(item.priority)) {
                  errors.push(`${blockPrefix}items[${itemIndex}].priority must be an integer.`);
                }
              });
            }
            break;
          case "status":
            requireString(block, "title", errors, blockPrefix);
            requireString(block, "body", errors, blockPrefix);
            break;
        }
      });
    });
  }

  if (value.footer !== undefined && !isStringArray(value.footer)) {
    errors.push("footer must be an array of strings.");
  }

  return { valid: errors.length === 0, errors };
}

function readDiaryFile(filePath: string): ResearchDiaryDocument | undefined {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;

  if (!isRecord(raw) || raw.documentType !== "research-diary") {
    return undefined;
  }

  const validation = validateResearchDiary(raw);
  if (!validation.valid) {
    throw new Error(
      `Invalid research diary ${path.basename(filePath)}:\n${validation.errors.join("\n")}`,
    );
  }

  return raw as ResearchDiaryDocument;
}

export function getResearchDiaries(): ResearchDiaryDocument[] {
  if (!fs.existsSync(diaryDirectory)) {
    return [];
  }

  return fs
    .readdirSync(diaryDirectory)
    .filter((file) => file.endsWith(".json") && !file.startsWith("_"))
    .map((file) => readDiaryFile(path.join(diaryDirectory, file)))
    .filter((diary): diary is ResearchDiaryDocument => Boolean(diary))
    .sort(
      (first, second) =>
        Date.parse(second.date) - Date.parse(first.date),
    );
}

export function getResearchDiary(
  slug: string,
): ResearchDiaryDocument | undefined {
  return getResearchDiaries().find((diary) => diary.slug === slug);
}
