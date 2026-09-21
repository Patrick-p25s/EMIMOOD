import { downloadDocument } from "@/api/documentService";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import DocumentCard from "@/components/shared/DocumentCard";
import DocumentFilterBar from "@/components/shared/DocumentFilterBar";
import { usePublicDocument } from "@/hooks/usePublic";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Documents publics</h2>

      <DocumentFilterBar
        filters={filters}
        onChange={updateFilters}
        matieres={subjects}
        classes={[
          { mention: "DAII", niveau: "L1", id: 1 },
          { mention: "DAII", niveau: "L1", id: 2 },
        ]}
        showClasseFilter
      />

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
            size="sm"
            disabled={pagination.page >= pagination.pages}
            onClick={() => goToPage(pagination.page + 1)}
            icon={<ChevronRight className="h-4 w-4" />}
          />
        </div>
      )}
    </div>
  );
}
