import { createContext, useContext, useState } from "react";
import { anneeUniv } from "@/fake/year";
// 1. On crée le "contenant" du contexte
const AnneeContext = createContext(null);

//    et fournir l'année active + les fonctions pour la changer
export function AnneeProvider({ children }) {
  // On cherche l'année marquée "active" dans les mocks, au démarrage
  const anneeParDefaut = anneeUniv.find((a) => a.active) || anneeUniv[0];

  const [annees, setAnnees] = useState(anneeUniv);
  const [anneeActive, setAnneeActive] = useState(anneeParDefaut);

  // Changer l'année active (ex: l'admin sélectionne une autre année)
  function changerAnneeActive(anneeId) {
    const nouvelle = annees.find((a) => a.id === anneeId);
    if (nouvelle) {
      setAnneeActive(nouvelle);
    }
  }

  // Créer une nouvelle année universitaire
  function creerAnnee(libelle) {
    const nouvelleAnnee = {
      id: Date.now(), // simple id temporaire pour le mock
      libelle,
      active: false,
    };
    setAnnees((prev) => [...prev, nouvelleAnnee]);
  }

  // Tout ce qu'on met ici devient accessible partout via useAnnee()
  const value = {
    annees,
    anneeActive,
    changerAnneeActive,
    creerAnnee,
  };

  return (
    <AnneeContext.Provider value={value}>{children}</AnneeContext.Provider>
  );
}

// 3. Un petit hook pratique pour éviter d'écrire useContext(AnneeContext)
//    partout dans le code
export function useAnnee() {
  const context = useContext(AnneeContext);
  if (!context) {
    throw new Error(
      "useAnnee doit être utilisé à l'intérieur d'un AnneeProvider",
    );
  }
  return context;
}
