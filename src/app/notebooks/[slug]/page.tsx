import { repos } from "@/lib/data";
import { notFound } from "next/navigation";
import { Terminal, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function generateStaticParams() {
  return repos.map((repo) => ({
    slug: repo.slug,
  }));
}

export default async function RepoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const repo = repos.find((r) => r.slug === slug);

  if (!repo) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/repos"
          className="inline-flex items-center text-gray-500 hover:text-orange-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Repos
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-50 rounded-lg">
            <Terminal className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{repo.title}</h1>
        </div>

        <div className="flex items-center gap-4 text-gray-500 mb-8 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{repo.date}</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-gray-600 prose-p:leading-relaxed">
          <div className="whitespace-pre-wrap">
            {repo.content}
          </div>
        </div>
      </div>
    </div>
  );
}
