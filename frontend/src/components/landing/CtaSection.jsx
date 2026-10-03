import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Section from "@/components/landing/Section";
import { AUTH_LINKS, CTA } from "@/config/landing";

export default function CtaSection() {
  return (
    <Section id="commencer">
      <div className="relative overflow-hidden rounded-xl bg-primary px-6 py-12 text-center text-primary-foreground shadow-xl shadow-primary/20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {CTA.title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
          {CTA.description}
        </p>
        <Button size="lg" variant="secondary" className="mt-6 transition-transform hover:-translate-y-0.5" asChild>
          <Link to={AUTH_LINKS.register}>{CTA.button}</Link>
        </Button>
      </div>
    </Section>
  );
}
