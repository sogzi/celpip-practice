export function LevelRing({ level }: { level: number }) {
  const pct = level / 12;
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-28 shrink-0">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--line)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none" stroke="var(--accent)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-3xl font-semibold leading-none tabular-nums">{level}</div>
          <div className="text-[11px] text-muted mt-1">of 12</div>
        </div>
      </div>
    </div>
  );
}
