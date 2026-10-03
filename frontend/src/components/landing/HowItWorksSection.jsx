import React from "react";
import Section from "@/components/landing/Section";
import { STEPS } from "@/config/landing";

export default function HowItWorksSection() {
  return (
    <Section
      id="comment-ca-marche"
      title="Comment ça marche"
      description="Trois étapes pour commencer."
    >
      <ol className="grid gap-6 md:grid-cols-3">
        {STEPS.map(({ title, description }, index) => (
          <li key={title} className="flex flex-col items-center text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-sm font-semibold text-foreground">
              {index + 1}
            </span>
            <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              {description}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
