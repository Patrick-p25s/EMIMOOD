import { classeData } from "@/fake/classe";
import { useState } from "react";
import useAnnonce from "./useAnnonce";
import useStudent from "./useStudent";

export default function useClasse() {
  const [classes, setClasses] = useState(classeData);
  const { annonces: allAnnonces } = useAnnonce();
  const { students } = useStudent();

  const createClasse = async (classeDataInput, year_id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!year_id || year_id.trim() === "") {
      throw new Error("Impossible de créer une classe sans année active");
    }

    const newClasse = {
      id: crypto.randomUUID(),
      mention: classeDataInput.mention,
      niveau: classeDataInput.label,
      code_invitation: Math.random().toString(36).substring(2, 8).toUpperCase(),
      year_id: year_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setClasses((prevClasses) => [...prevClasses, newClasse]);
    return newClasse;
  };

  const updateClasse = async (id, mention, niveau, code_invitation) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let updatedItem = null;

    setClasses((prevClasses) =>
      prevClasses.map((item) => {
        if (item.id === id) {
          updatedItem = {
            ...item,
            mention,
            niveau,
            code_invitation,
            updated_at: new Date().toISOString(),
          };
          return updatedItem;
        }
        return item;
      }),
    );

    return updatedItem;
  };

  const deleteClasse = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setClasses((prevClasses) => prevClasses.filter((c) => c.id !== id));
  };

  const getAnnonces = async (classeId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return allAnnonces.filter((ann) => ann.classe_id === classeId);
  };

  const getActiveAnnonce = async (classeId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return allAnnonces.filter(
      (ann) => ann.statut === "active" && ann.classe_id === classeId,
    );
  };

  const studentByClasse = async (classeId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return students.filter((stud) => stud.classe_id === classeId);
  };

  const getStudentClasse = async (studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) {
      throw new Error("Aucun étudiant trouvé");
    }
    return classes.find((cl) => cl.id === student.classe_id);
  };

  return {
    classes,
    createClasse,
    updateClasse,
    deleteClasse,
    studentByClasse,
    getActiveAnnonce,
    getAnnonces,
    getStudentClasse,
  };
}
