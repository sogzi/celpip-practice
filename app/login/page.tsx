import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log in · Prepfluent" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <LoginForm />
    </Suspense>
  );
}
