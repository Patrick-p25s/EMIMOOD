import React from "react";
import { BookOpen, Pencil, Trash2, Layers } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonStyled, buttonVariants } from "@/components/shared/ButtonStyled";
import { useNavigate } from "react-router-dom";

export default function MatiereCard({ matiere, onUpdate, onDelete }) {
  if (!matiere) return null;
  const navigate = useNavigate();

  return (
    <Card className="hover:border-primary/50 transition-colors flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => {
                navigate(matiere.id);
              }}
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  {matiere.name || "Matière sans titre"}
                </CardTitle>
              </div>
            </div>

            {/* Badge Semestre */}
            {matiere.smester && (
              <Badge
                variant="outline"
                className="gap-1 border-primary/20 text-primary"
              >
                <Layers className="h-3 w-3" />
                Semestre {matiere.semester || "S1"}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Description */}
          <CardDescription className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {matiere.description ||
              "Aucune description fournie pour cette matière."}
          </CardDescription>

          {/* Coefficient */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/60">
            <span className="text-xs text-muted-foreground">Coefficient :</span>
            <Badge variant="secondary" className="font-semibold text-xs">
              {matiere.coefficient ?? matiere.coef ?? 1}
            </Badge>
          </div>
        </CardContent>
      </div>

      {/* Actions (Modification / Suppression Optionnelles) */}
      {(onUpdate || onDelete) && (
        <CardFooter className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
          {onUpdate && (
            <ButtonStyled
              onClick={onUpdate}
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
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Supprimer
            </ButtonStyled>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
