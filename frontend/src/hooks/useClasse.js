import { classeData } from "@/mocks/classe";
import { useState } from "react";
import useAnnonce from "./useAnnonce";
import useStudent from "./useStudent";
import useMatiere from "./useMatiere";

export default function useClasse() {
  const [classes, setClasses] = useState(classeData);
  const { annonces: allAnnonces } = useAnnonce();
  const { students } = useStudent();
  const { matieres } = useMatiere();

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

  const regenerateCodeInvitation = async (classId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    setClasses((prevClasses) =>
      prevClasses.map((cl) =>
        cl.id === classId ? { ...cl, code_invitation: newCode } : cl,
      ),
    );

    return newCode;
  };

  const getClasseByCodeInvitation = async (code) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const found = classes.find((cl) => cl.code_invitation === code);
    if (!found) {
      throw new Error("Aucune classe trouvé");
    }
    return found;
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

  const studentByClasse = async (classeId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return students.filter((stud) => stud.classe_id === classeId);
  };

  const getStudentClasse = async (studentId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const found = await classes.find((cl) => cl.id === studentId);
    if (!found) {
      throw new Error("Aucune classe trouvé");
    }
    return found;
  };

  const getMatiere = async (classeId) => {
    if (classeId === null) {
      return await classes;
    }
    const matiere = matieres.filter((matier) => matier.classe_id === classeId);
    return matiere;
  };

  return {
    classes,
    regenerateCodeInvitation,
    getClasseByCodeInvitation,
    createClasse,
    updateClasse,
    deleteClasse,
    studentByClasse,
    getStudentClasse,
    getMatiere,
  };
}
