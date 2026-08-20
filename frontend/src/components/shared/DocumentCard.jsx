import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Edit,
  HardDrive,
  Bookmark,
  Lock,
  XCircle,
  Check,
  X,
} from "lucide-react";

export default function DocumentCard({
  document,
  isSaved: isSavedInitial = false,
  onDownload,
  onSave,
  onEdit,
  onDelete,
  onValide,
  onRejete,
}) {
  if (!document) return null;

  const [isSaved, setIsSaved] = useState(isSavedInitial);

  const {
    titre,
    description,
    date_limite,
    type_document,
    statut,
    fichier_path,
    taille_octets,
  } = document;

  const formatFileSize = (bytes) => {
    if (!bytes) return "Taille inconnue";
    const k = 1024;
    const sizes = ["Octets", "Ko", "Mo", "Go"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formattedDueDate = date_limite
    ? new Date(date_limite).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const handleSaveToggle = () => {
    const newState = !isSaved;
    setIsSaved(newState);
    if (onSave) onSave(document, newState);
  };

  // Badge dynamique selon le statut exact du document
  const renderStatusBadge = () => {
    switch (statut) {
      case "public":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 text-[11px]"
          >
            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Public
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="gap-1 border-amber-500/30 text-amber-600 bg-amber-50 dark:bg-amber-950/20 text-[11px]"
          >
            <Clock className="h-3 w-3 text-amber-600" /> En attente
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-rose-500/30 text-rose-600 bg-rose-50 dark:bg-rose-950/20 text-[11px]"
          >
            <XCircle className="h-3 w-3 text-rose-600" /> Rejeté (Privé)
          </Badge>
        );
      case "private":
      default:
        return (
          <Badge
            variant="secondary"
            className="gap-1 text-muted-foreground bg-muted text-[11px]"
          >
            <Lock className="h-3 w-3" /> Privé
          </Badge>
        );
    }
  };

  const getTypeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case "td":
        return {
          label: "TD",
          className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        };
      case "tp":
        return {
          label: "TP",
          className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
        };
      case "cours":
        return {
          label: "Cours",
          className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        };
      case "examen":
        return {
          label: "Examen",
          className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        };
      default:
        return {
          label: type?.toUpperCase() || "Doc",
          className: "bg-muted text-muted-foreground",
        };
    }
  };

  const typeInfo = getTypeBadge(type_document);

  return (
    <Card className="hover:border-primary/50 transition-all duration-200 flex flex-col justify-between hover:shadow-sm">
      <div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Badges : Type + Statut */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={`font-semibold text-[11px] ${typeInfo.className}`}
              >
                {typeInfo.label}
              </Badge>
              {renderStatusBadge()}
            </div>

            {/* Actions Administrateur / Modérateur */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Boutons d'approbation (visibles si en attente ou si fonctions fournies) */}
              {onValide && statut === "pending" && (
                <ButtonStyled
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  onClick={() => onValide(document)}
                  title="Valider la publication"
                  icon={<Check className="h-3.5 w-3.5" />}
                />
              )}
              {onRejete && statut === "pending" && (
                <ButtonStyled
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  onClick={() => onRejete(document)}
                  title="Rejeter la demande"
                  icon={<X className="h-3.5 w-3.5" />}
                />
              )}

              {/* Boutons standards Modification / Suppression */}
              {onEdit && (
                <ButtonStyled
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit(document)}
                  title="Modifier"
                  icon={<Edit className="h-3.5 w-3.5" />}
                />
              )}
              {onDelete && (
                <ButtonStyled
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(document.id)}
                  title="Supprimer"
                  icon={<Trash2 className="h-3.5 w-3.5" />}
                />
              )}
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-2">
            <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <CardTitle className="text-base font-semibold leading-tight text-foreground line-clamp-2">
              {titre}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pb-3 space-y-3">
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <HardDrive className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>{formatFileSize(taille_octets)}</span>
            </div>

            {formattedDueDate && (
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 font-medium">
                <Calendar className="h-3.5 w-3.5" />
                <span>À rendre avant le {formattedDueDate}</span>
              </div>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="pt-3 border-t border-border/60 flex items-center gap-2">
        <a
          href={fichier_path}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
          onClick={(e) => {
            if (onDownload) {
              e.preventDefault();
              onDownload(document);
            }
          }}
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-xs h-8"
          >
            <Download className="h-3.5 w-3.5" />
            Télécharger
          </Button>
        </a>

        <Button
          variant={isSaved ? "default" : "secondary"}
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={handleSaveToggle}
          title={
            isSaved
              ? "Retirer des enregistrements"
              : "Enregistrer dans mes favoris"
          }
        >
          <Bookmark
            className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`}
          />
        </Button>
      </CardFooter>
    </Card>
  );
}
