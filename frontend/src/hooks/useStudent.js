import {
  createModerator as createModeratorApi,
  deleteUser as deleteUserApi,
  getProfile as getProfileApi,
  listUsers,
  register as registerApi,
  updatePassword as updatePasswordApi,
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
      const updated = await updateProfileApi(newData);
      await fetchUser(pagination.page, pagination.page_size);
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const updatePassword = async (password, newPassword) => {
    setError(null);
    try {
      const updated = await updatePasswordApi({ password, newPassword });
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const getProfile = async () => {
    setError(null);
    try {
      const user = await getProfileApi();
      return user;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const createModerator = async (userData) => {
    setError(null);
    try {
      const user = await createModeratorApi(userData);
      return user;
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
    getProfile,
    updatePassword,
    updateProfile,
    createModerator,
    deleteUser,
  };
}
