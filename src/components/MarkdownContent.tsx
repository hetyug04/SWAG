import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

/**
 * remark-math uses $...$ and $$...$$ delimiters. Existing papers also use
 * LaTeX's \( ... \) and \[ ... \] forms, so normalize those outside code
 * spans and fenced code blocks before parsing.
 */
function normalizeLatexDelimiters(markdown: string) {
  let fence: { marker: string; length: number } | undefined;

  return markdown
    .split("\n")
    .map((line) => {
      const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);

      if (fenceMatch) {
        const sequence = fenceMatch[1];
        const marker = sequence[0];

        if (!fence) {
          fence = { marker, length: sequence.length };
        } else if (
          fence.marker === marker &&
          sequence.length >= fence.length
        ) {
          fence = undefined;
        }

        return line;
      }

      if (fence) {
        return line;
      }

      return line
        .split(/(`+[^`]*`+)/g)
        .map((part) => {
          if (part.startsWith("`")) {
            return part;
          }

          return part
            .replace(/\\\[/g, () => "$$")
            .replace(/\\\]/g, () => "$$")
            .replace(/\\\(/g, () => "$")
            .replace(/\\\)/g, () => "$");
        })
        .join("");
    })
    .join("\n");
}

export function MarkdownContent({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      components={{
        img: ({ ...props }) => (
          <span className="block my-8">
            {/* Markdown images can be local or remote and do not provide dimensions. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              {...props}
              className="rounded-xl shadow-lg w-full"
              alt={props.alt || ""}
            />
          </span>
        ),
      }}
    >
      {normalizeLatexDelimiters(children)}
    </ReactMarkdown>
  );
}
