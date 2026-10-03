import { useYear } from "@/hooks/useYear";
import React from "react";
import { useState } from "react";
import InputLabeled from "@/components/common/forms/InputLabeled";
import { ButtonStyled } from "@/components/common/forms/ButtonStyled";
import FormModal from "@/components/common/forms/FormModal";
import AlertBox from "@/components/common/feedback/AlertBox";
import { EmptyCard } from "@/components/common/feedback/EmptyCard";
import { Calendar, Plus } from "lucide-react";
import IconBadge from "@/components/shared/IconBadge";
import { getErrorMessage } from "@/utils/getErrorMessage";
import AdminPageHeader from "@/components/features/admin/AdminPageHeader";

export default function YearAdministration() {
  const [open, setOpen] = useState(false);
  const { loading, error, add, remove, activate, years } = useYear();

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <AdminPageHeader icon={Calendar} title="Années universitaires" description="Créez les périodes académiques et définissez l’année active." meta={`${years.length} année${years.length > 1 ? "s" : ""} configurée${years.length > 1 ? "s" : ""}`} actionLabel="Ajouter une année" actionIcon={<Plus className="size-4" />} onAction={() => setOpen(true)} />

      {error && (
        <AlertBox variant="error" title="Une erreur est survenue">
          {getErrorMessage(error)}
        </AlertBox>
      )}

      <YearForm onCreate={add} open={open} onOpen={setOpen} />

      {loading ? <p className="text-sm text-muted-foreground">Chargement des années universitaires…</p> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {years.length > 0 ? (
          years.map((year) => (
            <YearItem
              year={year}
              key={year.id}
              onDelete={remove}
              onActive={activate}
            />
          ))
        ) : (
          <EmptyCard icon={Calendar} title="Aucune année pour le moment" />
        )}
      </div>}
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
      setErreur(getErrorMessage(e));
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
      loading={isSubmiting}
      error={erreur}
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
      setError(getErrorMessage(err));
    } finally {
      setActiveAction(null);
    }
  };

  const isDeleting = activeAction === "delete";
  const isActiveLoading = activeAction === "active";
  const isLoading = activeAction !== null;
  const formattedDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="flex flex-col justify-between p-5 bg-background border border-card rounded-xl shadow-xl hover:shadow-md transition-all gap-4">
      {/* En-tête : Titre et Badge de statut */}
      <div className="flex items-center justify-between pb-3 border-b border-card">
        <h3 className="text-base font-semibold text-foreground tracking-tight">
          {year.label}
        </h3>

        <IconBadge>{year.is_active ? "Actives" : "Inactive"}</IconBadge>
      </div>

      <div className="flex items-center justify-between text-xs text-card-foreground bg-background/20 p-2.5 rounded-lg border border-card">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Début
          </span>
          <span className="font-medium text-foreground mt-0.5">
            {formattedDate(year.start_at)}
          </span>
        </div>
        <span className="text-foreground">→</span>
        <div className="flex flex-col text-right">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Fin
          </span>
          <span className="font-medium text-foreground mt-0.5">
            {formattedDate(year.end_at)}
          </span>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <AlertBox variant="error" title="Une erreur est survenue">
          {error}
        </AlertBox>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-card">
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
