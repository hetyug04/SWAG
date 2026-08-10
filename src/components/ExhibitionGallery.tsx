"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ExhibitionGallery.module.css";

type GalleryMode = "browse" | "inside";

const singularity = {
  title: "Singularity",
  preview: "/exhibitions/singularity-preview.svg",
  source: "/exhibitions/singularity",
};

type GalleryStyle = CSSProperties & {
  "--origin-x"?: string;
  "--origin-y"?: string;
};

export function ExhibitionGallery() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const exhibitionFrameRef = useRef<HTMLIFrameElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [rendered, setRendered] = useState(false);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<GalleryMode>("browse");
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!rendered) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlayRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        if (mode === "inside") {
          setMode("browse");
        } else {
          setOpen(false);
          closeTimer.current = setTimeout(() => {
            setRendered(false);
            triggerRef.current?.focus();
          }, 500);
        }
      } else if (
        event.key === "Enter" &&
        mode === "browse" &&
        document.activeElement === overlayRef.current
      ) {
        event.preventDefault();
        setMode("inside");
      }
    }

    function handleExhibitionMessage(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.source !== exhibitionFrameRef.current?.contentWindow ||
        event.data?.type !== "singularity:escape"
      ) {
        return;
      }

      setMode("browse");
      overlayRef.current?.focus();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("message", handleExhibitionMessage);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("message", handleExhibitionMessage);
      document.body.style.overflow = previousOverflow;
    };
  }, [mode, rendered]);

  function openGallery() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    const rect = triggerRef.current?.getBoundingClientRect();

    setOrigin({
      x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
      y: rect ? rect.top + rect.height / 2 : window.innerHeight / 2,
    });
    setMode("browse");
    setRendered(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  }

  function closeGallery() {
    setMode("browse");
    setOpen(false);
    closeTimer.current = setTimeout(() => {
      setRendered(false);
      triggerRef.current?.focus();
    }, 500);
  }

  function escapeGallery() {
    if (mode === "inside") {
      setMode("browse");
    } else {
      closeGallery();
    }
  }

  const overlay = rendered ? (
    <div
      ref={overlayRef}
      className={styles.overlay}
      data-open={open ? "true" : "false"}
      data-mode={mode}
      role="dialog"
      aria-modal="true"
      aria-label="Exhibition gallery"
      tabIndex={-1}
      style={{
        "--origin-x": `${origin.x}px`,
        "--origin-y": `${origin.y}px`,
      } as GalleryStyle}
    >
      <button className={styles.escapeButton} onClick={escapeGallery} aria-label="Go back">
        esc
      </button>

      <div className={styles.deck} aria-hidden={mode === "inside"}>
        <button
          className={styles.tile}
          onClick={() => setMode("inside")}
          aria-label={`Enter ${singularity.title}`}
          tabIndex={mode === "browse" ? 0 : -1}
        >
          <span className={styles.tileFrame}>
            <Image
              src={singularity.preview}
              alt="ASCII rendering of a luminous black hole and accretion disk"
              fill
              priority
              sizes="(max-width: 700px) 68vw, 24vw"
              className={styles.previewImage}
            />
          </span>
          <span className={styles.tileTitle}>{singularity.title}</span>
        </button>
      </div>

      <section
        className={styles.interior}
        aria-hidden={mode !== "inside"}
        aria-label={singularity.title}
      >
        {mode === "inside" ? (
          <iframe
            ref={exhibitionFrameRef}
            className={styles.exhibitionFrame}
            src={singularity.source}
            title="Interactive ASCII black hole"
            allow="fullscreen"
          />
        ) : null}
      </section>

      <p className={styles.srOnly} aria-live="polite">
        {mode === "browse"
          ? "Singularity selected. Press Enter to enter the exhibition."
          : "Singularity opened. Press Escape to return to the gallery."}
      </p>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.heartButton}
        onClick={openGallery}
        aria-label="Open exhibition gallery"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Image
          src="/heart-balloon.png"
          alt=""
          width={581}
          height={671}
          priority
          className={styles.heartImage}
        />
      </button>
      {overlay ? createPortal(overlay, document.body) : null}
    </>
  );
}
