import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read,
  ).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((notification) => !notification.is_read);
    }

    return notifications;
  }, [filter, notifications]);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 px-1">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bell className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Notifications
            </h1>

            <p className="text-xs text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} notification${
                    unreadCount > 1 ? "s" : ""
                  } non lue${unreadCount > 1 ? "s" : ""}`
                : "Tout est à jour"}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="h-7 gap-1.5 px-3 text-xs">
              Tout
              <Badge
                variant="secondary"
                className="h-5 min-w-5 justify-center px-1 text-[10px]"
              >
                {notifications.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger value="unread" className="h-7 gap-1.5 px-3 text-xs">
              Non lues
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="h-5 min-w-5 justify-center px-1 text-[10px]"
                >
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground"
            onClick={readAll}
            disabled={loading || unreadCount === 0}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Tout marquer lu
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={deleteAll}
            disabled={loading || notifications.length === 0}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Tout supprimer
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-xs text-destructive">
          <X className="h-4 w-4 shrink-0" />
          <span>{error.message?.toString()}</span>
        </div>
      )}

      {/* Notifications */}
      <div className="space-y-2">
        {loading ? (
          <NotificationSkeletonList />
        ) : filteredNotifications.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={read}
              onDelete={deleteNotification}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-xs text-muted-foreground">
            Page {pagination.page} sur {pagination.pages}
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 px-2.5 text-xs"
              disabled={pagination.page <= 1 || loading}
              onClick={() => goToPage(pagination.page - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Précédent
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 px-2.5 text-xs"
              disabled={pagination.page >= pagination.pages || loading}
              onClick={() => goToPage(pagination.page + 1)}
            >
              Suivant
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationItem({ notification, onRead, onDelete }) {
  const { id, message, is_read, created_at } = notification;

  return (
    <Card
      className={cn(
        "group transition-colors",
        !is_read && "border-primary/30 bg-primary/[0.025]",
      )}
    >
      <CardContent className="flex items-center gap-3 px-4 py-3">
        {/* Icon */}
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            is_read
              ? "bg-muted text-muted-foreground"
              : "bg-primary/10 text-primary",
          )}
        >
          <Bell className="h-4 w-4" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {!is_read && (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            )}

            <p className={cn("truncate text-sm", !is_read && "font-medium")}>
              {message}
            </p>
          </div>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatRelativeDate(created_at)}
          </p>
        </div>

        {/* Actions */}
        <div
          className={cn(
            "flex shrink-0 items-center gap-0.5 transition-opacity",
            "opacity-0 group-hover:opacity-100",
            "focus-within:opacity-100",
            "max-sm:opacity-100",
          )}
        >
          {!is_read && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onRead(id)}
              title="Marquer comme lu"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(id)}
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ filter }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex min-h-48 flex-col items-center justify-center text-center">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </div>

        <p className="text-sm font-medium">
          {filter === "unread"
            ? "Aucune notification non lue"
            : "Aucune notification"}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {filter === "unread"
            ? "Tu es à jour sur tout."
            : "Les nouvelles notifications apparaîtront ici."}
        </p>
      </CardContent>
    </Card>
  );
}

function NotificationSkeletonList() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-3 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function formatRelativeDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();

  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffHour < 24) return `Il y a ${diffHour} h`;
  if (diffDay === 1) return "Hier";
  if (diffDay < 7) return `Il y a ${diffDay} j`;

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}
