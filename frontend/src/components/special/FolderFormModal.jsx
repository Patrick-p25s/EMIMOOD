import React, { useEffect, useState } from "react";
import FormModal from "@/components/shared/FormModal";
import InputLabeled from "@/components/shared/InputLabeled";

export default function FolderFormModal({
  open,
  onOpenChange,
  onCreate,
  onUpdate,
  folder,
}) {
  const [name, setName] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);

  const isEditing = Boolean(folder);

  useEffect(() => {
    setName({
      name: folder?.name || "",
      description: folder?.description || "",
    });
  }, [folder, open]);

  const handleSubmit = async () => {
    setErreur(null);
    setLoading(true);
    try {
      if (isEditing) {
        await onUpdate(folder.id, name);
      } else {
        await onCreate(name);
      }
      onOpenChange(false);
    } catch (err) {
      setErreur(err.message?.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      loading={loading}
      error={erreur}
      title={isEditing ? "Modifier le dossier" : "Nouveau dossier"}
      submitLabel={isEditing ? "Enregistrer" : "Créer"}
    >
      <InputLabeled
        label="Nom du dossier"
        name="name"
        value={name.name}
        setValue={setName}
        placeholder="Ex: Semestre 1"
        required
      />
      <InputLabeled
        label="Nom du dossier"
        name="description"
        value={name.description}
        setValue={setName}
        placeholder="Ex: Semestre 1"
        required
      />
    </FormModal>
  );
}
