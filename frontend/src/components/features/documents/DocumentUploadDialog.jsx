import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import InputLabeled from "@/components/common/forms/InputLabeled";
import TextareaLabeled from "@/components/common/forms/TextareaLabeled";
import { FileCheck2, Star, UploadCloud } from "lucide-react";
import FormModal from "@/components/common/forms/FormModal";
import SelectLabeled from "@/components/common/forms/SelectLabeled";
import { Switch } from "@/components/ui/switch";

const buildFileMeta = (file) => ({
  file,
  fichierNom: file.name,
  mimeType: file.type,
  tailleOctets: file.size,
});

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
    typeDocument: "cours",
    matiereId: "",
    dateLimite: "",
    proposerPubliquement: true,
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAssignment = ["td", "tp", "devoir"].includes(form.typeDocument);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);

    if (!file) {
      setError("Sélectionnez un fichier avant de téléverser le document.");
      return;
    }

    setLoading(true);

    try {
      const documentData = {
        titre: form.titre,
        description: form.description,
        typeDocument: form.typeDocument,
        dateLimite: isAssignment && form.dateLimite ? form.dateLimite : null,
        proposerPubliquement: form.proposerPubliquement,
        matiereId: form.matiereId,
        ...buildFileMeta(file),
      };

      await onCreate(documentData);

      setForm({
        titre: "",
        description: "",
        typeDocument: "cours",
        matiereId: "",
        dateLimite: "",
        proposerPubliquement: true,
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
      <SelectLabeled
        placeholder="Sélectionner le type"
        value={form.typeDocument}
        setValue={setForm}
        options={[
          { value: "cours", label: "Cours" },
          { value: "td", label: "Travaux dirigés" },
          { value: "tp", label: "Travaux pratiques" },
          { value: "examen", label: "Examen" },
        ]}
        id="typeDocument"
      />

      {/* Sélection de la Matière */}
      {matieres.length > 0 && (
        <SelectLabeled
          options={matieres}
          value={form.matiereId}
          id="matiereId"
          setValue={setForm}
          placeholder="Choisir matiere"
        />
      )}
      <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500" />
          <Label htmlFor="important" className="cursor-pointer">
            Proposer au public
          </Label>
        </div>
        <Switch
          id="important"
          checked={form.proposerPubliquement}
          onCheckedChange={(checked) =>
            setForm((prev) => ({ ...prev, proposerPubliquement: checked }))
          }
        />
      </div>

      {/* Conditionnel : Date limite uniquement si TD/TP/Devoir */}
      {isAssignment && (
        <div className="space-y-1.5">
          <Label htmlFor="dateLimite">Date limite de rendu (Optionnelle)</Label>
          <input
            id="dateLimite"
            type="datetime-local"
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={form.dateLimite}
            onChange={(e) =>
              setForm((p) => ({ ...p, dateLimite: e.target.value }))
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
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <FileCheck2 className="h-3.5 w-3.5" />
              {(file.size / 1024 / 1024).toFixed(2)} Mo · prêt à téléverser
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
