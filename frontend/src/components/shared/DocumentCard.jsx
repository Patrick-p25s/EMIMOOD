import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
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

import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { getFileUrl } from "@/utils/file";

const TYPE_CONFIG = {
  cours: {
    label: "Cours",
    icon: FileText,
  },
  td: {
    label: "TD",
    icon: FileText,
  },
  tp: {
    label: "TP",
    icon: FileSpreadsheet,
  },
  examen: {
    label: "EXAM",
    icon: FileText,
  },
  corrige: {
    label: "Corrigé",
    icon: FileText,
  },
  autre: {
    label: "Document",
    icon: FileText,
  },
};

const STATUS_CONFIG = {
  prive: {
    label: "Privé",
    className:
      "border-border/60 bg-background/90 text-foreground backdrop-blur",
  },
  en_attente: {
    label: "En attente",
    className:
      "border-yellow-200 bg-yellow-50/90 text-yellow-700 backdrop-blur",
  },
  public: {
    label: "Public",
    className:
      "border-emerald-200 bg-emerald-50/90 text-emerald-700 backdrop-blur",
  },
  rejete: {
    label: "Rejeté",
    className: "border-red-200 bg-red-50/90 text-red-700 backdrop-blur",
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
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}k`;
  }

  return value;
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

const getExtension = (mimeType, filePath) => {
  return MIME_EXTENSIONS[mimeType] || filePath?.split(".").pop() || "bin";
};

const cleanFilename = (value) => {
  return value?.replace(/[\\/:*?"<>|]/g, "_").trim() || "document";
};

export default function DocumentCard({
  document,
  onEdit,
  onDelete,
  onValide,
  onRejete,
  onMove,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

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
      try {
        const saved = await getSaveById(id);

        if (mounted) {
          setIsSaved(Boolean(saved));
        }
      } catch {
        if (mounted) {
          setIsSaved(false);
        }
      } finally {
        if (mounted) {
          setCheckingSaved(false);
        }
      }
    };

    checkSaved();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDownload = async () => {
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
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleToggleSave = async () => {
    setSaveLoading(true);

    try {
      if (isSaved) {
        await deleteDocumentSaved(id);
        setIsSaved(false);
      } else {
        await saveDocument(id);
        setIsSaved(true);
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const hasActions =
    onEdit ||
    onDelete ||
    onMove ||
    onValide ||
    onRejete ||
    handleDownload ||
    handleToggleSave;

  return (
    <Card className="group overflow-hidden border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
      {/* Thumbnail */}
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

            <Badge className="absolute left-2.5 top-2.5 h-6 border-0 bg-background/90 px-2 text-[10px] font-semibold text-foreground shadow-sm backdrop-blur">
              {typeInfo.label}
            </Badge>

            <Badge
              variant="outline"
              className={cn(
                "absolute right-2.5 top-2.5 h-6 px-2 text-[10px] font-medium shadow-sm",
                statusInfo.className,
              )}
            >
              {statusInfo.label}
            </Badge>

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

      <CardContent className="p-3">
        {/* Title */}
        <button type="button" onClick={() => navigate(id)}>
          {titre}
        </button>

        {/* Subject */}
        {matiere?.nom && (
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {matiere.nom}
          </p>
        )}

        {/* Owner */}
        <div className="mt-2.5 flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={getFileUrl(owner?.avatar_url)} alt={ownerName} />
            <AvatarFallback className="bg-primary/10 text-[9px] font-medium text-primary">
              {ownerInitials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">{ownerName}</span>

            <span className="mx-1">•</span>

            <span>{formatDate(created_at)}</span>
          </div>
        </div>

        {/* Stats + menu */}
        <div className="mt-3 flex items-center justify-between">
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

          {hasActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 rounded-full"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Actions du document</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" side="top" className="w-48">
                <DropdownMenuItem
                  onClick={handleToggleSave}
                  disabled={checkingSaved || saveLoading}
                >
                  {isSaved ? (
                    <BookmarkCheck className="mr-2 h-4 w-4" />
                  ) : (
                    <Bookmark className="mr-2 h-4 w-4" />
                  )}

                  {isSaved ? "Retirer des enregistrés" : "Enregistrer"}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleDownload}
                  disabled={downloadLoading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </DropdownMenuItem>

                {(onEdit || onMove) && <DropdownMenuSeparator />}

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
                    <DropdownMenuSeparator />

                    {onValide && (
                      <DropdownMenuItem
                        onClick={onValide}
                        className="text-emerald-600 focus:text-emerald-600"
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

        {description && (
          <p className="mt-2 line-clamp-2 text-xs leading-4 text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
