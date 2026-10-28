import Link from "next/link";
import { SectionRunner } from "@/components/SectionRunner";
import { Eyebrow, btn } from "@/components/ui";

export const metadata = { title: "Full Writing test · Prepfluent" };

export default function FullWritingPage() {
  return (
    <div className="space-y-6">
      <Link href="/writing" className={btn.ghost}>← All writing tasks</Link>
      <div>
        <Eyebrow>Writing · Full test</Eyebrow>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">Full Writing test</h1>
        <p className="mt-1 text-muted">Both tasks back to back in 53 minutes, scored together for an estimated CELPIP level.</p>
      </div>
      <SectionRunner kind="writing" />
    </div>
  );
}
