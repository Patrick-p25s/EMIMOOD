import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

const TYPES_DOCUMENT = [
  { value: "cours", label: "Cours" },
  { value: "td", label: "Travaux dirigés" },
  { value: "examen", label: "Examen" },
];

export default function DocumentFilterBar({
  filters,
  onChange,
  classes = [],
  matieres = [],
  showClasseFilter = false,
}) {
  const hasActiveFilters =
    filters.search || filters.typeDocument || filters.classeId;

  const resetFilters = () => {
    onChange({ search: "", typeDocument: "", classeId: "" });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-wrap">
      <div className="relative flex-1 min-w-50">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un document..."
          className="pl-8"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      <Select
        value={filters.typeDocument || "all"}
        onValueChange={(val) =>
          onChange({ typeDocument: val === "all" ? "" : val })
        }
      >
        <SelectTrigger className="w-full sm:w-42.5">
          <SelectValue placeholder="Type de document" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
          {TYPES_DOCUMENT.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.matiereId || "all"}
        onValueChange={(val) =>
          onChange({ matiereId: val === "all" ? "" : val })
        }
      >
        <SelectTrigger className="w-full sm:w-42.5">
          <SelectValue placeholder="Type de document" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les matières</SelectItem>
          {matieres.map((mat) => (
            <SelectItem key={mat.id} value={mat.id}>
              {mat.titre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={resetFilters}
        >
          <X className="h-3.5 w-3.5" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
