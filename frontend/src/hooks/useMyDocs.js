import {
  deleteDocument as deleteDocumentApi,
  myDocument,
} from "@/api/documentService";
import { useCallback, useEffect, useState } from "react";

export const useMyDocuments = ({
  initialPage = 1,
  initialPageSize = 20,
} = {}) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
    pages: 1,
  });

  const fetchDocuments = useCallback(async (page, pageSize) => {
    setLoading(true);
    setError(null);

    try {
      const data = await myDocument({
        page,
        pageSize,
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
    fetchDocuments(initialPage, initialPageSize);
  }, [fetchDocuments, initialPage, initialPageSize]);

  const goToPage = (page) => {
    return fetchDocuments(page, pagination.pageSize);
  };

  const refresh = () => {
    return fetchDocuments(pagination.page, pagination.pageSize);
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
    loading,
    error,
    goToPage,
    refresh,
    deleteDocument,
  };
};
