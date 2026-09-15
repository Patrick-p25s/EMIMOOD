import { activeAnnounce, listActiveAnnonce } from "@/api/announceService";
import {
  deleteDocument as deleteDocumentApi,
  getPublicDocuments,
  myDocument,
} from "@/api/documentService";
import { useCallback, useEffect, useState } from "react";

const initialFilters = {
  search: "",
  matiereId: "",
  typeDocument: "",
  dossierId: "",
};

export const usePublicDocument = (initialPage = 1, initialPageSize = 20) => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
    pages: 1,
  });

  const fetchAnnonce = useCallback(async (page, pageSize, currentFilters) => {
    setLoading(true);
    setError(null);

    try {
      const data = await listActiveAnnonce({
        page,
        pageSize,
        // search: currentFilters.search || undefined,
        // matiereId: currentFilters.matiereId || undefined,
        // typeDocument: currentFilters.typeDocument || undefined,
        // dossierId: currentFilters.dossierId || undefined,
      });

      setAnnonces(data.items);

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
    fetchAnnonce(initialPage, initialPageSize, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAnnonce, initialPage, initialPageSize]);

  const goToPage = (page) => {
    return fetchAnnonce(page, pagination.pageSize, filters);
  };

  const refresh = () => {
    return fetchAnnonce(pagination.page, pagination.pageSize, filters);
  };

  const updateFilters = (newFilters) => {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);
    fetchAnnonce(1, pagination.pageSize, merged);
  };

  return {
    annonces,
    pagination,
    filters,
    loading,
    error,
    goToPage,
    refresh,
    updateFilters,
  };
};
