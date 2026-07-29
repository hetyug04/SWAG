import { NextResponse } from "next/server";
import { validateResearchDiary } from "@/lib/researchDiary";

export async function POST(request: Request) {
  let document: unknown;

  try {
    document = await request.json();
  } catch {
    return NextResponse.json(
      { valid: false, errors: ["Request body must be valid JSON."] },
      { status: 400 },
    );
  }

  const result = validateResearchDiary(document);
  return NextResponse.json(result, { status: result.valid ? 200 : 422 });
}
