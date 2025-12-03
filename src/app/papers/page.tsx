import { papers } from "@/lib/data";
import { FileText } from "lucide-react";

export default function PapersPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Research Papers</h1>
        </div>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl">
          Collection of my research papers and publications.
        </p>
        
        <div className="grid gap-4">
          {papers.map((paper, i) => (
            <a
              key={i}
              href={`/papers/${paper.slug}`}
              className="block bg-white p-5 rounded-xl border border-gray-100 hover:border-blue-400 hover:shadow-md hover:shadow-blue-50 transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {paper.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {paper.authors}
                  </p>
                </div>
                <span className="text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded font-medium">
                  {paper.date}
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                {paper.abstract}
              </p>
              <div className="flex gap-2 mt-3">
                {paper.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-blue-600 bg-blue-50/50 border border-blue-100 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
