import React, { useState } from "react";
import { ButtonStyled } from "@/components/shared/ButtonStyled";

export default function YearItem({ year, onDelete, onActive }) {
  // Un seul état pour suivre l'action spécifique en cours ('delete' | 'active' | null)
  const [activeAction, setActiveAction] = useState(null);
  const [error, setError] = useState(null);

  const handleAction = async (actionType, actionFn) => {
    if (!actionFn) return;

    setError(null);
    setActiveAction(actionType);

    try {
      await actionFn(year.id);
    } catch (err) {
      setError(err?.message || "Une erreur est survenue");
    } finally {
      setActiveAction(null);
    }
  };

  const isDeleting = activeAction === "delete";
  const isActiveLoading = activeAction === "active";
  const isLoading = activeAction !== null;

  return (
    <div className={year.is_active ? "text-green-500" : "text-red-500"}>
      <h1>{year.label}</h1>
      <p>{year.start_at}</p>
      <p>{year.end_at}</p>

      {/* Affichage des erreurs si l'action échoue */}
      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

      <div className="flex gap-2 mt-2">
        <ButtonStyled
          variant="destructive"
          loading={isDeleting}
          loadingText="Suppression en cours"
          onClick={() => handleAction("delete", onDelete)}
          disabled={isLoading}
        >
          Supprimer
        </ButtonStyled>

        {!year.is_active && (
          <ButtonStyled
            loading={isActiveLoading}
            loadingText="Activation en cours"
            onClick={() => handleAction("active", onActive)}
            disabled={isLoading}
          >
            Activer
          </ButtonStyled>
        )}
      </div>
    </div>
  );
}
