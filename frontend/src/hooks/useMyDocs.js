import {
  deleteDocument as deleteDocumentApi,
  myDocument,
} from "@/api/documentService";
import { useCallback, useEffect, useState } from "react";

const initialFilters = {
  search: "",
  matiereId: "",
  typeDocument: "",
  dossierId: "",
};

export const useMyDocuments = ({
  initialPage = 1,
  initialPageSize = 20,
} = {}) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
    pages: 1,
  });

  const fetchDocuments = useCallback(async (page, pageSize, currentFilters) => {
    setLoading(true);
    setError(null);

    try {
      const data = await myDocument({
        page,
        pageSize,
        search: currentFilters.search || undefined,
        matiereId: currentFilters.matiereId || undefined,
        typeDocument: currentFilters.typeDocument || undefined,
        dossierId: currentFilters.dossierId || undefined,
      });

      setDocuments(data.items);

      setPagination({
        page: data.page,
        pageSize: data.page_size,
        total: data.total,
        pages: data.pages,
      });

      return data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments(initialPage, initialPageSize, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDocuments, initialPage, initialPageSize]);

  const goToPage = (page) => {
    return fetchDocuments(page, pagination.pageSize, filters);
  };

  const refresh = () => {
    return fetchDocuments(pagination.page, pagination.pageSize, filters);
  };

  // Met à jour un ou plusieurs filtres et repart toujours à la page 1
  const updateFilters = (newFilters) => {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);
    fetchDocuments(1, pagination.pageSize, merged);
  };

  const deleteDocument = async (documentId) => {
    setLoading(true);
    setError(null);

    try {
      await deleteDocumentApi(documentId);

      setDocuments((currentDocuments) =>
        currentDocuments.filter((document) => document.id !== documentId),
      );
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    documents,
    pagination,
    filters,
    loading,
    error,
    goToPage,
    refresh,
    updateFilters,
    deleteDocument,
  };
};
