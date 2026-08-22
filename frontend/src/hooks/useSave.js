import { saveData } from "@/fake/sauvegarde";
import { useState } from "react";
import useDocument from "./useDocument";

export function useSave() {
  const [saved, setSaved] = useState(saveData);
  const { documents } = useDocument();
  const saveDocument = async (userId, documentId) => {
    const newSave = {
      id: crypto.randomUUID(),
      user_id: userId,
      document_id: documentId,
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
    };
    setSaved((prev) => [...prev, newSave]);
  };

  const deleteSave = async (documentId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return setSaved((save) => save.filter((s) => s.id !== documentId));
  };

  const getMyDocument = async (userId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return documents.filter((docs) => docs.owner_id === userId);
  };

  return { saved, saveDocument, deleteSave, getMyDocument };
}
