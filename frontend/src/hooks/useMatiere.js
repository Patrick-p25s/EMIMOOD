import { subjectData } from "@/fake/matiere";
import { useState } from "react";

export default function useMatiere() {
  const [matieres, setMatieres] = useState(subjectData);

  const createSubject = async (data, classeId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newSubject = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      coefficient: data.coefficient,
      semester: data.semester,
      classe_id: classeId,
    };
    setMatieres([...matieres, newSubject]);
  };
  const updateSubject = async (id, newData) => {
    setMatieres((prev) =>
      prev.filter((matiere) =>
        matiere.id === id
          ? {
              ...matiere,
              name: newData.name,
              description: newData.description,
              coefficient: newData.coefficient,
            }
          : matiere,
      ),
    );
  };
  const deleteSubject = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMatieres((prev) => prev.filter((mat) => mat.id !== id));
  };

  return { matieres, createSubject, updateSubject, deleteSubject };
}
