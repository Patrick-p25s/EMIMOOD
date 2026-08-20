import React, { useMemo, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useClasse from "@/hooks/useClasse";
import useMatiere from "@/hooks/useMatiere";
import useDocument from "@/hooks/useDocument";
import { ButtonStyled, buttonVariants } from "@/components/shared/ButtonStyled";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Check,
  X,
  Clock,
  FileText,
  Megaphone,
  Upload,
  GraduationCap,
  BookOpen,
  Users,
} from "lucide-react";

import AnnouncementDialog from "./AnnouncementDialog";
import DocumentUploadDialog from "./DialogUploadDialog";

import StatCard from "@/components/shared/StatCard";

// ── Sous-composant : carte info classe ───────────────────────
function ClasseInfoCard({ classe, matiereCount, studentCount, loading }) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-5">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
      <CardContent className="p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {classe?.mention || "Classe non trouvée"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {classe?.niveau && <span>{classe.niveau} · </span>}
              {classe?.annee?.mention ||
                classe?.annee_universitaire ||
                "Année en cours"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            {matiereCount} matière{matiereCount > 1 ? "s" : ""}
          </Badge>
          {studentCount !== undefined && (
            <Badge variant="secondary" className="gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {studentCount} étudiant{studentCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Sous-composant : ligne document en attente ───────────────
function PendingDocRow({ doc, matiereName, processing, onValide, onRejete }) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 rounded-md bg-amber-50 flex items-center justify-center shrink-0">
          <FileText className="h-4.5 w-4.5 text-amber-600" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm text-foreground truncate">
            {doc.titre}
          </p>
          <p className="text-xs text-muted-foreground">
            {matiereName || doc.matiere_id}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <ButtonStyled
          className={buttonVariants({ size: "sm" })}
          disabled={processing}
          onClick={() => onValide(doc.id)}
        >
          <Check className="w-4 h-4" /> Valider
        </ButtonStyled>
        <Button
          size="sm"
          variant="destructive"
          className="gap-1"
          disabled={processing}
          onClick={() => onRejete(doc.id)}
        >
          <X className="w-4 h-4" /> Rejeter
        </Button>
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────
const RECENT_LIMIT = 5;

export default function DashboardModerator() {
  const { user } = useAuth();
  const [processingId, setProcessingId] = useState(null);
  const [announceOpen, setAnnounceOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const moderatorClasseId = user?.classe_id || user?.classeId;

  const { classes, loading: classesLoading } = useClasse();
  const { matieres } = useMatiere();
  const { documents, valideDocument, rejeteDocument } = useDocument();

  const userClasse = useMemo(
    () => classes?.find((cl) => String(cl.id) === String(moderatorClasseId)),
    [classes, moderatorClasseId],
  );

  const classMatieres = useMemo(() => {
    if (!matieres || !moderatorClasseId) return [];
    return matieres.filter(
      (m) => String(m.classe_id) === String(moderatorClasseId),
    );
  }, [matieres, moderatorClasseId]);

  const classMatiereIds = useMemo(
    () => classMatieres.map((m) => String(m.id)),
    [classMatieres],
  );

  console.log(classMatiereIds);

  const classDocuments = useMemo(() => {
    if (!documents || classMatiereIds.length === 0) return [];
    return documents.filter((doc) =>
      classMatiereIds.includes(String(doc.matiere_id)),
    );
  }, [documents, classMatiereIds]);

  const pendingDocs = useMemo(
    () => classDocuments.filter((d) => d.statut === "pending"),
    [classDocuments],
  );
  const publicDocs = useMemo(
    () => classDocuments.filter((d) => d.statut === "publique"),
    [classDocuments],
  );
  const rejectedDocs = useMemo(
    () => classDocuments.filter((d) => d.statut === "rejete"),
    [classDocuments],
  );

  const recentPendingDocs = useMemo(
    () => pendingDocs.slice(0, RECENT_LIMIT),
    [pendingDocs],
  );

  const matiereNameById = useMemo(() => {
    const map = new Map();
    classMatieres.forEach((m) => map.set(String(m.id), m.nom));
    return map;
  }, [classMatieres]);

  const handleValide = async (docId) => {
    setProcessingId(docId);
    try {
      await valideDocument(docId);
    } catch (err) {
      console.error("Erreur lors de la validation:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejete = async (docId) => {
    setProcessingId(docId);
    try {
      await rejeteDocument(docId);
    } catch (err) {
      console.error("Erreur lors du rejet:", err);
    } finally {
      setProcessingId(null);
    }
  };

  if (!moderatorClasseId) {
    return (
      <div className="p-6">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-6 text-destructive text-sm">
            Aucune classe rattachée à ce compte modérateur.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* En-tête : infos classe + actions rapides */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        <div className="flex-1">
          <ClasseInfoCard
            classe={userClasse}
            matiereCount={classMatieres.length}
            loading={classesLoading}
          />
        </div>

        <div className="flex gap-2 shrink-0">
          <Dialog open={announceOpen} onOpenChange={setAnnounceOpen}>
            <DialogTrigger asChild>
              <ButtonStyled
                className={buttonVariants({ variant: "secondary" }, "gap-2")}
                icon={<Megaphone className="h-4 w-4" />}
              >
                Annonce
              </ButtonStyled>
            </DialogTrigger>
            <AnnouncementDialog
              classeId={moderatorClasseId}
              onClose={() => setAnnounceOpen(false)}
            />
          </Dialog>

          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <ButtonStyled
                className="gap-2"
                icon={<Upload className="h-4 w-4" />}
              >
                Document
              </ButtonStyled>
            </DialogTrigger>
            <DocumentUploadDialog
              matieres={classMatieres}
              onClose={() => setUploadOpen(false)}
            />
          </Dialog>
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="En attente"
          value={pendingDocs.length}
          icon={Clock}
          tone="warning"
        />
        <StatCard
          title="Documents publics"
          value={publicDocs.length}
          icon={FileText}
          tone="success"
        />
        <StatCard
          title="Documents rejetés"
          value={rejectedDocs.length}
          icon={X}
          tone="danger"
        />
        <StatCard
          title="Matières"
          value={classMatieres.length}
          icon={BookOpen}
        />
      </div>

      {/* Documents en attente récents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <h3 className="font-semibold text-foreground">
              Documents récents en attente
            </h3>
            <p className="text-sm text-muted-foreground">
              {pendingDocs.length > RECENT_LIMIT
                ? `${RECENT_LIMIT} plus récents sur ${pendingDocs.length}`
                : "À traiter en priorité"}
            </p>
          </div>
          {pendingDocs.length > 0 && (
            <Badge
              variant="outline"
              className="border-amber-300 text-amber-700 bg-amber-50"
            >
              {pendingDocs.length} en attente
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {recentPendingDocs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Aucun document en attente de validation.
            </div>
          ) : (
            recentPendingDocs.map((doc) => (
              <PendingDocRow
                key={doc.id}
                doc={doc}
                matiereName={matiereNameById.get(String(doc.matiere_id))}
                processing={processingId === doc.id}
                onValide={handleValide}
                onRejete={handleRejete}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Onglets détaillés */}
      {/* <Tabs defaultValue="pending" className="w-full space-y-4">
        <TabsList className="bg-muted p-1">
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" /> En attente ({pendingDocs.length})
          </TabsTrigger>
          <TabsTrigger value="public" className="gap-2">
            <FileText className="w-4 h-4" /> Publics ({publicDocs.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <X className="w-4 h-4" /> Rejetés ({rejectedDocs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-2">
          {pendingDocs.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center text-muted-foreground">
                Aucun document en attente de validation.
              </CardContent>
            </Card>
          ) : (
            pendingDocs.map((doc) => (
              <PendingDocRow
                key={doc.id}
                doc={doc}
                matiereName={matiereNameById.get(String(doc.matiere_id))}
                processing={processingId === doc.id}
                onValide={handleValide}
                onRejete={handleRejete}
              />
            ))
          )}
        </TabsContent> */}

      {/* <TabsContent value="public">
        </TabsContent>
        <TabsContent value="rejected">
        </TabsContent>
      </Tabs> */}
    </div>
  );
}
