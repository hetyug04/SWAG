export const researchDiaryJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "/api/ai/content-contract#research-diary",
  title: "S.W.A.G Research Diary",
  type: "object",
  additionalProperties: false,
  required: [
    "schemaVersion",
    "documentType",
    "slug",
    "title",
    "subtitle",
    "excerpt",
    "date",
    "readTime",
    "tags",
    "author",
    "lede",
    "entries",
  ],
  properties: {
    schemaVersion: { const: "1.0" },
    documentType: { const: "research-diary" },
    slug: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
    title: { type: "string", minLength: 1 },
    subtitle: { type: "string", minLength: 1 },
    excerpt: { type: "string", minLength: 1 },
    date: { type: "string", format: "date" },
    readTime: { type: "string", minLength: 1 },
    tags: { type: "array", items: { type: "string" }, minItems: 1 },
    author: {
      type: "object",
      additionalProperties: false,
      required: ["name", "role"],
      properties: {
        name: { type: "string", minLength: 1 },
        role: { type: "string", minLength: 1 },
      },
    },
    lede: { type: "string", minLength: 1 },
    notebook: {
      type: "object",
      additionalProperties: false,
      required: ["label", "githubUrl"],
      properties: {
        label: { type: "string", minLength: 1 },
        githubUrl: {
          type: "string",
          pattern: "^https://github\\.com/",
        },
      },
    },
    figureProvenance: { type: "string" },
    entries: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "navLabel", "label", "phase", "title", "dek", "blocks"],
        properties: {
          id: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
          navLabel: { type: "string", minLength: 1 },
          label: { type: "string", minLength: 1 },
          phase: { type: "string", minLength: 1 },
          title: { type: "string", minLength: 1 },
          dek: { type: "string", minLength: 1 },
          blocks: {
            type: "array",
            minItems: 1,
            items: {
              oneOf: [
                {
                  type: "object",
                  required: ["type", "markdown"],
                  properties: {
                    type: { const: "prose" },
                    markdown: { type: "string" },
                  },
                },
                {
                  type: "object",
                  required: ["type", "equations"],
                  properties: {
                    type: { const: "math" },
                    equations: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["formula", "label"],
                        properties: {
                          formula: { type: "string" },
                          label: { type: "string" },
                        },
                      },
                    },
                  },
                },
                {
                  type: "object",
                  required: [
                    "type",
                    "src",
                    "width",
                    "height",
                    "alt",
                    "caption",
                    "provenance",
                  ],
                  properties: {
                    type: { const: "figure" },
                    src: { type: "string" },
                    width: { type: "integer", minimum: 1 },
                    height: { type: "integer", minimum: 1 },
                    alt: { type: "string" },
                    caption: { type: "string" },
                    provenance: { type: "string" },
                    compact: { type: "boolean" },
                  },
                },
                {
                  type: "object",
                  required: ["type", "items"],
                  properties: {
                    type: { const: "stats" },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["value", "label"],
                        properties: {
                          value: { type: "string" },
                          label: { type: "string" },
                          latex: { type: "boolean" },
                        },
                      },
                    },
                  },
                },
                {
                  type: "object",
                  required: ["type", "label", "markdown"],
                  properties: {
                    type: { const: "note" },
                    label: { type: "string" },
                    markdown: { type: "string" },
                  },
                },
                {
                  type: "object",
                  required: ["type", "groups"],
                  properties: {
                    type: { const: "claims" },
                    groups: { type: "array" },
                  },
                },
                {
                  type: "object",
                  required: ["type", "title", "items"],
                  properties: {
                    type: { const: "nextStudies" },
                    title: { type: "string" },
                    items: { type: "array" },
                  },
                },
                {
                  type: "object",
                  required: ["type", "title", "body"],
                  properties: {
                    type: { const: "status" },
                    title: { type: "string" },
                    body: { type: "string" },
                    meta: { type: "string" },
                  },
                },
                {
                  type: "object",
                  required: ["type", "markdown"],
                  properties: {
                    type: { const: "quote" },
                    markdown: { type: "string" },
                    attribution: { type: "string" },
                  },
                },
              ],
            },
          },
        },
      },
    },
    footer: { type: "array", items: { type: "string" } },
  },
} as const;

export const aiContentContract = {
  name: "S.W.A.G content interface",
  version: "1.0",
  description:
    "A machine-readable contract for discovering, validating, and publishing research diaries.",
  capabilities: {
    discover: "GET /api/ai/content-contract",
    list: "GET /api/research-diaries",
    read: "GET /api/research-diaries/{slug}",
    validate: "POST /api/ai/research-diaries/validate",
    createLocally: 'npm run new -- research-diary "Title"',
    validateLocally: "npm run validate:content",
  },
  publishing: {
    mode: "repository workflow",
    reason:
      "Vercel deployments have an immutable filesystem, so publishing is performed through a reviewed repository change rather than an unauthenticated web write.",
    contentDirectory: "content/research-diaries",
    assetDirectory: "public/uploads/{slug}",
  },
  schema: researchDiaryJsonSchema,
} as const;
