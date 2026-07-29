import { NextResponse } from "next/server";
import { aiContentContract } from "@/lib/researchDiaryContract";

export function GET() {
  return NextResponse.json(aiContentContract, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
