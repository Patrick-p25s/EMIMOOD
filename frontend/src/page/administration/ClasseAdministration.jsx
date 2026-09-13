import React, { useState } from "react";
import InputLabeled from "@/components/shared/InputLabeled";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import FormModal from "@/components/shared/FormModal";
import ClasseCard from "@/components/special/ClasseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, School } from "lucide-react";
import { useClasse } from "@/hooks/useClasse";

const emptyClasse = { mention: "", niveau: "" };

export default function ClasseAdministration() {
  const { loading, error, classes, add, remove, update } = useClasse();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [classeData, setClasseData] = useState(emptyClasse);
  const [classeEnEdition, setClasseEnEdition] = useState(null);

  const [saving, setSaving] = useState(false);
  const [erreur, setErreur] = useState(null);

  const handleCreate = async () => {
    setErreur(null);
    setSaving(true);
    try {
      await add(classeData);
      setClasseData(emptyClasse);
      setOpenCreate(false);
    } catch (err) {
      setErreur(err.message?.toString());
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
    setErreur(null);
    setSaving(true);
    try {
      await update(classeEnEdition.id, classeData);
      setOpenEdit(false);
      setClasseEnEdition(null);
    } catch (err) {
      setErreur(err.message?.toString());
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setErreur(null);
    try {
      await remove(id);
    } catch (err) {
      setErreur(err.message?.toString());
    }
  };

  // Pas encore implémenté — juste le point d'entrée pour l'instant
  const handleAddModerateur = (classe) => {
    return null;
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
          onClick={() => setOpenCreate(true)}
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </ButtonStyled>
      </div>

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
          onChange={() => setErreur(null)}
        />
        <InputLabeled
          label="Niveau"
          value={classeData.niveau}
          setValue={setClasseData}
          name="niveau"
          onChange={() => setErreur(null)}
        />
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
          onChange={() => setErreur(null)}
        />
        <InputLabeled
          label="Niveau"
          value={classeData.niveau}
          setValue={setClasseData}
          name="niveau"
          onChange={() => setErreur(null)}
        />
      </FormModal>

      {/* Grille des classes */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">Erreur : {error.message}</p>
      ) : classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
          <School className="h-8 w-8" />
          <p className="text-sm">
            Aucune classe pour cette année. Commence par en créer une.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classe) => (
            <ClasseCard
              key={classe.id}
              classe={classe}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onAddModerateur={handleAddModerateur}
            />
          ))}
        </div>
      )}
    </div>
  );
}
