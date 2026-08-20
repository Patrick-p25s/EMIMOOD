import React from "react";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import AuthProvider from "./context/AuthContext";
import { AnneeProvider } from "./context/AnneeContext";
import MainLayout from "./layout/MainLayout";
import GuestRoute from "./route/GuestRoute";
import ProtectedRoute from "./route/ProtectedRoute";
import Dashboard from "./page/Dashboard";
import RegisterPage from "./page/RegisterPage";
import LoginPage from "./page/LoginPage";
import AdminRoute from "./route/AdminRoute";
import DashboardAdmin from "./page/admin/Dashboard";
import ManageClasse from "./page/admin/ManageClasse";
import AdminLayout from "./layout/AdminLayout";
import Annonces from "./page/admin/Annonces";
import Annee from "./page/admin/Annee";
import Classe from "./page/admin/Classe";
import Delegue from "./page/admin/Delegue";
import Etudiant from "./page/admin/Etudiant";
import ModeratorLayout from "./layout/ModeratorLayout";
import ModeratorRoute from "./route/ModeratorRoute";
import DashboardModerator from "./page/moderator/Dashboard";

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
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Route>

            <Route element={<AdminLayout />}>
              {/* Route pour administrateur seulement  */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route path="" element={<DashboardAdmin />} />
                <Route path="annonces" element={<Annonces />} />
                <Route path="annees" element={<Annee />} />
                <Route path="classes" element={<Classe />} />
                <Route path="classes/:classeId" element={<ManageClasse />} />
                <Route path="delegues" element={<Delegue />} />
                <Route path="etudiants" element={<Etudiant />} />
                <Route path="documents" element={<Classe />} />
              </Route>
            </Route>

            {/* Route pour les moderator seulement  */}
            <Route element={<ModeratorLayout />}>
              <Route path="/moderator" element={<ModeratorRoute />}>
                <Route path="" element={<DashboardModerator />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AnneeProvider>
    </AuthProvider>
  );
}
