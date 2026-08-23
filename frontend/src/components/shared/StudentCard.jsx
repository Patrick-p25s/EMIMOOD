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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonStyled, buttonVariants } from "@/components/shared/ButtonStyled";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudentCard({
  student,
  onUpdate,
  onDelete,
  onProfile,
  loading,
}) {
  if (!student) return null;

  // Formatage du nom complet
  const fullName =
    `${student.first_name || ""} ${student.last_name || ""}`.trim() ||
    "Utilisateur sans nom";

  // Génération des initiales (ex: Hery Andria -> HA)
  const initials =
    `${student.first_name?.[0] || ""}${student.last_name?.[0] || ""}`.toUpperCase() ||
    "ET";

  return (
    <Card className="hover:border-primary/50 transition-colors flex flex-col justify-between">
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
                <AvatarImage src={student.avatar_url} alt={fullName} />
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
            <Badge
              variant={student.role === "moderator" ? "default" : "secondary"}
              className="gap-1 capitalize shrink-0 text-[10px]"
            >
              <Shield className="h-3 w-3" />
              {student.role || "étudiant"}
            </Badge>
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
          {(student.niveau || student.mention) && (
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Parcours :</span>
              <Badge
                variant="outline"
                className="font-medium text-[11px] border-primary/20 text-primary"
              >
                {[student.niveau, student.mention].filter(Boolean).join(" · ")}
              </Badge>
            </div>
          )}
        </CardContent>
      </div>

      {/* Actions (Update / Delete Optionnels) */}
      {(onUpdate || onDelete) && (
        <CardFooter className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
          {onUpdate && (
            <ButtonStyled
              loading={loading}
              variant="ghost"
              size="sm"
              disable={loading}
              onClick={() => onUpdate(student)}
              icon={<Pencil className="h-3.5 w-3.5" />}
            >
              Modifier
            </ButtonStyled>
          )}

          {onDelete && (
            <ButtonStyled
              loading={loading}
              variant="destructive"
              size="sm"
              className="gap-1.5 h-8 text-xs"
              onClick={() => onDelete(student)}
              icon={<Trash2 className="h-3.5 w-3.5" />}
              disable={loading}
            >
              Supprimer
            </ButtonStyled>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
