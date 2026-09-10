import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useMemo } from "react";
import {
  ShieldAlert,
  LayoutDashboard,
  Flag,
  User,
  LogOut,
  Menu,
  X,
  Megaphone,
  BookOpen,
  Book,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";
import { ButtonStyled, buttonVariants } from "@/components/shared/ButtonStyled";
import useMatiere from "@/hooks/useMatiere";
import useClasse from "@/hooks/useClasse";
import useDocument from "@/hooks/useDocument";
import useStudent from "@/hooks/useStudent";
import useAnnonce from "@/hooks/useAnnonce";
const NAV_ITEMS = [
  {
    to: "/moderator",
    label: "Tableau de bord",
    icon: LayoutDashboard,
  },
  { to: "/moderator/matieres", label: "Matieres", icon: BookOpen },
  { to: "/moderator/students", label: "Utilisateurs", icon: User },
  { to: "/moderator/annonces", label: "Annonces", icon: Megaphone },
  { to: "/moderator/documents", label: "Documents", icon: Book },
  { to: "/moderator/profile", label: "My Profile", icon: User },
];

const RECENT_LIMIT = 5;

export default function ModeratorLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    annonces,
    getActiveAnnonce,
    archiveAnnonce,
    deleteAnnonce,
    updateAnnonce,
    createAnnonce,
  } = useAnnonce();
  const moderatorClasseId = user?.classe_id || user?.classeId;

  const { classes, getStudentClasse } = useClasse();
  const { matieres, createSubject, updateSubject, deleteSubject } =
    useMatiere();
  const {
    students,
    updateProfile,
    deleteStudent,
    createStudent,
    getMyProfile,
  } = useStudent();
  const {
    documents,
    valideDocument,
    rejeteDocument,
    createDocument,
    deleteDocument,
    studentDocument,
  } = useDocument();

  const userClasse = useMemo(
    () => classes?.find((cl) => String(cl.id) === String(moderatorClasseId)),
    [classes, moderatorClasseId],
  );

  const allAnnonces = useMemo(() => {
    if (!annonces || !moderatorClasseId) return [];
    return annonces.filter(
      (annonce) => String(annonce.classe_id) === String(moderatorClasseId),
    );
  });

  const allStudents = useMemo(() => {
    if (!students || !moderatorClasseId) return [];
    return students.filter(
      (student) => String(student.classe_id) === String(moderatorClasseId),
    );
  }, [students, moderatorClasseId]);

  const classMatieres = useMemo(() => {
    if (!matieres || !moderatorClasseId) return [];
    return matieres.filter(
      (m) => String(m.classe_id) === String(moderatorClasseId),
    );
  }, [matieres, moderatorClasseId]);

  const classMatiereIds = useMemo(
    () => classMatieres.map((m) => String(m.id)),
    [classMatieres],
  );

  const classDocuments = useMemo(() => {
    if (!documents || classMatiereIds.length === 0) return [];

    // Création d'un Set à partir de classMatiereIds pour une recherche instantanée O(1)
    const matiereSet = new Set(classMatiereIds.map(String));

    return documents.filter((doc) => matiereSet.has(String(doc.matiere_id)));
  }, [documents, classMatiereIds]);

  const pendingDocs = useMemo(
    () => classDocuments.filter((d) => d.statut === "pending"),
    [classDocuments],
  );
  const publicDocs = useMemo(
    () => classDocuments.filter((d) => d.statut === "public"),
    [classDocuments],
  );
  const rejectedDocs = useMemo(
    () => classDocuments.filter((d) => d.statut === "rejete"),
    [classDocuments],
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
    userClasse,
    classMatieres,
    classMatiereIds,
    classDocuments,
    matiereNameById,
    recentPendingDocs,
    rejectedDocs,
    publicDocs,
    allStudents,
    allAnnonces,
    createDocument,
    deleteDocument,
    archiveAnnonce,
    createStudent,
    deleteAnnonce,
    updateAnnonce,
    createAnnonce,
    getActiveAnnonce,
    createSubject,
    deleteSubject,
    updateSubject,
    updateProfile,
    deleteStudent,
    valideDocument,
    rejeteDocument,
    studentDocument,
    getStudentClasse,
    getMyProfile,
  };
  return (
    <div className="min-h-screen flex bg-orange-50/30">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-orange-200 flex flex-col transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2 px-4 h-16 border-b border-orange-200">
          <ShieldAlert className="h-6 w-6 text-orange-600" />
          <span className="font-semibold text-orange-900">Modération</span>
          <ButtonStyled
            variant="ghost"
            className={cn(
              buttonVariants({ size: "icon" }),
              "ml-auto lg:hidden",
            )}
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </ButtonStyled>
        </div>

        <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-orange-100 text-orange-900"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-900",
                )
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-orange-200">
          <ButtonStyled
            icon={<LogOut className="h-4 w-4" />}
            variant="ghost"
            onClick={async () => await logout()}
            className={
              "w-full justify-start gap-2 text-gray-600 hover:text-red-600"
            }
          >
            Déconnexion
          </ButtonStyled>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-orange-200 flex items-center justify-between px-4 lg:px-6">
          <ButtonStyled
            variant="ghost"
            size="icon"
            className={cn(buttonVariants({ size: "icon" }), "lg:hidden")}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </ButtonStyled>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="border-orange-300 text-orange-700 bg-orange-50"
            >
              Modérateur
            </Badge>
            <span className="text-sm text-gray-600">{user?.name}</span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet context={contextValue} />
        </main>
      </div>
    </div>
  );
}
