import StudentCard from "@/components/shared/StudentCard";
import useStudent from "@/hooks/useStudent";
import React from "react";
import { useState } from "react";
import FormModal from "@/components/shared/FormModal";
import { ChampUsersCreate } from "../RegisterPage";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
export default function Etudiant() {
  const { students, deleteStudent, updateProfile, createStudent } =
    useStudent();
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null); // Pour l'édition si besoin
  const isEditing = Boolean(selectedStudent);

  const [newStudent, setNewStudent] = useState({
    first_name: "",
    last_name: "",
    matricule: "",
    phone_number: "",
    email: "",
    password_hash: "",
    code_invitation: "",
  });

  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(false);

  // Réinitialisation propre à la fermeture du modal
  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedStudent(null);
      setErreur(null);
      setNewStudent({
        first_name: "",
        last_name: "",
        matricule: "",
        phone_number: "",
        email: "",
        password_hash: "",
        code_invitation: "",
      });
    }
  };

  const handleSubmit = async () => {
    setErreur(null);
    setLoading(true);

    try {
      if (isEditing) {
        if (updateProfile) await updateProfile(selectedStudent.id, newStudent);
      } else {
        const user = await createStudent(newStudent, null, "student");
        console.log(user);
      }

      // Fermeture et réinitialisation SEULEMENT si la requête réussit
      handleOpenChange(false);
    } catch (e) {
      setErreur(
        e?.message || "Une erreur est survenue lors de l'enregistrement.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (student) => {
    const studentId = student?.id || student;
    if (!studentId) return;

    if (
      !window.confirm(
        "Voulez-vous vraiment retirer cet étudiant de la classe ?",
      )
    )
      return;

    setLoading(true);
    try {
      if (deleteStudent) {
        await deleteStudent(studentId);
      }
    } catch (e) {
      setErreur(e?.message || "Erreur lors de la suppression de l'étudiant.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (student) => {
    setSelectedStudent(student);
    setNewStudent({
      first_name: student.first_name || "",
      last_name: student.last_name || "",
      matricule: student.matricule || "",
      phone_number: student.phone_number || "",
      email: student.email || "",
      password_hash: "",
      code_invitation: "",
    });
    setOpen(true);
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
}
