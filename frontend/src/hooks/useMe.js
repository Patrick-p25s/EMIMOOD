import { useCallback, useState, useEffect } from "react";

import {
  getProfile as getProfileApi,
  getUserClasse,
  updatePassword as updatePasswordApi,
  updateProfile as updateProfileApi,
} from "@/api/userService";
import { getStats } from "@/api/documentService";

export const useMe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classe, setClasse] = useState(null);
  const [stats, setStats] = useState({
    documentsCount: 0,
    savedCount: 0,
    pendingCount: 0,
  });
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
  const getStatiStique = useCallback(
    (userId = null) =>
      execute(async () => {
        const response = await getStats(userId);
        setStats({
          documentsCount: response.document,
          savedCount: response.saved,
          pendingCount: response.pending,
        });
        return response;
      }),
    [],
  );

  useEffect(() => {
    getProfile();
    getClasse();
    getStatiStique();
  }, [getProfile, getClasse, getStatiStique]);

  const updateProfile = (data) => execute(() => updateProfileApi(null, data));

  const updatePassword = ({ password, newPassword }) =>
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
    stats,
    classe,
    getProfile,
    getClasse,
    updateProfile,
    updatePassword,
  };
};
