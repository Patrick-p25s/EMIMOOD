import { downloadDocument } from "@/api/documentService";
import DocumentCard from "@/components/shared/DocumentCard";
import { useMyDocuments } from "@/hooks/useMyDocs";
import React from "react";

export default function MyDocumentManage() {
  const { documents } = useMyDocuments();

  const handleDownload = async (documentId) => {
    try {
      const blob = await downloadDocument(documentId);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = documentId;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSave = async () => {
    return null;
  };
  return (
    <div>
      <h2 className="text-xl font-bold">Documents publics de</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <DocumentCard
            onSave={handleSave}
            key={doc.id}
            document={doc}
            onDownload={handleDownload}
          />
        ))}
      </div>
    </div>
  );
}
