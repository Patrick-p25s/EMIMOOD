import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AlertCircle, Archive, Trash2, Edit, Clock } from "lucide-react";

export default function AnnonceItem({
  annonce,
  auteur,
  onArchive,
  onDelete,
  onEdit,
}) {
  const { titre, contenu, important, statut, created_at } = annonce || {};

  // Formatage de la date
  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Date inconnue";

  // Initiales de l'auteur pour l'avatar de secours
  const authorInitials = auteur
    ? `${auteur.first_name?.[0] || ""}${auteur.last_name?.[0] || ""}`.toUpperCase()
    : "A";

  const authorName = auteur
    ? `${auteur.first_name || ""} ${auteur.last_name || ""}`.trim()
    : "Enseignant";

  return (
    <Card
      className={`relative transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
        important ? "border-l-4 border-l-amber-500 bg-amber-500/5" : ""
      } ${statut === "archive" ? "opacity-60 bg-muted/40" : ""}`}
    >
      <div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            {/* Infos Principales : Auteur + Titre */}
            <div className="space-y-2 min-w-0 flex-1">
              {/* Badges de Statut */}
              <div className="flex items-center gap-2 flex-wrap">
                {important && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-amber-500/40 text-amber-600 bg-amber-50 dark:bg-amber-950/30 text-[11px]"
                  >
                    <AlertCircle className="h-3 w-3" />
                    Important
                  </Badge>
                )}
                {statut === "archive" ? (
                  <Badge variant="secondary" className="text-[11px]">
                    Archivée
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-emerald-600 border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/20 text-[11px]"
                  >
                    Active
                  </Badge>
                )}
              </div>

              {/* Titre */}
              <CardTitle className="text-lg font-semibold tracking-tight text-foreground line-clamp-2">
                {titre}
              </CardTitle>
            </div>

            {/* Actions d'édition / suppression compactes */}
            <div className="flex items-center gap-1 shrink-0">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={onEdit}
                  title="Modifier"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onArchive && statut !== "archive" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={onArchive}
                  title="Archiver"
                >
                  <Archive className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                  onClick={onDelete}
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Contenu de l'annonces */}
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {contenu}
          </p>
        </CardContent>
      </div>

      {/* Pied de Carte : Auteur + Date */}
      <CardFooter className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border border-border">
            <AvatarImage src={auteur?.avatar_url} alt={authorName} />
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">
              {authorInitials}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground/90">{authorName}</span>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground/80">
          <Clock className="h-3.5 w-3.5" />
          <span>{formattedDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
