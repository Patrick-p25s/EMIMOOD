// components/moderator/DocumentUploadDialog.jsx
import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import InputLabeled from "@/components/shared/InputLabeled";
import { UploadCloud } from "lucide-react";
import useDocument from "@/hooks/useDocument";

export default function DocumentUploadDialog({ matieres, onClose }) {
  const [form, setForm] = useState({ titre: "", matiere_id: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { uploadDocument } = useDocument();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.titre.trim() || !form.matiere_id || !file) {
      setError("Titre, matière et fichier sont obligatoires.");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("titre", form.titre);
      payload.append("matiere_id", form.matiere_id);
      payload.append("fichier", file);
      payload.append("statut", "publique"); // publié direct par le modérateur

      await uploadDocument(payload);
      setForm({ titre: "", matiere_id: "" });
      setFile(null);
      onClose?.();
    } catch (err) {
      setError(err?.message || "Erreur lors de l'upload du document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
          <DialogDescription>
            Publié directement dans les documents publics de la classe.
          </DialogDescription>
        </DialogHeader>

        <fieldset disabled={loading} className="space-y-4 py-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <InputLabeled
            label="Titre"
            name="titre"
            value={form.titre}
            setValue={setForm}
            placeholder="Ex: Cours - Chapitre 3"
            required
          />

          <div className="space-y-1.5">
            <Label htmlFor="matiere">Matière</Label>
            <Select
              value={form.matiere_id}
              onValueChange={(val) =>
                setForm((p) => ({ ...p, matiere_id: val }))
              }
            >
              <SelectTrigger id="matiere">
                <SelectValue placeholder="Sélectionner une matière" />
              </SelectTrigger>
              <SelectContent>
                {matieres.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fichier">Fichier</Label>
            <label
              htmlFor="fichier"
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors text-sm text-muted-foreground"
            >
              <UploadCloud className="h-6 w-6" />
              {file ? file.name : "Cliquez pour choisir un fichier"}
              <input
                id="fichier"
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </fieldset>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button type="submit" loading={loading} loadingText="Envoi...">
            Publier le document
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
