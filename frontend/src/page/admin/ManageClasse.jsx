import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  Users,
  Megaphone,
  KeyRound,
  Folder,
  PaperBagIcon,
  Recycle,
} from "lucide-react";

import { ButtonStyled } from "@/components/shared/ButtonStyled";
import FormModal from "@/components/shared/FormModal";
import { ChampUsersCreate } from "../RegisterPage";

import useAnnonce from "@/hooks/useAnnonce";
import { useClasse } from "@/hooks/useClasse";
import useStudent from "@/hooks/useStudent";

// Composants shadcn/ui
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AnnonceItem from "@/components/shared/AnnonceItem";
import StudentCard from "@/components/shared/StudentCard";
import MatiereCard from "@/components/shared/MatiereCard";

export default function ManageClasse() {
  const { classeId } = useParams();
  const [open, setOpen] = useState(false);
  const { createStudent } = useStudent();
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    password_hash: "",
  });

  // 1. Récupération des hooks
  const { classes, studentByClasse, getMatiere, regenerateCodeInvitation } =
    useClasse();
  const { getActiveAnnonce, annonces } = useAnnonce();

  // 2. États locaux pour stocker les résultats asynchrones
  const [annoncesClasse, setAnnoncesClasse] = useState([]);
  const [studentsClasse, setStudentsClasse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // 3. Recherche synchrone de la classe dans le tableau `classes`
  const classe = classes.find((cl) => cl.id === classeId);

  // 4. Chargement asynchrone des annonces et étudiants associés
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!classeId) return;
      setLoading(true);

      try {
        const [annoncesData, studentsData] = await Promise.all([
          getActiveAnnonce(classeId),
          studentByClasse(classeId),
        ]);

        if (isMounted) {
          setAnnoncesClasse(annoncesData);
          setStudentsClasse(studentsData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [classeId]);

  // 5. Gestion des cas d'erreur
  if (!classe) {
    return (
      <div className="p-6 text-center text-destructive font-medium">
        Classe introuvable.
      </div>
    );
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true); // ✅ N'impacte pas le 'loading' global de la page
    setErreur("");
    try {
      await regenerateCodeInvitation(classeId);
    } catch (error) {
      setErreur(`Erreur : ${error.message.toString()}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSubmit = async () => {
    setErreur(null);
    setIsSubmiting(true);
    try {
      await createStudent(formData, classeId);
    } catch (error) {
      setErreur(`Erreur : ${error.message.toString()}`);
    } finally {
      setIsSubmiting(false);
    }
  };

  // 6. Affichage
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* En-tête : Informations de la classe et action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {classe.niveau || classe.mention || classeId}
            </h1>
            {classe.mention && (
              <Badge variant="secondary" className="text-xs">
                {classe.mention}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            Code d'invitation :{" "}
            <span className="font-mono text-foreground font-semibold">
              {classe.code_invitation}
            </span>
          </p>
        </div>

        <div>
          <div className="flex gap-4">
            <ButtonStyled
              onClick={() => setOpen(true)}
              className="flex items-center gap-2"
              icon={<Plus className="w-4 h-4" />}
              disable={loading}
            >
              Ajouter Modérateur
            </ButtonStyled>
            <ButtonStyled
              onClick={handleRegenerate}
              className="flex items-center gap-2"
              icon={<Recycle className="w-4 h-4" />}
              disable={isRegenerating}
            >
              Regénérer code
            </ButtonStyled>
          </div>

          <FormModal
            open={open}
            onOpenChange={setOpen}
            onSubmit={handleSubmit}
            error={erreur}
            loading={isSubmiting}
            submitLabel="Créer"
          >
            <ChampUsersCreate setValue={setFormData} value={formData} />
          </FormModal>
        </div>
      </div>

      {/* Chargement Skeleton */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      ) : (
        /* Onglets pour naviguer facilement et ajouter du contenu plus tard */
        <Tabs defaultValue="students" className="w-full space-y-6">
          <TabsList className="bg-muted p-1">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Étudiants ({studentsClasse.length})
            </TabsTrigger>
            <TabsTrigger value="annonces" className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              Annonces ({annoncesClasse.length})
            </TabsTrigger>

            {/* Emplacement prêt pour de futurs onglets (ex: Documents, Devoirs) */}
            <TabsTrigger value="matiere">
              <PaperBagIcon className="w-4 h-4 mr-2" /> Matiere
            </TabsTrigger>
            {/* <TabsTrigger value="documents">
              <Folder className="w-4 h-4 mr-2" /> Documents
            </TabsTrigger> */}
          </TabsList>

          {/* Onglet Étudiants */}
          <TabsContent value="students" className="space-y-4">
            {studentsClasse.length <= 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Aucun étudiant disponible.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {studentsClasse.map((student, idx) => (
                  <StudentCard student={student} key={student.id || idx} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Onglet Annonces */}
          <TabsContent value="annonces" className="space-y-4">
            {annoncesClasse.length <= 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Aucune tâche / annonce disponible.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {annoncesClasse.map((annonce, idx) => (
                  <AnnonceItem annonce={annonce} key={annonce.id || idx} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="matiere" className="space-y-4">
            {getMatiere(classeId).length <= 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Aucune matiere / annonce disponible.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getMatiere(classeId).map((matiere) => (
                  <MatiereCard matiere={matiere} key={matiere.id} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

{
  /* Composant Cartes Annonces aux normes shadcn */
}
function AnnonceCard({ annonce }) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="p-4">
        <CardTitle className="text-base font-semibold">
          {annonce.titre}
        </CardTitle>
        {annonce.description && (
          <CardDescription className="text-xs line-clamp-2 mt-1">
            {annonce.description}
          </CardDescription>
        )}
      </CardHeader>
    </Card>
  );
}
