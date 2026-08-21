import { DocumentViewerPage } from "@/components/special/DocumentViewer";
import useDocument from "@/hooks/useDocument";
import React from "react";
import { useParams } from "react-router-dom";

export default function OneDocument() {
  const { documentId } = useParams();
  const { getDocumentById } = useDocument();
  const document = getDocumentById(documentId);
  return (
    <div>
      <DocumentViewerPage document={document} />
    </div>
  );
}
