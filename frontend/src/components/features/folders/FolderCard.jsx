import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Folder, Pencil, Trash2 } from "lucide-react";
import { ButtonStyled } from "@/components/common/forms/ButtonStyled";

export default function FolderCard({ folder, onOpen, onEdit, onDelete }) {
  return (
    <Card
      className="group cursor-pointer transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={() => onOpen(folder)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(folder);
        }
      }}
    >
      <CardContent className="flex items-center justify-between gap-3 pt-5">
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

        <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
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
