import React, { useState } from "react";
import {
  LayoutDashboard,
  Globe,
  BookOpen,
  UploadCloud,
  Megaphone,
  Bell,
  Sparkles,
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

  const navigation = [
    { id: "dashboard", label: "Mon profil", icon: LayoutDashboard },
    { id: "public", label: "Explorer", icon: Globe },
    { id: "courses", label: "Mes documents", icon: BookOpen },
    { id: "annonces", label: "Annonces", icon: Megaphone },
    { id: "notification", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <header className="sticky top-3 z-20 rounded-2xl border bg-background/85 p-2 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 border-r px-2 pr-4 md:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold tracking-tight">Mon espace</span>
            </div>
            <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto scroll-smooth pb-0.5" aria-label="Navigation de l'espace étudiant">
              {navigation.map(({ id, label, icon: Icon }) => (
                <ButtonStyled
                  key={id}
                  icon={<Icon className="h-4 w-4" />}
                  variant={activeTab === id ? "secondary" : "ghost"}
                  onClick={() => setActiveTab(id)}
                  className="shrink-0 gap-2 rounded-xl px-3"
                  aria-pressed={activeTab === id}
                >
                  <span className="hidden sm:inline">{label}</span>
                </ButtonStyled>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-1 border-l pl-2">
              <ButtonStyled
                onClick={() => setIsUploadOpen(true)}
                className="gap-2 rounded-xl px-2.5 sm:px-3"
                icon={<UploadCloud className="h-4 w-4" />}
                title="Publier un document"
              >
                <span className="hidden md:inline">Publier</span>
              </ButtonStyled>
              <ModeToggle />
            </div>
          </div>
        </header>

        {activeTab === "dashboard" && <ProfileManage />}

        {activeTab === "public" && <PublicPageManage onTab={setActiveTab} />}

        {activeTab === "courses" && <MyDocumentManage onTab={setActiveTab} />}
        {activeTab === "annonces" && <AnnonceManage />}
        {activeTab === "notification" && <NotificationManage />}

        <DocumentUploadDialog
          open={isUploadOpen}
          onOpenChange={setIsUploadOpen}
          matieres={matieres}
          onCreate={onCreateDocument}
        />
      </div>
    </div>
  );
}
