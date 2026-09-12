import React from "react";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import AuthProvider from "./context/AuthContext";
import { AnneeProvider } from "./context/AnneeContext";
import MainLayout from "./layout/MainLayout";
import GuestRoute from "./route/GuestRoute";
import ProtectedRoute from "./route/ProtectedRoute";
import RegisterPage from "./page/RegisterPage";
import LoginPage from "./page/LoginPage";
import AdminRoute from "./route/AdminRoute";
import ModeratorLayout from "./layout/ModeratorLayout";
import AdminDashboard from "./page/administration/AdminDashboard";
import ClasseAdministration from "./page/administration/ClasseAdministration";
import MatiereAdministration from "./page/administration/MatiereAdministration";
import DocumentAdministration from "./page/administration/DocumentAdministration";
import YearAdministration from "./page/administration/YearAdministration";
import AdminLayout from "./layout/AdminLayout";
import Test from "./page/administration/Test";
import MyDashboard from "./page/connected/Dashboard";
export default function App() {
  return (
    <AuthProvider>
      <AnneeProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              {/* Route pour tous le monde sans exeption  */}
              <Route path="/" element={<LandingPage />} />

              {/* Route pour tous sauf ce qui est connecté  */}
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Route pour tous ce qui est connecté  */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<MyDashboard />} />
              </Route>
            </Route>

            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboard />} />
                <Route path="year" element={<YearAdministration />} />
                <Route path="classe" element={<ClasseAdministration />} />
                <Route path="matiere" element={<MatiereAdministration />} />
                <Route path="document" element={<DocumentAdministration />} />
                <Route path="annonces" element={<DocumentAdministration />} />
                <Route path="etudiant" element={<DocumentAdministration />} />
              </Route>
            </Route>

            {/* <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminRoute />}>
                <Route path="" element={<DashboardAdmin />} />
                <Route path="annonces" element={<Annonces />} />
                <Route path="annees" element={<Annee />} />
                <Route path="classes" element={<Classe />} />
                <Route path="classes/:classeId" element={<ManageClasse />} />
                <Route path="etudiants" element={<Etudiant />} />
                <Route path="documents" element={<DocumentAdmin />} />
                <Route path="documents/:documentId" element={<OneDocument />} />
              </Route>
            </Route>

            <Route path="/moderator" element={<ModeratorRoute />}>
              <Route element={<ModeratorLayout />}>
                <Route index element={<DashboardModerator />} />
                <Route path="students" element={<StudentModerator />} />
                <Route path="annonces" element={<AnnounceModerator />} />
                <Route path="matieres" element={<SubjectModerator />} />
                <Route path="profile" element={<StudentLayout />} />
                <Route
                  path="matieres/:subjectId"
                  element={<OneSubjectModerator />}
                />
                <Route path="documents" element={<DocumentModerator />} />
                <Route
                  path="documents/:documentId"
                  element={<OneDocumentModerator />}
                />
              </Route>
            </Route> */}
          </Routes>
        </BrowserRouter>
      </AnneeProvider>
    </AuthProvider>
  );
}
