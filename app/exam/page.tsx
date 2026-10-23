import { ExamRunner } from "@/components/ExamRunner";
import Link from "next/link";
import { Card, ComingSoon, Eyebrow, btn } from "@/components/ui";
import { FEATURES } from "@/lib/features";

export const metadata = { title: "Mock exam · Prepfluent" };

export default function ExamPage() {
  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Full CELPIP-General mock exam</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Mock exam</h1>
        <p className="mt-2 text-muted max-w-2xl">All four sections in one sitting, with a level for each skill and your average.</p>
      </div>
      {FEATURES.mockExam ? (
        <ExamRunner />
      ) : (
        <Card className="p-8 text-center border-dashed">
          <ComingSoon />
          <p className="mt-3 font-semibold text-lg">The full mock exam is coming soon</p>
          <p className="mt-1 text-sm text-muted max-w-md mx-auto">
            In the meantime, practise each section on its own, including the full Reading and Listening tests.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link href="/reading/full" className={btn.primary}>Full Reading test</Link>
            <Link href="/listening/full" className={btn.secondary}>Full Listening test</Link>
          </div>
        </Card>
      )}
    </div>
  );
}
