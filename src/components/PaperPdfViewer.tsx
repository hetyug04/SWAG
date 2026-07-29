import styles from "./PaperPdfViewer.module.css";

export function PaperPdfViewer({
  source,
  title,
}: {
  source: string;
  title: string;
}) {
  const embedSource = `${source}${source.includes("#") ? "&" : "#"}toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

  return (
    <section className={styles.reader} aria-labelledby="paper-pdf-title">
      <div className={styles.toolbar}>
        <h2 className={styles.title} id="paper-pdf-title">
          Read the paper
        </h2>
        <div className={styles.actions}>
          <a
            className={styles.action}
            href={source}
            target="_blank"
            rel="noreferrer"
          >
            Open PDF
          </a>
          <a className={styles.action} href={source} download>
            Download
          </a>
        </div>
      </div>
      <iframe
        className={styles.frame}
        src={embedSource}
        title={`${title} PDF`}
        loading="lazy"
      />
    </section>
  );
}
