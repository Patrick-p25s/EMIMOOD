import React from "react";
import useStudent from "@/hooks/useStudent";
import useClasse from "@/hooks/useClasse";
import useDocument from "@/hooks/useDocument";
import useStudentManager from "@/hooks/useStudentManager";

import StudentCard from "@/components/shared/StudentCard";
import FormModal from "@/components/shared/FormModal";
import UserProfileModal from "@/components/special/StudentProfileModal";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import { ChampUsersCreate } from "../public/RegisterPage";

export default function Etudiant() {
  const {
    students,
    deleteStudent,
    updateProfile,
    createStudent,
    getMyProfile,
  } = useStudent();
  const { getStudentClasse } = useClasse();
  const { studentDocument } = useDocument();

  const {
    open,
    setOpen,
    openProfile,
    setOpenProfile,
    isEditing,
    newStudent,
    setNewStudent,
    studentProfile,
    erreur,
    loading,
    handleOpenChange,
    handleSubmit,
    handleDelete,
    handleUpdate,
    handleProfile,
  } = useStudentManager({
    createStudentFn: createStudent,
    updateProfileFn: updateProfile,
    deleteStudentFn: deleteStudent,
    getMyProfileFn: getMyProfile,
    getStudentClasseFn: getStudentClasse,
    studentDocumentFn: studentDocument,
    defaultClasseId: null,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Gestion des Étudiants</h1>
        <ButtonStyled onClick={() => setOpen(true)}>
          Ajouter un étudiant
        </ButtonStyled>
      </div>

      {erreur && (
        <div className="p-3 bg-destructive/15 text-destructive rounded-md text-sm">
          {erreur}
        </div>
      )}

      <UserProfileModal
        open={openProfile}
        onOpenChange={setOpenProfile}
        classe={studentProfile.classe}
        user={studentProfile.user}
        stats={studentProfile.stats}
      />

      <FormModal
        open={open}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        error={erreur}
        loading={loading}
        title={
          isEditing ? "Modifier l'étudiant" : "Inscrire un nouvel étudiant"
        }
        submitLabel={isEditing ? "Modifier" : "Créer"}
      >
        <ChampUsersCreate
          className="flex flex-col gap-4"
          value={newStudent}
          setValue={setNewStudent}
          isEdit={isEditing}
        />
      </FormModal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(students || []).map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onDelete={() => handleDelete(student)}
            onUpdate={() => handleUpdate(student)}
            onProfile={() => handleProfile(student.id)}
          />
        ))}
      </div>
    </div>
  );
}
