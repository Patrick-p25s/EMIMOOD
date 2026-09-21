import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCheck,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotification } from "@/hooks/useNotification";
import { ButtonStyled } from "@/components/shared/ButtonStyled";

export function NotificationManage() {
  const {
    loading,
    error,
    pagination,
    notifications,
    goToPage,
    read,
    readAll,
    deleteAll,
    deleteNotification,
  } = useNotification();

  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => !n.is_read);
    return notifications;
  }, [filter, notifications]);

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Notifications
            </h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`
                : "Tout est à jour"}
            </p>
          </div>
        </div>
      </div>

      {/* Filtres + actions groupées */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all" className="gap-1.5">
              Tout
              <Badge variant="secondary" className="text-[11px] h-5 px-1.5">
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="gap-1.5">
              Non lues
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-[11px] h-5 px-1.5">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-1">
          <ButtonStyled
            variant="ghost"
            className="gap-1.5 text-xs text-muted-foreground"
            onClick={readAll}
            disabled={loading || unreadCount === 0}
            icon={<CheckCheck className="h-3.5 w-3.5" />}
          >
            Tout marquer lu
          </ButtonStyled>
          <ButtonStyled
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={deleteAll}
            disabled={loading || notifications.length === 0}
            icon={<Trash2 className="h-3.5 w-3.5" />}
          >
            Tout supprimer
          </ButtonStyled>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5">
          <X className="h-4 w-4 shrink-0" />
          {error.message?.toString()}
        </div>
      )}

      {/* Liste */}
      <div className="space-y-2">
        {loading ? (
          <NotificationSkeletonList />
        ) : filteredNotifications.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          filteredNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onRead={read}
              onDelete={deleteNotification}
            />
          ))
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Page {pagination.page} sur {pagination.pages}
          </p>
          <div className="flex items-center gap-2">
            <ButtonStyled
              variant="outline"
              size="sm"
              className="gap-1 h-8"
              disabled={pagination.page <= 1 || loading}
              onClick={() => goToPage(pagination.page - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Précédent
            </ButtonStyled>
            <ButtonStyled
              variant="outline"
              size="sm"
              className="gap-1 h-8"
              disabled={pagination.page >= pagination.pages || loading}
              onClick={() => goToPage(pagination.page + 1)}
            >
              Suivant <ChevronRight className="h-3.5 w-3.5" />
            </ButtonStyled>
          </div>
        </div>
      )}
    </div>
  );
}

function formatRelativeDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffHour < 24) return `Il y a ${diffHour} h`;
  if (diffDay === 1) return "Hier";
  if (diffDay < 7) return `Il y a ${diffDay} j`;

  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function NotificationItem({ notification, onRead, onDelete }) {
  const { id, message, is_read, created_at } = notification;

  return (
    <Card
      className={cn(
        "group transition-all hover:shadow-sm",
        !is_read && "border-l-4 border-l-primary bg-primary/3",
      )}
    >
      <CardContent className="p-4 flex items-start gap-3">
        <div
          className={cn(
            "h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-colors",
            is_read ? "bg-muted" : "bg-primary/10",
          )}
        >
          <Bell
            className={cn(
              "h-4 w-4",
              is_read ? "text-muted-foreground" : "text-primary",
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p
              className={cn(
                "text-sm text-foreground leading-snug",
                !is_read && "font-medium",
              )}
            >
              {message}
            </p>
            {!is_read && (
              <span
                className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5"
                title="Non lu"
              />
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              {formatRelativeDate(created_at)}
            </p>

            {/* Actions : visibles au survol, toujours visibles sur mobile */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              {!is_read && (
                <ButtonStyled
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onRead(id)}
                  title="Marquer comme lu"
                  icon={<Check className="h-3.5 w-3.5" />}
                />
              )}
              <ButtonStyled
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(id)}
                title="Supprimer"
                icon={<Trash2 className="h-3.5 w-3.5" />}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ filter }) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-14 flex flex-col items-center gap-2 text-center">
        <div className="p-3 rounded-full bg-muted mb-1">
          <Bell className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">
          {filter === "unread"
            ? "Aucune notification non lue"
            : "Aucune notification"}
        </p>
        <p className="text-xs text-muted-foreground">
          {filter === "unread"
            ? "Tu es à jour sur tout."
            : "Tu seras averti ici des nouveautés."}
        </p>
      </CardContent>
    </Card>
  );
}

function NotificationSkeletonList() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
