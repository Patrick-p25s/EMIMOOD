import React, { useState } from "react";
import { Bell, BookOpen, Compass, FolderOpen, Megaphone, Plus, UserRound } from "lucide-react";
import DocumentUploadDialog from "@/components/features/documents/DocumentUploadDialog";
import { ButtonStyled } from "@/components/common/forms/ButtonStyled";
import ProfileManage from "@/page/connected/ProfileManage";
import MyDocumentManage from "@/page/connected/MyDocumentManage";
import PublicPageManage from "@/page/connected/PublicPageManage";
import AnnonceManage from "@/page/connected/AnnonceManage";
import { NotificationManage } from "@/page/connected/NotificationManage";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { cn } from "@/lib/utils";

const NAVIGATION = [
  { id: "public", label: "Explorer", icon: Compass },
  { id: "courses", label: "Mes documents", icon: FolderOpen },
  { id: "annonces", label: "Annonces", icon: Megaphone },
  { id: "notification", label: "Notifications", icon: Bell },
  { id: "dashboard", label: "Mon profil", icon: UserRound },
];

export default function StudentLayout({ matieres, onCreateDocument }) {
  const [activeTab, setActiveTab] = useState("public");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const activePage = NAVIGATION.find((item) => item.id === activeTab);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 h-14 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[1600px] items-center gap-3 px-3 sm:px-5">
          <div className="flex items-center gap-2 font-semibold tracking-tight"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background"><BookOpen className="h-4 w-4" /></div><span className="hidden sm:inline">EmiMood</span></div>
          <div className="hidden h-5 border-l sm:block" />
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground">{activePage?.label}</p>
          <ButtonStyled onClick={() => setIsUploadOpen(true)} className="h-8 gap-1.5 rounded-lg px-2.5 sm:px-3" icon={<Plus className="h-4 w-4" />}><span className="hidden sm:inline">Créer</span></ButtonStyled>
          <ModeToggle />
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r px-3 py-4 lg:block">
          <nav className="space-y-1" aria-label="Navigation principale">
            {NAVIGATION.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveTab(id)} className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", activeTab === id ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground")}><Icon className="h-5 w-5" />{label}</button>)}
          </nav>
          <p className="mt-5 border-t pt-4 text-xs leading-5 text-muted-foreground">Tes cours et ressources, au même endroit.</p>
        </aside>

        <main className="min-w-0 flex-1 px-3 py-5 pb-24 sm:px-5 sm:py-7 lg:px-8 lg:pb-8">
          {activeTab === "public" && <PublicPageManage />}
          {activeTab === "courses" && <MyDocumentManage />}
          {activeTab === "annonces" && <AnnonceManage />}
          {activeTab === "notification" && <NotificationManage />}
          {activeTab === "dashboard" && <ProfileManage />}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 border-t bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="Navigation mobile">
        {NAVIGATION.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveTab(id)} className={cn("flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium", activeTab === id ? "text-foreground" : "text-muted-foreground")}><Icon className={cn("h-5 w-5", activeTab === id && "fill-muted")} /><span className="truncate">{label}</span></button>)}
      </nav>

      <DocumentUploadDialog open={isUploadOpen} onOpenChange={setIsUploadOpen} matieres={matieres} onCreate={onCreateDocument} />
    </div>
  );
}
