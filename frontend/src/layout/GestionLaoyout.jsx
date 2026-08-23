import { NavLink, Outlet } from "react-router-dom";
import { useYear } from "../context/AnneeContext";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Megaphone,
  Calendar,
  School,
  Users,
  User,
  FileText,
  User2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import useDocument from "@/hooks/useDocument";
import useStudent from "@/hooks/useStudent";
import { useState, useMemo, useEffect } from "react";
import useMatiere from "@/hooks/useMatiere";
import useClasse from "@/hooks/useClasse";
const menuGeneral = [
  {
    to: "/gestion",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    end: true,
  },
  { to: "/gestion/annonces", label: "Annonces", icon: Megaphone },
];

const menuAnnee = [{ to: "/gestion/annees", label: "Années", icon: Calendar }];

const menuStructure = [
  { to: "/gestion/classes", label: "Classes", icon: School },
  { to: "/gestion/etudiants", label: "Étudiants", icon: User },
];

const menuContenu = [
  { to: "/gestion/documents", label: "Documents", icon: FileText },
];
const menuProfile = [
  { to: "/gestion/profile", label: "Mon profile", icon: User2 },
];

export default function GestionLayout() {
  const { getActiveYear } = useYear();
  const { logout, user } = useAuth();
  const { getClasseDocuments, getStudentClasse } = useClasse();
  const { matieres } = useMatiere();
  const { documents, studentDocument } = useDocument();
  const {
    students,
    getByClasse,
    getMyProfile,
    updateProfile,
    deleteStudent,
    createStudent,
  } = useStudent();
  const [studentTraite, setStudentTraite] = useState([]);

  const [documentTraiter, setDocumentTraiter] = useState([]);

  const isAdmin = user.role === "admin";
  const matiere = useMemo(() => {
    if (isAdmin) {
      return matieres;
    } else {
      return matieres.filter((mat) => mat.classe_id === user.classe_id);
    }
  }, [user, matieres]);

  const loadDocuments = async () => {
    if (isAdmin) {
      setDocumentTraiter(documents);
    } else {
      const docs = await getClasseDocuments(user.classe_id);
      setDocumentTraiter(docs);
    }
  };
  const loadStudent = async () => {
    if (isAdmin) {
      setStudentTraite(students);
    } else {
      const stds = await getByClasse(user.classe_id);
      setStudentTraite(stds);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [user, documents]);
  useEffect(() => {
    loadStudent();
  }, [students, user]);

  const contextValue = {
    studentTraite,
    documentTraiter,
    matiere,
    user,
    createStudent,
    deleteStudent,
    updateProfile,
    getMyProfile,
    getStudentClasse,
    studentDocument,
  };
  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-56 shrink-0 border-r px-3 py-4 flex flex-col gap-1">
        <div className="text-sm font-medium px-2 pb-4">EMIMOOD</div>

        <MenuSection titre="Général" items={menuGeneral} />
        {isAdmin && (
          <MenuSection titre="Année universitaire" items={menuAnnee} />
        )}
        <MenuSection titre="Structure" items={menuStructure} />
        <MenuSection titre="Contenu" items={menuContenu} />
        {!isAdmin && <MenuSection titre="Mon Profile" items={menuProfile} />}
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="flex justify-end items-center px-6 py-3 border-b">
          <div className="px-4 py-4 border-t border-orange-200">
            <ButtonStyled
              variant="ghost"
              onClick={logout}
              icon={<LogOut className="h-4 w-4" />}
            >
              Déconnexion
            </ButtonStyled>
          </div>
          <Badge
            variant="secondary"
            className="gap-1.5 bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100"
          >
            <Calendar className="size-3.5" />
            Année active : {getActiveYear.label}
          </Badge>
        </header>

        {/* PAGE ACTIVE */}
        <main className="flex-1 p-6">
          <Outlet context={contextValue} />
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
