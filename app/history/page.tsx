import { HistoryView } from "@/components/HistoryView";
import { Eyebrow } from "@/components/ui";

export const metadata = { title: "Progress · CELPIP Practice" };

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>Your progress</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Practice history</h1>
        <p className="mt-2 text-muted">Saved in this browser only.</p>
      </div>
      <HistoryView />
    </div>
  );
}
