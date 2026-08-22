import { useState } from "react";

export default function useStudentManager({
  createStudentFn,
  updateProfileFn,
  deleteStudentFn,
  getMyProfileFn,
  getStudentClasseFn,
  studentDocumentFn,
  defaultClasseId = null,
}) {
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
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

  const [studentProfile, setStudentProfile] = useState({
    user: {},
    classe: {},
    stats: {},
  });

  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(false);

  // Réinitialisation propre du formulaire
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

  // Soumission (Création / Edition)
  const handleSubmit = async () => {
    setErreur(null);
    setLoading(true);
    try {
      if (isEditing) {
        if (updateProfileFn)
          await updateProfileFn(selectedStudent.id, newStudent);
      } else {
        if (createStudentFn) {
          await createStudentFn(newStudent, defaultClasseId, "student");
        }
      }
      handleOpenChange(false);
    } catch (e) {
      setErreur(
        e?.message || "Une erreur est survenue lors de l'enregistrement.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Suppression
  const handleDelete = async (student) => {
    const studentId = student?.id || student;
    if (!studentId) return;

    if (!window.confirm("Voulez-vous vraiment retirer cet étudiant ?")) return;

    setLoading(true);
    try {
      if (deleteStudentFn) {
        await deleteStudentFn(studentId);
      }
    } catch (e) {
      setErreur(e?.message || "Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  // Préparation de l'édition
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

  // Chargement des données du profil
  const handleProfile = async (studentId) => {
    setOpenProfile(true);
    if (!studentId) return;
    try {
      const student = getMyProfileFn ? await getMyProfileFn(studentId) : {};
      const studentClasse = getStudentClasseFn
        ? await getStudentClasseFn(student.id)
        : {};
      const documents = studentDocumentFn
        ? await studentDocumentFn(studentId)
        : [];

      const docsArray = Array.isArray(documents) ? documents : [];
      const pendingDocs = docsArray.filter((doc) => doc.statut === "pending");

      setStudentProfile({
        user: student,
        classe: studentClasse,
        stats: {
          documentsCount: docsArray.length,
          pendingCount: pendingDocs.length,
          savedCount: 0,
        },
      });
    } catch (err) {
      console.error("Erreur chargement profil:", err);
    }
  };

  return {
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
  };
}
