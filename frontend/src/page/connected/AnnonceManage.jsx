import useAnnonce from "@/hooks/useAnnonce";
import { Megaphone } from "lucide-react";
import React from "react";

export default function AnnonceManage() {
  const { annonces, loading, error } = useAnnonce();
  return (
    <div>
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm">
          {error?.message}
        </div>
      )}
      {annonces.length <= 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center border border-dashed rounded-xl text-muted-foreground">
          <Megaphone className="h-8 w-8" />
          <p className="text-sm">Aucune annonce disponible.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {annonces.map((annonce) => (
            <AnnonceItem
              annonce={annonce}
              key={annonce.id}
              loading={actionLoading}
              onDelete={() => handleDelete(annonce)}
              onArchive={() => handleArchive(annonce.id)}
              onEdit={() => handleEdit(annonce)}
              onUnarchive={() => handleActive(annonce.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
