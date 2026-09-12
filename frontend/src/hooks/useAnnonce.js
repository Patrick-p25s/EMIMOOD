import { annonceData } from "@/mocks/annonce";
import { useState } from "react";

export default function useAnnonce() {
  const [annonces, setAnnonces] = useState(annonceData);

  const createAnnonce = async (annonce, classeId, auteurId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newAnnonce = {
      id: crypto.randomUUID(),
      titre: annonce.titre,
      contenu: annonce.contenu,
      important: annonce.important ?? false,
      classe_id: classeId,
      auteur_id: auteurId,
      statut: "active",
      created_at: new Date().toISOString(),
    };

    // Correctement ajouté au state
    setAnnonces((prev) => [newAnnonce, ...prev]);
    return newAnnonce;
  };

  const archiveAnnonce = async (annonceId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAnnonces((prev) =>
      prev.map((annonce) =>
        annonce.id === annonceId ? { ...annonce, statut: "archivee" } : annonce,
      ),
    );
  };

  const getActiveAnnonce = async (classeId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Filtrage avec le return explicite et condition corrigée
    return annonces.filter(
      (ann) =>
        ann.statut === "active" &&
        (ann.classe_id === classeId || ann.classe_id === null),
    );
  };

  const deleteAnnonce = async (annonceId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAnnonces((prev) => prev.filter((annonce) => annonce.id !== annonceId));
  };

  const updateAnnonce = async (annonceId, newAnnonce) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let updatedItem = null;

    setAnnonces((prev) =>
      prev.map((annonce) => {
        if (annonce.id === annonceId) {
          updatedItem = {
            ...annonce,
            titre: newAnnonce.titre,
            contenu: newAnnonce.contenu,
            important: newAnnonce.important,
            updated_at: new Date().toISOString(),
          };
          return updatedItem;
        }
        return annonce;
      }),
    );

    return updatedItem;
  };

  return {
    annonces,
    createAnnonce,
    updateAnnonce,
    deleteAnnonce,
    archiveAnnonce,
    getActiveAnnonce,
  };
}
