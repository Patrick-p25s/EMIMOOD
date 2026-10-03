import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ButtonStyled } from "@/components/common/forms/ButtonStyled";
import IconBadge from "@/components/shared/IconBadge";
import AlertBox from "@/components/common/feedback/AlertBox";

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
  Play,
  Trash2,
  Video,
  X,
  Lock,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  deleteDocumentSaved,
  downloadDocument,
  getSaveById,
  saveDocument,
} from "@/api/documentService";

import { cn } from "@/lib/utils";
import { getFileUrl } from "@/utils/file";

// Chaque type a sa propre identité visuelle : icône, teinte de badge,
// et dégradé de vignette (utilisé seulement quand pas de vraie miniature)
const TYPE_CONFIG = {
  cours: {
    label: "Cours",
    icon: FileText,
    tone: "primary",
    gradient: "from-primary/25 to-primary/5",
  },
  td: {
    label: "TD",
    icon: FileText,
    tone: "primary",
    gradient: "from-blue-500/25 to-blue-500/5",
  },
  tp: {
    label: "TP",
    icon: FileSpreadsheet,
    tone: "primary",
    gradient: "from-purple-500/25 to-purple-500/5",
  },
  examen: {
    label: "Examen",
    icon: FileText,
    tone: "destructive",
    gradient: "from-destructive/25 to-destructive/5",
  },
  corrige: {
    label: "Corrigé",
    icon: FileText,
    tone: "success",
    gradient: "from-success/25 to-success/5",
  },
  autre: {
    label: "Document",
    icon: FileText,
    tone: "muted",
    gradient: "from-muted-foreground/15 to-muted-foreground/5",
  },
};

const STATUS_CONFIG = {
  prive: { label: "Privé", icon: Lock, tone: "muted" },
  en_attente: { label: "En attente", icon: Clock, tone: "warning" },
  public: { label: "Public", icon: CheckCircle2, tone: "success" },
  rejete: { label: "Rejeté", icon: XCircle, tone: "destructive" },
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
  onRead = null,
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
      } catch {
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

  const goToDocument = () => navigate(id);

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
    } catch {
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
    } catch {
      setErreur(
        isSaved
          ? "Impossible de retirer des enregistrements."
          : "Impossible d'enregistrer le document.",
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const hasManagementActions = Boolean(
    onEdit || onDelete || onMove || onValide || onRejete,
  );

  return (
    <Card className="group overflow-hidden transition-colors hover:border-foreground/25">
      {/* Vignette */}
      <div
        className="relative cursor-pointer"
        onClick={onRead || goToDocument}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            (onRead || goToDocument)();
          }
        }}
        aria-label={`Prévisualiser ${titre}`}
      >
        <AspectRatio ratio={16 / 6}>
          <div className="relative h-full w-full overflow-hidden">
            {thumbnail_url ? (
              <img
                src={getFileUrl(thumbnail_url)}
                alt={titre}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className={cn(
                  "flex h-full w-full items-center justify-center bg-muted/70",
                  typeInfo.gradient,
                )}
              >
                {isVideo ? (
                  <Video className="h-10 w-10 text-foreground/30" />
                ) : isImage ? (
                  <FileImage className="h-10 w-10 text-foreground/30" />
                ) : (
                  <TypeIcon className="h-10 w-10 text-foreground/30" />
                )}
              </div>
            )}

            <div className="absolute left-2.5 top-2.5">
              <IconBadge
                icon={TypeIcon}
                tone={typeInfo.tone}
                className="border-0 bg-background/90 text-[11px] shadow-none"
              >
                {typeInfo.label}
              </IconBadge>
            </div>

            <div className="absolute right-2.5 top-2.5">
              <IconBadge
                icon={statusInfo.icon}
                tone={statusInfo.tone}
                className="bg-background/90 text-[11px] shadow-none"
              >
                {statusInfo.label}
              </IconBadge>
            </div>

            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/95">
                  <Play className="ml-0.5 h-4 w-4 text-foreground fill-foreground" />
                </div>
              </div>
            )}
          </div>
        </AspectRatio>
      </div>

      <CardContent className="space-y-3 p-4">
        <div className="cursor-pointer" onClick={goToDocument}>
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
            {titre}
          </h3>
        </div>

        {matiere?.nom && (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {matiere.nom}
          </p>
        )}

        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 ring-2 ring-background shadow-sm">
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

        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
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

          <div className="flex items-center gap-0.5">
            <ButtonStyled
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7 shrink-0",
                isSaved && "text-primary hover:text-primary",
              )}
              icon={
                isSaved ? (
                  <BookmarkCheck className="h-3.5 w-3.5" />
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
          <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        )}

        {erreur && <AlertBox variant="error">{erreur}</AlertBox>}
      </CardContent>
    </Card>
  );
}
