import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCheck,
  Trash2,
  Check,
  ChevronLeft,
  X,
  Wifi,
  WifiOff,
  Radio,
  FileText,
  Megaphone,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotification } from "@/hooks/useNotification";
import { ButtonStyled } from "@/components/common/forms/ButtonStyled";
import IconBadge from "@/components/shared/IconBadge";
import { EmptyCard } from "@/components/common/feedback/EmptyCard";

export function NotificationManage() {
  const {
    loading,
    error,
    pagination,
    notifications,
    unread,
    liveStatus,
    goToPage,
    read,
    readAll,
    deleteAll,
    deleteNotification,
  } = useNotification();

  const [filter, setFilter] = useState("all");

  const unreadCount = unread;

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((notification) => !notification.is_read);
    }

    return notifications;
  }, [filter, notifications]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-1 pb-8">
      <section className="border-b pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Notifications</h1>
                <LiveIndicator status={liveStatus} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} notification${
                    unreadCount > 1 ? "s" : ""
                  } non lue${unreadCount > 1 ? "s" : ""}`
                : "Tout est à jour"}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{pagination.total} au total</p>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="h-7 gap-1.5 px-3 text-xs">
              Tout
              <IconBadge>{notifications.length}</IconBadge>
            </TabsTrigger>

            <TabsTrigger value="unread" className="h-7 gap-1.5 px-3 text-xs">
              Non lues
              {unreadCount > 0 && <IconBadge>{unreadCount}</IconBadge>}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-1">
          <ButtonStyled
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground"
            onClick={readAll}
            disabled={loading || unreadCount === 0}
            icon={<CheckCheck className="h-3.5 w-3.5" />}
          >
            Tout marquer lu
          </ButtonStyled>

          <ButtonStyled
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={deleteAll}
            disabled={loading || notifications.length === 0}
            icon={<Trash2 className="h-3.5 w-3.5" />}
          >
            Tout supprimer
          </ButtonStyled>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-xs text-destructive">
          <X className="h-4 w-4 shrink-0" />
          <span>{error.message?.toString()}</span>
        </div>
      )}

      <div className="space-y-2">
        {loading ? (
          <NotificationSkeletonList />
        ) : filteredNotifications.length === 0 ? (
          <EmptyCard
            icon={Bell}
            title={
              filter === "unread"
                ? "Aucune notification non lue"
                : "Aucune notification"
            }
            description={
              filter === "unread"
                ? "Tu es à jour sur tout."
                : "Les nouvelles notifications apparaîtront ici."
            }
          />
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
            <ButtonStyled
              variant="outline"
              size="sm"
              className="h-8 gap-1 px-2.5 text-xs"
              disabled={pagination.page <= 1 || loading}
              onClick={() => goToPage(pagination.page - 1)}
              icon={<ChevronLeft className="h-3.5 w-3.5" />}
            >
              Précédent
            </ButtonStyled>

            <ButtonStyled
              variant="outline"
              size="sm"
              className="h-8 gap-1 px-2.5 text-xs"
              disabled={pagination.page >= pagination.pages || loading}
              onClick={() => goToPage(pagination.page + 1)}
            >
              Suivant
            </ButtonStyled>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationItem({ notification, onRead, onDelete }) {
  const { id, message, is_read, created_at, type } = notification;
  const typeDetails = getNotificationType(type);
  const Icon = typeDetails.icon;

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        !is_read && "border-primary/30 bg-primary/[0.04] shadow-sm",
      )}
    >
      <CardContent className="flex items-start gap-3 px-4 py-4 sm:px-5">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            is_read
              ? "bg-muted text-muted-foreground"
              : typeDetails.className,
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {!is_read && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_0_3px] shadow-primary/15" />
            )}
            <p className={cn("min-w-0 text-sm", !is_read && "font-semibold")}>
              {message}
            </p>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md bg-muted px-1.5 py-0.5 font-medium">{typeDetails.label}</span>
            <span>{formatRelativeDate(created_at)}</span>
          </div>
        </div>

        <div
          className={cn(
            "flex shrink-0 items-center gap-0.5 transition-opacity",
            "opacity-0 group-hover:opacity-100",
            "focus-within:opacity-100",
            "max-sm:opacity-100",
          )}
        >
          {!is_read && (
            <ButtonStyled
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onRead(id)}
              title="Marquer comme lu"
              icon={<Check className="h-4 w-4" />}
            />
          )}

          <ButtonStyled
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(id)}
            title="Supprimer"
            icon={<Trash2 className="h-4 w-4" />}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function LiveIndicator({ status }) {
  const isLive = status === "live";
  const reconnecting = status === "connecting" || status === "reconnecting";
  const Icon = isLive ? Wifi : reconnecting ? Radio : WifiOff;
  const label = isLive ? "Temps réel actif" : reconnecting ? "Connexion en cours" : "Hors ligne";

  return (
    <span
      title={label}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        isLive && "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        reconnecting && "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
        !isLive && !reconnecting && "border-muted bg-muted text-muted-foreground",
      )}
    >
      <Icon className={cn("h-3 w-3", reconnecting && "animate-pulse")} />
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
}

function getNotificationType(type) {
  const types = {
    new_annonce: { label: "Annonce", icon: Megaphone, className: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
    new_public_doc: { label: "Document", icon: FileText, className: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
    new_valide_doc: { label: "Document validé", icon: CircleCheck, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    new_reject_doc: { label: "Document refusé", icon: CircleX, className: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  };
  return types[type] || { label: "Information", icon: Bell, className: "bg-primary/10 text-primary" };
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
