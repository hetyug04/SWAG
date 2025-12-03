import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Suspense } from "react";
import { SearchInput } from "./SearchInput";

export function Navbar() {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <span className="font-bold text-xl tracking-tight italic group-hover:text-[#FFD21E] transition-colors">#S.W.A.G</span>
        </Link>

        {/* Search Bar - Hidden on mobile, visible on md+ */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <Suspense fallback={<div className="w-full h-10 bg-gray-100 rounded-full animate-pulse" />}>
            <SearchInput />
          </Suspense>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
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
            Blog
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-gray-600">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
