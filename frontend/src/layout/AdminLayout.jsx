import { NavLink, Outlet } from "react-router-dom";
import { useAnnee } from "../context/AnneeContext";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Megaphone,
  Calendar,
  School,
  Users,
  User,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuGeneral = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/annonces", label: "Annonces", icon: Megaphone },
];

const menuAnnee = [{ to: "/admin/annees", label: "Années", icon: Calendar }];

const menuStructure = [
  { to: "/admin/classes", label: "Classes", icon: School },
  { to: "/admin/delegues", label: "Délégués", icon: Users },
  { to: "/admin/etudiants", label: "Étudiants", icon: User },
];

const menuContenu = [
  { to: "/admin/documents", label: "Documents", icon: FileText },
];

export default function AdminLayout() {
  const { anneeActive } = useAnnee();

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-56 shrink-0 border-r px-3 py-4 flex flex-col gap-1">
        <div className="text-sm font-medium px-2 pb-4">EMIMOOD</div>

        <MenuSection titre="Général" items={menuGeneral} />
        <MenuSection titre="Année universitaire" items={menuAnnee} />
        <MenuSection titre="Structure" items={menuStructure} />
        <MenuSection titre="Contenu" items={menuContenu} />
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="flex justify-end items-center px-6 py-3 border-b">
          <Badge
            variant="secondary"
            className="gap-1.5 bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100"
          >
            <Calendar className="size-3.5" />
            Année active : {anneeActive.libelle}
          </Badge>
        </header>

        {/* PAGE ACTIVE */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// --- Sous-composants du menu ---

function MenuSection({ titre, items }) {
  return (
    <>
      <div className="text-xs text-muted-foreground px-2 pt-3 pb-1">
        {titre}
      </div>
      {items.map((item) => (
        <MenuItem key={item.to} {...item} />
      ))}
    </>
  );
}

function MenuItem({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
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
