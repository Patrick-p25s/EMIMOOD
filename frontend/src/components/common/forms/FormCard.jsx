import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import AlertBox from "@/components/common/feedback/AlertBox";
import { cn } from "@/lib/utils";

export default function FormCard({
  title,
  description = null,
  error = null,
  onSubmit,
  children,
  footer = null,
  className = "",
  contentClassName = "",
  loading = false,
  noValidate = true,
}) {
  const errors = Array.isArray(error) ? error : error ? [error] : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit?.(e);
  };

  return (
    <Card
      className={cn(
        "w-full max-w-md border-border/70 bg-card/95 shadow-xl shadow-primary/5 backdrop-blur",
        className,
      )}
    >
      <form onSubmit={handleSubmit} noValidate={noValidate}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>

        <CardContent className={cn("flex flex-col gap-4", contentClassName)}>
          {errors.length > 0 && (
            <AlertBox variant="error" title="Une action est nécessaire">
              {errors.length === 1 ? (
                errors[0]
              ) : (
                <ul className="list-disc pl-4 space-y-0.5">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </AlertBox>
          )}

          <fieldset disabled={loading} className="flex flex-col gap-4">
            {children}
          </fieldset>
        </CardContent>

        {footer && (
          <CardFooter className="flex flex-col gap-3">{footer}</CardFooter>
        )}
      </form>
    </Card>
  );
}
