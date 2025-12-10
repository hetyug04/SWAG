import { blogs } from "@/lib/data";
import { notFound } from "next/navigation";
import { BookOpen, Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-500 hover:text-purple-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-50 rounded-lg">
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900">{blog.title}</h1>
        </div>

        <div className="flex items-center gap-6 text-gray-500 mb-12 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{blog.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{blog.readTime}</span>
          </div>
        </div>

        <div className="prose prose-xl max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-purple-600 hover:prose-a:text-purple-700 prose-img:rounded-xl prose-img:shadow-lg">
          <p className="text-2xl text-gray-600 mb-12 font-medium italic leading-relaxed">
            {blog.excerpt}
          </p>
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({ node, ...props }) => (
                <span className="block my-8">
                  <img {...props} className="rounded-xl shadow-lg w-full" alt={props.alt || ""} />
                </span>
              ),
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
