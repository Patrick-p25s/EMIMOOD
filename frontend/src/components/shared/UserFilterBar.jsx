import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ButtonStyled } from "./ButtonStyled";

const TYPES_DOCUMENT = [
  { value: "cours", label: "Cours" },
  { value: "td", label: "TD" },
  { value: "tp", label: "TP" },
  { value: "examen", label: "Examen" },
  { value: "corrige", label: "Corrigé" },
];

export default function UserFilterBar({
  filters,
  onChange,
  classes = [],
  showClasseFilter = false,
}) {
  const hasActiveFilters = filters.search || filters.classeId;

  const resetFilters = () => {
    onChange({ search: "", classeId: "" });
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

      {/* classes */}
      {showClasseFilter && (
        <Select
          value={filters.classeId || "all"}
          onValueChange={(val) =>
            onChange({ classeId: val === "all" ? "" : val })
          }
        >
          <SelectTrigger className="w-full sm:w-42.5">
            <SelectValue placeholder="Classe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les classes</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.mention}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
