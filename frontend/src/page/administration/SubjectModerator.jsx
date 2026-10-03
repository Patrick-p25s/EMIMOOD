import FormModal from "@/components/common/forms/FormModal";
import InputLabeled from "@/components/common/forms/InputLabeled";
import TextareaLabeled from "@/components/common/forms/TextareaLabeled";
import React, { useEffect, useState } from "react";
import MatiereCard from "@/components/features/subjects/MatiereCard";
import { useSubject } from "@/hooks/useSubject";
import AlertBox from "@/components/common/feedback/AlertBox";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { BookOpen, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyCard } from "@/components/common/feedback/EmptyCard";
import AdminPageHeader from "@/components/features/admin/AdminPageHeader";

export default function SubjectAdministration() {
  const {
    subjects,
    add,
    remove,
    update,
    error,
    loading,
    pagination,
  } = useSubject();

  const [open, setOpen] = useState(false);
  const [updated, setUpdated] = useState(null);
  const isEditing = Boolean(updated);

  const [newData, setNewData] = useState({
    name: "",
    description: "",
    coefficient: "",
    semester: "",
  });

  const [erreur, setErreur] = useState(null);
  const [loadingAct, setLoadAct] = useState(false);

  // Synchronisation du formulaire à l'ouverture en modification ou création
  useEffect(() => {
    if (updated) {
      setNewData({
        name: updated.name || updated.titre || updated.nom || "",
        description: updated.description || "",
        coefficient: updated.coefficient ?? updated.coef ?? "",
        semester: updated.semester || updated.semestre || "",
      });
    } else {
      setNewData({
        name: "",
        description: "",
        coefficient: "",
        semester: "",
      });
    }
  }, [updated]);

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setUpdated(null);
      setErreur(null);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoadAct(true);
    setErreur(null);

    try {
      if (isEditing) {
        await update(updated.id, newData);
      } else {
        await add(newData);
      }

      // Fermeture et réinitialisation UNIQUEMENT en cas de succès
      setOpen(false);
      setUpdated(null);
      setNewData({
        name: "",
        description: "",
        coefficient: "",
        semester: "",
      });
    } catch (err) {
      setErreur(getErrorMessage(err));
    } finally {
      setLoadAct(false);
    }
  };

  const handleUpdate = (subject) => {
    setUpdated(subject);
    setOpen(true);
  };

  const handleOpenCreate = () => {
    setUpdated(null);
    setOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <AdminPageHeader icon={BookOpen} title="Matières" description="Définissez les matières, coefficients et semestres de chaque cursus." meta={`${pagination.total ?? subjects.length} matière${(pagination.total ?? subjects.length) > 1 ? "s" : ""} configurée${(pagination.total ?? subjects.length) > 1 ? "s" : ""}`} actionLabel="Ajouter une matière" actionIcon={<Plus className="size-4" />} onAction={handleOpenCreate} />

      {(erreur || error) && <AlertBox variant="error" title="Une erreur est survenue">{erreur || getErrorMessage(error)}</AlertBox>}

      <FormModal
        open={open}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        error={erreur}
        loading={loadingAct}
        submitLabel={isEditing ? "Modifier" : "Créer"}
        title={
          isEditing ? "Modifier la matière" : "Ajouter une nouvelle matière"
        }
        description="Renseignez les informations pédagogiques de cette matière."
        onCancel={() => {
          setUpdated(null);
          setOpen(false);
        }}
      >
        <InputLabeled
          label="Nom de la matière"
          name="name"
          value={newData.name}
          setValue={setNewData}
        />
        <TextareaLabeled
          label="Description"
          id="description"
          name="description"
          value={newData.description}
          setValue={setNewData}
          placeholder="Matière obligatoire"
        />
        <div className="grid grid-cols-2 gap-2">
          <InputLabeled
            type="number"
            label="Coefficient"
            value={newData.coefficient}
            setValue={setNewData}
            name="coefficient"
          />
          <InputLabeled
            type="text"
            label="Semestre actuel"
            value={newData.semester}
            setValue={setNewData}
            name="semester"
          />
        </div>
      </FormModal>

      {loading ? <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-40 rounded-xl" />)}</div> : subjects.length === 0 ? <EmptyCard icon={BookOpen} title="Aucune matière configurée" description="Ajoutez une première matière pour commencer." /> : <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{subjects.map((matiere) => <MatiereCard matiere={matiere} key={matiere.id} onDelete={() => remove(matiere.id)} onUpdate={() => handleUpdate(matiere)} />)}</div>}
    </div>
  );
}
