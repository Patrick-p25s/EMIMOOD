import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ManageClasse from "./page/ManageClasse";
import AdminLayout from "./layout/AdminLayout";

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
                <Route path="annonces" element={<ManageClasse />} />
                <Route path="annees" element={<ManageClasse />} />
                <Route path="classes" element={<ManageClasse />} />
                <Route path="delegues" element={<ManageClasse />} />
                <Route path="etudiants" element={<ManageClasse />} />
                <Route path="documents" element={<ManageClasse />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AnneeProvider>
    </AuthProvider>
  );
}
