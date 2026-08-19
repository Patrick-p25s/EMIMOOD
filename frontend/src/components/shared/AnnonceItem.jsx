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
import {
  AlertCircle,
  MoreVertical,
  Archive,
  Trash2,
  Edit,
  Clock,
} from "lucide-react";
import { ButtonStyled } from "./ButtonStyled";

export default function AnnonceItem({
  annonce,
  auteur, // Optionnel: objet contenant { first_name, last_name, avatar_url }
  onArchive,
  onDelete,
  onEdit,
}) {
  const { titre, contenu, important, statut, created_at } = annonce;

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

  return (
    <Card
      className={`relative transition-all duration-200 hover:shadow-md ${
        important ? "border-l-4 border-l-destructive bg-destructive/5" : ""
      } ${statut === "archive" ? "opacity-60 bg-muted/50" : ""}`}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1.5 pr-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Badges de statut */}
            {important && (
              <Badge variant="destructive" className="gap-1 px-2 py-0.5">
                <AlertCircle className="h-3.5 w-3.5" />
                Important
              </Badge>
            )}
            {statut === "archive" ? (
              <Badge variant="secondary">Archivée</Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-emerald-600 border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/20"
              >
                Active
              </Badge>
            )}
          </div>

          <CardTitle className="text-xl font-bold tracking-tight text-foreground line-clamp-2">
            {titre}
          </CardTitle>
        </div>

        {/* Menu d'actions */}
        {onDelete && (
          <ButtonStyled
            variant="destructive"
            icon={<Trash2 className="mr-2 h-4 w-4" />}
            onClick={() => onDelete(annonce.id)}
          >
            Supprimer
          </ButtonStyled>
        )}
        {onEdit && (
          <ButtonStyled
            variant="destructive"
            icon={<Edit className="mr-2 h-4 w-4" />}
            onClick={() => onEdit(annonce)}
          >
            Modifier
          </ButtonStyled>
        )}
        {onArchive && (
          <ButtonStyled
            variant="destructive"
            icon={<Archive className="mr-2 h-4 w-4" />}
            onClick={() => onArchive(annonce.id)}
          >
            Archiver
          </ButtonStyled>
        )}

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Menu d'actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(annonce)}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
            )}
            {onArchive && statut !== "archive" && (
              <DropdownMenuItem onClick={() => onArchive(annonce.id)}>
                <Archive className="mr-2 h-4 w-4" />
                Archiver
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(annonce.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
          {contenu}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
        {/* Auteur */}
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={auteur?.avatar_url} alt={auteur?.first_name} />
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">
              {authorInitials}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground/80">
            {auteur
              ? `${auteur.first_name} ${auteur.last_name || ""}`
              : "Enseignant"}
          </span>
        </div>

        {/* Horodatage */}
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
          <span>{formattedDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
