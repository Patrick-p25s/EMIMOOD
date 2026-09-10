// components/moderator/AnnouncementDialog.jsx
import React, { useState } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InputLabeled from "@/components/shared/InputLabeled";
import useAnnonce from "@/hooks/useAnnonce"; // à adapter selon ton hook
import FormModal from "@/components/shared/FormModal";

export default function AnnouncementDialog({ classeId, onOpen, onOpenChange }) {
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
      setError(err?.message || "Erreur lors de la publication de l'annonces.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      onSubmit={handleSubmit}
      onOpenChange={onOpenChange}
      open={onOpen}
      error={error}
      loading={loading}
    >
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
          onChange={(e) => setForm((p) => ({ ...p, contenu: e.target.value }))}
          placeholder="Détaillez votre annonce..."
          rows={5}
          required
        />
      </div>
    </FormModal>
  );
}
