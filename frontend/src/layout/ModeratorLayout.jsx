import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useMemo } from "react";
import {
  ShieldAlert,
  LayoutDashboard,
  Flag,
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
import { ButtonStyled, buttonVariants } from "@/components/common/forms/ButtonStyled";

const NAV_ITEMS = [
  {
    to: "/admin",
    label: "Tableau de bord",
    icon: LayoutDashboard,
  },
  { to: "/admin/matiere", label: "Matieres", icon: BookOpen },
  { to: "/admin/etudiant", label: "Utilisateurs", icon: Users },
  { to: "/admin/annonces", label: "Annonces", icon: Megaphone },
  { to: "/admin/document", label: "Documents", icon: Book },
  { to: "/admin/etudiant", label: "My Profile", icon: Users },
];

export default function ModeratorLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            icon={<X className="h-5 w-5" />}
            variant="ghost"
            className={cn(
              buttonVariants({ size: "icon" }),
              "ml-auto lg:hidden",
            )}
            onClick={() => setSidebarOpen(false)}
          ></ButtonStyled>
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
            icon={<Menu className="h-5 w-5" />}
          ></ButtonStyled>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="border-orange-300 text-orange-700 bg-orange-50"
            >
              Administration
            </Badge>
            <span className="text-sm text-gray-600">{user?.name}</span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
