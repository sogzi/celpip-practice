import { Suspense } from "react";
import { SkillPartPage, skillStaticParams } from "@/components/SkillPartPage";

export function generateStaticParams() {
  return skillStaticParams("listening");
}

export default function ListeningPartPage({ params }: PageProps<"/listening/[partId]">) {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <SkillPartPage skill="listening" params={params} />
    </Suspense>
  );
}
