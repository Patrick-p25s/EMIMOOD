import { anneeUniv } from "@/fake/year";
import { useState } from "react";

export default function useYear() {
  const [years, setYears] = useState(anneeUniv);

  const createYear = async (yearData) => {
    // 1. Validation immédiate (évite de patienter pour rien)
    const labelTrimmed = yearData.label?.trim().toLowerCase();

    if (!labelTrimmed) {
      throw new Error("Le libellé est obligatoire");
    }

    const exist = years.some(
      (year) => year.label.toLowerCase() === labelTrimmed,
    );

    if (exist) {
      throw new Error("Cette année universitaire existe déjà");
    }

    // 2. Simulation d'un appel réseau (Syntaxe corrigée)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 3. Construction du nouvel objet
    const newYear = {
      id: crypto.randomUUID(), // ID unique et robuste
      label: yearData.label.trim(),
      start_at: yearData.start_at,
      end_at: yearData.end_at,
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
    };

    // 4. Mise à jour avec la fonction de rappel (évite les stale closures)
    setYears((prevYears) => [...prevYears, newYear]);

    return newYear;
  };

  const updateYear = async (id, yearData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setYears((year) =>
      year.id === id
        ? {
            ...year,
            label: yearData.label,
            start_at: yearData.label,
            end_at: yearData.end_at,
          }
        : year,
    );
    return years;
  };

  const deleteYear = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setYears((prevYear) => prevYear.filter((y) => y.id !== id));
  };

  const activeYear = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setYears((prevYear) =>
      prevYear.map((year) =>
        year.id === id
          ? { ...year, is_active: true }
          : { ...year, is_active: false },
      ),
    );
  };

  const getActiveYear = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const foundYear = years.find((year) => year.is_active);
    if (!foundYear) {
      throw new Error("Aucune année actif");
    }
    return foundYear;
  };

  return {
    years,
    createYear,
    updateYear,
    deleteYear,
    activeYear,
    getActiveYear,
  };
}
