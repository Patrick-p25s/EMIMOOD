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
import { useState, useMemo, useEffect, useCallback } from "react";
import useMatiere from "@/hooks/useMatiere";
import useClasse from "@/hooks/useClasse";
import useAnnonce from "@/hooks/useAnnonce";
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
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const classeId = user?.classe_id;

  // 1. Déclarations propres des états locaux
  const [allDocuments, setAllDocuments] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [allAnnonces, setAllAnnonces] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hooks d'actions
  const { getClasseDocuments, getStudentClasse } = useClasse();
  const { matieres, getClasseSubject } = useMatiere();
  const { documents, studentDocument } = useDocument();
  const { annonces, getClasseAnnonce } = useAnnonce();
  const {
    students,
    getByClasse,
    createStudent,
    deleteStudent,
    getMyProfile,
    updatePassword,
    updateProfile,
  } = useStudent();

  const loadDocuments = useCallback(async () => {
    if (isAdmin) {
      setAllDocuments(documents || []);
    } else if (classeId) {
      const docs = await getClasseDocuments(classeId);
      setAllDocuments(docs || []);
    }
  }, [isAdmin, classeId, getClasseDocuments, documents]);

  const loadStudents = useCallback(async () => {
    if (isAdmin) {
      setAllStudents(students || []);
    } else if (classeId) {
      const stds = await getByClasse(classeId);
      setAllStudents(stds || []);
    }
  }, [isAdmin, classeId, getByClasse, students]);

  const loadAnnonces = useCallback(async () => {
    if (isAdmin) {
      setAllAnnonces(annonces || []);
    } else if (classeId) {
      const ann = await getClasseAnnonce(classeId);
      setAllAnnonces(ann || []);
    }
  }, [isAdmin, classeId, getClasseAnnonce, annonces]);

  const loadSubjects = useCallback(async () => {
    if (isAdmin) {
      setAllSubjects(matieres || []);
    } else if (classeId) {
      const subs = await getClasseSubject(classeId);
      setAllSubjects(subs || []);
    }
  }, [isAdmin, classeId, getClasseSubject, matieres]);

  // 3. Un seul useEffect d'initialisation en parallèle
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    async function initData() {
      setLoading(true);
      await Promise.all([
        loadDocuments(),
        loadStudents(),
        loadAnnonces(),
        loadSubjects(),
      ]);
      if (isMounted) setLoading(false);
    }

    initData();

    return () => {
      isMounted = false;
    };
  }, [user?.id, classeId]);

  const userClasse = useMemo(
    () => classes?.find((cl) => String(cl.id) === String(classeId)),
    [classes, classeId],
  );

  const classMatieres = useMemo(() => {
    if (!allSubjects || !classeId) return [];
    return allSubjects.filter((m) => String(m.classe_id) === String(classeId));
  }, [allSubjects, classeId]);

  const classMatiereIds = useMemo(
    () => allSubjects.map((m) => String(m.id)),
    [allSubjects],
  );

  const classDocuments = useMemo(() => {
    if (!allDocuments || classMatiereIds.length === 0) return [];

    // Création d'un Set à partir de classMatiereIds pour une recherche instantanée O(1)
    const matiereSet = new Set(classMatiereIds.map(String));

    return allDocuments.filter((doc) => matiereSet.has(String(doc.matiere_id)));
  }, [allDocuments, classMatiereIds]);

  const pendingDocs = useMemo(
    () => allDocuments.filter((d) => d.statut === "pending"),
    [allDocuments],
  );
  const publicDocs = useMemo(
    () => allDocuments.filter((d) => d.statut === "public"),
    [allDocuments],
  );
  const rejectedDocs = useMemo(
    () => allDocuments.filter((d) => d.statut === "rejete"),
    [allDocuments],
  );

  const recentPendingDocs = useMemo(
    () => pendingDocs.slice(0, RECENT_LIMIT),
    [pendingDocs],
  );

  const matiereNameById = useMemo(() => {
    const map = new Map();
    classMatieres.forEach((m) => map.set(String(m.id), m.nom));
    return map;
  }, [classMatieres]);

  const contextValue = {
    allStudents,
    allAnnonces,
    allDocuments,
    allSubjects,
    user,
    pendingDocs,
    rejectedDocs,
    recentPendingDocs,
    matiereNameById,
    classDocuments,
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
