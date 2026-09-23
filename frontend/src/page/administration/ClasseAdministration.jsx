import React, { useState } from "react";
import InputLabeled from "@/components/shared/InputLabeled";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import FormModal from "@/components/shared/FormModal";
import ClasseCard from "@/components/special/ClasseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, School } from "lucide-react";
import { useClasse } from "@/hooks/useClasse";
import { ChampUsersCreate } from "../RegisterPage";
import AlertBox from "@/components/shared/AlertBox";
import { EmptyCard } from "@/components/shared/EmptyCard";

const emptyClasse = { mention: "", niveau: "" };

export default function ClasseAdministration() {
  const { loading, error, classes, add, remove, update, generate, moderator } =
    useClasse();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [classeData, setClasseData] = useState(emptyClasse);
  const [classeEnEdition, setClasseEnEdition] = useState(null);
  const [openModerator, setOpentModerator] = useState(false);
  const [classe, setClasse] = useState(null);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [saving, setSaving] = useState(false);
  const [erreur, setActionErreur] = useState(null);

  const handleCreate = async () => {
    setActionErreur(null);
    setSaving(true);
    try {
      await add(classeData);
      setClasseData(emptyClasse);
      setOpenCreate(false);
    } catch (err) {
      setActionErreur(err.message?.toString());
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (classe) => {
    setClasseEnEdition(classe);
    setClasseData({ mention: classe.mention, niveau: classe.niveau });
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    setActionErreur(null);
    setSaving(true);
    try {
      const updated = await update(classeEnEdition.id, classeData);
      setOpenEdit(false);
      setClasseEnEdition(null);
      return updated;
    } catch (err) {
      setActionErreur(err.message?.toString());
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async (id) => {
    setActionErreur(null);
    try {
      await generate(id);
    } catch (err) {
      setActionErreur(err.message?.toString());
    }
  };

  const handleDelete = async (id) => {
    setActionErreur(null);
    try {
      await remove(id);
    } catch (err) {
      setActionErreur(err.message?.toString());
    }
  };

  // Pas encore implémenté — juste le point d'entrée pour l'instant
  const handleAddModerateur = async () => {
    if (classe === null) {
      setActionErreur("Aucune classe séléctionné");
      return;
    }
    try {
      return await moderator(userData, classe.id);
    } catch (err) {
      setActionErreur(err.message?.toString());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Gestion des classes</h1>
          <p className="text-sm text-muted-foreground">
            {classes.length} classe{classes.length > 1 ? "s" : ""} pour l'année
            active
          </p>
        </div>
        <ButtonStyled
          type="button"
          className="gap-1.5"
          onClick={() => {
            setOpenCreate(true);
            setActionErreur(null);
          }}
          icon={<Plus className="h-4 w-4" />}
        >
          Ajouter
        </ButtonStyled>
      </div>

      {(error || erreur) && (
        <AlertBox variant="error">{erreur || error}</AlertBox>
      )}

      {/* Modal : créer une classe */}
      <FormModal
        onSubmit={handleCreate}
        title="Ajouter une classe"
        submitLabel="Créer"
        loading={saving}
        open={openCreate}
        onOpenChange={setOpenCreate}
        error={erreur}
      >
        <InputLabeled
          label="Mention"
          value={classeData.mention}
          setValue={setClasseData}
          name="mention"
          onChange={() => setActionErreur(null)}
        />
        <InputLabeled
          label="Niveau"
          value={classeData.niveau}
          setValue={setClasseData}
          name="niveau"
          onChange={() => setActionErreur(null)}
        />
      </FormModal>

      <FormModal
        open={openModerator}
        onOpenChange={setOpentModerator}
        onSubmit={handleAddModerateur}
      >
        <ChampUsersCreate value={userData} setValue={setUserData} />
      </FormModal>

      {/* Modal : modifier une classe */}
      <FormModal
        onSubmit={handleUpdate}
        title="Modifier la classe"
        submitLabel="Enregistrer"
        loading={saving}
        open={openEdit}
        onOpenChange={setOpenEdit}
        error={erreur}
      >
        <InputLabeled
          label="Mention"
          value={classeData.mention}
          setValue={setClasseData}
          name="mention"
          onChange={() => setActionErreur(null)}
        />
        <InputLabeled
          label="Niveau"
          value={classeData.niveau}
          setValue={setClasseData}
          name="niveau"
          onChange={() => setActionErreur(null)}
        />
      </FormModal>

      {/* Grille des classes */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <EmptyCard
          icon={School}
          title="Aucune classe pour cette année. Commence par en créer une."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classe) => (
            <ClasseCard
              key={classe.id}
              classe={classe}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onAddModerateur={() => {
                setOpentModerator(true);
                setClasse(classe);
              }}
              onRegenerate={handleRegenerate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
