import StudentCard from "@/components/shared/StudentCard";
import React, { useState } from "react";
import FormModal from "@/components/shared/FormModal";
import { ChampUsersCreate } from "../RegisterPage";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import UserProfileModal from "@/components/special/StudentProfileModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import useStudent from "@/hooks/useStudent";
import { getUserClasse } from "@/api/userService";
import AlertBox from "@/components/shared/AlertBox";
import UserFilterBar from "@/components/shared/UserFilterBar";
import useAuth from "@/hooks/useAuth";

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
        e?.message || "Une erreur est survenue lors de l'enregistrement.",
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
      setErreur(e?.message || "Erreur lors de la suppression de l'étudiant.");
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
      setProfileError(err?.message || "Erreur lors du chargement du profil.");
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Gestion des étudiants</h1>
          <p className="text-sm text-muted-foreground">
            {pagination.total} étudiant{pagination.total > 1 ? "s" : ""} inscrit
            {pagination.total > 1 ? "s" : ""}
          </p>
        </div>
        <ButtonStyled onClick={() => setOpen(true)}>
          Ajouter un étudiant
        </ButtonStyled>
      </div>

      <UserFilterBar
        filters={filters}
        onChange={updateFilters}
        classes={[{ niveau: "L1", mention: "DAII", id: 1 }]}
        showClasseFilter={role === "admin"}
      />

      {erreur ||
        (error && (
          <AlertBox variant="error" title="Un erreur se produit">
            {error || error.message?.toString()}
          </AlertBox>
        ))}

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
        <p className="text-sm text-destructive">Erreur : {error.message}</p>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center border border-dashed rounded-xl text-muted-foreground">
          <Users className="h-8 w-8" />
          <p className="text-sm">Aucun étudiant inscrit pour le moment.</p>
        </div>
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

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => goToPage(pagination.page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} sur {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.pages}
            onClick={() => goToPage(pagination.page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
