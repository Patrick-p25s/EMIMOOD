import React, { useState } from "react";
import { LayoutDashboard, Globe, BookOpen, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import de tes composants déjà créés
import ProfileStudent from "@/components/special/ProfileStudent";
import DocumentCard from "@/components/shared/DocumentCard";
import DocumentUploadDialog from "@/page/moderator/DocumentUploadDialog";
export default function StudentLayout({
  user,
  classe,
  documents,
  matieres,
  onCreateDocument,
}) {
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "public" | "courses"
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Filtrage des documents
  const publicDocuments = documents.filter((doc) => doc.statut === "public");
  const myDocuments = documents.filter((doc) => doc.owner_id === user.id);

  return (
    <div className="min-h-screen bg-background space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Barre de navigation principale */}
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("dashboard")}
            className="gap-2"
          >
            <LayoutDashboard className="h-4 w-4" /> Tableau de bord
          </Button>

          <Button
            variant={activeTab === "public" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("public")}
            className="gap-2"
          >
            <Globe className="h-4 w-4" /> Espace Public
          </Button>

          <Button
            variant={activeTab === "courses" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("courses")}
            className="gap-2"
          >
            <BookOpen className="h-4 w-4" /> Mes Cours par Matière
          </Button>
        </div>

        {/* Bouton d'action rapide d'upload */}
        <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
          <UploadCloud className="h-4 w-4" /> Publier un document
        </Button>
      </div>

      {/* Vue 1 : Dashboard */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <ProfileStudent
            user={user}
            classe={classe}
            stats={{
              documentsCount: myDocuments.length,
              savedCount: documents.filter((d) => d.isSaved).length,
              pendingCount: myDocuments.filter((d) => d.statut === "en_attente")
                .length,
            }}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              Mes derniers documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myDocuments.slice(0, 3).map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vue 2 : Espace Public */}
      {activeTab === "public" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            Documents publics de {classe?.nom}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>
      )}

      {/* Vue 3 : Cours par Matière */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          {matieres.map((matiere) => {
            const matiereDocs = documents.filter(
              (d) => String(d.matiere_id) === String(matiere.id),
            );
            return (
              <div
                key={matiere.id}
                className="border border-border rounded-xl p-4 bg-card space-y-3"
              >
                <h3 className="font-semibold text-lg text-primary">
                  {matiere.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {matiereDocs.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal d'upload */}
      <DocumentUploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        matieres={matieres}
        onCreate={onCreateDocument}
        ownerId={user.id}
      />
    </div>
  );
}
