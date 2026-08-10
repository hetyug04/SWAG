import type { Metadata } from "next";
import { AsciiBlackHole } from "./AsciiBlackHole";

export const metadata: Metadata = {
  title: "Singularity",
  description: "An interactive ASCII black hole.",
};

export default function SingularityPage() {
  return <AsciiBlackHole />;
}
