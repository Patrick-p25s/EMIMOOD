import { userData } from "@/fake/user";
import { Users } from "lucide-react";
import { useState } from "react";

export default function useStudent() {
  const [students, setStudents] = useState(userData);

  const createStudent = async (studentData, classeId, role = "moderator") => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newStudent = {
      id: crypto.randomUUID(),
      first_name: studentData.first_name,
      email: studentData.email,
      password: studentData.password,
      classe_id: classeId,
      role: role,
    };
    setStudents((student) => [...student, newStudent]);
    return newStudent;
  };

  const updateProfile = async (id, studentData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let updatedStudent = null;

    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === id) {
          updatedStudent = {
            ...student,
            first_name: studentData.first_name ?? student.first_name,
            last_name: studentData.last_name ?? student.last_name,
            phone_number: studentData.phone_number ?? student.phone_number,
            updated_at: new Date().toISOString(),
          };
          return updatedStudent;
        }
        return student;
      }),
    );

    return updatedStudent;
  };

  const deleteStudent = async (studentId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStudents((prev) => prev.filter((student) => student.id !== studentId));
  };

  const getStudentById = async (userId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return students.find((student) => student.id === userId);
  };

  const getByClasse = async (classeId) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (!classeId) {
      throw new Error("Aucune classe trouvée");
    }
    return students.filter((student) => student.classe_id === classeId);
  };

  const getMyProfile = async (studentId) =>
    students.find((student) => student.id === studentId);

  const updatePassword = async (studentId, oldPassword, newPassword) => {
    const student = await getStudentById(studentId);
    if (student.password_hash !== oldPassword) {
      throw new Error("Mot de passe incorrect");
    }
    setStudents((std) =>
      std.id === studentId ? { ...std, password_hash: newPassword } : std,
    );
    return student;
  };

  return {
    students,
    updateProfile,
    updatePassword,
    getStudentById,
    getByClasse,
    deleteStudent,
    getMyProfile,
    createStudent,
  };
}
