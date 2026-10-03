import { getDocumentById } from "@/api/documentService";
import { DocumentViewerPage } from "@/components/features/documents/DocumentViewer";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function DocumentLecture() {
  const { documentId, id } = useParams();
  const idToLoad = documentId || id;
  const navigate = useNavigate();
  const location = useLocation();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    if (!idToLoad) return;

    const fetchDocument = async () => {
      setLoading(true);
      setErreur(null);
      try {
        const res = await getDocumentById(idToLoad);
        setDoc(res);
      } catch (err) {
        setErreur(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [idToLoad]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(location.pathname.startsWith("/admin/") ? "/admin/document" : "/dashboard");
  };

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Chargement du document...</p>
    );
  }

  if (erreur) {
    return <p className="text-sm text-destructive">Erreur : {erreur}</p>;
  }

  if (!doc) {
    return (
      <p className="text-sm text-muted-foreground">Document introuvable.</p>
    );
  }

  return <DocumentViewerPage document={doc} onBack={handleBack} />;
}
