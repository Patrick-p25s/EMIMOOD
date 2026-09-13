import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  UserPlus,
  GraduationCap,
  KeyRound,
} from "lucide-react";

export default function ClasseCard({
  classe,
  onEdit,
  onDelete,
  onAddModerateur,
}) {
  return (
    <Card className="group relative flex flex-col justify-between transition-all hover:shadow-md hover:border-primary/30 cursor-pointer">
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
          <Badge variant="secondary" className="text-xs shrink-0">
            {classe.niveau}
          </Badge>
        </div>

        {/* Code d'invitation */}
        <div className="pt-2 border-t border-border flex items-center gap-2">
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
      </CardContent>

      {/* Actions */}
      <CardFooter className="pt-3 border-t border-border flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onAddModerateur(classe);
          }}
        >
          <UserPlus className="h-3.5 w-3.5" />
          Modérateur
        </Button>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(classe);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(classe.id);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
