import React, { useState } from "react";
import { LayoutDashboard, Globe, BookOpen, UploadCloud } from "lucide-react";
import DocumentUploadDialog from "@/page/moderator/DocumentUploadDialog";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import ProfileManage from "@/page/connected/ProfileManage";
import MyDocumentManage from "@/page/connected/MyDocumentManage";
import PublicPageManage from "@/page/connected/PublicPageManage";

export default function StudentLayout({ matieres, onCreateDocument }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Barre de navigation principale */}
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <ButtonStyled
            icon={<LayoutDashboard className="h-4 w-4" />}
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            onClick={() => setActiveTab("dashboard")}
            className="gap-2"
          >
            Tableau de bord
          </ButtonStyled>
          <ButtonStyled
            icon={<Globe className="h-4 w-4" />}
            variant={activeTab === "public" ? "default" : "ghost"}
            onClick={() => setActiveTab("public")}
            className="gap-2"
          >
            Espace Public
          </ButtonStyled>

          <ButtonStyled
            icon={<BookOpen className="h-4 w-4" />}
            variant={activeTab === "courses" ? "default" : "ghost"}
            onClick={() => setActiveTab("courses")}
            className="gap-2"
          >
            Mes Cours par Matière
          </ButtonStyled>
        </div>

        {/* Bouton d'action rapide d'upload */}
        <ButtonStyled
          onClick={() => setIsUploadOpen(true)}
          className="gap-2"
          icon={<UploadCloud className="h-4 w-4" />}
        >
          Publier un document
        </ButtonStyled>
      </div>

      {/* Vue 1 : Dashboard */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <ProfileManage />
        </div>
      )}

      {/* Vue 2 : Espace Public */}
      {activeTab === "public" && (
        <div className="space-y-4">
          <MyDocumentManage />
        </div>
      )}

      {/* Vue 3 : Cours par Matière */}
      {activeTab === "courses" && <PublicPageManage />}

      {/* Modal d'upload */}
      <DocumentUploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        matieres={matieres}
        onCreate={onCreateDocument}
      />
    </div>
  );
}
