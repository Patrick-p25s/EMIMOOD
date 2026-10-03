import { listActiveAnnonce } from "@/api/announceService";
import AnnonceItem from "@/components/features/announcements/AnnonceItem";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { Megaphone, AlertCircle, BellRing } from "lucide-react";

import React, { useCallback, useEffect, useState } from "react";
import { EmptyCard } from "@/components/common/feedback/EmptyCard";
import AlertBox from "@/components/common/feedback/AlertBox";
import IconBadge from "@/components/shared/IconBadge";

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

  const fetchData = useCallback(async (page, pageSize) => {
    setLoading(true);
    setErreur(null);

    try {
      const data = await listActiveAnnonce({
        page,
        pageSize,
      });

      setAnnonces(data.items);

      setPagination({
        page: data.page,
        pageSize: data.page_size,
        total: data.total,
        pages: data.pages,
      });
    } catch (err) {
      setErreur(
        err.message?.toString() || "Impossible de récupérer les annonces.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(pagination.page, pagination.pageSize);
  }, [fetchData, pagination.page, pagination.pageSize]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Megaphone className="h-5 w-5" />
            </div>

            <IconBadge tone="success">Informations</IconBadge>
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Annonces</h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Retrouvez les dernières informations et annonces importantes de
              votre classe.
            </p>
          </div>
        </div>

        {!loading && annonces.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BellRing className="h-4 w-4" />
            <span>
              {pagination.total} {pagination.total > 1 ? "annonces" : "annonce"}
            </span>
          </div>
        )}
      </div>

      {/* Error */}
      {erreur && <AlertBox variant="error">{erreur}</AlertBox>}

      {/* Loading */}
      {loading && annonces.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="space-y-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>

              <CardContent>
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : annonces.length === 0 ? (
        <EmptyCard
          title="Aucune annonce disponible"
          description="Les nouvelles informations publiées par votre établissement ou
              votre classe apparaîtront ici."
          icon={Megaphone}
        />
      ) : (
        /* Annonces */
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />

            <h2 className="text-sm font-medium">Dernières annonces</h2>

            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {annonces.map((annonce) => (
              <AnnonceItem
                annonce={annonce}
                key={annonce.id}
                loading={loading}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer décoratif */}
      {!loading && annonces.length > 0 && (
        <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
          <div className="h-px w-12 bg-border" />

          <span>Restez informé des actualités de votre espace</span>

          <div className="h-px w-12 bg-border" />
        </div>
      )}
    </div>
  );
}
