import Link from "next/link";
import { SPEAKING_TASKS, WRITING_TASKS } from "@/lib/celpip";
import { Suspense } from "react";
import { ApiBadge } from "@/components/ApiBadge";
import { RecentActivity } from "@/components/RecentActivity";
import { Card, Eyebrow } from "@/components/ui";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="max-w-2xl">
        <Eyebrow>CELPIP-General practice</Eyebrow>
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
          Practise under real test conditions. Get scored on the 1–12 CELPIP scale.
        </h1>
        <p className="mt-4 text-muted leading-relaxed">
          Every task uses the official timings and the four CELPIP rating dimensions. After each answer you get a
          level estimate, specific language fixes and a model answer built from your own ideas.
        </p>
        <div className="mt-5 h-6">
          <Suspense>
            <ApiBadge />
          </Suspense>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-5">
        <Card className="p-6 flex flex-col">
          <Eyebrow>Writing · 2 tasks</Eyebrow>
          <h2 className="mt-2 text-xl font-semibold">Writing</h2>
          <ul className="mt-4 space-y-3 flex-1">
            {WRITING_TASKS.map((t) => (
              <li key={t.id}>
                <Link href={`/writing/${t.id}`} className="group flex items-center justify-between gap-3 rounded-lg -mx-2 px-2 py-2 hover:bg-surface-2">
                  <span>
                    <span className="font-medium">Task {t.number}: {t.name}</span>
                    <span className="block text-sm text-muted">{t.minutes} min · {t.minWords}–{t.maxWords} words</span>
                  </span>
                  <span className="text-muted group-hover:text-accent" aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6 flex flex-col">
          <Eyebrow>Speaking · 8 tasks</Eyebrow>
          <h2 className="mt-2 text-xl font-semibold">Speaking</h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Timed preparation, automatic recording and a live transcript. Listen back before you submit.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 flex-1 content-start">
            {SPEAKING_TASKS.map((t) => (
              <Link key={t.id} href={`/speaking/${t.id}`} className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-accent hover:text-accent">
                {t.number}. {t.name}
              </Link>
            ))}
          </div>
          <Link href="/speaking" className="mt-5 text-sm font-medium text-accent">See all speaking tasks →</Link>
        </Card>
      </section>

      <RecentActivity />
    </div>
  );
}
