import Link from "next/link";
import { SPEAKING_TASKS } from "@/lib/celpip";
import { Card, Eyebrow } from "@/components/ui";

export const metadata = { title: "Speaking · Prepfluent" };

export default function SpeakingIndex() {
  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>Speaking test · 8 tasks</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Speaking tasks</h1>
        <p className="mt-2 text-muted max-w-2xl">
          Rated on Content/Coherence, Vocabulary, Listenability and Task Fulfillment. You&apos;ll need a microphone.
        </p>
      </div>
      <Link href="/speaking/full" className="group block">
        <Card className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-accent/40 bg-accent-soft transition group-hover:border-accent">
          <div>
            <p className="font-semibold text-lg group-hover:text-accent">Full Speaking test</p>
            <p className="text-sm text-muted mt-1">All 8 tasks back to back, about 20 minutes, with an estimated CELPIP level.</p>
          </div>
          <span className="text-accent font-medium shrink-0">Start →</span>
        </Card>
      </Link>

      <div className="grid sm:grid-cols-2 gap-4">
        {SPEAKING_TASKS.map((t) => (
          <Link key={t.id} href={`/speaking/${t.id}`} className="group">
            <Card className="p-5 h-full flex gap-4 transition group-hover:border-muted">
              <span className="grid place-items-center size-10 shrink-0 rounded-lg bg-surface-2 font-semibold tabular-nums group-hover:bg-accent group-hover:text-accent-ink transition">
                {t.number}
              </span>
              <div>
                <h2 className="font-semibold group-hover:text-accent">{t.name}</h2>
                <p className="mt-1 text-sm text-muted leading-relaxed">{t.summary}</p>
                <p className="mt-2 text-xs text-muted">Prepare {t.prepSeconds}s · Speak {t.speakSeconds}s</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
