import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AUTH_LINKS, HERO } from "@/config/landing";

export default function HeroSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center lg:px-6">
        <Badge variant="secondary" className="mb-4">
          {HERO.badge}
        </Badge>

        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {HERO.title}
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">{HERO.subtitle}</p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
