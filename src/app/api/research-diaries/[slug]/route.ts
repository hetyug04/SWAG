import { NextResponse } from "next/server";
import { getResearchDiary } from "@/lib/researchDiary";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const diary = getResearchDiary(slug);

  if (!diary) {
    return NextResponse.json(
      { error: "Research diary not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(diary, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
