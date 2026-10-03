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

const STATUT_FILTER = [
  { value: "en_attente", label: "En attente" },
  { value: "rejete", label: "Rejeté" },
  { value: "public", label: "Publique" },
  { value: "prive", label: "Privé" },
];

export default function DocumentFilterBar({
  filters,
  onChange,
  classes = [],
  matieres = [],
  showClasseFilter = false,
}) {
  const hasActiveFilters =
    filters.search ||
    filters.typeDocument ||
    filters.classeId ||
    filters.statut;

  const resetFilters = () => {
    onChange({ search: "", typeDocument: "", classeId: "", statut: "" });
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative min-w-0 flex-1 sm:min-w-55">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un document..."
          className="h-10 border-transparent bg-muted/60 pl-9 shadow-none focus-visible:border-primary focus-visible:bg-background"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      <Select
        value={filters.statut || "all"}
        onValueChange={(val) => onChange({ statut: val === "all" ? "" : val })}
      >
        <SelectTrigger className="h-10 w-full bg-background sm:w-40">
          <SelectValue placeholder="Visibilité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toute visibilité</SelectItem>
          {STATUT_FILTER.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.typeDocument || "all"}
        onValueChange={(val) =>
          onChange({ typeDocument: val === "all" ? "" : val })
        }
      >
        <SelectTrigger className="h-10 w-full bg-background sm:w-40">
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
        <SelectTrigger className="h-10 w-full bg-background sm:w-40">
          <SelectValue placeholder="Matière" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les matières</SelectItem>
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
          <SelectTrigger className="h-10 w-full bg-background sm:w-40">
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
