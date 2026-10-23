import { connection } from "next/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Card, Eyebrow } from "@/components/ui";
import { getAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { DAILY_LIMITS, startOfToday } from "@/lib/usage";

export const metadata = { title: "Usage · Prepfluent admin", robots: { index: false, follow: false } };

const DAY = 24 * 3600 * 1000;
/** Request time for this server-rendered report (the page is dynamic via connection()). */
const requestTime = () => Date.now();
const usd = (n: number) => (n < 1 ? `$${n.toFixed(3)}` : `$${n.toFixed(2)}`);

interface UsageRow { user_id: string; kind: string; cost_usd: number; created_at: string }
interface AttemptRow { user_id: string; kind: string; created_at: string }
interface Profile { id: string; email: string | null; full_name: string | null; created_at: string }

async function Report() {
  await connection();
  if (!(await getAdmin())) notFound();

  const db = createAdminClient();
  const now = requestTime();
  const since30 = new Date(now - 30 * DAY).toISOString();
  const today = startOfToday().getTime();
  const since7 = now - 7 * DAY;

  const [usageRes, attemptsRes, profilesRes] = await Promise.all([
    db.from("ai_usage").select("user_id, kind, cost_usd, created_at").gte("created_at", since30).range(0, 49999),
    db.from("practice_attempts").select("user_id, kind, created_at").gte("created_at", since30).range(0, 49999),
    db.from("profiles").select("id, email, full_name, created_at").range(0, 49999),
  ]);
  const usage = (usageRes.data ?? []) as UsageRow[];
  const attempts = (attemptsRes.data ?? []) as AttemptRow[];
  const profiles = (profilesRes.data ?? []) as Profile[];
  const errors = [usageRes.error, attemptsRes.error, profilesRes.error].filter(Boolean);

  const t = (r: { created_at: string }) => new Date(r.created_at).getTime();
  const sum = (rows: UsageRow[]) => rows.reduce((n, r) => n + Number(r.cost_usd), 0);
  const scores = usage.filter((r) => r.kind === "score");
  const window = (rows: UsageRow[], from: number) => rows.filter((r) => t(r) >= from);

  const cost7 = sum(window(usage, since7));
  const cost30 = sum(usage);
  const active7 = new Set([...attempts, ...usage].filter((a) => t(a) >= since7).map((a) => a.user_id)).size;
  const payingProxy = new Set(window(scores, since7).map((r) => r.user_id)).size;

  const perUser = profiles
    .map((p) => {
      const u = usage.filter((r) => r.user_id === p.id);
      const us = u.filter((r) => r.kind === "score");
      const a = attempts.filter((r) => r.user_id === p.id);
      const last = Math.max(0, ...a.map(t), ...u.map(t));
      return {
        ...p,
        scoresToday: window(us, today).length,
        scores7: window(us, since7).length,
        scores30: us.length,
        sessions30: a.length,
        cost30: sum(u),
        last,
      };
    })
    .sort((x, y) => y.cost30 - x.cost30 || y.sessions30 - x.sessions30);

  const kpis = [
    { label: "Scores today", value: String(window(scores, today).length), sub: usd(sum(window(usage, today))) },
    { label: "Scores, last 7 days", value: String(window(scores, since7).length), sub: usd(cost7) },
    { label: "AI cost, last 30 days", value: usd(cost30), sub: `${scores.length} scores` },
    { label: "Projected monthly cost", value: usd((cost7 / 7) * 30), sub: "from the last 7 days" },
    { label: "Active users, 7 days", value: String(active7), sub: `${profiles.length} accounts in total` },
    {
      label: "AI cost per scoring user",
      value: payingProxy ? usd(cost7 / payingProxy) : "–",
      sub: `per week · ${payingProxy} users scored`,
    },
  ];

  return (
    <div className="space-y-6">
      {errors.length > 0 && (
        <p className="rounded-lg bg-warn-soft text-warn p-3 text-sm">Some data couldn&apos;t be loaded: {errors.map((e) => e!.message).join("; ")}</p>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4">
            <p className="text-xs text-muted">{k.label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{k.value}</p>
            <p className="text-xs text-muted tabular-nums">{k.sub}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-line">
          <h2 className="font-semibold">Users</h2>
          <p className="text-xs text-muted">Daily limit: {DAILY_LIMITS.score} scores per user · resets at midnight Eastern</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-line">
                <th className="px-4 py-2 font-medium">User</th>
                <th className="px-3 py-2 font-medium text-right">Scores today</th>
                <th className="px-3 py-2 font-medium text-right">7 days</th>
                <th className="px-3 py-2 font-medium text-right">30 days</th>
                <th className="px-3 py-2 font-medium text-right">Practice sessions (30d)</th>
                <th className="px-3 py-2 font-medium text-right">AI cost (30d)</th>
                <th className="px-4 py-2 font-medium text-right">Last active</th>
              </tr>
            </thead>
            <tbody>
              {perUser.map((u) => (
                <tr key={u.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-2">
                    <span className="block font-medium">{u.full_name || "No name"}</span>
                    <span className="block text-xs text-muted">{u.email}</span>
                  </td>
                  <td className={`px-3 py-2 text-right tabular-nums ${u.scoresToday >= DAILY_LIMITS.score ? "text-accent font-medium" : ""}`}>{u.scoresToday}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{u.scores7}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{u.scores30}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{u.sessions30}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{usd(u.cost30)}</td>
                  <td className="px-4 py-2 text-right text-muted whitespace-nowrap">
                    {u.last ? new Date(u.last).toLocaleDateString("en-CA", { month: "short", day: "numeric" }) : "Never"}
                  </td>
                </tr>
              ))}
              {perUser.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-muted">No users yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="text-xs text-muted">
        Costs are estimated from token counts at list prices and exclude failed calls. Check the Anthropic console for exact billing.
      </p>
    </div>
  );
}

export default function AdminUsagePage() {
  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Admin</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Usage and costs</h1>
      </div>
      <Suspense fallback={<div className="h-96 rounded-xl border border-line bg-surface animate-pulse" />}>
        <Report />
      </Suspense>
    </div>
  );
}
