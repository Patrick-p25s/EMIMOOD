import { createContext, useContext, useState } from "react";
import { anneeUniv } from "@/mocks/year";
const AnneeContext = createContext(null);

export function AnneeProvider({ children }) {
  const [years, setYears] = useState(anneeUniv);

  const activeYear = async (yearId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setYears((prev) =>
      prev.map((year) =>
        year.id === yearId
          ? { ...year, is_active: true }
          : { ...year, is_active: false },
      ),
    );
  };

  const createYear = async (yearData) => {
    const exist = years.some((year) => year.label === yearData.label);
    if (exist) {
      throw new Error("Year already exists");
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    const nouvelleAnnee = {
      id: Date.now(), // simple id temporaire pour le mock
      label: yearData.label,
      start_at: yearData.start_at,
      end_at: yearData.end_at,
      is_active: false,
    };
    setYears((prev) => [...prev, nouvelleAnnee]);
  };

  const deleteYear = async (yearId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setYears((prev) => prev.filter((year) => year.id !== yearId));
  };

  const updateYear = async (yearId, yearData) => {
    setYears((prev) =>
      prev.map((year) =>
        year.id === yearId
          ? {
              ...year,
              label: yearData.label,
              start_at: yearData.start_at,
              end_at: yearData.end_at,
            }
          : year,
      ),
    );
  };

  const getActiveYear = years.find((year) => year.is_active) || years[0];

  const value = {
    years,
    getActiveYear,
    activeYear,
    createYear,
    deleteYear,
    updateYear,
  };

  return (
    <AnneeContext.Provider value={value}>{children}</AnneeContext.Provider>
  );
}

export function useYear() {
  const context = useContext(AnneeContext);
  if (!context) {
    throw new Error(
      "useYear doit être utilisé à l'intérieur d'un AnneeProvider",
    );
  }
  return context;
}
