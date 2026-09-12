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
import DashboardAdmin from "./page/admin/Dashboard";
import ManageClasse from "./page/admin/ManageClasse";
import AdminLayout from "./layout/AdminLayout";
import Annonces from "./page/admin/Annonces";
import Annee from "./page/admin/Annee";
import Classe from "./page/admin/Classe";
import Etudiant from "./page/admin/Etudiant";
import ModeratorLayout from "./layout/ModeratorLayout";
import ModeratorRoute from "./route/ModeratorRoute";
import DashboardModerator from "./page/moderator/Dashboard";
import StudentModerator from "./page/moderator/StudentModerator";
import AnnounceModerator from "./page/moderator/AnnounceModerator";
import SubjectModerator from "./page/moderator/SubjectModerator";
import DocumentModerator from "./page/moderator/DocumentModerator";
import OneSubjectModerator from "./page/moderator/OneSubjectModerator";
import OneDocumentModerator from "./page/moderator/OneDocumentModerator";
import DocumentAdmin from "./page/admin/Document";
import OneDocument from "./page/admin/OneDocument";
import StudentLayout from "./page/moderator/MyProfile";
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

            <Route element={<ModeratorLayout />}>
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<DashboardAdmin />} />
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
