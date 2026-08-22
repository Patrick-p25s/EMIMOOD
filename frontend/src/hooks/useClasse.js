import { classeData } from "@/fake/classe";
import { useState } from "react";
import useAnnonce from "./useAnnonce";
import useStudent from "./useStudent";
import useMatiere from "./useMatiere";
import useDocument from "./useDocument";

export default function useClasse() {
  const [classes, setClasses] = useState(classeData);
  const { annonces } = useAnnonce();
  const { students } = useStudent();
  const { matieres } = useMatiere();
  const { documents } = useDocument();
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

  const regenerateCodeClasse = async (classId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    setClasses((prevClasses) =>
      prevClasses.map((cl) =>
        cl.id === classId ? { ...cl, code_invitation: newCode } : cl,
      ),
    );

    return newCode;
  };

  const updateClasse = async (id, mention, niveau) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let updatedItem = null;

    setClasses((prevClasses) =>
      prevClasses.map((item) => {
        if (item.id === id) {
          updatedItem = {
            ...item,
            mention,
            niveau,
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

  // const getClasseAnnonce = async (classeId) => {
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   return annonces.filter((ann) => ann.classe_id === classeId);
  // };

  // const getClasseActiveAnnonce = async (classeId) => {
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   return annonces.filter(
  //     (ann) => ann.statut === "active" && ann.classe_id === classeId,
  //   );
  // };

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

  const getClasseSubject = (classeId) => {
    const matiere = matieres.filter((matier) => matier.classe_id === classeId);
    return matiere;
  };

  // const getClasseSubjectsIds = getClasseSubject.map((cl) => cl.id);

  const getClasseDocuments = async (classeId) => {
    const matiere = await getClasseSubject(-classeId);
    const matieresIds = matiere.map((cl) => cl.id);
    const matiereSet = new Set(matieresIds.map(String));

    return documents.filter((doc) => matiereSet.has(String(doc.matiere_id)));
  };
  return {
    classes,
    getClasseDocuments,
    regenerateCodeClasse,
    createClasse,
    updateClasse,
    deleteClasse,
    studentByClasse,
    getStudentClasse,
    getClasseSubject,
  };
}
