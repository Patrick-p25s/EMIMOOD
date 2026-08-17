import { Button } from "@/components/ui/button";
import useAuth from "@/hook/useAuth";
import { NavLink, Outlet } from "react-router-dom";

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <>
      <header>
        <NavLink to="/">EmiMood</NavLink>
        <div>
          {isAuthenticated ? (
            <div>
              <h1>Bonjour {user.first_name} </h1>{" "}
              <Button onClick={() => logout()}>Deconnecter</Button>
            </div>
          ) : (
            <nav>
              <NavLink to="/login">Se connecter</NavLink>{" "}
              <NavLink to="/register">S'inscrire</NavLink>
            </nav>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <h1>Je suis la footer du page</h1>
      </footer>
    </>
  );
}
