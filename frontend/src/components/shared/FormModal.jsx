import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ButtonStyled } from "./ButtonStyled";

export default function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Enregistrer",
  loading = false,
  error = null,
}) {
  const errors = Array.isArray(error) ? error : error ? [error] : [];
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          {/* Le contenu du formulaire est injecté ici */}
          <div className="py-4 space-y-4">{children}</div>

          {/* Afficher erreur s'il en a  */}
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

          <DialogFooter>
            <ButtonStyled
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </ButtonStyled>
            <ButtonStyled
              loading={loading}
              loadingText="Envoie en cours"
              type="submit"
            >
              Envoyer
            </ButtonStyled>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
