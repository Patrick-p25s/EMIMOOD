import { ButtonStyled } from "@/components/shared/ButtonStyled";
import FormModal from "@/components/shared/FormModal";
import InputLabeled from "@/components/shared/InputLabeled";
import TextareaLabeled from "@/components/shared/TextareaLabeled";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MatiereCard from "@/components/shared/MatiereCard";

export default function SubjectModerator() {
  const {
    classMatieres = [],
    userClasse,
    createSubject,
    deleteSubject,
    updateSubject,
  } = useOutletContext() || {};

  const [open, setOpen] = useState(false);
  const [updated, setUpdated] = useState(null);
  const isEditing = Boolean(updated);

  const [newData, setNewData] = useState({
    name: "",
    description: "",
    coefficient: "",
    semester: "",
  });

  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(false);

  // Synchronisation du formulaire à l'ouverture en modification ou création
  useEffect(() => {
    if (updated) {
      setNewData({
        name: updated.name || updated.titre || updated.nom || "",
        description: updated.description || "",
        coefficient: updated.coefficient ?? updated.coef ?? "",
        semester: updated.semester || updated.semestre || "",
      });
    } else {
      setNewData({
        name: "",
        description: "",
        coefficient: "",
        semester: "",
      });
    }
  }, [updated]);

  // Réinitialiser l'état 'updated' lorsque le modal se ferme
  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setUpdated(null);
      setErreur(null);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setErreur(null);

    try {
      if (isEditing) {
        await updateSubject(updated.id, newData);
      } else {
        await createSubject(newData, userClasse?.id);
      }

      // Fermeture et réinitialisation UNIQUEMENT en cas de succès
      setOpen(false);
      setUpdated(null);
      setNewData({
        name: "",
        description: "",
        coefficient: "",
        semester: "",
      });
    } catch (err) {
      setErreur(`Erreur : ${err?.message || "Une erreur est survenue"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteSubject(id);
    } catch (err) {
      setErreur(err?.message || "Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (subject) => {
    setUpdated(subject);
    setOpen(true);
  };

  const handleOpenCreate = () => {
    setUpdated(null);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Gestion des matières</h1>
        <ButtonStyled onClick={handleOpenCreate}>
          Ajouter un étudiant
        </ButtonStyled>
      </div>

      {erreur && (
        <div className="p-3 bg-destructive/15 text-destructive rounded-md text-sm">
          {erreur}
        </div>
      )}

      <FormModal
        open={open}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        error={erreur}
        loading={loading}
        submitLabel={isEditing ? "Modifier" : "Créer"}
        title={
          isEditing ? "Modifier la matière" : "Ajouter une nouvelle matière"
        }
        description="Cette matière sera affectée uniquement à votre classe."
        onCancel={() => {
          setUpdated(null);
          setOpen(false);
        }}
      >
        <InputLabeled
          label="Nom de la matière"
          name="name"
          value={newData.name}
          setValue={setNewData}
        />
        <TextareaLabeled
          label="Description"
          id="description"
          name="description"
          value={newData.description}
          setValue={setNewData}
          placeholder="Matière obligatoire"
        />
        <div className="grid grid-cols-2 gap-2">
          <InputLabeled
            type="number"
            label="Coefficient"
            value={newData.coefficient}
            setValue={setNewData}
            name="coefficient"
          />
          <InputLabeled
            type="text"
            label="Semestre actuel"
            value={newData.semester}
            setValue={setNewData}
            name="semester"
          />
        </div>
      </FormModal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classMatieres.map((matiere) => (
          <MatiereCard
            matiere={matiere}
            key={matiere.id}
            onDelete={() => handleDelete(matiere.id)}
            onUpdate={() => handleUpdate(matiere)}
          />
        ))}
      </div>
    </div>
  );
}
