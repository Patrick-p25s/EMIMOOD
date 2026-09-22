import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonStyled } from "./ButtonStyled";

const VARIANT_CONFIG = {
  success: {
    icon: CheckCircle2,
    className:
      "border-success/30 bg-success/10 text-success [&>svg]:text-success",
  },
  warning: {
    icon: AlertTriangle,
    className:
      "border-warning/30 bg-warning/10 text-warning [&>svg]:text-warning",
  },
  error: {
    icon: XCircle,
    className:
      "border-destructive/30 bg-destructive/10 text-destructive [&>svg]:text-destructive",
  },
  info: {
    icon: Info,
    className:
      "border-primary/30 bg-primary/10 text-primary [&>svg]:text-primary",
  },
};

export default function AlertBox({
  variant = "info",
  title,
  children,
  onDismiss,
  className,
}) {
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.info;
  const Icon = config.icon;

  return (
    <Alert className={cn("relative pr-10", config.className, className)}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle className="font-medium">{title}</AlertTitle>}
      {children && (
        <AlertDescription className="text-current/90">
          {children}
        </AlertDescription>
      )}

      {onDismiss && (
        <ButtonStyled
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-6 w-6 text-current hover:bg-current/10 hover:text-current"
          onClick={onDismiss}
          icon={<X className="h-3.5 w-3.5" />}
        />
      )}
    </Alert>
  );
}
