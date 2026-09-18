import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputLabeled from "./InputLabeled";
import SelectLabeled from "./SelectLabeled";
import { label } from "framer-motion/client";

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
      <SelectLabeled
        value={filters.matiereId}
        id="matiereId"
        setValue={onChange}
        options={[
          { value: "all", label: "Tous les matière" },
          ...matieres.map((f) => ({ value: f.id, label: f.name })),
        ]}
        label="Matière"
        placeholder="Matière"
      />
      {/* <Select
        value={filters.matiereId || "all"}
        onValueChange={(val) =>
          onChange({ matiereId: val === "all" ? "" : val })
        }
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Matière" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les matières</SelectItem>
          {matieres.map((m) => (
            <SelectItem key={m.id} value={String(m.id)}>
              {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}

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
      {/* <Select
        value={filters.typeDocument || "all"}
        onValueChange={(val) =>
          onChange({ typeDocument: val === "all" ? "" : val })
        }
      >
        <SelectTrigger className="w-full sm:w-35">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
          {TYPES_DOCUMENT.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}

      {/* Dossier */}
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
      {/* <Select
        value={filters.dossierId || "all"}
        onValueChange={(val) =>
          onChange({ dossierId: val === "all" ? "" : val })
        }
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Dossier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les dossiers</SelectItem>
          {dossiers.map((d) => (
            <SelectItem key={d.id} value={String(d.id)}>
              {d.nom}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}

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
