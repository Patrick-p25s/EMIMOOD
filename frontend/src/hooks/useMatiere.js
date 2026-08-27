import { subjectData } from "@/fake/matiere";
import { useState } from "react";

export default function useMatiere() {
  const [matieres, setMatieres] = useState(subjectData);

  const createSubject = async (data, classeId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newSubject = {
      id: crypto.randomUUID(),
      name: data.name,
      nom: data.name, // Doublon de sécurité pour l'UI
      description: data.description,
      coefficient: Number(data.coefficient) || 1,
      semester: data.semester,
      semestre: data.semester, // Doublon de sécurité pour l'UI
      classe_id: classeId,
    };

    setMatieres((prev) => [...prev, newSubject]);
    return newSubject;
  };

  const updateSubject = async (id, newData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    setMatieres((prev) =>
      prev.map((matiere) =>
        matiere.id === id
          ? {
              ...matiere,
              ...newData,
              nom: newData.name || matiere.nom,
              semester: newData.semester || matiere.semester,
            }
          : matiere,
      ),
    );
  };

  const deleteSubject = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setMatieres((prev) => prev.filter((mat) => String(mat.id) !== String(id)));
  };

  return {
    matieres,
    setMatieres,
    createSubject,
    updateSubject,
    deleteSubject,
  };
}
