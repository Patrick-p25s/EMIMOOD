import useAnnonce from "@/hooks/useAnnonce";
import useClasse from "@/hooks/useClasse";
import useStudent from "@/hooks/useStudent";
import useMatiere from "@/hooks/useMatiere";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export default function DashboardAdmin() {
  const { annonces } = useAnnonce();
  const { students } = useStudent();
  const { classes } = useClasse();
  const { matieres } = useMatiere();
  const delegues = students.filter((s) => s.role === "moderator");
  return (
    <div className="flex justify-between">
      <StatCard
        title="Etudiant inscrit"
        value={students.length}
        description="Tous les étudiant inscrit"
      />
      <StatCard
        title="Total de classe"
        value={classes.length}
        description="Tous les étudiant inscrit"
      />
      <StatCard
        title="Total des matieres"
        value={matieres.length}
        description="Tous les étudiant inscrit"
      />
      <StatCard
        title="Delegue total"
        value={delegues.length}
        description="Tous les étudiant inscrit"
      />
    </div>
  );
}

export function StatCard({ title, value, description, badgeText }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">
          {title}
        </CardTitle>
        {badgeText && (
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-secondary text-secondary-foreground border border-border">
            {badgeText}
          </span>
        )}
      </CardHeader>

      <CardContent>
        <div className="text-4xl font-extrabold text-foreground tracking-tight mb-2">
          {value}
        </div>
        <CardDescription className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
