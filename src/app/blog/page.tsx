import { blogs } from "@/lib/data";
import { BookOpen, Calendar } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-purple-50 rounded-lg">
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Research Diary</h1>
        </div>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl">
          Research notes, tutorials, and updates.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {blogs.map((blog, i) => (
            <a
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
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
