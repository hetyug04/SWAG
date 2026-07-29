import Link from "next/link";
import { paperPdfUrl, type Paper } from "@/lib/data";
import styles from "./PaperPreviewCard.module.css";

export function PaperPreviewCard({ paper }: { paper: Paper }) {
  const href = `/papers/${paper.slug}`;
  const pdfSource = paperPdfUrl(paper);
  const previewImage = paper.preview;
  const textPreview = paper.content?.trim() || paper.abstract;

  return (
    <article className={styles.card}>
      <div className={styles.preview}>
        {previewImage ? (
          <div
            aria-label={`First-page preview of ${paper.title}`}
            className={styles.previewImage}
            role="img"
            style={{ backgroundImage: `url("${previewImage}")` }}
          />
        ) : pdfSource ? (
          <iframe
            className={styles.pdf}
            loading="lazy"
            src={`${pdfSource}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
            title={`First-page preview of ${paper.title}`}
            tabIndex={-1}
            scrolling="no"
          />
        ) : (
          <div
            aria-label={`Text preview of ${paper.title}`}
            className={styles.bodyPreview}
            role="img"
          >
            {textPreview}
          </div>
        )}
      </div>
      <div className={styles.details}>
        <div className={styles.meta}>
          <span>Paper</span>
          {paper.date && <time>{paper.date}</time>}
        </div>
        <h3 className={styles.title}>{paper.title}</h3>
        {paper.authors && <p className={styles.authors}>{paper.authors}</p>}
        <Link className={styles.open} href={href}>
          Read paper →
        </Link>
      </div>
    </article>
  );
}
