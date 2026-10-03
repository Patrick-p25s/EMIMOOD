import StudentCard from "@/components/features/users/StudentCard";
import React, { useState } from "react";
import FormModal from "@/components/common/forms/FormModal";
import { ChampUsersCreate } from "../RegisterPage";
import UserProfileModal from "@/components/features/users/StudentProfileModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users } from "lucide-react";
import useStudent from "@/hooks/useStudent";
import { getUserClasse } from "@/api/userService";
import AlertBox from "@/components/common/feedback/AlertBox";
import UserFilterBar from "@/components/features/users/UserFilterBar";
import useAuth from "@/hooks/useAuth";
import { EmptyCard } from "@/components/common/feedback/EmptyCard";
import { getErrorMessage } from "@/utils/getErrorMessage";
import AdminPageHeader from "@/components/features/admin/AdminPageHeader";
import AdminPagination from "@/components/features/admin/AdminPagination";

export default function UsersAdministration() {
  const { role } = useAuth();
  const {
    users,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
    goToPage,
    register,
    updateProfile,
    fetchStat,
    deleteUser,
  } = useStudent();

  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const isEditing = Boolean(selectedStudent);

  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    matricule: "",
    phoneNumber: "",
    email: "",
    password: "",
    codeInvitation: "",
  });

  const [studentProfile, setStudentProfile] = useState({
    user: {},
    classe: {},
    stats: {},
  });

  const [erreur, setErreur] = useState(null);
  const [load, setActionLoad] = useState(false);

  const [openProfile, setOpenProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Réinitialisation propre à la fermeture du modal de formulaire
  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedStudent(null);
      setErreur(null);
      setNewStudent({
        firstName: "",
        lastName: "",
        matricule: "",
        phoneNumber: "",
        email: "",
        password: "",
        codeInvitation: "",
      });
    }
  };

  const handleSubmit = async () => {
    setErreur(null);
    setActionLoad(true);

    try {
      if (isEditing) {
        await updateProfile(selectedStudent.id, newStudent);
      } else {
        await register(newStudent);
      }
      handleOpenChange(false);
    } catch (e) {
      setErreur(
        getErrorMessage(e),
      );
    } finally {
      setActionLoad(false);
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

    setActionLoad(true);
    setErreur(null);
    try {
      await deleteUser(studentId);
    } catch (e) {
      setErreur(getErrorMessage(e));
    } finally {
      setActionLoad(false);
    }
  };

  const handleUpdate = (student) => {
    setSelectedStudent(student);
    setNewStudent({
      firstName: student.first_name || "",
      lastName: student.last_name || "",
      matricule: student.matricule || "",
      phoneNumber: student.phone_number || "",
      email: student.email || "",
      password: "",
      codeInvitation: "",
    });
    setOpen(true);
  };

  const handleProfile = async (student) => {
    if (!student) return;

    setOpenProfile(true);
    setProfileLoading(true);
    setProfileError(null);

    try {
      const [classeData, stats] = await Promise.all([
        getUserClasse(student.id),
        fetchStat(student.id),
      ]);

      setStudentProfile({
        user: student,
        classe: classeData,
        stats: {
          documentsCount: stats.document ?? 0,
          pendingCount: stats.pending ?? 0,
          savedCount: stats.saved ?? 0,
        },
      });
    } catch (err) {
      setProfileError(getErrorMessage(err));
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">
      <AdminPageHeader icon={Users} title="Étudiants" description="Inscrivez, consultez et gérez les étudiants de l’établissement." meta={`${pagination.total} étudiant${pagination.total > 1 ? "s" : ""} inscrit${pagination.total > 1 ? "s" : ""}`} actionLabel="Ajouter un étudiant" actionIcon={<Plus className="size-4" />} onAction={() => setOpen(true)} />

      <UserFilterBar
        filters={filters}
        onChange={updateFilters}
        classes={[{ niveau: "L1", mention: "DAII", id: 1 }]}
        showClasseFilter={role === "admin"}
      />

      {(erreur || error) && <AlertBox variant="error" title="Une erreur est survenue">{erreur || getErrorMessage(error)}</AlertBox>}

      <UserProfileModal
        open={openProfile}
        onOpenChange={setOpenProfile}
        classe={studentProfile.classe}
        user={studentProfile.user}
        stats={studentProfile.stats}
        loading={profileLoading}
        error={profileError}
      />

      <FormModal
        open={open}
        onOpenChange={handleOpenChange}
        onSubmit={handleSubmit}
        error={erreur}
        loading={load}
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <AlertBox variant="error" title="Erreur">
          {getErrorMessage(error)}
        </AlertBox>
      ) : users.length === 0 ? (
        <EmptyCard
          icon={Users}
          title="Aucun étudiant inscrit pour le moment."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {users.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onProfile={() => handleProfile(student)}
            />
          ))}
        </div>
      )}

      <AdminPagination pagination={pagination} onPageChange={goToPage} />
    </div>
  );
}
