import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Bookmark,
  BookmarkCheck,
  Pencil,
  Trash2,
  Check,
  X,
  AlertCircle,
  FolderInput,
} from "lucide-react";
import {
  deleteDocumentSaved,
  downloadDocument,
  getSaveById,
  saveDocument,
} from "@/api/documentService";
import { ButtonStyled } from "./ButtonStyled";
import useAuth from "@/hooks/useAuth";

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

const TYPE_LABELS = {
  cours: "Cours",
  td: "TD",
  tp: "TP",
  examen: "Examen",
  corrige: "Corrigé",
  autre: "Autre",
};

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
  } = document;

  const statutInfo = STATUT_CONFIG[statut] || STATUT_CONFIG.prive;
  const tailleLisible = taille_octets
    ? `${(taille_octets / 1024 / 1024).toFixed(2)} Mo`
    : null;

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
        if (document.owner_id == user.id) {
          if (window.confirm("Cette document va disparaitre ")) {
            return await deleteDocumentSaved(id);
          }
          return;
        }
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
    <Card className="flex flex-col justify-between transition-all hover:shadow-md hover:border-primary/30">
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm text-foreground line-clamp-2">
              {titre}
            </h3>
          </div>
          <Badge
            variant="outline"
            className={`text-[11px] shrink-0 ${statutInfo.className}`}
          >
            {statutInfo.label}
          </Badge>
        </div>

        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-[11px]">
            {TYPE_LABELS[type_document] || type_document}
          </Badge>
          {tailleLisible && <span>{tailleLisible}</span>}
        </div>

        {erreur && (
          <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-2.5 py-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {erreur}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t border-border flex flex-col gap-2">
        {/* Actions principales : télécharger / enregistrer */}
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
            className={`h-8 w-8 shrink-0 ${
              isSaved ? "text-primary border-primary/40 bg-primary/5" : ""
            }`}
            onClick={handleToggleSave}
            loading={saveLoading}
            title={isSaved ? "Retirer des enregistrements" : "Enregistrer"}
          />
        </div>

        {/* Actions de modération : valider / rejeter (si en attente) */}
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

        {/* Actions secondaires : déplacer / modifier / supprimer */}
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
      </CardFooter>
    </Card>
  );
}
