import { ExamRunner } from "@/components/ExamRunner";
import { Eyebrow } from "@/components/ui";

export const metadata = { title: "Mock exam · CELPIP Practice" };

export default function ExamPage() {
  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Full CELPIP-General mock exam</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Mock exam</h1>
        <p className="mt-2 text-muted max-w-2xl">All four sections in one sitting, with a level for each skill and your average.</p>
      </div>
      <ExamRunner />
    </div>
  );
}
