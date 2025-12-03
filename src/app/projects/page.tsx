import { projects } from "@/lib/data";
import { Code, Star, GitFork } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-green-50 rounded-lg">
            <Code className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Projects</h1>
        </div>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl">
          Showcase of my personal and professional projects.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
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
      </div>
    </div>
  );
}
