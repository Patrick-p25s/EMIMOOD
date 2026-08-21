import AnnonceItem from "@/components/shared/AnnonceItem";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import FormCard from "@/components/shared/FormCard";
import FormModal from "@/components/shared/FormModal";
import InputLabeled from "@/components/shared/InputLabeled";
import useAnnonce from "@/hooks/useAnnonce";
import React, { useEffect, useMemo, useState } from "react";
export default function Annonces() {
  const {
    annonces,
    deleteAnnonce,
    archiveAnnonce,
    createAnnonce,
    updateAnnonce,
  } = useAnnonce();

  const [filter, setFilter] = useState("all");

  const [open, setOpen] = useState(false);
  const [updated, setUpdated] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(false);
  const filteredAnnonces = useMemo(() => {
    let resultat = annonces;
    if (filter !== "all") {
      resultat = resultat.filter((ann) => ann.statut === filter);
    }
    return resultat;
  }, [filter, annonces]);

  const cancelUpdate = () => {
    setUpdated(null);
    setOpen(false);
  };
  const handleEdit = (annonce) => {
    setOpen(true);
    setUpdated(annonce);
  };

  const handleDelete = async (annonce) => {
    const annonceId = annonce?.id;
    if (!annonceId) return;

    setLoading(true);
    setErreur(null);
    try {
      await deleteAnnonce(annonceId);
    } catch (error) {
      setErreur(`Erreur : ${error.message.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (annoceId) => {
    setErreur(null);
    setLoading(true);
    try {
      await archiveAnnonce(annoceId);
    } catch (error) {
      setErreur(`Erreur ${error.message.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">
          Gestion des annonces administrations
        </h1>
        <div>
          <ButtonStyled onClick={() => setOpen(true)}>Ajouter</ButtonStyled>
        </div>
      </div>

      {erreur && (
        <div className="p-3 bg-destructive/15 text-destructive rounded-md text-sm">
          {erreur}
        </div>
      )}

      <div className="flex gap-5">
        <ButtonStyled
          onClick={() => setFilter("all")}
          variant={filter === "all" ? "default" : "secondary"}
        >
          Tout
        </ButtonStyled>
        <ButtonStyled
          onClick={() => setFilter("active")}
          variant={filter === "active" ? "default" : "secondary"}
        >
          Actif
        </ButtonStyled>
        <ButtonStyled
          onClick={() => setFilter("archive")}
          variant={filter === "archive" ? "default" : "secondary"}
        >
          Archive
        </ButtonStyled>
      </div>

      <div>
        <AnnonceForm
          onOpen={setOpen}
          open={open}
          onCreate={createAnnonce}
          onUpdate={updateAnnonce}
          updated={updated}
          onCancel={cancelUpdate}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnnonces.length <= 0 ? (
          <div className="border-dashed">
            <h1 className=" text-xl pt-6 text-center text-muted-foreground">
              Aucune annonces disponible
            </h1>
          </div>
        ) : (
          filteredAnnonces.map((annonce) => (
            <AnnonceItem
              annonce={annonce}
              key={annonce.id}
              onDelete={() => handleDelete(annonce)}
              onArchive={() => handleArchive(annonce.id)}
              onEdit={() => handleEdit(annonce)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function AnnonceForm({ onCreate, open, onOpen, onUpdate, updated, onCancel }) {
  const [annonceData, setAnnonceData] = useState({
    titre: updated?.titre || "",
    contenu: updated?.contenu || "",
    important: updated?.important || false,
  });

  const isEditing = Boolean(updated);

  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    if (updated) {
      setAnnonceData({
        titre: updated.titre,
        contenu: updated.contenu,
        important: updated.important,
      });
    } else {
      setAnnonceData({
        titre: "",
        contenu: "",
        important: false,
      });
    }
  }, [updated]);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEditing) {
        await onUpdate(updated.id, annonceData);
        onUpdate;
        onCancel();
      } else {
        await onCreate(annonceData);
      }
    } catch (err) {
      setErreur(`Erreur : ${err.message.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpen}
      title="Ajouter une annonce pour tous le monde"
      description="Tous ce que vous allez ecrire ici sera accessible pour tous les étudiant"
      onSubmit={handleSubmit}
      error={erreur}
      loading={loading}
      submitLabel={isEditing ? "Modifier" : "Envoyer"}
    >
      <InputLabeled
        value={annonceData.titre}
        setValue={setAnnonceData}
        name="titre"
        label="Titre de votre annonce"
      />

      <label
        htmlFor="important"
        className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-background hover:bg-muted-foreground cursor-pointer transition-colors"
      >
        <input
          type="checkbox"
          id="important"
          checked={annonceData.important}
          onChange={(e) =>
            setAnnonceData((prev) => ({
              ...prev,
              important: e.target.checked,
            }))
          }
          className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
        />
        <span className="text-sm font-medium text-slate-700">
          Est-ce important ? ★
        </span>
      </label>

      <div>
        <label
          htmlFor="contenue"
          className="mb-1 block text-sm font-medium text-accent-foreground"
        >
          contenue de votre tâche
        </label>
        <textarea
          id="contenue"
          rows={3}
          value={annonceData.contenu}
          onChange={(e) =>
            setAnnonceData({ ...annonceData, contenu: e.target.value })
          }
          placeholder="Décrivez votre tâche..."
          className="block w-full rounded-xl border border-accent bg-background px-4 py-2.5 text-sm text-foreground placeholder-slate-400 outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/10 resize-none"
        />
      </div>
    </FormModal>
  );
}
