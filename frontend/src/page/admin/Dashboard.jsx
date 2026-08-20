import useAnnonce from "@/hooks/useAnnonce";
import useClasse from "@/hooks/useClasse";
import useStudent from "@/hooks/useStudent";
import useMatiere from "@/hooks/useMatiere";
import StatCard from "@/components/shared/StatCard";

export default function DashboardAdmin() {
  const { annonces } = useAnnonce();
  const { students } = useStudent();
  const { classes } = useClasse();
  const { matieres } = useMatiere();
  const delegues = students.filter((s) => s.role === "moderator");

  return (
    <div className="flex justify-between">
      <StatCard title="Etudiant inscrit" value={students.length} />
      <StatCard title="Total de classe" value={classes.length} />
      <StatCard
        title="Total des matieres"
        value={matieres.length}
        tone="success"
      />
      <StatCard title="Delegue total" value={delegues.length} />
    </div>
  );
}
