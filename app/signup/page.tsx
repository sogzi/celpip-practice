import { Suspense } from "react";
import { SignupForm } from "./SignupForm";

export const metadata = { title: "Sign up · Prepfluent" };

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <SignupForm />
    </Suspense>
  );
}
