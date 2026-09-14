import {
  approveDocument,
  createDocument,
  deleteDocument,
  getNotPrivateDocs,
  rejectDocument,
  updateDocument,
} from "@/api/documentService";
import { useCallback, useEffect, useState } from "react";

const initialFilters = {
  search: "",
  typeDocument: "",
  classeId: "",
};

export default function useDocument(initialPage = 1, initialPageSize = 20) {
  const [documents, setDocuments] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
    pages: 1,
  });
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(async (page, pageSize, currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotPrivateDocs({
        page,
        pageSize,
        search: currentFilters.search || undefined,
        typeDocument: currentFilters.typeDocument || undefined,
        classeId: currentFilters.classeId || undefined,
      });
      setDocuments(data.items);
      setPagination({
        page: data.page,
        pageSize: data.pageSize,
        total: data.total,
        pages: data.pages,
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments(initialPage, initialPageSize, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToPage = (newPage) => {
    fetchDocuments(newPage, pagination.pageSize, filters);
  };

  const updateFilters = (newFilters) => {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);
    fetchDocuments(1, pagination.pageSize, merged);
  };

  const refresh = () =>
    fetchDocuments(pagination.page, pagination.pageSize, filters);

  const add = async (newDocument) => {
    setError(null);
    try {
      const created = await createDocument(newDocument);
      await refresh();
      return created;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const remove = async (id) => {
    setError(null);
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const update = async (id, data) => {
    setError(null);
    try {
      const updated = await updateDocument(id, data);
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                titre: data.titre,
                description: data.description,
                dateLimite: data.dateLimite,
                typeDocument: data.typeDocument,
              }
            : doc,
        ),
      );
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const approve = async (id) => {
    setError(null);
    try {
      const approved = await approveDocument(id);
      setDocuments((prev) =>
        prev.map((document) =>
          document.id === id ? { ...document, statut: "public" } : document,
        ),
      );
      return approved;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const reject = async (id) => {
    setError(null);
    try {
      const activated = await rejectDocument(id);
      setDocuments((prev) =>
        prev.map((document) =>
          document.id === id ? { ...document, statut: "reject" } : document,
        ),
      );
      return activated;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    documents,
    loading,
    error,
    pagination,
    filters,
    goToPage,
    updateFilters,
    refresh,
    add,
    remove,
    update,
    approve,
    reject,
  };
}
