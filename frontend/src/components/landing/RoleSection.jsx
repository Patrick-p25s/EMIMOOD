import React from "react";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Section from "@/components/landing/Section";
import { ROLES } from "@/config/landing";

export default function RolesSection() {
  return (
    <Section
      id="roles"
      muted
      title="Un rôle pour chacun"
      description="Chaque utilisateur dispose des outils adaptés à sa place dans la plateforme."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {ROLES.map(({ title, description, points }) => (
          <Card key={title} className="transition-colors hover:border-foreground/25">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
