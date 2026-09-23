import { getDocumentById } from "@/api/documentService";
import { DocumentViewerPage } from "@/components/special/DocumentViewer";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DocumentLecture() {
  const { documentId } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    if (!documentId) return;

    const fetchDocument = async () => {
      setLoading(true);
      setErreur(null);
      try {
        const res = await getDocumentById(documentId);
        setDoc(res);
        console.log(res);
      } catch (err) {
        setErreur(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

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

  return <DocumentViewerPage document={doc} />;
}
