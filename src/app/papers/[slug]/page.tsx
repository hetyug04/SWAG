import { papers } from "@/lib/data";
import { notFound } from "next/navigation";
import { FileText, Calendar, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

export function generateStaticParams() {
  return papers.map((paper) => ({
    slug: paper.slug,
  }));
}

export default async function PaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const paper = papers.find((p) => p.slug === slug);

  if (!paper) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/papers"
          className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Papers
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{paper.title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-8 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">Authors:</span>
            <span>{paper.authors}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{paper.date}</span>
          </div>
          {paper.link && (
            <a
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Original
            </a>
          )}
        </div>

        <div className="mb-8">
          <div className="flex gap-2 mb-6">
            {paper.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-blue-600 bg-blue-50/50 border border-blue-100 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Abstract</h2>
          <p className="text-xl text-gray-600 mb-8 font-medium leading-relaxed">
            {paper.abstract}
          </p>

          {paper.content && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Content</h2>
              <div className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-gray-600 prose-p:leading-relaxed">
                <div className="whitespace-pre-wrap">
                  {paper.content}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
