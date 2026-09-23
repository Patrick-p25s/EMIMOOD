import {
  createFolder,
  deleteFolder,
  getFolderById,
  getUsersFolders,
  updateFolder,
} from "@/api/folderService";
import { useCallback, useEffect, useState } from "react";

export const useFolder = (initialPage = 1, initialPageSize = 20) => {
  const [folders, setFolders] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchtFolder = useCallback(
    async (page = pagination.page, pageSize = pagination.pageSize) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUsersFolders({ page, pageSize });
        setFolders(data.items);
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
    fetchtFolder(initialPage, initialPageSize);
  }, []);

  const goToPage = (newPage) => {
    fetchtFolder(newPage, pagination.pageSize);
  };

  const add = async (newFolder) => {
    setError(null);
    try {
      const created = await createFolder(newFolder);
      await fetchtFolder(pagination.page, pagination.pageSize);
      return created;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const remove = async (id) => {
    setError(null);
    try {
      await deleteFolder(id);
      setFolders((prev) => prev.filter((y) => y.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const getById = async (id) => {
    setError(null);
    try {
      const data = await getFolderById(id);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const update = async (id, data) => {
    setError(null);
    try {
      const activated = await updateFolder(id, data);
      setFolders((prev) =>
        prev.map((folder) => ({ ...folder, is_active: folder.id === id })),
      );
      return activated;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    folders,
    loading,
    error,
    pagination,
    goToPage,
    refresh: () => fetchtFolder(pagination.page, pagination.pageSize),
    add,
    getById,
    update,
    remove,
  };
};
