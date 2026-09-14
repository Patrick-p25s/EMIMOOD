import { useCallback, useEffect, useState } from "react";
import {
  createClasse,
  deleteClasse,
  listClasse,
  regenerateCode,
  updateClasse,
} from "@/api/classeService";

export const useClasse = (initialPage = 1, initialPageSize = 20) => {
  const [classes, setClasses] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClasse = useCallback(
    async (page = pagination.page, pageSize = pagination.pageSize) => {
      setLoading(true);
      setError(null);
      try {
        const data = await listClasse({ page, pageSize });
        setClasses(data.items);
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
    },
    [pagination.page, pagination.pageSize],
  );

  useEffect(() => {
    fetchClasse(initialPage, initialPageSize);
  }, []);

  const goToPage = (newPage) => {
    fetchClasse(newPage, pagination.pageSize);
  };

  const add = async (newClasse) => {
    setError(null);
    try {
      const created = await createClasse(newClasse);
      setClasses((prev) => [...prev, created]);
      return created;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const generate = async (id) => {
    setError(null);
    try {
      const updated = await regenerateCode(id);
      setClasses((prev) => prev.map((cl) => (cl.id === id ? updated : cl)));
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const remove = async (id) => {
    setError(null);
    try {
      await deleteClasse(id);
      setClasses((prev) => prev.filter((cl) => cl.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const update = async (id, newClasse) => {
    setError(null);
    try {
      const updated = await updateClasse(id, newClasse);
      setClasses((prev) =>
        prev.filter((cl) =>
          cl.id === id
            ? { ...cl, niveau: newClasse.niveau, mention: newClasse.mention }
            : cl,
        ),
      );
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    classes,
    error,
    loading,
    pagination,
    goToPage,
    refresh: () => fetchClasse(pagination.page, pagination.pageSize),
    add,
    update,
    remove,
    generate,
  };
};
