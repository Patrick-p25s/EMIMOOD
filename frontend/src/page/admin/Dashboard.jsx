import useAnnonce from "@/hooks/useAnnonce";
import useClasse from "@/hooks/useClasse";
import useStudent from "@/hooks/useStudent";
import useMatiere from "@/hooks/useMatiere";
import StatCard from "@/components/shared/StatCard";
import { BookOpen, User, User2, User2Icon } from "lucide-react";

export default function DashboardAdmin() {
  const { annonces } = useAnnonce();
  const { students } = useStudent();
  const { classes } = useClasse();
  const { matieres } = useMatiere();
  const delegues = students.filter((s) => s.role === "moderator");

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Etudiant inscrit" value={students.length} icon={User} />
      <StatCard
        title="Total de classe"
        value={classes.length}
        icon={User2Icon}
      />
      <StatCard
        title="Total des matieres"
        value={matieres.length}
        tone="success"
        icon={BookOpen}
      />
      <StatCard title="Delegue total" value={delegues.length} icon={User2} />
    </div>
  );
}
