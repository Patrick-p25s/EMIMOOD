import { getStats } from "@/api/documentService";
import {
  createModerator as createModeratorApi,
  deleteUser as deleteUserApi,
  listUsers,
  register as registerApi,
  updateProfile as updateProfileApi,
} from "@/api/userService";
import { useState, useEffect, useCallback } from "react";

export default function useStudent(initialPage = 1, initialPageSize = 20) {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    page_size: initialPageSize,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(
    async (page = pagination.page, pageSize = pagination.page_size) => {
      setLoading(true);
      setError(null);
      try {
        const data = await listUsers({ page, pageSize });
        setUsers(data.items);
        setPagination({
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          pages: data.pages,
        });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.page_size],
  );

  const fetchStat = async (userId = null) => {
    setError(null);
    try {
      if (userId) {
        const st = await getStats(userId);
        return st;
      }
      return null;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUser(initialPage, initialPageSize);
  }, []);

  const goToPage = (newPage) => {
    fetchUser(newPage, pagination.page_size);
  };

  const register = async (newData) => {
    setError(null);
    try {
      const user = await registerApi(newData);
      return user;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const updateProfile = async (id, newData) => {
    setError(null);
    try {
      const updated = await updateProfileApi(id, newData);
      setUsers((prev) =>
        prev.map((us) =>
          us.id === id
            ? {
                first_name: newData.firstName,
                last_name: newData.lastName,
                email: newData.email,
              }
            : us,
        ),
      );
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const deleteUser = async (id) => {
    setError(null);
    try {
      await deleteUserApi(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    goToPage,
    pagination,
    refresh: () => fetchUser(pagination.page, pagination.pageSize),
    register,
    fetchStat,
    updateProfile,
    deleteUser,
  };
}
