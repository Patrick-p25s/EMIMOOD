import { userYearHook } from "@/hooks/useYear";
import React from "react";
import { useState } from "react";
import InputLabeled from "@/components/shared/InputLabeled";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import FormModal from "@/components/shared/FormModal";

export default function YearAdministration() {
  const [open, setOpen] = useState(false);
  const { loading, error, add, remove, activate, years } = userYearHook();

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Anné universitaire blog </h1>
        <ButtonStyled onClick={() => setOpen(true)}>Ajouter</ButtonStyled>
      </div>

      <YearForm onCreate={add} open={open} onOpen={setOpen} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {years.map((year) => (
          <YearItem
            year={year}
            key={year.id}
            onDelete={remove}
            onActive={activate}
          />
        ))}
      </div>
    </div>
  );
}

function YearForm({ onCreate, open, onOpen }) {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [yearData, setYearData] = useState({
    label: "",
    startAt: "",
    endAt: "",
  });

  const handleSubmit = async () => {
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
    <FormModal
      onSubmit={handleSubmit}
      open={open}
      onOpenChange={onOpen}
      submitLabel="Créer"
      title="Remplir tous les champs pour créer"
      labe
      loading={isSubmiting}
    >
      <InputLabeled
        value={yearData.label}
        label="Label de l'anné"
        setValue={setYearData}
        name="label"
      />
      <InputLabeled
        type="datetime-local"
        label="Date de début"
        value={yearData.startAt}
        name="startAt"
        setValue={setYearData}
      />
      <InputLabeled
        type="datetime-local"
        label="Date de fini"
        value={yearData.endAt}
        name="endAt"
        setValue={setYearData}
      />
      {erreur && <p className="text-red-500">{erreur}</p>}
    </FormModal>
  );
}

function YearItem({ year, onDelete, onActive }) {
  const [activeAction, setActiveAction] = useState(null);
  const [error, setError] = useState(null);

  const handleAction = async (actionType, actionFn) => {
    if (!actionFn) return;

    setError(null);
    setActiveAction(actionType);

    try {
      await actionFn(year.id);
    } catch (err) {
      setError(err?.message || "Une erreur est survenue");
    } finally {
      setActiveAction(null);
    }
  };

  const isDeleting = activeAction === "delete";
  const isActiveLoading = activeAction === "active";
  const isLoading = activeAction !== null;

  return (
    <div className="flex flex-col justify-between p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all gap-4">
      {/* En-tête : Titre et Badge de statut */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-base font-semibold text-slate-800 tracking-tight">
          {year.label}
        </h3>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            year.is_active
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-100 text-slate-600 border-slate-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              year.is_active ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />
          {year.is_active ? "Actives" : "Inactive"}
        </span>
      </div>

      {/* Période / Dates */}
      <div className="flex items-center justify-between text-xs text-card-foreground bg-slate-50 p-2.5 rounded-lg border border-slate-100">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Début
          </span>
          <span className="font-medium text-foreground mt-0.5">
            {year.start_at}
          </span>
        </div>
        <span className="text-slate-300">→</span>
        <div className="flex flex-col text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Fin
          </span>
          <span className="font-medium text-foreground mt-0.5">
            {year.end_at}
          </span>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
        {!year.is_active && (
          <ButtonStyled
            loading={isActiveLoading}
            loadingText="Activation en cours"
            onClick={() => handleAction("active", onActive)}
            disabled={isLoading}
          >
            Activer
          </ButtonStyled>
        )}

        <ButtonStyled
          variant="destructive"
          loading={isDeleting}
          loadingText="Suppression en cours"
          onClick={() => handleAction("delete", onDelete)}
          disabled={isLoading}
        >
          Supprimer
        </ButtonStyled>
      </div>
    </div>
  );
}
