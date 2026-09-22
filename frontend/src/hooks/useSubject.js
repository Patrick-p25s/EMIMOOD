import {
  createSuject,
  deleteSubject,
  getSubjectById,
  listSubjects,
  updateSuject,
} from "@/api/sujectService";
import { useCallback, useEffect, useState } from "react";

export const useSubject = (initialPage = 1, initialPageSize = 20) => {
  const [subjects, setSujects] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubject = useCallback(
    async (page = pagination.page, pageSize = pagination.pageSize) => {
      setLoading(true);
      setError(null);
      try {
        const data = await listSubjects({ page, pageSize });
        setSujects(data.items);
        setPagination({
          page: data.page,
          pageSize: data.page_size,
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
    fetchSubject(initialPage, initialPageSize);
  }, []);

  const goToPage = (newPage) => {
    fetchSubject(newPage, pagination.pageSize);
  };

  const add = async (newFolder) => {
    setError(null);
    try {
      const created = await createSuject(newFolder);
      await fetchSubject(pagination.page, pagination.pageSize);
      return created;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const remove = async (id) => {
    setError(null);
    try {
      await deleteSubject(id);
      setSujects((prev) => prev.filter((sub) => sub.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const getById = async (id) => {
    setError(null);
    try {
      const data = await getSubjectById(id);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const update = async (id, data) => {
    setError(null);
    try {
      const activated = await updateSuject(id, data);
      setSujects((prev) =>
        prev.map((subject) =>
          subject.id === id
            ? {
                ...subject,
                name: data.name,
                description: data.description,
                semester: data.semester,
                coefficient: data.coefficient,
              }
            : subject,
        ),
      );
      return activated;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    subjects,
    loading,
    error,
    pagination,
    goToPage,
    refresh: () => fetchSubject(pagination.page, pagination.pageSize),
    add,
    getById,
    update,
    remove,
  };
};
