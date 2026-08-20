// components/moderator/AnnouncementDialog.jsx
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
import { Textarea } from "@/components/ui/textarea";
import InputLabeled from "@/components/shared/InputLabeled";
import useAnnonce from "@/hooks/useAnnonce"; // à adapter selon ton hook

export default function AnnouncementDialog({ classeId, onClose }) {
  const [form, setForm] = useState({ titre: "", contenu: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { createAnnonce } = useAnnonce();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.titre.trim() || !form.contenu.trim()) {
      setError("Le titre et le contenu sont obligatoires.");
      return;
    }

    setLoading(true);
    try {
      await createAnnonce({ ...form, classe_id: classeId });
      setForm({ titre: "", contenu: "" });
      onClose?.();
    } catch (err) {
      setError(err?.message || "Erreur lors de la publication de l'annonce.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Nouvelle annonce</DialogTitle>
          <DialogDescription>
            Visible par tous les étudiants de votre classe.
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
            placeholder="Ex: Report de l'examen de mardi"
            required
          />

          <div className="space-y-1.5">
            <Label htmlFor="contenu">Contenu</Label>
            <Textarea
              id="contenu"
              value={form.contenu}
              onChange={(e) =>
                setForm((p) => ({ ...p, contenu: e.target.value }))
              }
              placeholder="Détaillez votre annonce..."
              rows={5}
              required
            />
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
          <Button type="submit" loading={loading} loadingText="Publication...">
            Publier
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
