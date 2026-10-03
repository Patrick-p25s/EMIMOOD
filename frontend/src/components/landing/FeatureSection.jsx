import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Section from "@/components/landing/Section";
import { FEATURES } from "@/config/landing";

export default function FeaturesSection() {
  return (
    <Section
      id="fonctionnalites"
      muted
      title="Tout ce dont vous avez besoin"
      description="Une plateforme simple pour retrouver et partager vos documents de cours."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="transition-colors hover:border-foreground/25">
            <CardContent className="space-y-3 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
