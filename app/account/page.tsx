import { Suspense } from "react";
import { AccountView } from "./AccountView";

export const metadata = { title: "Account · Prepfluent" };

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <AccountView />
    </Suspense>
  );
}
