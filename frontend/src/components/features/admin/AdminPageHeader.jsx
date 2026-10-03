import { ButtonStyled } from "@/components/common/forms/ButtonStyled";
import { cn } from "@/lib/utils";

/** A consistent title and primary-action area for administration screens. */
export default function AdminPageHeader({
  icon: Icon,
  title,
  description,
  meta,
  actionLabel,
  actionIcon,
  onAction,
  actionLoading = false,
  children,
  className,
}) {
  return (
    <header className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          {meta && <p className="mt-1 text-xs font-medium text-muted-foreground">{meta}</p>}
        </div>
      </div>

      {(children || actionLabel) && (
        <div className="flex shrink-0 items-center gap-2">
          {children}
          {actionLabel && (
            <ButtonStyled onClick={onAction} icon={actionIcon} loading={actionLoading}>
              {actionLabel}
            </ButtonStyled>
          )}
        </div>
      )}
    </header>
  );
}
