import React, { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  Megaphone,
  BookOpen,
  Book,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";
import { ButtonStyled, buttonVariants } from "@/components/shared/ButtonStyled";
import useMatiere from "@/hooks/useMatiere";
import useClasse from "@/hooks/useClasse";
import useDocument from "@/hooks/useDocument";
import useStudent from "@/hooks/useStudent";
import useAnnonce from "@/hooks/useAnnonce";

const NAV_ITEMS = [
  { to: "/moderator", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/moderator/matieres", label: "Matières", icon: BookOpen },
  { to: "/moderator/students", label: "Utilisateurs", icon: Users },
  { to: "/moderator/annonces", label: "Annonces", icon: Megaphone },
  { to: "/moderator/documents", label: "Documents", icon: Book },
  { to: "/moderator/profile", label: "Mon Profil", icon: Users },
];

export default function ModeratorLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hooks d'actions
  const {
    archiveAnnonce,
    deleteAnnonce,
    updateAnnonce,
    createAnnonce,
    getClasseAnnonce,
    getClasseActiveAnnonce,
  } = useAnnonce();

  const {
    getStudentClasse,
    getClasseDocuments,
    getClasseSubject,
    studentByClasse,
  } = useClasse();
  const isProfilePage = location.pathname.startsWith("/moderator/profile");

  const { createSubject, updateSubject, deleteSubject } = useMatiere();
  const { updateProfile, deleteStudent, createStudent, getMyProfile } =
    useStudent();
  const {
    valideDocument,
    rejeteDocument,
    createDocument,
    deleteDocument,
    studentDocument,
  } = useDocument();

  const classeId = user?.classe_id || user?.classeId || null;

  // États pour stocker les données résolues
  const [moderatorData, setModeratorData] = useState({
    userClasse: null,
    allStudents: [],
    allDocuments: [],
    allSubjects: [],
    allAnnonces: [],
    loading: true,
    error: null,
  });

  // Fonction de rechargement/rafraîchissement des données
  const fetchClasseData = async () => {
    if (!user || !classeId) {
      setModeratorData((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      setModeratorData((prev) => ({ ...prev, loading: true, error: null }));

      // Execution de toutes les requêtes en parallèle pour des performances maximales
      const [classe, studentsList, docsList, subjectsList, annoncesList] =
        await Promise.all([
          getStudentClasse ? getStudentClasse(user.id) : Promise.resolve(null),
          studentByClasse ? studentByClasse(classeId) : Promise.resolve([]),
          getClasseDocuments
            ? getClasseDocuments(classeId)
            : Promise.resolve([]),
          getClasseSubject ? getClasseSubject(classeId) : Promise.resolve([]),
          getClasseAnnonce ? getClasseAnnonce(classeId) : Promise.resolve([]),
        ]);

      setModeratorData({
        userClasse: classe,
        allStudents: Array.isArray(studentsList) ? studentsList : [],
        allDocuments: Array.isArray(docsList) ? docsList : [],
        allSubjects: Array.isArray(subjectsList) ? subjectsList : [],
        allAnnonces: Array.isArray(annoncesList) ? annoncesList : [],
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Erreur lors du chargement des données modérateur :", err);
      setModeratorData((prev) => ({
        ...prev,
        loading: false,
        error: err?.message || "Erreur de chargement des données.",
      }));
    }
  };

  useEffect(() => {
    fetchClasseData();
  }, [classeId]);

  // Regroupement des données et des méthodes d'action dans le contexte
  const contextValue = {
    // Données chargées
    user,
    userClasse: moderatorData.userClasse,
    allStudents: moderatorData.allStudents,
    allDocuments: moderatorData.allDocuments,
    allSubjects: moderatorData.allSubjects,
    allAnnonces: moderatorData.allAnnonces,
    loadingData: moderatorData.loading,
    errorData: moderatorData.error,
    refreshData: fetchClasseData,

    // Actions & Méthodes CRUD
    createDocument,
    getStudentClasse,
    deleteDocument,
    valideDocument,
    rejeteDocument,
    studentDocument,
    archiveAnnonce,
    deleteAnnonce,
    updateAnnonce,
    createAnnonce,
    getClasseActiveAnnonce,
    createStudent,
    deleteStudent,
    updateProfile,
    getMyProfile,
    createSubject,
    deleteSubject,
    updateSubject,
  };

  if (isProfilePage) {
    return (
      <div className="min-h-screen bg-orange-50/30">
        <Outlet context={contextValue} />
      </div>
    );
  }

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
            onClick={logout}
            className="w-full justify-start gap-2 text-gray-600 hover:text-red-600"
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
            <span className="text-sm text-gray-600">
              {user?.first_name
                ? `${user.first_name} ${user.last_name || ""}`
                : user?.name}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {moderatorData.loading ? (
            <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
              Chargement des données de la classe...
            </div>
          ) : (
            <Outlet context={contextValue} />
          )}
        </main>
      </div>
    </div>
  );
}
