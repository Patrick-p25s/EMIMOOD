import React from "react";
import { cn } from "@/lib/utils";

export default function Section({
  id,
  title,
  description,
  muted = false,
  className,
  children,
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-16 py-16 md:py-20",
        muted && "bg-muted/30",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        {(title || description) && (
          <div className="mx-auto mb-10 max-w-2xl text-center">
            {title && (
              <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-3 text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
