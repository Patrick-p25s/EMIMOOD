import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import InputLabeled from "@/components/shared/InputLabeled";
import TextareaLabeled from "@/components/shared/TextareaLabeled";
import { UploadCloud } from "lucide-react";
import FormModal from "@/components/shared/FormModal";

export default function DocumentUploadDialog({
  matieres = [],
  open,
  onOpenChange,
  onCreate,
  ownerId,
}) {
  const [form, setForm] = useState({
    titre: "",
    description: "",
    type_document: "cours",
    matiere_id: "",
    date_limite: "",
    proposer_publique: true,
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAssignment = ["td", "tp", "devoir"].includes(form.type_document);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);

    if (!form.titre.trim() || !form.matiere_id || !file) {
      setError("Le titre, la matière et le fichier sont obligatoires.");
      return;
    }

    setLoading(true);

    try {
      // Données à transmettre au handler createDocument
      const documentData = {
        titre: form.titre,
        description: form.description,
        type_document: form.type_document,
        date_limite: isAssignment && form.date_limite ? form.date_limite : null,
        proposer_publique: form.proposer_publique,
        file: file, // Optionnel si traité plus tard avec FormData
        taille_octets: file.size,
        fichier_path: URL.createObjectURL(file), // Mock URL temporaire pour la prévisualisation
      };

      await onCreate(documentData, form.matiere_id, ownerId);

      // Reinitialisation du formulaire à la fermeture
      setForm({
        titre: "",
        description: "",
        type_document: "cours",
        matiere_id: "",
        date_limite: "",
        proposer_publique: true,
      });
      setFile(null);
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || "Erreur lors de l'upload du document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      onOpenChange={onOpenChange}
      open={open}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      title="Ajouter un nouveau document"
      submitLabel="Téléverser"
    >
      <InputLabeled
        label="Titre du document"
        name="titre"
        value={form.titre}
        setValue={setForm}
        placeholder="Ex: TD1 - Structures de données"
        required
      />

      {/* Sélection du Type de Document */}
      <div className="space-y-1.5">
        <Label htmlFor="type_document">Type de document</Label>
        <Select
          value={form.type_document}
          onValueChange={(val) =>
            setForm((p) => ({ ...p, type_document: val }))
          }
        >
          <SelectTrigger id="type_document">
            <SelectValue placeholder="Sélectionner le type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cours">Cours</SelectItem>
            <SelectItem value="td">Travaux Dirigés (TD)</SelectItem>
            <SelectItem value="tp">Travaux Pratiques (TP)</SelectItem>
            <SelectItem value="examen">Examen / Controle</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sélection de la Matière */}
      <div className="space-y-1.5">
        <Label htmlFor="matiere">Matière</Label>
        <Select
          value={form.matiere_id}
          onValueChange={(val) => setForm((p) => ({ ...p, matiere_id: val }))}
        >
          <SelectTrigger id="matiere">
            <SelectValue placeholder="Sélectionner une matière" />
          </SelectTrigger>
          <SelectContent>
            {matieres?.map((m) => (
              <SelectItem key={m.id} value={String(m.id)}>
                {m.name || m.titre || m.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Conditionnel : Date limite uniquement si TD/TP/Devoir */}
      {isAssignment && (
        <div className="space-y-1.5">
          <Label htmlFor="date_limite">
            Date limite de rendu (Optionnelle)
          </Label>
          <input
            id="date_limite"
            type="datetime-local"
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={form.date_limite}
            onChange={(e) =>
              setForm((p) => ({ ...p, date_limite: e.target.value }))
            }
          />
        </div>
      )}

      <TextareaLabeled
        label="Description (Optionnelle)"
        id="description"
        name="description"
        value={form.description}
        setValue={setForm}
        placeholder="Informations ou consignes relatives au document..."
      />

      {/* Upload de fichier */}
      <div className="space-y-1.5">
        <Label htmlFor="fichier">Fichier joint</Label>
        <label
          htmlFor="fichier"
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-5 cursor-pointer hover:bg-muted/50 transition-colors text-sm text-muted-foreground"
        >
          <UploadCloud className="h-6 w-6 text-primary" />
          <span className="font-medium text-foreground">
            {file ? file.name : "Cliquez pour choisir un fichier"}
          </span>
          {file && (
            <span className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} Mo
            </span>
          )}
          <input
            id="fichier"
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>
    </FormModal>
  );
}
