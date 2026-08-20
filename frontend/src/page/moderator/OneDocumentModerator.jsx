import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Bookmark,
  FileText,
  Calendar,
  HardDrive,
  AlertCircle,
  Clock,
  CheckCircle2,
  Lock,
  XCircle,
  Video,
} from "lucide-react";
import useDocument from "@/hooks/useDocument";
import { useState } from "react";
function DocumentViewerPage({ document, onBack, onSave }) {
  const [isSaved, setIsSaved] = useState(false);

  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Aucun document à afficher.</p>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Button>
        )}
      </div>
    );
  }

  const {
    titre,
    description,
    mime_type,
    fichier_path,
    taille_octets,
    type_document,
    date_limite,
    statut,
  } = document;

  const handleSaveToggle = () => {
    const nextState = !isSaved;
    setIsSaved(nextState);
    if (onSave) onSave(document, nextState);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Inconnue";
    const k = 1024;
    const sizes = ["Octets", "Ko", "Mo", "Go"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formattedDueDate = date_limite
    ? new Date(date_limite).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  // Affiche le bon lecteur selon le mime_type
  const renderViewer = () => {
    if (!fichier_path) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-muted-foreground bg-muted/20 rounded-lg">
          <FileText className="h-10 w-10 mb-2" />
          <p>Le fichier associé n'est pas accessible.</p>
        </div>
      );
    }

    // 1. Vidéos (MP4, WebM, Ogg, etc.)
    if (mime_type?.startsWith("video/")) {
      return (
        <div className="flex flex-col items-center justify-center bg-black/90 rounded-lg overflow-hidden border border-border shadow-lg">
          <video
            controls
            controlsList="nodownload"
            playsInline
            preload="metadata"
            className="w-full max-h-[75vh] outline-none"
          >
            <source src={fichier_path} type={mime_type || "video/mp4"} />
            Votre navigateur ne supporte pas la lecture de vidéos HTML5.
          </video>
        </div>
      );
    }

    // 2. PDF
    if (mime_type === "application/pdf") {
      return (
        <iframe
          src={`${fichier_path}#toolbar=1`}
          title={titre}
          className="w-full h-[75vh] rounded-lg border border-border shadow-inner bg-background"
        />
      );
    }

    // 3. Images
    if (mime_type?.startsWith("image/")) {
      return (
        <div className="flex items-center justify-center p-4 bg-black/5 dark:bg-black/40 rounded-lg border border-border min-h-[50vh]">
          <img
            src={fichier_path}
            alt={titre}
            className="max-h-[70vh] max-w-full object-contain rounded-md shadow-sm"
          />
        </div>
      );
    }

    // 4. Documents Office (Word, Excel, PPT via Google Viewer)
    if (
      mime_type?.includes("word") ||
      mime_type?.includes("officedocument") ||
      mime_type?.includes("excel") ||
      mime_type?.includes("powerpoint")
    ) {
      const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
        fichier_path,
      )}&embedded=true`;

      return (
        <iframe
          src={googleViewerUrl}
          title={titre}
          className="w-full h-[75vh] rounded-lg border border-border bg-background"
        />
      );
    }

    // 5. Autre / Non supporté directement
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4 bg-muted/20 rounded-lg border border-dashed border-border p-6 text-center">
        <FileText className="h-12 w-12 text-primary" />
        <div>
          <h4 className="font-semibold text-foreground">
            Prévisualisation non disponible
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            Ce type de fichier ({mime_type || "inconnu"}) ne peut pas être lu
            directement dans le navigateur.
          </p>
        </div>
        <a
          href={fichier_path}
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="gap-2">
            <Download className="h-4 w-4" /> Télécharger pour consulter
          </Button>
        </a>
      </div>
    );
  };

  const renderStatusBadge = () => {
    switch (statut) {
      case "public":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 text-xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Public
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="gap-1 border-amber-500/30 text-amber-600 bg-amber-50 dark:bg-amber-950/20 text-xs"
          >
            <Clock className="h-3.5 w-3.5" /> En attente
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-rose-500/30 text-rose-600 bg-rose-50 dark:bg-rose-950/20 text-xs"
          >
            <XCircle className="h-3.5 w-3.5" /> Rejeté
          </Badge>
        );
      case "private":
      default:
        return (
          <Badge
            variant="secondary"
            className="gap-1 text-muted-foreground text-xs"
          >
            <Lock className="h-3.5 w-3.5" /> Privé
          </Badge>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      {/* Barre d'action supérieure */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-border">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant={isSaved ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={handleSaveToggle}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Enregistré" : "Enregistrer"}
          </Button>

          <a
            href={fichier_path}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Télécharger
            </Button>
          </a>
        </div>
      </div>

      {/* En-tête du document */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="uppercase font-semibold text-xs flex items-center gap-1"
          >
            {mime_type?.startsWith("video/") && <Video className="h-3 w-3" />}
            {type_document || "Document"}
          </Badge>
          {renderStatusBadge()}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {titre}
        </h1>

        {description && (
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-4xl">
            {description}
          </p>
        )}

        {/* Métadonnées */}
        <div className="flex items-center gap-6 text-xs md:text-sm text-muted-foreground flex-wrap pt-2">
          <div className="flex items-center gap-1.5">
            <HardDrive className="h-4 w-4" />
            <span>{formatFileSize(taille_octets)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>{mime_type || "Format inconnu"}</span>
          </div>

          {formattedDueDate && (
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 font-medium">
              <Calendar className="h-4 w-4" />
              <span>À rendre avant le {formattedDueDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Zone d'affichage du média / lecteur */}
      <div className="pt-2">{renderViewer()}</div>
    </div>
  );
}

export default function OneDocumentModerator() {
  const { documentId } = useParams();
  const { getDocumentById } = useDocument();
  const document = getDocumentById(documentId);
  const navigate = useNavigate();
  return (
    <div>
      <DocumentViewerPage
        document={document}
        onBack={navigate("/moderator/documents")}
      />
    </div>
  );
}
