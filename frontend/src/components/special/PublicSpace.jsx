import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Globe, FileText, Filter, BookOpen, X } from "lucide-react";
import DocumentCard from "@/components/shared/DocumentCard";
import { DocumentViewerPage } from "@/components/special/DocumentViewer";
export default function PublicSpace({
  documents = [],
  classe,
  onSaveDocument,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState(null);

  // 1. Filtrer uniquement les documents publics
  const publicDocs = useMemo(() => {
    return documents.filter((doc) => doc.statut === "public");
  }, [documents]);

  // 2. Application de la recherche textuelle et du filtre par type
  const filteredDocuments = useMemo(() => {
    return publicDocs.filter((doc) => {
      const matchSearch =
        doc.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType =
        selectedType === "all" ||
        doc.type_document?.toLowerCase() === selectedType.toLowerCase();

      return matchSearch && matchType;
    });
  }, [publicDocs, searchQuery, selectedType]);

  // Si l'utilisateur a cliqué sur un document pour le lire
  if (selectedDocument) {
    return (
      <DocumentViewerPage
        document={selectedDocument}
        onBack={() => setSelectedDocument(null)}
        onSave={onSaveDocument}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête de la section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Espace Public
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Documents de cours, TD et TP partagés et validés pour la classe de{" "}
            <span className="font-semibold text-foreground">
              {`${classe?.mention} ${classe?.niveau}` || "votre promotion"}
            </span>
            .
          </p>
        </div>

        <Badge variant="secondary" className="w-fit text-xs px-3 py-1 gap-1.5">
          <BookOpen className="h-3.5 w-3.5 text-primary" />
          {filteredDocuments.length} document(s) disponible(s)
        </Badge>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Champ de recherche */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre ou mot-clé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Boutons de filtres par type */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Button
            variant={selectedType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("all")}
            className="text-xs h-9 shrink-0"
          >
            Tous
          </Button>
          <Button
            variant={selectedType === "cours" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("cours")}
            className="text-xs h-9 shrink-0"
          >
            Cours
          </Button>
          <Button
            variant={selectedType === "td" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("td")}
            className="text-xs h-9 shrink-0"
          >
            TD
          </Button>
          <Button
            variant={selectedType === "tp" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("tp")}
            className="text-xs h-9 shrink-0"
          >
            TP
          </Button>
          <Button
            variant={selectedType === "examen" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("examen")}
            className="text-xs h-9 shrink-0"
          >
            Examens
          </Button>
        </div>
      </div>

      {/* Grille d'affichage des documents */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDocument(doc)}
              className="cursor-pointer"
            >
              <DocumentCard
                document={doc}
                isSaved={doc.isSaved}
                onSave={onSaveDocument}
              />
            </div>
          ))}
        </div>
      ) : (
        /* État vide si aucun document ne correspond */
        <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/20 border border-dashed border-border rounded-xl">
          <FileText className="h-10 w-10 text-muted-foreground/60 mb-3" />
          <h3 className="font-semibold text-foreground">
            Aucun document disponible
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            {searchQuery || selectedType !== "all"
              ? "Aucun résultat ne correspond à vos critères de recherche."
              : "Aucun document n'a encore été publié publiquement pour cette classe."}
          </p>
          {(searchQuery || selectedType !== "all") && (
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
              }}
              className="mt-2 text-xs"
            >
              Réinitialiser la recherche
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
