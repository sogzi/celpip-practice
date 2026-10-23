import Link from "next/link";
import { WRITING_TASKS } from "@/lib/celpip";
import { Card, Eyebrow } from "@/components/ui";

export const metadata = { title: "Writing · Prepfluent" };

export default function WritingIndex() {
  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>Writing test · 53 minutes</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Writing tasks</h1>
        <p className="mt-2 text-muted max-w-2xl">
          Rated on Content/Coherence, Vocabulary, Readability and Task Fulfillment.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {WRITING_TASKS.map((t) => (
          <Link key={t.id} href={`/writing/${t.id}`} className="group">
            <Card className="p-6 h-full transition group-hover:border-muted">
              <p className="text-sm text-muted">Task {t.number}</p>
              <h2 className="mt-1 text-xl font-semibold group-hover:text-accent">{t.name}</h2>
              <p className="mt-2 text-muted leading-relaxed">{t.summary}</p>
              <p className="mt-4 text-sm">{t.minutes} minutes · {t.minWords}–{t.maxWords} words · {t.prompts.length} prompts</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
