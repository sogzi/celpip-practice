import type { ReactNode } from "react";
import { SITE } from "@/lib/site";
import { Eyebrow } from "./ui";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="max-w-3xl">
      <Eyebrow>{SITE.name}</Eyebrow>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted">Last updated: {SITE.legalUpdated}</p>
      <div className="mt-8 space-y-8 leading-relaxed text-[15px] [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2 [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 [&_a]:text-accent [&_a]:underline">
        {children}
      </div>
    </article>
  );
}

export function ContactLink() {
  return <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>;
}
