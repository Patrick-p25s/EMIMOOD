import {
  activeYear,
  createYear,
  deleteYear,
  listYear,
} from "@/api/yearService";
import { useCallback, useEffect, useState } from "react";

export const userYearHook = (initialPage = 1, initialPageSize = 20) => {
  const [years, setYears] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchYear = useCallback(
    async (page = pagination.page, pageSize = pagination.pageSize) => {
      setLoading(true);
      setError(null);
      try {
        const data = await listYear({ page, pageSize });
        setYears(data.items);
        console.log(data);
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
    fetchYear(initialPage, initialPageSize);
  }, []);

  const goToPage = (newPage) => {
    fetchYear(newPage, pagination.pageSize);
  };

  const add = async (newYear) => {
    setError(null);
    try {
      const created = await createYear(newYear);
      await fetchYear(pagination.page, pagination.pageSize);
      return created;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const activate = async (id) => {
    setError(null);
    try {
      const activated = await activeYear(id);
      setYears((prev) =>
        prev.map((year) => ({ ...year, is_active: year.id === id })),
      );
      return activated;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const remove = async (id) => {
    setError(null);
    try {
      await deleteYear(id);
      setYears((prev) => prev.filter((y) => y.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    years,
    loading,
    error,
    goToPage,
    refresh: () => fetchYear(pagination.page, pagination.pageSize),
    add,
    activate,
    remove,
  };
};
