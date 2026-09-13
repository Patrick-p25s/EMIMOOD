import {
  activeAnnounce,
  createAnnonce,
  listAnnonces,
} from "@/api/announceService";
import { useCallback, useState, useEffect } from "react";

export default function useAnnonce(initialPage = 1, initialPageSize = 20) {
  const [annonces, setAnnonces] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnnonce = useCallback(
    async (page = pagination.page, pageSize = pagination.pageSize) => {
      setLoading(true);
      setError(null);
      try {
        const data = await listAnnonces({ page, pageSize });
        setAnnonces(data.items);
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
    fetchAnnonce(initialPage, initialPageSize);
  }, []);

  const goToPage = (newPage) => {
    fetchAnnonce(newPage, pagination.pageSize);
  };

  const activeAnnonce = annonces.filter(
    (annonce) => annonce.statut === "active",
  );
  const archiveAnnonce = annonces.filter(
    (annonce) => annonce.statut !== "active",
  );

  const add = async (newAnnonce) => {
    setError(null);
    try {
      const created = await createAnnonce(newAnnonce);
      await fetchAnnonce(pagination.page, pagination.pageSize);
      return created;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // const remove = async (id) => {
  //   setError(null);
  //   try {
  //     await del(id);
  //     setAnnonces((prev) => prev.filter((y) => y.id !== id));
  //   } catch (err) {
  //     setError(err);
  //     throw err;
  //   }
  // };

  const archive = async (id) => {
    setError(null);
    try {
      const archived = await archiveAnnonce(id);
      setAnnonces((prev) =>
        prev.map((annonce) =>
          annonce.id === id ? { ...annonce, statut: "archive" } : annonce,
        ),
      );
      return archived;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const active = async (id) => {
    setError(null);
    try {
      const activated = await activeAnnounce(id);
      setAnnonces((prev) =>
        prev.map((annonce) =>
          annonce.id === id ? { ...annonce, statut: "active" } : annonce,
        ),
      );
      return activated;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    annonces,
    activeAnnonce,
    archiveAnnonce,
    loading,
    error,
    goToPage,
    refresh: () => fetchAnnonce(pagination.page, pagination.pageSize),
    add,
    active,
    archive,
  };
}
