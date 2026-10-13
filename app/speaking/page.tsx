import Link from "next/link";
import { SPEAKING_TASKS } from "@/lib/celpip";
import { Card, Eyebrow } from "@/components/ui";

export const metadata = { title: "Speaking · CELPIP Practice" };

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
