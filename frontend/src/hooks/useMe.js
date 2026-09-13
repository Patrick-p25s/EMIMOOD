import { useCallback, useState, useEffect } from "react";

import {
  getProfile as getProfileApi,
  getUserClasse,
  updatePassword as updatePasswordApi,
  updateProfile as updateProfileApi,
} from "@/api/userService";

export const useMe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classe, setClasse] = useState(null);
  const [me, setMe] = useState(null);

  const execute = async (callback) => {
    setLoading(true);
    setError(null);

    try {
      return await callback();
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProfile = useCallback(
    () =>
      execute(async () => {
        const response = await getProfileApi();
        setMe(response);
        return response;
      }),
    [],
  );

  const getClasse = useCallback(
    (userId = null) =>
      execute(async () => {
        const response = await getUserClasse(userId);
        setClasse(response);
        return response;
      }),
    [],
  );

  useEffect(() => {
    getProfile();
    getClasse();
  }, [getProfile, getClasse]);

  const updateProfile = (data) => execute(() => updateProfileApi(data));

  const updatePassword = (password, newPassword) =>
    execute(() =>
      updatePasswordApi({
        password,
        newPassword,
      }),
    );

  return {
    loading,
    error,
    me,
    classe,
    getProfile,
    getClasse,
    updateProfile,
    updatePassword,
  };
};
