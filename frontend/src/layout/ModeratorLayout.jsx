import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  ShieldAlert,
  LayoutDashboard,
  Flag,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";

const NAV_ITEMS = [
  {
    to: "/moderator/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
  },
  { to: "/moderator/reports", label: "Signalements", icon: Flag },
  { to: "/moderator/users", label: "Utilisateurs", icon: Users },
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
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
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
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-gray-600 hover:text-red-600"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-orange-200 flex items-center justify-between px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
