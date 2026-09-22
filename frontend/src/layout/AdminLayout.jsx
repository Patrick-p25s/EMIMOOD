import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Megaphone,
  Calendar,
  School,
  User,
  FileText,
  LogOut,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";

const menuGeneral = [
  {
    to: "/admin",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/annonces",
    label: "Annonces",
    icon: Megaphone,
  },
];

const menuAnnee = [
  {
    to: "/admin/year",
    label: "Années",
    icon: Calendar,
  },
];

const menuClasse = [
  {
    to: "/admin/classe",
    label: "Classes",
    icon: School,
  },
];

const menuStructure = [
  {
    to: "/admin/etudiant",
    label: "Étudiants",
    icon: User,
  },
];

const menuMatiere = [
  {
    to: "/admin/matiere",
    label: "Matières",
    icon: School,
  },
];

const menuContenu = [
  {
    to: "/admin/document",
    label: "Documents",
    icon: FileText,
  },
];

export default function AdminLayout() {
  const { logout, role } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-56 shrink-0 border-r flex-col">
        <SidebarContent onLogout={handleLogout} role={role} />
      </aside>

      {/* SIDEBAR MOBILE */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 flex flex-col">
          <SidebarContent
            onLogout={handleLogout}
            onNavigate={() => setMobileOpen(false)}
            role={role}
          />
        </SheetContent>
      </Sheet>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="shrink-0 flex items-center justify-between gap-3 px-4 md:px-6 py-3 border-b bg-background">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 md:flex-none" />

          <Badge
            variant="secondary"
            className="gap-1.5 bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100"
          >
            <Calendar className="size-3.5" />
            <span className="hidden sm:inline">Année active : </span>
          </Badge>
        </header>

        {/* PAGE ACTIVE */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onLogout, onNavigate, role }) {
  return (
    <>
      <div className="text-sm font-medium px-5 py-4 border-b shrink-0">
        EMIMOOD
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1">
        {/* Général : tout le monde */}
        <MenuSection
          titre="Général"
          items={menuGeneral}
          onNavigate={onNavigate}
        />

        {/* Année : uniquement ADMIN */}
        {role === "admin" && (
          <MenuSection
            titre="Année universitaire"
            items={menuAnnee}
            onNavigate={onNavigate}
          />
        )}

        {/* Classes : pas MODERATEUR */}
        {role !== "moderator" && (
          <MenuSection
            titre="Classes"
            items={menuClasse}
            onNavigate={onNavigate}
          />
        )}

        {/* Structure : pas MODERATEUR */}
        {role !== "moderator" && (
          <MenuSection
            titre="Structure"
            items={menuStructure}
            onNavigate={onNavigate}
          />
        )}

        {/* Matières : pas ADMIN */}
        {role !== "admin" && (
          <MenuSection
            titre="Matières"
            items={menuMatiere}
            onNavigate={onNavigate}
          />
        )}

        {/* Contenu : tout le monde */}
        <MenuSection
          titre="Contenu"
          items={menuContenu}
          onNavigate={onNavigate}
        />
      </div>

      <div className="px-4 py-4 border-t shrink-0">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </>
  );
}

function MenuSection({ titre, items, onNavigate }) {
  return (
    <>
      <div className="text-xs text-muted-foreground px-2 pt-3 pb-1">
        {titre}
      </div>

      {items.map((item) => (
        <MenuItem key={item.to} {...item} onNavigate={onNavigate} />
      ))}
    </>
  );
}

function MenuItem({ to, label, icon: Icon, end, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-foreground hover:bg-accent/50",
        )
      }
    >
      <Icon className="size-4" />
      {label}
    </NavLink>
  );
}
