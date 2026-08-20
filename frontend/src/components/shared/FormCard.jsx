import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export default function FormCard({
  title,
  description = null,
  error = null, // string ou array de strings
  onSubmit,
  children,
  footer = null, // contenu du footer (ex: bouton submit + lien)
  className = "",
  contentClassName = "",
  loading = false, // désactive tout le fieldset pendant le submit
  noValidate = true,
}) {
  const errors = Array.isArray(error) ? error : error ? [error] : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <form onSubmit={handleSubmit} noValidate={noValidate}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>

        <CardContent className={cn("flex flex-col gap-4", contentClassName)}>
          {errors.length > 0 && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="flex flex-col gap-0.5">
                {errors.map((err, i) => (
                  <span key={i}>{err}</span>
                ))}
              </div>
            </div>
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
