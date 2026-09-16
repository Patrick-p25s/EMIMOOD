import { useState, useEffect, useCallback } from "react";
import { getSavedByFolder } from "@/api/documentService";

export function useFolderDocuments(folderId) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(async () => {
    if (!folderId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getSavedByFolder(folderId);
      setDocuments(data ?? data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return { documents, loading, error, refresh: fetchDocuments };
}
