import Link from "next/link";
import katex from "katex";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  ExternalLink,
  FlaskConical,
  Github,
  Microscope,
  TriangleAlert,
  X,
} from "lucide-react";
import "katex/dist/katex.min.css";
import { MarkdownContent } from "@/components/MarkdownContent";
import type {
  ResearchDiaryBlock,
  ResearchDiaryDocument,
  ResearchDiaryFigureBlock,
  ResearchDiaryStatsBlock,
} from "@/lib/researchDiary";
import styles from "./ResearchDiary.module.css";

function MathValue({
  formula,
  display = false,
  label,
}: {
  formula: string;
  display?: boolean;
  label?: string;
}) {
  const html = katex.renderToString(formula, {
    displayMode: display,
    output: "html",
    throwOnError: false,
  });

  if (display) {
    return (
      <div
        aria-label={label ?? formula}
        className={styles.displayMath}
        dangerouslySetInnerHTML={{ __html: html }}
        role="math"
      />
    );
  }

  return (
    <span
      aria-label={label ?? formula}
      className={styles.inlineMath}
      dangerouslySetInnerHTML={{ __html: html }}
      role="math"
    />
  );
}

function FigureBlock({ figure }: { figure: ResearchDiaryFigureBlock }) {
  return (
    <figure
      className={`${styles.notebookFigure} ${
        figure.compact ? styles.compactFigure : ""
      }`}
    >
      <a
        aria-label={`Open full-resolution figure: ${figure.alt}`}
        className={styles.figureImageLink}
        href={figure.src}
        rel="noreferrer"
        target="_blank"
      >
        {/* Notebook figures are already compressed exports. Using the source file
            directly avoids the optimizer queue stalling on figures late in a
            long article. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={figure.alt}
          height={figure.height}
          loading="lazy"
          sizes="(max-width: 760px) 94vw, (max-width: 1200px) 78vw, 920px"
          src={figure.src}
          width={figure.width}
        />
      </a>
      <figcaption>
        <p>{figure.caption}</p>
        <div>
          <span>{figure.provenance}</span>
          <a href={figure.src} rel="noreferrer" target="_blank">
            Open full resolution
            <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </figcaption>
    </figure>
  );
}

function StatsBlock({ stats }: { stats: ResearchDiaryStatsBlock }) {
  return (
    <div className={styles.statStrip}>
      {stats.items.map((item) => (
        <div key={`${item.value}-${item.label}`}>
          <strong>
            {item.latex ? <MathValue formula={item.value} /> : item.value}
          </strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function DiaryBlock({ block }: { block: ResearchDiaryBlock }) {
  switch (block.type) {
    case "prose":
      return (
        <div className={styles.prose}>
          <MarkdownContent>{block.markdown}</MarkdownContent>
        </div>
      );
    case "math":
      return (
        <div className={styles.mathPair}>
          {block.equations.map((equation) => (
            <MathValue
              display
              formula={equation.formula}
              key={equation.formula}
              label={equation.label}
            />
          ))}
        </div>
      );
    case "figure":
      return <FigureBlock figure={block} />;
    case "stats":
      return <StatsBlock stats={block} />;
    case "note":
      return (
        <aside className={styles.diaryNote}>
          <span>{block.label}</span>
          <div>
            <MarkdownContent>{block.markdown}</MarkdownContent>
          </div>
        </aside>
      );
    case "claims":
      return (
        <div className={styles.claims}>
          {block.groups.map((group) => (
            <section key={group.title}>
              <h3>
                {group.tone === "supported" ? (
                  <Check aria-hidden="true" />
                ) : (
                  <X aria-hidden="true" />
                )}
                {group.title}
              </h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      );
    case "nextStudies":
      return (
        <div className={styles.nextStudies}>
          <h3>{block.title}</h3>
          {block.items.map((item) => (
            <article key={`${item.priority}-${item.name}`}>
              <span>{String(item.priority).padStart(2, "0")}</span>
              <div>
                <h4>{item.name}</h4>
                <p>{item.design}</p>
                <small>
                  <Microscope aria-hidden="true" />
                  {item.decisionValue}
                </small>
              </div>
            </article>
          ))}
        </div>
      );
    case "status":
      return (
        <aside className={styles.candor}>
          <TriangleAlert aria-hidden="true" />
          <div>
            <strong>{block.title}</strong>
            <p>{block.body}</p>
            {block.meta ? <span>{block.meta}</span> : null}
          </div>
        </aside>
      );
    case "quote":
      return (
        <blockquote>
          <MarkdownContent>{block.markdown}</MarkdownContent>
          {block.attribution ? <cite>— {block.attribution}</cite> : null}
        </blockquote>
      );
  }
}

export function ResearchDiary({
  diary,
}: {
  diary: ResearchDiaryDocument;
}) {
  const publishedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${diary.date}T00:00:00Z`));

  return (
    <div className={styles.diaryPage}>
      <div className={styles.topBar}>
        <Link href="/blog">
          <ArrowLeft aria-hidden="true" />
          Back to Research Diary
        </Link>
      </div>

      <header className={styles.hero}>
        <div className={styles.heroTags}>
          {diary.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <h1>{diary.title}</h1>
        <p className={styles.heroDek}>{diary.subtitle}</p>
        <div className={styles.byline}>
          <div className={styles.avatar}>
            <FlaskConical aria-hidden="true" />
          </div>
          <div>
            <strong>{diary.author.name}</strong>
            <span>{diary.author.role}</span>
          </div>
          <div className={styles.heroMeta}>
            <span>
              <Calendar aria-hidden="true" />
              {publishedDate}
            </span>
            <span>
              <Clock aria-hidden="true" />
              {diary.readTime}
            </span>
          </div>
        </div>
        <p className={styles.heroLede}>{diary.lede}</p>
        {diary.notebook ? (
          <a
            className={styles.notebookLink}
            href={diary.notebook.githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            <Github aria-hidden="true" />
            {diary.notebook.label}
            <ExternalLink aria-hidden="true" />
          </a>
        ) : null}
      </header>

      <div className={styles.articleLayout}>
        <aside className={styles.contents}>
          <span>On this page</span>
          <nav aria-label="Research diary sections">
            {diary.entries.map((entry, index) => (
              <a href={`#${entry.id}`} key={entry.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {entry.navLabel}
              </a>
            ))}
          </nav>
          {diary.figureProvenance ? (
            <div className={styles.contentsNote}>
              <strong>Figure provenance</strong>
              <p>{diary.figureProvenance}</p>
            </div>
          ) : null}
        </aside>

        <article className={styles.article}>
          {diary.entries.map((entry) => (
            <section className={styles.entry} id={entry.id} key={entry.id}>
              <header className={styles.entryHeader}>
                <div>
                  <span>{entry.label}</span>
                  <span>{entry.phase}</span>
                </div>
                <h2>{entry.title}</h2>
                <p>{entry.dek}</p>
              </header>
              {entry.blocks.map((block, index) => (
                <DiaryBlock block={block} key={`${entry.id}-${block.type}-${index}`} />
              ))}
              {entry === diary.entries.at(-1) && diary.footer?.length ? (
                <footer className={styles.articleFooter}>
                  {diary.footer.map((paragraph) => (
                    <div key={paragraph}>
                      <MarkdownContent>{paragraph}</MarkdownContent>
                    </div>
                  ))}
                </footer>
              ) : null}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
