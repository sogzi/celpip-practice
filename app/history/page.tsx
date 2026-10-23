import { HistoryView } from "@/components/HistoryView";
import { Eyebrow } from "@/components/ui";

export const metadata = { title: "Progress · Prepfluent" };

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>Your progress</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Practice history</h1>
        <p className="mt-2 text-muted">Saved to your account, so it follows you on any device.</p>
      </div>
      <HistoryView />
    </div>
  );
}
