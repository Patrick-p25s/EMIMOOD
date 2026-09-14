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
import {
  AlertCircle,
  Archive,
  ArchiveRestore,
  Trash2,
  Edit,
  Clock,
} from "lucide-react";

export default function AnnonceItem({
  annonce,
  auteur,
  onArchive,
  onUnarchive,
  onDelete,
  onEdit,
}) {
  const { titre, contenu, important, statut, created_at } = annonce || {};
  const isArchivee = statut === "archivee";

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Date inconnue";

  const authorInitials = auteur
    ? `${auteur.first_name?.[0] || ""}${auteur.last_name?.[0] || ""}`.toUpperCase()
    : "A";

  const authorName = auteur
    ? `${auteur.first_name || ""} ${auteur.last_name || ""}`.trim()
    : "Enseignant";

  return (
    <Card
      className={`relative transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
        important && !isArchivee
          ? "border-l-4 border-l-warning bg-warning/5"
          : ""
      } ${isArchivee ? "opacity-70 bg-muted/40" : ""}`}
    >
      <div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {important && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-warning/40 text-warning bg-warning/10 text-[11px]"
                  >
                    <AlertCircle className="h-3 w-3" />
                    Important
                  </Badge>
                )}
                {isArchivee ? (
                  <Badge variant="secondary" className="gap-1 text-[11px]">
                    <Archive className="h-3 w-3" />
                    Archivée
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-success border-success/30 bg-success/10 text-[11px]"
                  >
                    Active
                  </Badge>
                )}
              </div>

              <CardTitle className="text-lg font-semibold tracking-tight text-foreground line-clamp-2">
                {titre}
              </CardTitle>
            </div>

            {/* Actions compactes */}
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

              {isArchivee
                ? onUnarchive && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-success hover:bg-success/10"
                      onClick={onUnarchive}
                      title="Réactiver"
                    >
                      <ArchiveRestore className="h-4 w-4" />
                    </Button>
                  )
                : onArchive && (
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

        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {contenu}
          </p>
        </CardContent>
      </div>

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
