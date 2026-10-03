import React, { useState } from "react";
import {
  LayoutDashboard,
  Globe,
  BookOpen,
  UploadCloud,
  Megaphone,
  Clock,
  Bell,
} from "lucide-react";
import DocumentUploadDialog from "@/components/features/documents/DocumentUploadDialog";
import { ButtonStyled } from "@/components/common/forms/ButtonStyled";
import ProfileManage from "@/page/connected/ProfileManage";
import MyDocumentManage from "@/page/connected/MyDocumentManage";
import PublicPageManage from "@/page/connected/PublicPageManage";
import AnnonceManage from "@/page/connected/AnnonceManage";
import { NotificationManage } from "@/page/connected/NotificationManage";
import { ModeToggle } from "@/components/shared/ModeToggle";

export default function StudentLayout({ matieres, onCreateDocument }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Barre de navigation principale */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
          <ButtonStyled
            icon={<LayoutDashboard className="h-4 w-4 shrink-0" />}
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            onClick={() => setActiveTab("dashboard")}
            className="gap-2 px-2 sm:px-3"
            title="Tableau de bord"
          >
            <span className="hidden lg:inline">Tableau de bord</span>
          </ButtonStyled>

          <ButtonStyled
            icon={<Globe className="h-4 w-4 shrink-0" />}
            variant={activeTab === "public" ? "default" : "ghost"}
            onClick={() => setActiveTab("public")}
            className="gap-2 px-2 sm:px-3"
            title="Espace Public"
          >
            <span className="hidden lg:inline">Espace Public</span>
          </ButtonStyled>

          <ButtonStyled
            icon={<BookOpen className="h-4 w-4 shrink-0" />}
            variant={activeTab === "courses" ? "default" : "ghost"}
            onClick={() => setActiveTab("courses")}
            className="gap-2 px-2 sm:px-3"
            title="Mes Cours par Matière"
          >
            <span className="hidden lg:inline">Mes Cours par Matière</span>
          </ButtonStyled>

          <ButtonStyled
            icon={<Megaphone className="h-4 w-4 shrink-0" />}
            variant={activeTab === "annonces" ? "default" : "ghost"}
            onClick={() => setActiveTab("annonces")}
            className="gap-2 px-2 sm:px-3"
            title="Les annonces"
          >
            <span className="hidden lg:inline">Les annonces</span>
          </ButtonStyled>

          <ButtonStyled
            icon={<Bell className="h-4 w-4 shrink-0" />}
            variant={activeTab === "notification" ? "default" : "ghost"}
            onClick={() => setActiveTab("notification")}
            className="gap-2 px-2 sm:px-3"
            title="Notifications"
          >
            <span className="hidden lg:inline">Notifications</span>
          </ButtonStyled>
        </div>

        <ButtonStyled
          onClick={() => setIsUploadOpen(true)}
          className="gap-2 shrink-0 px-2 sm:px-3"
          icon={<UploadCloud className="h-4 w-4" />}
          title="Publier un document"
        >
          <span className="hidden sm:inline">Publier un document</span>
        </ButtonStyled>
        <ModeToggle />
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
          <PublicPageManage onTab={setActiveTab} />
        </div>
      )}

      {/* Vue 3 : Cours par Matière */}
      {activeTab === "courses" && <MyDocumentManage onTab={setActiveTab} />}
      {activeTab === "annonces" && <AnnonceManage />}
      {activeTab === "notification" && <NotificationManage />}

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
