import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Code,
  FileText,
  Terminal,
  ArrowRight,
  Star,
  GitFork,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { papers, projects, repos, blogs } from "@/lib/data";
import { PaperPreviewCard } from "@/components/PaperPreviewCard";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query?.toLowerCase() || "";

  const filteredPapers = papers.filter(
    (p) =>
      p.title.toLowerCase().includes(query) ||
      p.authors.toLowerCase().includes(query) ||
      p.tags.some((t) => t.toLowerCase().includes(query))
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.language.toLowerCase().includes(query)
  );

  const filteredRepos = repos.filter(
    (r) =>
      r.title.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query)
  );

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(query) ||
      b.excerpt.toLowerCase().includes(query)
  );

  const hasResults =
    filteredPapers.length > 0 ||
    filteredProjects.length > 0 ||
    filteredRepos.length > 0 ||
    filteredBlogs.length > 0;
  const displayedPapers = filteredPapers.slice(0, 3);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section - Only show if no search query */}
      {!query && (
        <section>
          <div className="container mx-auto px-4 py-24 text-center max-w-5xl">
            <h1
              aria-label="i love GPUs"
              className="flex items-center justify-center gap-[0.16em] text-4xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight"
            >
              <span>i</span>
              <Image
                src="/heart-balloon.png"
                alt=""
                width={581}
                height={671}
                priority
                className="h-[1.25em] w-auto object-contain"
              />
              <span>GPUs</span>
            </h1>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/papers"
                className="px-10 py-4 text-base bg-[#FFD21E] text-black rounded-full font-bold hover:bg-[#F5C518] transition-colors border-2 border-[#FFD21E]"
              >
                Browse Papers
              </Link>
              <Link
                href="/projects"
                className="px-10 py-4 text-base bg-white text-gray-900 border-2 border-gray-200 rounded-full font-bold hover:border-gray-900 transition-colors"
              >
                View Projects
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-12 space-y-16 max-w-6xl">
        {query && !hasResults && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900">No results found</h2>
            <p className="text-gray-600 mt-2">
              Try adjusting your search query.
            </p>
          </div>
        )}

        {/* Blog Section */}
        {filteredBlogs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {query ? "Matching Research Diary Entries" : "Research Diary"}
                </h2>
              </div>
              {!query && (
                <Link
                  href="/blog"
                  className="text-sm font-medium text-gray-600 hover:text-purple-600 flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {filteredBlogs.map((blog, i) => (
                <Link
                  key={i}
                  href={`/blog/${blog.slug}`}
                  className="block bg-white p-6 rounded-xl border border-gray-100 hover:border-purple-400 hover:shadow-md hover:shadow-purple-50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Papers Section */}
        {filteredPapers.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {query ? "Matching Papers" : "Recent Papers"}
                </h2>
              </div>
              {!query && (
                <Link
                  href="/papers"
                  className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:border-blue-300 hover:bg-blue-100 transition-colors"
                >
                  View more <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {displayedPapers.map((paper) => (
                <PaperPreviewCard key={paper.slug} paper={paper} />
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {filteredProjects.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {query ? "Matching Projects" : "Featured Projects"}
                </h2>
              </div>
              {!query && (
                <Link
                  href="/projects"
                  className="text-sm font-medium text-gray-600 hover:text-green-600 flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {filteredProjects.map((project, i) => (
                <a
                  key={i}
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white p-5 rounded-xl border border-gray-100 hover:border-green-400 hover:shadow-md hover:shadow-green-50 transition-all flex flex-col h-full group"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        {project.language}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {project.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" /> {project.forks}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Notebooks Section */}
        {filteredRepos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Terminal className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {query ? "Matching Notebooks" : "Latest Notebooks"}
                </h2>
              </div>
              {!query && (
                <Link
                  href="/notebooks"
                  className="text-sm font-medium text-gray-600 hover:text-orange-600 flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            <div className="grid gap-4">
              {filteredRepos.map((notebook, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-xl border border-gray-100 hover:border-orange-400 hover:shadow-md hover:shadow-orange-50 transition-all flex flex-wrap items-center gap-4 group"
                >
                  <a
                    className="flex min-w-0 flex-1 items-center gap-4"
                    href={notebook.github || `/notebooks/${notebook.slug}`}
                    rel={notebook.github ? "noreferrer" : undefined}
                    target={notebook.github ? "_blank" : undefined}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 font-mono text-sm font-bold border border-orange-100">
                      IPYNB
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                        {notebook.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {notebook.description}
                      </p>
                    </div>
                    {notebook.github ? (
                      <ExternalLink className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    ) : null}
                  </a>
                  <div className="ml-auto flex items-center gap-4">
                    {notebook.diary ? (
                      <Link
                        className="inline-flex items-center gap-1 text-sm font-semibold text-orange-700 hover:text-orange-900"
                        href={notebook.diary}
                      >
                        <BookOpen className="h-4 w-4" />
                        Read diary
                      </Link>
                    ) : null}
                    <span className="text-sm text-gray-400 whitespace-nowrap">
                      {notebook.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
