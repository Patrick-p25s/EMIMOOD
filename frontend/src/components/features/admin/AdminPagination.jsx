import { ChevronLeft, ChevronRight } from "lucide-react";
import { ButtonStyled } from "@/components/common/forms/ButtonStyled";

export default function AdminPagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-3 pt-2" aria-label="Pagination">
      <ButtonStyled variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)} icon={<ChevronLeft className="size-4" />} aria-label="Page précédente" />
      <span className="text-sm text-muted-foreground">Page {pagination.page} sur {pagination.pages}</span>
      <ButtonStyled variant="outline" size="sm" disabled={pagination.page >= pagination.pages} onClick={() => onPageChange(pagination.page + 1)} icon={<ChevronRight className="size-4" />} aria-label="Page suivante" />
    </nav>
  );
}
