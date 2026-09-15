import { downloadDocument } from "@/api/documentService";
import DocumentCard from "@/components/shared/DocumentCard";
import FilterBar from "@/components/shared/FiterBar";
import { Button } from "@/components/ui/button";
import { useMyDocuments } from "@/hooks/useMyDocs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

export default function PublicPageManage() {
  const {
    documents,
    error,
    loading,
    pagination,
    filters,
    updateFilters,
    goToPage,
    deleteDocument,
  } = useMyDocuments();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Documents publics</h2>

      <FilterBar filters={filters} onChange={updateFilters} />

      {loading && (
        <p className="text-sm text-muted-foreground">Chargement...</p>
      )}
      {error && (
        <p className="text-sm text-destructive">Erreur : {error.message}</p>
      )}
      {!loading && documents.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucun document trouvé.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => goToPage(pagination.page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} sur {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.pages}
            onClick={() => goToPage(pagination.page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
