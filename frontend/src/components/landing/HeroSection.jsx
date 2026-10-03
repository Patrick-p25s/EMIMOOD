import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AUTH_LINKS, HERO } from "@/config/landing";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[12%] top-4 h-48 w-48 rounded-full bg-primary/15 blur-3xl motion-safe:animate-[float_7s_ease-in-out_infinite]" />
        <div className="absolute right-[12%] top-20 h-40 w-40 rounded-full bg-chart-2/15 blur-3xl motion-safe:animate-[float_9s_ease-in-out_infinite_reverse]" />
      </div>
      <div className="mx-auto max-w-3xl px-4 text-center lg:px-6">
        <Badge variant="secondary" className="mb-4 transition-transform duration-300 hover:scale-105">
          {HERO.badge}
        </Badge>

        <h1 className="text-4xl font-bold tracking-tight text-foreground motion-safe:animate-[fade-in-up_600ms_ease-out_both] md:text-5xl">
          {HERO.title}
        </h1>

        <p className="mt-4 text-lg text-muted-foreground motion-safe:animate-[fade-in-up_600ms_ease-out_120ms_both]">{HERO.subtitle}</p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 motion-safe:animate-[fade-in-up_600ms_ease-out_220ms_both] sm:flex-row">
          <Button size="lg" asChild>
            <Link to={AUTH_LINKS.register}>{HERO.primaryCta}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to={AUTH_LINKS.login}>{HERO.secondaryCta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
