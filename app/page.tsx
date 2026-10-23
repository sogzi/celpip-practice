import Link from "next/link";
import { SPEAKING_TASKS, WRITING_TASKS } from "@/lib/celpip";
import { FEATURES } from "@/lib/features";
import { PARTS, type Skill } from "@/lib/rl";
import { HeroAuthButtons } from "@/components/AuthMenu";
import { RecentActivity } from "@/components/RecentActivity";
import { Card, ComingSoon, Eyebrow } from "@/components/ui";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="max-w-2xl">
        <Eyebrow>CELPIP-General practice</Eyebrow>
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
          Practise under real test conditions. Get scored on the 1–12 CELPIP scale.
        </h1>
        <p className="mt-4 text-muted leading-relaxed">
          All four skills, with official timings and formats. Reading and listening are marked instantly; writing and
          speaking are scored on the four CELPIP rating dimensions, with language fixes and a sample answer.
        </p>
        <HeroAuthButtons />
      </section>

      {FEATURES.mockExam ? (
        <Link href="/exam" className="group block">
          <MockExamCard />
        </Link>
      ) : (
        <MockExamCard comingSoon />
      )}

      <section className="grid md:grid-cols-2 gap-5">
        {(["reading", "listening"] as Skill[]).map((skill) => (
          <Card key={skill} className="p-6 flex flex-col">
            <Eyebrow>{skill === "reading" ? "Reading · 4 parts" : "Listening · 6 parts"}</Eyebrow>
            <h2 className="mt-2 text-xl font-semibold">{skill === "reading" ? "Reading" : "Listening"}</h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {skill === "reading"
                ? "Passages, diagrams and fill-in-the-blank replies, each part on its own timer."
                : "Conversations, news and discussions played once, as on test day."}{" "}
              {FEATURES.aiGeneration ? "Built-in or freshly generated." : ""}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 flex-1 content-start">
              {PARTS[skill].map((p) => (
                <Link key={p.id} href={`/${skill}/${p.id}`} className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-accent hover:text-accent">
                  {p.number}. {p.name.replace(/^(Reading|Listening) (to |for )?/, "").replace(/^./, (c) => c.toUpperCase())}
                </Link>
              ))}
            </div>
            <Link href={`/${skill}/full`} className="mt-5 text-sm font-medium text-accent">Take the full {skill} test →</Link>
          </Card>
        ))}
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

function MockExamCard({ comingSoon = false }: { comingSoon?: boolean }) {
  return (
    <Card
      className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
        comingSoon ? "border-dashed" : "border-accent/40 bg-accent-soft group-hover:border-accent"
      }`}
    >
      <div>
        <div className="flex items-center gap-2">
          <Eyebrow>Full mock exam · about 2½ hours</Eyebrow>
          {comingSoon && <ComingSoon />}
        </div>
        <p className={`mt-2 text-xl font-semibold ${comingSoon ? "text-muted" : "group-hover:text-accent"}`}>
          Take all four sections, then get your average level
        </p>
        <p className="text-sm text-muted mt-1">
          Listening, Reading, Writing and Speaking in the official order. Your report shows a level for each skill and the average, with feedback for every task.
        </p>
      </div>
      {!comingSoon && <span className="text-accent font-medium shrink-0">Start →</span>}
    </Card>
  );
}
