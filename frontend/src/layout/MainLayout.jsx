import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { NavLink, Outlet } from "react-router-dom";

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/"
            className="text-xl font-bold tracking-tight text-slate-900 hover:opacity-80 transition-opacity"
          >
            EmiMood
          </NavLink>

          {/* Navigation / User Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700">
                  Bonjour{" "}
                  <strong className="text-slate-900">{user?.first_name}</strong>
                </span>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Déconnecter
                </Button>
              </div>
            ) : (
              <nav className="flex items-center gap-3">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                      isActive
                        ? "text-slate-900 bg-slate-100"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  Se connecter
                </NavLink>
                <NavLink to="/register">
                  <Button size="sm">S'inscrire</Button>
                </NavLink>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main Content (Pousse le footer vers le bas grâce à flex-1) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer (Toujours en bas) */}
      <footer className="w-full border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} EmiMood — Je suis le footer de la page
          </p>
        </div>
      </footer>
    </div>
  );
}
