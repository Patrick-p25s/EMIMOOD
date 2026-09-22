import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ButtonStyled } from "./ButtonStyled";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  Check,
  Download,
  Eye,
  FileImage,
  FileText,
  FileSpreadsheet,
  FolderInput,
  MoreVertical,
  Pencil,
  Trash2,
  Video,
  X,
} from "lucide-react";

import {
  deleteDocumentSaved,
  downloadDocument,
  getSaveById,
  saveDocument,
} from "@/api/documentService";

import { cn } from "@/lib/utils";
import { getFileUrl } from "@/utils/file";
import IconBadge from "./IconBadge";

const TYPE_CONFIG = {
  cours: { label: "Cours", icon: FileText },
  td: { label: "TD", icon: FileText },
  tp: { label: "TP", icon: FileSpreadsheet },
  examen: { label: "EXAM", icon: FileText },
  corrige: { label: "Corrigé", icon: FileText },
  autre: { label: "Document", icon: FileText },
};

const STATUS_CONFIG = {
  prive: {
    label: "Privé",
    className:
      "border-border/60 bg-background/90 text-foreground backdrop-blur",
  },
  en_attente: {
    label: "En attente",
    className: "border-warning/30 bg-warning/10 text-warning backdrop-blur",
  },
  public: {
    label: "Public",
    className: "border-success/30 bg-success/10 text-success backdrop-blur",
  },
  rejete: {
    label: "Rejeté",
    className:
      "border-destructive/30 bg-destructive/10 text-destructive backdrop-blur",
  },
};

const MIME_EXTENSIONS = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "pptx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

const formatCount = (value = 0) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return String(value);
};

