import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import FormModal from "@/components/shared/FormModal";
import StudentCard from "@/components/shared/StudentCard";
import UserProfileModal from "@/components/special/StudentProfileModal";
import { ChampUsersCreate } from "../public/RegisterPage";
import useStudentManager from "@/hooks/useStudentManager";
import useAuth from "@/hooks/useAuth";

export default function StudentModerator() {
  const {
    allStudents,
    createStudent,
    deleteStudent,
    updateProfile,
    getMyProfile,
    getStudentClasse,
    studentDocument,
  } = useOutletContext() || {};

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
    defaultClasseId: getStudentClasse?.id,
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allStudents.map((student) => (
          <StudentCard
            key={student.id}
            student={{
              ...student,
              niveau: getStudentClasse?.niveau,
              mention: getStudentClasse?.mention,
            }}
            onDelete={() => handleDelete(student)}
            onUpdate={() => handleUpdate(student)}
            onProfile={() => handleProfile(student.id)}
          />
        ))}
      </div>

      <UserProfileModal
        open={openProfile}
        onOpenChange={setOpenProfile}
        classe={studentProfile.classe}
        user={studentProfile.user}
        stats={studentProfile.stats}
      />
    </div>
  );
}
