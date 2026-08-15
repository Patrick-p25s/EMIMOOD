import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function MainLayout() {
  const { user } = useAuth();
  console.log(user);
  return (
    <div>
      <header className="bg-red-500">
        <nav>Je suis La barre de navigation</nav>
        <h1>Ceci est mon assistant</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