const formatDate = (date) => {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  if (hours < 24) return `il y a ${hours} h`;
  if (days < 7) return `il y a ${days} jours`;

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getExtension = (mimeType, filePath) =>
  MIME_EXTENSIONS[mimeType] || filePath?.split(".").pop() || "bin";

const cleanFilename = (value) =>
  value?.replace(/[\\/:*?"<>|]/g, "_").trim() || "document";

export default function DocumentCard({
  document,
  onEdit,
  onDelete,
  onValide,
  onRejete,
  onMove,
}) {
  const navigate = useNavigate();

  const [erreur, setErreur] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const {
    id,
    titre,
    description,
    type_document,
    statut,
    mime_type,
    fichier_path,
    thumbnail_url,
    created_at,
    owner,
    matiere,
    vue_count = 0,
    download_count = 0,
    save_count = 0,
  } = document;

  const typeInfo = TYPE_CONFIG[type_document] || TYPE_CONFIG.autre;
  const statusInfo = STATUS_CONFIG[statut] || STATUS_CONFIG.prive;
  const TypeIcon = typeInfo.icon;

  const ownerName =
    `${owner?.first_name || ""} ${owner?.last_name || ""}`.trim() ||
    "Utilisateur";
  const ownerInitials =
    `${owner?.first_name?.[0] || ""}${owner?.last_name?.[0] || ""}`.toUpperCase() ||
    "U";

  const isVideo = mime_type?.startsWith("video/");
  const isImage = mime_type?.startsWith("image/");

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    const checkSaved = async () => {
      setCheckingSaved(true);
      try {
        const saved = await getSaveById(id);
        if (mounted) setIsSaved(Boolean(saved));
      } catch (err) {
        if (mounted)
          setErreur("Impossible de vérifier l'état d'enregistrement.");
      } finally {
        if (mounted) setCheckingSaved(false);
      }
    };

    checkSaved();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDownload = async () => {
    setErreur(null);
    setDownloadLoading(true);
    try {
      const blob = await downloadDocument(id);
      const url = window.URL.createObjectURL(blob);
      const extension = getExtension(mime_type, fichier_path);
      const filename = `${cleanFilename(titre)}.${extension}`;

      const link = window.document.createElement("a");
      link.href = url;
      link.download = filename;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setErreur("Le téléchargement a échoué.");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleToggleSave = async () => {
    setErreur(null);
    setSaveLoading(true);
    try {
      if (isSaved) {
        await deleteDocumentSaved(id);
        setIsSaved(false);
      } else {
        await saveDocument(id);
        setIsSaved(true);
      }
    } catch (err) {
      setErreur(
        isSaved
          ? "Impossible de retirer des enregistrements."
          : "Impossible d'enregistrer le document.",
      );
    } finally {
      setSaveLoading(false);
    }
  };

  // Actions "de gestion" (celles qui dépendent du rôle/contexte) — le
  // téléchargement et l'enregistrement sont toujours proposés, donc pas
  // à inclure dans ce calcul.
  const hasManagementActions = Boolean(
    onEdit || onDelete || onMove || onValide || onRejete,
  );

  return (
    <Card className="group overflow-hidden border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
      {/* Vignette */}
      <button
        type="button"
        onClick={() => navigate(id)}
        className="block w-full text-left"
      >
        <AspectRatio ratio={16 / 9}>
          <div className="relative h-full w-full overflow-hidden bg-muted">
            {thumbnail_url ? (
              <img
                src={getFileUrl(thumbnail_url)}
                alt={titre}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border bg-background shadow-sm">
                  {isVideo ? (
                    <Video className="h-7 w-7 text-muted-foreground" />
                  ) : isImage ? (
                    <FileImage className="h-7 w-7 text-muted-foreground" />
                  ) : (
                    <TypeIcon className="h-7 w-7 text-muted-foreground" />
                  )}
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

            <IconBadge
              className="absolute left-2.5 top-2.5 h-6 border-0 bg-background/90 font-semibold text-foreground shadow-sm "
              tone="primary"
            >
              {typeInfo.label}
            </IconBadge>

            <IconBadge
              tone="success"
              className={cn(
                "absolute right-2.5 top-2.5 h-6 px-2 text-[10px] font-medium shadow-sm",
                statusInfo.className,
              )}
            >
              {statusInfo.label}
            </IconBadge>

            {isVideo && thumbnail_url && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/95 shadow-md">
                  <Video className="ml-0.5 h-4 w-4 text-foreground" />
                </div>
              </div>
            )}
          </div>
        </AspectRatio>
      </button>

      <CardContent className="p-3 space-y-2.5">
        {/* Titre */}
        <button
          type="button"
          onClick={() => navigate(id)}
          className="block w-full text-left"
        >
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 hover:text-primary transition-colors">
            {titre}
          </h3>
        </button>

        {matiere?.nom && (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {matiere.nom}
          </p>
        )}

        {/* Auteur */}
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={getFileUrl(owner?.avatar_url)} alt={ownerName} />
            <AvatarFallback className="bg-primary/10 text-[9px] font-medium text-primary">
              {ownerInitials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 text-xs text-muted-foreground truncate">
            <span className="font-medium text-foreground/80">{ownerName}</span>
            <span className="mx-1">·</span>
            <span>{formatDate(created_at)}</span>
          </div>
        </div>

        {/* Stats + actions rapides + menu */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatCount(vue_count)}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              {formatCount(download_count)}
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="h-3.5 w-3.5" />
              {formatCount(save_count)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <ButtonStyled
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              icon={
                isSaved ? (
                  <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Bookmark className="h-3.5 w-3.5" />
                )
              }
              onClick={handleToggleSave}
              loading={saveLoading}
              disabled={checkingSaved}
              title={isSaved ? "Retirer des enregistrés" : "Enregistrer"}
            />

            <ButtonStyled
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              icon={<Download className="h-3.5 w-3.5" />}
              onClick={handleDownload}
              loading={downloadLoading}
              title="Télécharger"
            />

            {hasManagementActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ButtonStyled
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    icon={<MoreVertical className="h-4 w-4" />}
                    title="Plus d'actions"
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" side="top" className="w-48">
                  {onEdit && (
                    <DropdownMenuItem onClick={onEdit}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                  )}

                  {onMove && (
                    <DropdownMenuItem onClick={() => onMove(document)}>
                      <FolderInput className="mr-2 h-4 w-4" />
                      Déplacer
                    </DropdownMenuItem>
                  )}

                  {statut === "en_attente" && (onValide || onRejete) && (
                    <>
                      {(onEdit || onMove) && <DropdownMenuSeparator />}

                      {onValide && (
                        <DropdownMenuItem
                          onClick={onValide}
                          className="text-success focus:text-success"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Valider
                        </DropdownMenuItem>
                      )}

                      {onRejete && (
                        <DropdownMenuItem
                          onClick={onRejete}
                          className="text-destructive focus:text-destructive"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Rejeter
                        </DropdownMenuItem>
                      )}
                    </>
                  )}

                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {description && (
          <p className="line-clamp-2 text-xs leading-4 text-muted-foreground">
            {description}
          </p>
        )}

        {erreur && (
          <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-2.5 py-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {erreur}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
