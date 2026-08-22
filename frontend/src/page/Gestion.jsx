import { ButtonStyled } from "@/components/shared/ButtonStyled";
import FormModal from "@/components/shared/FormModal";
import StudentCard from "@/components/shared/StudentCard";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import RegisterPage from "./public/RegisterPage";
import { ChampUsersCreate } from "./public/RegisterPage";
import UserProfileModal from "@/components/special/StudentProfileModal";
export default function Gestion() {
  // 1. Valeurs de secours pour éviter que 'allStudents' ou 'userClasse' fasse planter le composant
  const {
    studentTraite = [],
    user,
    createStudent,
    deleteStudent,
    updateProfile,
    getMyProfile,
    getStudentClasse,
    studentDocument,
  } = useOutletContext() || {};

  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null); // Pour l'édition si besoin
  const isEditing = Boolean(selectedStudent);
  const [studentProfile, setStudentProfile] = useState({
    user: {},
    classe: {},
    stats: {},
  });
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
  const [openProfile, setOpenProfile] = useState(false);
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
        const newUser = await createStudent(
          newStudent,
          user.class_id,
          "student",
        );
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

  const handleProfile = async (studentId) => {
    setOpenProfile(true);
    if (!studentId) return;
    const student = await getMyProfile(studentId);
    const studentClasse = await getStudentClasse(student.id);
    const document = await studentDocument(studentId);
    const pendindDocs = document?.filter((docs) => docs.statut === "pending");
    setStudentProfile({
      user: student,
      classe: { studentClasse },
      stats: {
        documentsCount: document.length,
        pendingCount: pendindDocs.length,
        savedCound: 1,
      },
    });
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

      {/* Grille responsive d'étudiants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studentTraite.map((student) => (
          <StudentCard
            student={{
              ...student,
              niveau: user?.classe_id,
              mention: user?.classe_id,
            }}
            key={student.id}
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
