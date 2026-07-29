import Link from "next/link";
import { Menu } from "lucide-react";
import { Suspense } from "react";
import { SearchInput } from "./SearchInput";
import styles from "./Navbar.module.css";

export function Navbar() {
  return (
    <header className="border-b border-gray-100 bg-white/45 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 grid grid-cols-[1fr_auto] md:grid-cols-[minmax(0,1fr)_minmax(0,32rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)_minmax(0,1fr)] items-center gap-4">
        <Link href="/" className={styles.homeLink} aria-label="Go to home page">
          <svg
            aria-hidden="true"
            className={styles.houseIcon}
            viewBox="0 0 24 24"
          >
            <path
              className={styles.blast}
              d="m12 5 1.7 3.4 3.6-2-1 3.8 4 .8-3.3 2.5 2.8 2.9-4.1.1.4 4.1-3.4-2.2-1.9 3.7-1.5-3.8-3.6 2 .7-4.1-4-.7 3.2-2.6-2.9-2.9 4.1-.2-.4-4.1 3.5 2.1Z"
            />
            <path
              className={`${styles.housePiece} ${styles.roof}`}
              d="M3.5 11.2 12 3.8l8.5 7.4"
            />
            <path
              className={`${styles.housePiece} ${styles.chimney}`}
              d="M16.8 6.9V3.5h2.2v5.3"
            />
            <path
              className={`${styles.housePiece} ${styles.leftWall}`}
              d="M5.5 10.2v10h6.5v-8.7"
            />
            <path
              className={`${styles.housePiece} ${styles.rightWall}`}
              d="M12 11.5v8.7h6.5v-10"
            />
            <path
              className={`${styles.housePiece} ${styles.door}`}
              d="M10 20.2v-5.4h4v5.4"
            />
            <circle
              className={`${styles.debris} ${styles.debrisOne}`}
              cx="12"
              cy="12"
              r="1"
            />
            <circle
              className={`${styles.debris} ${styles.debrisTwo}`}
              cx="12"
              cy="12"
              r="0.8"
            />
            <circle
              className={`${styles.debris} ${styles.debrisThree}`}
              cx="12"
              cy="12"
              r="0.7"
            />
            <circle
              className={`${styles.debris} ${styles.debrisFour}`}
              cx="12"
              cy="12"
              r="0.9"
            />
          </svg>
        </Link>

        {/* Search Bar - Hidden on mobile, visible on md+ */}
        <div className="hidden md:flex w-full">
          <Suspense fallback={<div className="w-full h-10 bg-gray-100 rounded-full animate-pulse" />}>
            <SearchInput />
          </Suspense>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center justify-self-end gap-5 whitespace-nowrap text-sm font-medium text-gray-600">
          <Link href="/papers" className="hover:text-black transition-colors">
            Papers
          </Link>
          <Link href="/projects" className="hover:text-black transition-colors">
            Projects
          </Link>
          <Link href="/notebooks" className="hover:text-black transition-colors">
            Notebooks
          </Link>
          <Link href="/blog" className="hover:text-black transition-colors">
            Research Diary
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden justify-self-end p-2 text-gray-600"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
