import { repos } from "@/lib/data";
import { BookOpen, ExternalLink, Terminal } from "lucide-react";
import Link from "next/link";

export default function ReposPage() {
  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-orange-50 rounded-lg">
            <Terminal className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Notebooks</h1>
        </div>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl">
          Notebooks and code experiments.
        </p>

        <div className="grid gap-4">
          {repos.map((repo, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl border border-gray-100 hover:border-orange-400 hover:shadow-md hover:shadow-orange-50 transition-all flex flex-wrap items-center gap-4 group"
            >
              <a
                className="flex min-w-0 flex-1 items-center gap-4"
                href={repo.github || `/notebooks/${repo.slug}`}
                rel={repo.github ? "noreferrer" : undefined}
                target={repo.github ? "_blank" : undefined}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 font-mono text-sm font-bold border border-orange-100">
                  IPYNB
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                    {repo.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {repo.description}
                  </p>
                </div>
                {repo.github ? (
                  <ExternalLink className="h-4 w-4 flex-shrink-0 text-gray-400" />
                ) : null}
              </a>
              <div className="ml-auto flex items-center gap-4">
                {repo.diary ? (
                  <Link
                    className="inline-flex items-center gap-1 text-sm font-semibold text-orange-700 hover:text-orange-900"
                    href={repo.diary}
                  >
                    <BookOpen className="h-4 w-4" />
                    Read diary
                  </Link>
                ) : null}
                <span className="text-sm text-gray-400 whitespace-nowrap">
                  {repo.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
