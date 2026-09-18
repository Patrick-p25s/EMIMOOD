import { listActiveAnnonce } from "@/api/announceService";
import AnnonceItem from "@/components/shared/AnnonceItem";
import { Megaphone } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

export default function AnnonceManage() {
  const [annonces, setAnnonces] = useState([]);
  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    pages: 0,
  });

  const fetchData = useCallback(
    async (page, pageSize) => {
      setLoading(true);
      setErreur(null);
      try {
        const data = await listActiveAnnonce({ page, pageSize });
        setAnnonces(data.items);
        setPagination({
          page: data.page,
          pageSize: data.page_size,
          total: data.total,
          pages: data.pages,
        });
      } catch (err) {
        setErreur(err.message?.toString());
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize],
  );

  useEffect(() => {
    fetchData(pagination.page, pagination.pageSize);
  }, []);

  return (
    <div>
      {erreur && (
        <div className="p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm">
          {erreur}
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
            <AnnonceItem annonce={annonce} key={annonce.id} loading={loading} />
          ))}
        </div>
      )}
    </div>
  );
}
