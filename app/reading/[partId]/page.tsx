import { Suspense } from "react";
import { SkillPartPage, skillStaticParams } from "@/components/SkillPartPage";

export function generateStaticParams() {
  return skillStaticParams("reading");
}

export default function ReadingPartPage({ params }: PageProps<"/reading/[partId]">) {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <SkillPartPage skill="reading" params={params} />
    </Suspense>
  );
}
