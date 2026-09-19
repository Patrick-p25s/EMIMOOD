import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SelectLabeled from "./SelectLabeled";
import { label } from "framer-motion/client";
import { ButtonStyled } from "./ButtonStyled";

const TYPES_DOCUMENT = [
  { value: "cours", label: "Cours" },
  { value: "td", label: "TD" },
  { value: "tp", label: "TP" },
  { value: "examen", label: "Examen" },
  { value: "corrige", label: "Corrigé" },
];

export default function FilterBar({
  filters,
  onChange,
  matieres = [],
  dossiers = [],
  classes = [],
}) {
  const hasActiveFilters =
    filters.search ||
    filters.matiereId ||
    filters.typeDocument ||
    filters.dossierId;

  const resetFilters = () => {
    onChange({ search: "", matiereId: "", typeDocument: "", dossierId: "" });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-wrap">
      {/* Recherche */}
      <div className="relative flex-1 min-w-50">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un document..."
          className="pl-8"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      {/* Matière */}
      {matieres.length > 0 && (
        <SelectLabeled
          value={filters.matiereId}
          id="matiereId"
          setValue={onChange}
          options={[
            { value: "all", label: "Tous les matière" },
            ...matieres.map((f) => ({ value: f.id, label: f.name })),
          ]}
          label="Matière"
        />
      )}

      {/* classes */}
      {classes.length > 0 && (
        <SelectLabeled
          value={filters.classeId}
          setValue={onChange}
          id="classeId"
          options={[
            { value: "all", label: "Tous les classe" },
            ...classes.map((cl) => ({
              value: cl.id,
              label: `${cl.mention} ${cl.niveau}`,
            })),
          ]}
          placeholder="Classe"
        />
      )}

      {/* Type */}
      <SelectLabeled
        value={filters.typeDocument || "all"}
        setValue={onChange}
        id="typeDocument"
        options={[
          { value: "all", label: "Tous les types" },
          ...TYPES_DOCUMENT.map((f) => ({ value: f.id, label: f.name })),
        ]}
        label="Matière"
        placeholder="Matière"
      />

      {/* Dossier */}
      {dossiers.length > 0 && (
        <SelectLabeled
          value={filters.dossierId}
          setValue={onChange}
          id="dossierId"
          options={[
            {
              value: "all",
              label: "Tous les dossier",
              ...dossiers.map((d) => ({ value: d.id, label: d.name })),
            },
          ]}
        />
      )}

      {hasActiveFilters && (
        <ButtonStyled
          variant="ghost"
          className="gap-1.5"
          onClick={resetFilters}
          icon={<X className="h-3.5 w-3.5" />}
        >
          Réinitialiser
        </ButtonStyled>
      )}
    </div>
  );
}
