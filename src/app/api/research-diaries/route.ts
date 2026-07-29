import { NextResponse } from "next/server";
import { getResearchDiaries } from "@/lib/researchDiary";

export function GET() {
  const diaries = getResearchDiaries().map((diary) => ({
    slug: diary.slug,
    title: diary.title,
    excerpt: diary.excerpt,
    date: diary.date,
    readTime: diary.readTime,
    tags: diary.tags,
    url: `/blog/${diary.slug}`,
    apiUrl: `/api/research-diaries/${diary.slug}`,
  }));

  return NextResponse.json({ diaries }, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
