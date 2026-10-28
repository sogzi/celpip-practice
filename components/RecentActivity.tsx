"use client";
import Link from "next/link";
import { attemptLevel } from "@/lib/history";
import { Card } from "./ui";
import { useAttempts } from "./useAttempts";

export function RecentActivity() {
  const attempts = useAttempts().slice(0, 4);
  if (attempts.length === 0) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="font-semibold">Recent practice</h2>
        <Link href="/history" className="text-sm text-accent font-medium">All progress →</Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {attempts.map((a) => {
          const lv = attemptLevel(a);
          return (
            <Card key={a.id} className="p-4">
              <p className="text-xs text-muted truncate">{a.taskName}</p>
              <p className="mt-1 font-medium truncate">{a.promptTitle}</p>
              <p className="mt-3 text-2xl font-semibold tabular-nums">
                {lv === null ? "–" : (a.result.mode === "exam" || a.result.mode === "section") ? lv.toFixed(1) : lv}
                <span className="text-sm font-normal text-muted"> {lv ? "/ 12" : "not scored"}</span>
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
