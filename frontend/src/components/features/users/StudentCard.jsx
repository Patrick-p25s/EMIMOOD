import React from "react";
import { Mail, Phone, Shield, Trash2, Pencil } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ButtonStyled, buttonVariants } from "@/components/common/forms/ButtonStyled";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFileUrl } from "@/utils/file";
import IconBadge from "@/components/shared/IconBadge";

export default function StudentCard({
  student,
  onUpdate,
  onDelete,
  onProfile,
}) {
  if (!student) return null;
  const studentClasse = student.classe;

  // Formatage du nom complet
  const fullName =
    `${student.first_name || ""} ${student.last_name || ""}`.trim() ||
    "Utilisateur sans nom";

  // Génération des initiales (ex: Hery Andria -> HA)
  const initials =
    `${student.first_name?.[0] || ""}${student.last_name?.[0] || ""}`.toUpperCase() ||
    "ET";

  return (
    <Card className="flex flex-col justify-between transition-colors hover:border-foreground/25">
      <div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div
              className={
                onProfile
                  ? "cursor-pointer flex items-center gap-3 min-w-0"
                  : "flex items-center gap-3 min-w-0"
              }
              onClick={onProfile}
            >
              {/* Avatar de l'étudiant / modérateur */}
              <Avatar className="h-10 w-10 border border-border shrink-0">
                <AvatarImage
                  src={getFileUrl(student?.avatar_url)}
                  alt={fullName}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <CardTitle className="text-base font-semibold text-foreground truncate">
                  {fullName}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground truncate flex items-center gap-1">
                  <Mail className="h-3 w-3 shrink-0" />
                  {student.email || "Pas d'email"}
                </CardDescription>
              </div>
            </div>

            {/* Badge de Rôle */}
            <IconBadge
              icon={Shield}
              tone={student.role === "moderator" ? "success" : "primary"}
            >
              {student.role || "étudiant"}
            </IconBadge>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 text-xs">
          {/* Numéro de téléphone */}
          {student.phone_number && (
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> Téléphone :
              </span>
              <span className="font-medium text-foreground">
                {student.phone_number}
              </span>
            </div>
          )}

          {/* Matricule */}
          <div className="flex items-center justify-between pt-1 border-t border-border/60 text-muted-foreground">
            <span>Matricule :</span>
            <span className="font-mono font-medium text-foreground">
              {student.matricule || "Non renseigné"}
            </span>
          </div>

          {/* Mention et Niveau (ex: L1 - Informatique) */}
          {studentClasse && (
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Parcours :</span>
              <IconBadge>
                {[studentClasse.niveau, studentClasse.mention]
                  .filter(Boolean)
                  .join(" · ")}
              </IconBadge>
            </div>
          )}
        </CardContent>
      </div>

      {/* Actions (Update / Delete Optionnels) */}
      {(onUpdate || onDelete) && (
        <CardFooter className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
          {onUpdate && (
            <ButtonStyled
              onClick={() => onUpdate(student)}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
              icon={<Pencil className="h-3.5 w-3.5" />}
            >
              Modifier
            </ButtonStyled>
          )}

          {onDelete && (
            <ButtonStyled
              variant="destructive"
              size="sm"
              className="gap-1.5 h-8 text-xs"
              onClick={() => onDelete(student)}
              icon={<Trash2 className="h-3.5 w-3.5" />}
            >
              Supprimer
            </ButtonStyled>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
