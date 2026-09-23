import AnnonceItem from "@/components/shared/AnnonceItem";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import FormModal from "@/components/shared/FormModal";
import InputLabeled from "@/components/shared/InputLabeled";
import TextareaLabeled from "@/components/shared/TextareaLabeled";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Plus, Star } from "lucide-react";
import useAnnonce from "@/hooks/useAnnonce";
import React, { useEffect, useMemo, useState } from "react";
import AlertBox from "@/components/shared/AlertBox";

export default function AnnoncesAdministration() {
  const {
    annonces,
    activeAnnonce,
    archivedAnnonce,
    loading,
    error,
    stats,
    getReadingStat,
    add,
    update,
    remove,
    archive,
    active,
  } = useAnnonce();

  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [updated, setUpdated] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filteredAnnonces = useMemo(() => {
    if (filter === "active") return activeAnnonce;
    if (filter === "archive") return archivedAnnonce;
    return annonces;
  }, [filter, annonces, activeAnnonce, archivedAnnonce]);

  console.log(stats);

  const cancelUpdate = () => {
    setUpdated(null);
    setOpen(false);
  };

  const handleEdit = (annonce) => {
    setUpdated(annonce);
    setOpen(true);
  };

  const handleDelete = async (annonce) => {
    if (!annonce?.id) return;
    setActionError(null);
    setActionLoading(true);
    try {
      await remove(annonce.id);
    } catch (err) {
      setActionError(`Erreur : ${err.message?.toString()}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async (annonceId) => {
    setActionError(null);
    setActionLoading(true);
    try {
      await archive(annonceId);
    } catch (err) {
      setActionError(`Erreur : ${err.message?.toString()}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleActive = async (annonceId) => {
    setActionError(null);
    setActionLoading(true);
    try {
      await active(annonceId);
    } catch (err) {
      setActionError(`Erreur : ${err.message?.toString()}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Gestion des annonces</h1>
            <p className="text-sm text-muted-foreground">
              Visibles par tous les utilisateurs de la plateforme
            </p>
          </div>
        </div>
        <ButtonStyled className="gap-1.5" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Ajouter
        </ButtonStyled>
      </div>

      {(error || actionError) && (
        <AlertBox title="Un erreur se produit" variant="error">
          {actionError || error?.message}
        </AlertBox>
      )}

      {/* Filtres */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">
            Tout{" "}
            <Badge variant="secondary" className="ml-1.5">
              {annonces.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active">
            Actives{" "}
            <Badge variant="secondary" className="ml-1.5">
              {activeAnnonce.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="archive">
            Archivées{" "}
            <Badge variant="secondary" className="ml-1.5">
              {archivedAnnonce.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <AnnonceForm
        onOpen={setOpen}
        open={open}
        onCreate={add}
        onUpdate={update}
        updated={updated}
        onCancel={cancelUpdate}
      />

      {/* Liste */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : filteredAnnonces.length <= 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center border border-dashed rounded-xl text-muted-foreground">
          <Megaphone className="h-8 w-8" />
          <p className="text-sm">
            Aucune annonce disponible dans cette catégorie.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAnnonces.map((annonce) => (
            <AnnonceItem
              annonce={annonce}
              key={annonce.id}
              onGetStat={getReadingStat}
              loading={actionLoading}
              onDelete={() => handleDelete(annonce)}
              onArchive={() => handleArchive(annonce.id)}
              onEdit={() => handleEdit(annonce)}
              onUnarchive={() => handleActive(annonce.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AnnonceForm({ onCreate, open, onOpen, onUpdate, updated, onCancel }) {
  const [annonceData, setAnnonceData] = useState({
    titre: "",
    contenu: "",
    important: false,
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
      setAnnonceData({ titre: "", contenu: "", important: false });
    }
  }, [updated]);

  const handleSubmit = async () => {
    setErreur(null);
    setLoading(true);
    try {
      if (isEditing) {
        await onUpdate(updated.id, annonceData);
      } else {
        await onCreate(annonceData);
      }
      onCancel();
    } catch (err) {
      setErreur(`Erreur : ${err.message?.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      onOpenChange={(v) => {
        onOpen(v);
        if (!v) onCancel();
      }}
      title={isEditing ? "Modifier l'annonce" : "Ajouter une annonce"}
      description="Tout ce que vous écrivez ici sera visible par tous les étudiants."
      onSubmit={handleSubmit}
      error={erreur}
      loading={loading}
      submitLabel={isEditing ? "Modifier" : "Envoyer"}
    >
      <InputLabeled
        value={annonceData.titre}
        setValue={setAnnonceData}
        name="titre"
        label="Titre de l'annonce"
        placeholder="Ex: Rentrée du second semestre"
      />

      <TextareaLabeled
        label="Contenu"
        id="contenu"
        value={annonceData.contenu}
        setValue={setAnnonceData}
        placeholder="Décrivez votre annonce..."
      />

      <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500" />
          <Label htmlFor="important" className="cursor-pointer">
            Marquer comme importante
          </Label>
        </div>
        <Switch
          id="important"
          checked={annonceData.important}
          onCheckedChange={(checked) =>
            setAnnonceData((prev) => ({ ...prev, important: checked }))
          }
        />
      </div>
    </FormModal>
  );
}
