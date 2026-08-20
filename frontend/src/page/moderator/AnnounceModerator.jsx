import AnnonceItem from "@/components/shared/AnnonceItem";
import React from "react";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import FormModal from "@/components/shared/FormModal";
import InputLabeled from "@/components/shared/InputLabeled";
import TextareaLabeled from "@/components/shared/TextareaLabeled";
export default function AnnounceModerator() {
  const {
    userClasse,
    allAnnonces,
    archiveAnnonce,
    deleteAnnonce,
    updateAnnonce,
    createAnnonce,
  } = useOutletContext();

  const [open, setOpen] = useState(false);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null); // Pour l'édition si besoin
  const isEditing = Boolean(selectedAnnonce);

  const [newAnnonce, setNewAnnonce] = useState({
    titre: "",
    contenu: "",
    important: false,
  });

  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(false);

  // Réinitialisation propre à la fermeture du modal
  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedAnnonce(null);
      setErreur(null);
      setNewAnnonce({ titre: "", contenu: "", important: false });
    }
  };

  const handleArchive = (annonce) => {
    const annonceId = annonce?.id || annonce;
    if (!annonceId) return;

    if (
      !window.confirm(
        "Voulez-vous vraiment archiver cet annonce de la classe ?",
      )
    )
      return;

    setLoading(true);
    try {
      archiveAnnonce(annonceId);
    } catch (e) {
      setErreur(e?.message || "Erreur lors de la suppression de l'étudiant.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setErreur(null);
    setLoading(true);

    try {
      if (isEditing) {
        if (updateAnnonce) await updateAnnonce(selectedAnnonce.id, newAnnonce);
      } else {
        if (userClasse) {
          await createAnnonce(newAnnonce, userClasse.id);
        } else {
          setErreur("Pas de classe séléctionne");
        }
      }

      // Fermeture et réinitialisation SEULEMENT si la requête réussit
      handleOpenChange(false);
    } catch (e) {
      setErreur(
        e?.message || "Une erreur est survenue lors de l'enregistrement.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (annonce) => {
    const annonceId = annonce?.id || annonce;
    if (!annonceId) return;

    if (
      !window.confirm("Voulez-vous vraiment retirer cet annonce de la classe ?")
    )
      return;

    setLoading(true);
    try {
      deleteAnnonce(annonceId);
    } catch (e) {
      setErreur(e?.message || "Erreur lors de la suppression de l'étudiant.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (annonce) => {
    setSelectedAnnonce(annonce);
    setNewAnnonce({
      titre: annonce.titre || "",
      contenu: annonce.contenu || "",
      important: annonce.important || false,
    });
    setOpen(true);
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Gestion des annonces</h1>
        <ButtonStyled onClick={() => setOpen(true)}>
          Ajouter une annonces
        </ButtonStyled>
      </div>

      <FormModal
        open={open}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        error={erreur}
        loading={loading}
        title={isEditing ? "Modifier une annonce" : "Créer une annonces"}
        submitLabel={isEditing ? "Modifier" : "Créer"}
      >
        <InputLabeled
          name="titre"
          value={newAnnonce.titre}
          setValue={setNewAnnonce}
          label="Entrez la titre d'annonce"
        />
        <TextareaLabeled
          id="contenu"
          value={newAnnonce.contenu}
          setValue={setNewAnnonce}
          label="Explication d'annonce"
        />
      </FormModal>
      {erreur && (
        <div className="p-3 bg-destructive/15 text-destructive rounded-md text-sm">
          {erreur}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAnnonces.map((annonce) => (
          <AnnonceItem
            annonce={annonce}
            key={annonce.id}
            onArchive={() => handleArchive(annonce)}
            onEdit={() => handleUpdate(annonce)}
            onDelete={() => handleDelete(annonce)}
          />
        ))}
      </div>
    </div>
  );
}
