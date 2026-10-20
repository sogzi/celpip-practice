import Link from "next/link";
import { notFound } from "next/navigation";
import { PARTS, SKILL_INFO, getPart, type Skill } from "@/lib/rl";
import { TestRunner } from "./TestRunner";
import { Eyebrow, btn } from "./ui";

export async function SkillPartPage({ skill, params }: { skill: Skill; params: Promise<{ partId: string }> }) {
  const { partId } = await params;
  const info = SKILL_INFO[skill];
  const isFull = partId === "full";
  const part = isFull ? undefined : getPart(skill, partId);
  if (!isFull && !part) notFound();
  const partIds = isFull ? PARTS[skill].map((p) => p.id) : [part!.id];
  return (
    <div className="space-y-6">
      <Link href={`/${skill}`} className={btn.ghost}>← All {skill} parts</Link>
      <div>
        <Eyebrow>{isFull ? `${info.label} · Full test` : `${info.label} Part ${part!.number}`}</Eyebrow>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
          {isFull ? `Full ${info.label} test` : part!.name}
        </h1>
        <p className="mt-1 text-muted">{isFull ? `All ${PARTS[skill].length} parts, ${info.duration}.` : part!.summary}</p>
      </div>
      <TestRunner key={partId} skill={skill} partIds={partIds} />
    </div>
  );
}

export function skillStaticParams(skill: Skill) {
  return [...PARTS[skill].map((p) => ({ partId: p.id })), { partId: "full" }];
}
