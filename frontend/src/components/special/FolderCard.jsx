import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Pencil, Trash2 } from "lucide-react";
import { ButtonStyled } from "../shared/ButtonStyled";

export default function FolderCard({ folder, onOpen, onEdit, onDelete }) {
  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
      onClick={() => onOpen(folder)}
    >
      <CardContent className="pt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
            <Folder className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm text-foreground truncate">
              {folder.name}
            </p>
            {folder.documentsCount != null && (
              <p className="text-xs text-muted-foreground">
                {folder.documentsCount} document
                {folder.documentsCount > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <ButtonStyled
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(folder);
            }}
            icon={<Pencil className="h-3.5 w-3.5" />}
          />
          <ButtonStyled
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(folder.id);
            }}
            icon={<Trash2 className="h-3.5 w-3.5" />}
          />
        </div>
      </CardContent>
    </Card>
  );
}
