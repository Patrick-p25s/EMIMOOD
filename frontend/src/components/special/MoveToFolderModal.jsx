import React, { useState } from "react";
import FormModal from "@/components/shared/FormModal";
import SelectLabeled from "@/components/shared/SelectLabeled";
import { moveDocument } from "@/api/documentService";

export default function MoveToFolderDialog({
  open,
  onOpenChange,
  document,
  folders,
  onMoved,
}) {
  const [folderId, setFolderId] = useState({ folderId: "" });
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);

  const handleSubmit = async () => {
    if (!document) return;
    setErreur(null);
    setLoading(true);
    try {
      await moveDocument(document.id, folderId.folderId || null);
      onMoved?.(document.id, folderId.folderId || null);
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
      title="Déplacer le document"
      description={document ? `Déplacer "${document.titre}" vers :` : ""}
      submitLabel="Déplacer"
    >
      <SelectLabeled
        label="Dossier de destination"
        id="folderId"
        value={folderId.folderId}
        setValue={setFolderId}
        placeholder="Sélectionner un dossier"
        options={[
          { value: "None", label: "Aucun dossier (racine)" },
          ...folders.map((f) => ({ value: f.id, label: f.name })),
        ]}
      />
    </FormModal>
  );
}
