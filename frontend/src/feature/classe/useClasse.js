import { classeData } from "@/fake/classe";
import React, { useState } from "react";

export default function useClasse() {
  const [classes, setClasses] = useState(classeData);

  const createClasse = async (classeData, year_id) => {
    // 2. Simulation d'un appel réseau (Syntaxe corrigée)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (year_id.trim() === "") {
      throw new Error("Impossible de créer une classe sans année active");
    }
    // 3. Construction du nouvel objet
    const newClasse = {
      id: crypto.randomUUID(), // ID unique et robuste
      mention: classeData.mention,
      niveau: classeData.label,
      code_invitation: Date.now(),
      year_id: year_id,
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
    };

    // 4. Mise à jour avec la fonction de rappel (évite les stale closures)
    setClasses((prevClasses) => [...prevClasses, newClasse]);

    return newClasse;
  };

  const updateClasse = async (id, mention, niveau, code_invitation) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setClasses((classe) =>
      classe.id === id
        ? {
            ...classe,
            mention: mention,
            niveau: niveau,
            code_invitation: code_invitation,
          }
        : classe,
    );
    return classes;
  };

  const deleteClasse = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setClasses((prevClasse) => prevClasse.filter((y) => y.id !== id));
  };

  return { classes, createClasse, updateClasse, deleteClasse };
}
