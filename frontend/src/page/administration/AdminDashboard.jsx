import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  FileText,
  GraduationCap,
  Megaphone,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AlertBox from "@/components/common/feedback/AlertBox";
import { ButtonStyled } from "@/components/common/forms/ButtonStyled";
import IconBadge from "@/components/shared/IconBadge";
import useAnnonce from "@/hooks/useAnnonce";
import useStudent from "@/hooks/useStudent";
import { useClasse } from "@/hooks/useClasse";
import { useSubject } from "@/hooks/useSubject";
import { useYear } from "@/hooks/useYear";
import { getErrorMessage } from "@/utils/getErrorMessage";

const formatNumber = (value) => new Intl.NumberFormat("fr-FR").format(value || 0);

export default function AdminDashboard() {
  const students = useStudent();
  const classes = useClasse();
  const subjects = useSubject();
  const years = useYear();
  const announcements = useAnnonce();
  const activeYear = years.years.find((year) => year.is_active);
  const isLoading = students.loading || classes.loading || subjects.loading || years.loading || announcements.loading;
  const errors = [students.error, classes.error, subjects.error, years.error, announcements.error].filter(Boolean);
  const stats = [
    { label: "Étudiants", value: students.pagination.total, icon: Users, tone: "text-primary bg-primary/10", to: "/admin/etudiant" },
    { label: "Classes", value: classes.pagination.total, icon: GraduationCap, tone: "text-violet-600 bg-violet-500/10", to: "/admin/classe" },
    { label: "Matières", value: subjects.pagination.total, icon: BookOpen, tone: "text-emerald-600 bg-emerald-500/10", to: "/admin/matiere" },
    { label: "Annonces", value: announcements.pagination.total, icon: Megaphone, tone: "text-amber-600 bg-amber-500/10", to: "/admin/annonces" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-8">
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/12 via-background to-background px-5 py-6 sm:px-7 sm:py-8">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <IconBadge icon={CalendarDays} tone={activeYear ? "success" : "warning"}>{activeYear ? `Année active : ${activeYear.label}` : "Aucune année active"}</IconBadge>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Espace d’administration</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground sm:text-base">Gardez un œil sur votre établissement et accédez rapidement aux actions importantes.</p>
          </div>
          <ButtonStyled asChild className="self-start sm:self-auto"><Link to="/admin/annonces"><Megaphone /> Publier une annonce</Link></ButtonStyled>
        </div>
      </section>

      {errors.length > 0 && <AlertBox variant="warning" title="Certaines données n’ont pas pu être chargées">{getErrorMessage(errors[0])} Vous pouvez continuer à utiliser les autres rubriques.</AlertBox>}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-30 rounded-xl" />) : stats.map(({ label, value, icon: Icon, tone, to }) => (
          <Link key={label} to={to} className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md"><CardContent className="flex items-center gap-4 p-4">
              <div className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone}`}><Icon className="size-5" /></div>
              <div><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-0.5 text-2xl font-semibold tracking-tight">{formatNumber(value)}</p></div>
              <ArrowRight className="ml-auto size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </CardContent></Card>
          </Link>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.85fr]">
        <Card><CardHeader><CardTitle>À suivre</CardTitle><p className="text-sm text-muted-foreground">Les éléments qui demandent votre attention aujourd’hui.</p></CardHeader><CardContent className="space-y-1">
          <DashboardRow icon={Megaphone} label="Annonces actives" value={announcements.activeAnnonce.length} to="/admin/annonces" />
          <DashboardRow icon={CalendarDays} label="Années universitaires" value={years.pagination.total} to="/admin/year" />
          <DashboardRow icon={FileText} label="Gérer les documents partagés" to="/admin/document" />
        </CardContent></Card>
        <Card className="bg-muted/35"><CardHeader><CardTitle>Raccourcis</CardTitle><p className="text-sm text-muted-foreground">Les tâches administratives courantes.</p></CardHeader><CardContent className="grid gap-2">
          <QuickLink to="/admin/etudiant" icon={Users} label="Gérer les étudiants" /><QuickLink to="/admin/classe" icon={GraduationCap} label="Organiser les classes" /><QuickLink to="/admin/year" icon={CalendarDays} label="Configurer les années" />
        </CardContent></Card>
      </section>
    </div>
  );
}

function DashboardRow({ icon: Icon, label, value, to }) {
  return <Link to={to} className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted"><Icon className="size-4 text-primary" /><span className="flex-1 text-sm font-medium">{label}</span>{value !== undefined && <span className="text-sm tabular-nums text-muted-foreground">{formatNumber(value)}</span>}<ArrowRight className="size-4 text-muted-foreground" /></Link>;
}

function QuickLink({ to, icon: Icon, label }) {
  return <Link to={to} className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"><Icon className="size-4 text-primary" />{label}<ArrowRight className="ml-auto size-4 text-muted-foreground" /></Link>;
}
