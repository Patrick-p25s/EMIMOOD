import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FileText } from "lucide-react";
import DocumentCard from "@/components/features/documents/DocumentCard";
import { useFolderDocuments } from "@/hooks/useFolderDocument";
import { ButtonStyled } from "@/components/common/forms/ButtonStyled";
export default function FolderDocumentsView({ folder, onBack, cardProps }) {
  const { documents, loading, error } = useFolderDocuments(folder.id);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 pb-8">
      <div className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-4 shadow-sm sm:px-5">
        <ButtonStyled
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl"
          onClick={onBack}
          icon={<ArrowLeft className="h-4 w-4" />}
        />
        <div><p className="text-xs text-muted-foreground">Mes documents</p><h2 className="text-lg font-semibold">{folder.name}</h2></div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">Erreur : {error.message}</p>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center border border-dashed rounded-xl text-muted-foreground">
          <FileText className="h-8 w-8" />
          <p className="text-sm">Ce dossier est vide.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} {...cardProps} />
          ))}
        </div>
      )}
    </div>
  );
}
