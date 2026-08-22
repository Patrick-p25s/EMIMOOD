import StudentLayout from "@/layout/StudentLayout";
import { useOutletContext } from "react-router-dom";
export default function ModeratorProfile() {
  const { user, userClasse, allSubjects, allDocuments, createDocument } =
    useOutletContext();
  return (
    <StudentLayout
      user={user}
      classe={userClasse}
      matieres={allSubjects}
      documents={allDocuments}
      onCreateDocument={createDocument}
    />
  );
}
