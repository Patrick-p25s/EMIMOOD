import { ButtonStyled } from "@/components/common/forms/ButtonStyled";
import DocumentCard from "@/components/features/documents/DocumentCard";
import DocumentFilterBar from "@/components/features/documents/DocumentFilterBar";
import { EmptyCard } from "@/components/common/feedback/EmptyCard";
import { usePublicDocument } from "@/hooks/usePublic";
import { Book, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

export default function PublicPageManage() {
  const {
    pagination,
    error,
    loading,
    filters,
    updateFilters,
    documents,
    goToPage,
    subjects,
  } = usePublicDocument();
  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 pb-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div><h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Explorer</h1><p className="mt-1 text-sm text-muted-foreground">Cours et ressources partagés.</p></div>
        {!loading && <span className="text-sm text-muted-foreground">{pagination.total} ressources</span>}
      </div>

      <section className="border-b pb-4">
        <DocumentFilterBar filters={filters} onChange={updateFilters} matieres={subjects} />
      </section>

      {loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-72 animate-pulse rounded-xl border bg-muted/50" />)}</div>
      )}
      {error && (
        <p className="text-sm text-destructive">Erreur : {error.message}</p>
      )}
      {!loading && documents.length === 0 && (
        <EmptyCard icon={Book} description="Aucune document trouvé " />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 border-t pt-4">
          <ButtonStyled
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => goToPage(pagination.page - 1)}
            icon={<ChevronLeft className="h-4 w-4" />}
          />

          <span className="text-sm text-muted-foreground">
            Page {pagination.page} sur {pagination.pages}
          </span>
          <ButtonStyled
            variant="outline"
            disabled={pagination.page >= pagination.pages}
            onClick={() => goToPage(pagination.page + 1)}
            icon={<ChevronRight className="h-4 w-4" />}
          />
        </div>
      )}
    </div>
  );
}
