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

import MyDashboard from "./page/connected/Dashboard";
import AdminDashboard from "./page/administration/AdminDashboard";
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
                <Route index element={<AdminDashboard />} />
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
