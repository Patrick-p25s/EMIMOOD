import React, { useState } from "react";
import useClasse from "./useClasse";
import InputLabeled from "@/components/shared/InputLabeled";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import useYear from "../year/useYear";

export default function ClasseBlog() {
  const { classes, createClasse, deleteClasse, updateClasse } = useClasse();
  const { getActiveYear } = useYear();
  const [classeData, setClasseData] = useState({
    mention: "",
    niveau: "",
  });
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur(null);
    setLoading(true);

    try {
      const year_actif = await getActiveYear();
      await createClasse(classeData, year_actif?.id || "");
    } catch (error) {
      setErreur(error.message.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <InputLabeled
          label="Mention"
          value={classeData.mention}
          setValue={setClasseData}
          name="mention"
        />
        <InputLabeled
          label="Niveau"
          value={classeData.niveau}
          setValue={setClasseData}
          name="niveau"
        />
        <ButtonStyled type="submit">Ajouter</ButtonStyled>
      </form>
    </div>
  );
}
