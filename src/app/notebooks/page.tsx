import { notebooks } from "@/lib/data";
import { Terminal } from "lucide-react";

export default function NotebooksPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-orange-50 rounded-lg">
            <Terminal className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Notebooks</h1>
        </div>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl">
          Jupyter notebooks and data analysis experiments.
        </p>

        <div className="grid gap-4">
          {notebooks.map((notebook, i) => (
            <a
              key={i}
              href={`/notebooks/${notebook.slug}`}
              className="block bg-white p-4 rounded-xl border border-gray-100 hover:border-orange-400 hover:shadow-md hover:shadow-orange-50 transition-all flex items-center gap-4 group cursor-pointer"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 font-mono text-sm font-bold border border-orange-100">
                IPYNB
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                  {notebook.title}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {notebook.description}
                </p>
              </div>
              <div className="text-sm text-gray-400 whitespace-nowrap">
                {notebook.date}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
