import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Contexts
import AuthProvider from "./context/AuthContext";
import { AnneeProvider } from "./context/AnneeContext";

// Pages Publiques & Auth
import LandingPage from "./page/public/LandingPage";
import LoginPage from "./page/public/LoginPage";
import RegisterPage from "./page/public/RegisterPage";
import Dashboard from "./page/connected/Dashboard";

// Routes Protégées (Guards)
import GuestRoute from "./route/GuestRoute";
import ProtectedRoute from "./route/ProtectedRoute";
import AdminRoute from "./route/AdminRoute";
import ModeratorRoute from "./route/ModeratorRoute";

// Admin Layout & Pages
import AdminLayout from "./layout/AdminLayout";
import DashboardAdmin from "./page/admin/Dashboard";
import ManageClasse from "./page/admin/ManageClasse";
import Annonces from "./page/admin/Annonces";
import Annee from "./page/admin/Annee";
import Classe from "./page/admin/Classe";
import Etudiant from "./page/admin/Etudiant";
import DocumentAdmin from "./page/admin/Document";
import OneDocument from "./page/admin/OneDocument";

// Moderator Layout & Pages
import ModeratorLayout from "./layout/ModeratorLayout";
import DashboardModerator from "./page/moderator/Dashboard";
import StudentModerator from "./page/moderator/StudentModerator";
import AnnounceModerator from "./page/moderator/AnnounceModerator";
import SubjectModerator from "./page/moderator/SubjectModerator";
import DocumentModerator from "./page/moderator/DocumentModerator";
import OneSubjectModerator from "./page/moderator/OneSubjectModerator";
import OneDocumentModerator from "./page/moderator/OneDocumentModerator";
import ProfileModerator from "./page/moderator/MyProfile"; // Renommé pour clarté
import GestionRouter from "./layout/GestionRouter";
import Gestion from "./page/Gestion";
import GestionLayout from "./layout/GestionLaoyout";
export default function App() {
  return (
    <AuthProvider>
      <AnneeProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. Routes Publiques */}
            <Route path="/" element={<LandingPage />} />

            {/* 2. Routes Invités (Non connectés) */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* 3. Routes Étudiant / Utilisateur Connecté */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* 4. Espace Administrateur */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<DashboardAdmin />} />
                <Route path="annonces" element={<Annonces />} />
                <Route path="annees" element={<Annee />} />
                <Route path="classes" element={<Classe />} />
                <Route path="classes/:classeId" element={<ManageClasse />} />
                <Route path="etudiants" element={<Etudiant />} />
                <Route path="documents" element={<DocumentAdmin />} />
                <Route path="documents/:documentId" element={<OneDocument />} />
              </Route>
            </Route>

            {/* 5. Espace Modérateur */}
            <Route path="/moderator" element={<ModeratorRoute />}>
              <Route element={<ModeratorLayout />}>
                <Route index element={<DashboardModerator />} />
                <Route path="students" element={<StudentModerator />} />
                <Route path="annonces" element={<AnnounceModerator />} />
                <Route path="matieres" element={<SubjectModerator />} />
                <Route
                  path="matieres/:subjectId"
                  element={<OneSubjectModerator />}
                />
                <Route path="documents" element={<DocumentModerator />} />
                <Route
                  path="documents/:documentId"
                  element={<OneDocumentModerator />}
                />
                <Route path="profile" element={<ProfileModerator />} />
              </Route>
            </Route>
            <Route path="/gestion" element={<GestionRouter />}>
              <Route element={<GestionLayout />}>
                <Route index element={<Gestion />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AnneeProvider>
    </AuthProvider>
  );
}
