import InputLabeled from "@/components/shared/InputLabeled";
import React, { useState } from "react";
import useYear from "./useYear";
import { Button } from "@/components/ui/button";
import { ButtonStyled } from "@/components/shared/ButtonStyled";

export default function YearForm({ onCreate }) {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [yearData, setYearData] = useState({
    label: "",
    start_at: "",
    end_at: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur(null);
    setIsSubmiting(true);
    try {
      await onCreate(yearData);
    } catch (e) {
      setErreur(e.message.toString());
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputLabeled
        value={yearData.label}
        label="Label de l'anné"
        setValue={setYearData}
        name="label"
      />
      <InputLabeled
        type="datetime"
        label="Date de début"
        value={yearData.start_at}
        name="start_at"
        setValue={setYearData}
      />
      <InputLabeled
        type="datetime"
        label="Date de fini"
        value={yearData.end_at}
        name="end_at"
        setValue={setYearData}
      />
      {erreur && <p className="text-red-500">{erreur}</p>}
      <ButtonStyled loading={isSubmiting} loadingText="Creation en cours ">
        Envoyer
      </ButtonStyled>
    </form>
  );
}
