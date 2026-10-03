import { ButtonStyled } from "@/components/common/forms/ButtonStyled";
import DocumentCard from "@/components/features/documents/DocumentCard";
import DocumentFilterBar from "@/components/features/documents/DocumentFilterBar";
import { EmptyCard } from "@/components/common/feedback/EmptyCard";
import { usePublicDocument } from "@/hooks/usePublic";
import { Book, ChevronLeft, ChevronRight, Compass, Files } from "lucide-react";
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
      <section className="relative overflow-hidden rounded-2xl border bg-card px-5 py-6 shadow-sm sm:px-7">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Compass className="h-5 w-5" /></div>
            <h1 className="text-2xl font-semibold tracking-tight">Explorer les documents</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">Retrouve les cours, TD et ressources partagés par ta communauté.</p>
          </div>
          {!loading && <div className="flex items-center gap-2 rounded-xl border bg-background/70 px-3 py-2 text-sm text-muted-foreground"><Files className="h-4 w-4 text-primary" /><span><strong className="text-foreground">{pagination.total}</strong> ressources</span></div>}
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-3 shadow-sm sm:p-4">
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
        <div className="flex items-center justify-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
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
