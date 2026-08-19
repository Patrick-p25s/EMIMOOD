import React, { useState } from "react";
import useClasse from "@/hooks/useClasse";
import InputLabeled from "@/components/shared/InputLabeled";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import { useYear } from "@/context/AnneeContext";
import FormCard from "@/components/shared/FormCard";
import { useNavigate } from "react-router-dom";

export default function Classe() {
  const { classes, createClasse, deleteClasse, updateClasse } = useClasse();
  const { getYearActive } = useYear();
  const [classeData, setClasseData] = useState({
    mention: "",
    niveau: "",
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(null);

  const handleDelete = async (e, id) => {
    // Empêche le déclenchement du navigate() de la carte parent
    e.stopPropagation();

    setErreur(null);

    try {
      await deleteClasse(id);
    } catch (error) {
      setErreur(error?.message?.toString() || "Erreur de suppression");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur(null);
    setLoading(true);

    try {
      console.log(getYearActive.id);
      await createClasse(classeData, getYearActive?.id || "");
    } catch (error) {
      setErreur(error.message.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <FormCard
        onSubmit={handleSubmit}
        title="Formulaire pour ajouter la classe "
        loading={loading}
        error={erreur}
      >
        <InputLabeled
          label="Mention"
          value={classeData.mention}
          setValue={setClasseData}
          name="mention"
          onChange={() => setErreur(null)}
        />

        <InputLabeled
          label="Niveau"
          value={classeData.niveau}
          setValue={setClasseData}
          name="niveau"
          onChange={() => setErreur(null)}
        />

        <ButtonStyled
          type="submit"
          disable={loading}
          loading={loading}
          loadingText="Ajout en cours ..."
        >
          Ajouter
        </ButtonStyled>
      </FormCard>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((classe) => {
          return (
            <div
              key={classe.id}
              onClick={() => navigate(`classe/${classe.id}`)}
              className="group relative flex flex-col justify-between p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
            >
              <div className="space-y-2">
                {/* En-tête : Mention & Niveau */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {classe.mention}
                  </h3>
                  <span className="px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                    {classe.niveau}
                  </span>
                </div>

                {/* Code d'invitation */}
                <div className="pt-2 border-t border-accent-foreground">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                    Code d'invitation
                  </p>
                  <p className="text-sm font-mono font-bold text-slate-700 tracking-wide mt-0.5">
                    {classe.code_invitation}
                  </p>
                </div>
              </div>

              {/* Bouton d'action */}
              <div className="mt-5 pt-3 flex justify-end border-t border-slate-100">
                <ButtonStyled
                  variant="destructive"
                  loadingText="Suppression..."
                  onClick={(e) => handleDelete(e, classe.id)}
                >
                  Supprimer
                </ButtonStyled>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
