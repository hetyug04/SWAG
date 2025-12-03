import { notebooks } from "@/lib/data";
import { notFound } from "next/navigation";
import { Terminal, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function generateStaticParams() {
  return notebooks.map((notebook) => ({
    slug: notebook.slug,
  }));
}

export default async function NotebookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const notebook = notebooks.find((n) => n.slug === slug);

  if (!notebook) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/notebooks"
          className="inline-flex items-center text-gray-500 hover:text-orange-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notebooks
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-50 rounded-lg">
            <Terminal className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{notebook.title}</h1>
        </div>

        <div className="flex items-center gap-4 text-gray-500 mb-8 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{notebook.date}</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-gray-600 prose-p:leading-relaxed">
          <p className="text-xl text-gray-600 mb-8 font-medium">
            {notebook.description}
          </p>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 font-mono text-sm text-gray-800 whitespace-pre-wrap">
            {notebook.content}
          </div>
        </div>
      </div>
    </div>
  );
}
