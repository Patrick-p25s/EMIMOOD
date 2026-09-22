import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  Video,
  Presentation,
  Download,
  Bookmark,
  BookmarkCheck,
  Pencil,
  Trash2,
  Check,
  X,
  AlertCircle,
  FolderInput,
  Eye,
} from "lucide-react";
import {
  deleteDocumentSaved,
  downloadDocument,
  getSaveById,
  saveDocument,
} from "@/api/documentService";
import { ButtonStyled } from "./ButtonStyled";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const STATUT_CONFIG = {
  prive: { label: "Privé", className: "bg-muted text-muted-foreground" },
  en_attente: {
    label: "En attente",
    className: "bg-warning/10 text-warning border-warning/30",
  },
  public: {
    label: "Public",
    className: "bg-success/10 text-success border-success/30",
  },
  rejete: {
    label: "Rejeté",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
};

// Mapping type -> icône + couleur de vignette. C'est ce qui remplace
// la vraie miniature en attendant une génération côté backend.
const TYPE_CONFIG = {
  cours: {
    label: "Cours",
    icon: FileText,
    className: "bg-primary/10 text-primary",
  },
  td: {
    label: "TD",
    icon: FileText,
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  tp: {
    label: "TP",
    icon: FileSpreadsheet,
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  examen: {
    label: "Examen",
    icon: FileText,
    className: "bg-destructive/10 text-destructive",
  },
  corrige: {
    label: "Corrigé",
    icon: FileText,
    className: "bg-success/10 text-success",
  },
  autre: {
    label: "Autre",
    icon: FileText,
    className: "bg-muted text-muted-foreground",
  },
};

const IMAGE_MIME_PREFIX = "image/";
const VIDEO_MIME_PREFIX = "video/";

const MIME_EXTENSIONS = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

const getExtension = (mimeType, fichierPath) => {
  if (MIME_EXTENSIONS[mimeType]) return MIME_EXTENSIONS[mimeType];
  return fichierPath?.split(".").pop() || "bin";
};

const slugifyTitre = (titre) =>
  titre?.replace(/[\\/:*?"<>|]/g, "_").trim() || "document";

const formatRelativeDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  if (diffHour < 24) return `il y a ${diffHour} h`;
  if (diffDay === 1) return "hier";
  if (diffDay < 7) return `il y a ${diffDay} j`;
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
};

// Formate un compteur potentiellement null en affichage court (0, 12, 1.2k)
const formatCount = (value) => {
  const n = value ?? 0;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

export default function DocumentCard({
  document,
  onEdit,
  onDelete,
  onValide,
  onRejete,
  onMove,
}) {
  const [erreur, setErreur] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!document?.id) return;

    let actif = true;

    const checkSaved = async () => {
      setCheckingSaved(true);
      try {
        const save = await getSaveById(document.id);
        if (actif) setIsSaved(save);
      } catch (err) {
        setErreur(err.message?.toString());
      } finally {
        if (actif) setCheckingSaved(false);
      }
    };

    checkSaved();
    return () => {
      actif = false;
    };
  }, [document?.id]);

  if (!document) return null;

  const {
    id,
    titre,
    description,
    type_document,
    statut,
    taille_octets,
    mime_type,
    fichier_path,
    created_at,
    owner,
    vue_count,
    download_count,
    save_count,
  } = document;

  const statutInfo = STATUT_CONFIG[statut] || STATUT_CONFIG.prive;

  // Priorité : mime type (image/vidéo réelle) > type_document déclaré > fallback
  const isImage = mime_type?.startsWith(IMAGE_MIME_PREFIX);
  const isVideo = mime_type?.startsWith(VIDEO_MIME_PREFIX);
  const typeInfo = TYPE_CONFIG[type_document] || TYPE_CONFIG.autre;
  const VignetteIcon = isVideo ? Video : isImage ? FileImage : typeInfo.icon;

  const tailleLisible = taille_octets
    ? `${(taille_octets / 1024 / 1024).toFixed(2)} Mo`
    : null;

  const ownerName = owner
    ? `${owner.first_name || ""} ${owner.last_name || ""}`.trim()
    : "Utilisateur";
  const ownerInitials = owner
    ? `${owner.first_name?.[0] || ""}${owner.last_name?.[0] || ""}`.toUpperCase()
    : "U";

  const handleDownload = async () => {
    setErreur(null);
    setDownloadLoading(true);
    try {
      const blob = await downloadDocument(id);
      const url = window.URL.createObjectURL(blob);
      const extension = getExtension(mime_type, fichier_path);
      const nomFichier = `${slugifyTitre(titre)}.${extension}`;

      const link = window.document.createElement("a");
      link.href = url;
      link.download = nomFichier;
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

  return (
    <Card className="group overflow-hidden flex flex-col justify-between transition-all hover:shadow-md hover:border-primary/30">
      {/* Vignette : couleur + icône par type, en attendant une vraie miniature */}
      <div
        className={cn(
          "relative h-28 flex items-center justify-center cursor-pointer",
          typeInfo.className,
        )}
        onClick={() => navigate(id)}
      >
        <VignetteIcon className="h-9 w-9 opacity-40" />

        <Badge
          variant="secondary"
          className="absolute top-2 left-2 text-[10px] h-5 px-1.5 bg-background/90"
        >
          {typeInfo.label}
        </Badge>

        <Badge
          variant="outline"
          className={cn(
            "absolute top-2 right-2 text-[10px] h-5 px-1.5 bg-background/90",
            statutInfo.className,
          )}
        >
          {statutInfo.label}
        </Badge>
      </div>

      <CardContent className="pt-4 space-y-2.5 flex-1">
        <h3
          className="font-semibold text-sm text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
          onClick={() => navigate(id)}
        >
          {titre}
        </h3>

        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        {/* Auteur + date */}
        <div className="flex items-center gap-2 pt-1">
          <Avatar className="h-5 w-5">
            <AvatarImage src={owner?.avatar_url} alt={ownerName} />
            <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
              {ownerInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">
            {ownerName}
            {created_at && (
              <span className="text-muted-foreground/70">
                {" "}
                · {formatRelativeDate(created_at)}
              </span>
            )}
          </span>
        </div>

        {/* Stats sociales */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5">
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
          {tailleLisible && (
            <span className="ml-auto text-muted-foreground/70">
              {tailleLisible}
            </span>
          )}
        </div>

        {erreur && (
          <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-2.5 py-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {erreur}
          </div>
        )}
      </CardContent>

      {/* <CardFooter className="pt-3 border-t border-border flex flex-col gap-2">
        <div className="flex items-center gap-2 w-full">
          <ButtonStyled
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 text-xs h-8"
            onClick={handleDownload}
            loading={downloadLoading}
            icon={<Download className="h-3.5 w-3.5" />}
          >
            Télécharger
          </ButtonStyled>

          <ButtonStyled
            icon={
              isSaved ? (
                <BookmarkCheck className="h-3.5 w-3.5" />
              ) : (
                <Bookmark className="h-3.5 w-3.5" />
              )
            }
            variant="outline"
            size="icon"
            disabled={checkingSaved}
            className={cn(
              "h-8 w-8 shrink-0",
              isSaved && "text-primary border-primary/40 bg-primary/5",
            )}
            onClick={handleToggleSave}
            loading={saveLoading}
            title={isSaved ? "Retirer des enregistrements" : "Enregistrer"}
          />
        </div>

        {statut === "en_attente" && (onValide || onRejete) && (
          <div className="flex items-center gap-2 w-full">
            {onValide && (
              <ButtonStyled
                size="sm"
                icon={<Check className="h-3.5 w-3.5" />}
                className="flex-1 gap-1.5 text-xs h-8 bg-success text-success-foreground hover:bg-success/90"
                onClick={onValide}
              >
                Valider
              </ButtonStyled>
            )}
            {onRejete && (
              <ButtonStyled
                icon={<X className="h-3.5 w-3.5" />}
                variant="destructive"
                size="sm"
                className="flex-1 gap-1.5 text-xs h-8"
                onClick={onRejete}
              >
                Rejeter
              </ButtonStyled>
            )}
          </div>
        )}

        {(onMove || onEdit || onDelete) && (
          <div className="flex items-center justify-end gap-1 w-full">
            {onMove && (
              <ButtonStyled
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onMove(document)}
                icon={<FolderInput className="h-3.5 w-3.5" />}
                title="Déplacer vers un dossier"
              />
            )}
            {onEdit && (
              <ButtonStyled
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onEdit}
                icon={<Pencil className="h-3.5 w-3.5" />}
                title="Modifier"
              />
            )}
            {onDelete && (
              <ButtonStyled
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                icon={<Trash2 className="h-3.5 w-3.5" />}
                onClick={() => onDelete(id)}
                title="Supprimer"
              />
            )}
          </div>
        )}
      </CardFooter> */}
    </Card>
  );
}
