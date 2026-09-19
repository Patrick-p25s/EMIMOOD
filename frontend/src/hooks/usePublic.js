import {
  deleteDocument as deleteDocumentApi,
  getPublicDocuments,
  myDocument,
} from "@/api/documentService";
import { listSubjects } from "@/api/sujectService";
import { useCallback, useEffect, useState } from "react";

const initialFilters = {
  search: "",
  matiereId: "",
  typeDocument: "",
  dossierId: "",
};

export const usePublicDocument = (initialPage = 1, initialPageSize = 20) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [subjects, setSubjects] = useState([]);

  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
    pages: 1,
  });

  const fetchClasseSubject = useCallback(async () => {
    setError(null);
    try {
      const subjectList = await listSubjects();
      setSubjects(subjectList.items);
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const fetchDocuments = useCallback(async (page, pageSize, currentFilters) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPublicDocuments({
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
    fetchClasseSubject();
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
    subjects,
    goToPage,
    refresh,
    updateFilters,
    deleteDocument,
  };
};
