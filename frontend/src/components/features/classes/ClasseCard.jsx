import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Pencil,
  Trash2,
  UserPlus,
  GraduationCap,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { ButtonStyled } from "@/components/common/forms/ButtonStyled";
import IconBadge from "@/components/shared/IconBadge";

export default function ClasseCard({
  classe,
  onEdit,
  onDelete,
  onAddModerateur,
  onRegenerate,
}) {
  return (
    <Card className="group relative flex cursor-pointer flex-col justify-between transition-colors hover:border-foreground/25">
      <CardContent className="pt-5 space-y-3">
        {/* En-tête : Mention & Niveau */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <GraduationCap className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {classe.mention}
            </h3>
          </div>
          <IconBadge>{classe.niveau}</IconBadge>
        </div>

        {/* Code d'invitation */}
        <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <KeyRound className="h-3.5 w-3.5 text-muted-foreground shrink-0" />

            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                Code d'invitation
              </p>

              <p className="text-sm font-mono font-bold text-foreground tracking-wide">
                {classe.code_invitation}
              </p>
            </div>
          </div>

          <ButtonStyled
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onRegenerate(classe.id);
            }}
            title="Régénérer le code"
            icon={<RefreshCw className="h-4 w-4" />}
          />
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="pt-3 border-t border-border flex items-center justify-between gap-2">
        <ButtonStyled
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onAddModerateur(classe);
          }}
          icon={<UserPlus className="h-3.5 w-3.5" />}
        >
          Modérateur
        </ButtonStyled>

        <div className="flex items-center gap-1.5">
          <ButtonStyled
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(classe);
            }}
            icon={<Pencil className="h-3.5 w-3.5" />}
          />
          <ButtonStyled
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(classe.id);
            }}
            icon={<Trash2 className="h-3.5 w-3.5" />}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
