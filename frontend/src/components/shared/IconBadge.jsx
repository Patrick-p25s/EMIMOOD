import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Palette de tons prédéfinis, alignée sur tes tokens shadcn existants
const TONE_CONFIG = {
  primary: "border-primary/30 bg-primary/10 text-primary",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
  muted: "border-border bg-muted text-muted-foreground",
};

export default function IconBadge({
  icon: Icon,
  children,
  tone = "muted",
  className,
  ...props
}) {
  const toneClassName = TONE_CONFIG[tone] || TONE_CONFIG.muted;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium text-[11px] h-6 px-2.5",
        toneClassName,
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </Badge>
  );
}
