import Link from "next/link";
import { Card, btn } from "@/components/ui";

export const metadata = { title: "Sign-in problem · Prepfluent" };

export default function AuthErrorPage() {
  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">That link didn&apos;t work</h1>
        <div className="mt-3 space-y-2 text-sm text-muted leading-relaxed">
          <p>The link may have expired or already been used, or it was opened in a different browser from the one you signed up in.</p>
          <p>Try logging in. If you haven&apos;t confirmed your email yet, sign up again to get a new link, or reset your password.</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/login" className={btn.primary}>Log in</Link>
          <Link href="/forgot-password" className={btn.secondary}>Reset password</Link>
        </div>
      </Card>
    </div>
  );
}
