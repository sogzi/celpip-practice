import Link from "next/link";
import { SectionRunner } from "@/components/SectionRunner";
import { Eyebrow, btn } from "@/components/ui";

export const metadata = { title: "Full Speaking test · Prepfluent" };

export default function FullSpeakingPage() {
  return (
    <div className="space-y-6">
      <Link href="/speaking" className={btn.ghost}>← All speaking tasks</Link>
      <div>
        <Eyebrow>Speaking · Full test</Eyebrow>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">Full Speaking test</h1>
        <p className="mt-1 text-muted">All 8 tasks back to back in about 20 minutes, scored together for an estimated CELPIP level.</p>
      </div>
      <SectionRunner kind="speaking" />
    </div>
  );
}
