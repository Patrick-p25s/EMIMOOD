import React from "react";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import AuthProvider from "./context/AuthContext";
import MainLayout from "./layout/MainLayout";
import GuestRoute from "./route/GuestRoute";
import ProtectedRoute from "./route/ProtectedRoute";
import RegisterPage from "./page/RegisterPage";
import LoginPage from "./page/LoginPage";
import AdminRoute from "./route/AdminRoute";
import AdminDashboard from "./page/administration/AdminDashboard";
import ClasseAdministration from "./page/administration/ClasseAdministration";
import MatiereAdministration from "./page/administration/MatiereAdministration";
import DocumentAdministration from "./page/administration/DocumentAdministration";
import YearAdministration from "./page/administration/YearAdministration";
import AdminLayout from "./layout/AdminLayout";
import MyDashboard from "./page/connected/Dashboard";
import DocumentLecture from "./page/connected/DocumentLecture";
import AnnoncesAdministration from "./page/administration/AnnonceAdministration";
import UsersAdministration from "./page/administration/UsersAdministration";
import SubjectAdministration from "./page/administration/SubjectModerator";
export default function App() {
  return (
    <AuthProvider>
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
          </Route>

          {/* Route pour tous ce qui est connecté  */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<MyDashboard />} />
            <Route
              path="/dashboard/:documentId"
              element={<DocumentLecture />}
            />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<AdminDashboard />} />
              <Route path="year" element={<YearAdministration />} />
              <Route path="classe" element={<ClasseAdministration />} />
              <Route path="matiere" element={<SubjectAdministration />} />
              <Route path="document" element={<DocumentAdministration />} />
              <Route
                path="document/:documentId"
                element={<DocumentLecture />}
              />
              <Route path="annonces" element={<AnnoncesAdministration />} />
              <Route path="etudiant" element={<UsersAdministration />} />
            </Route>
          </Route>
          <Route path="/documents/:id" element={<DocumentLecture />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
