import { createDocument, downloadDocument } from "@/api/documentService";
import StudentLayout from "@/layout/StudentLayout";

export default function MyDashboard() {
  const handleCreate = async (data) => {
    try {
      const res = await createDocument(data);
    } catch (error) {
      console.log("Erreur ", error.message);
    }
  };
  return (
    <div>
      <StudentLayout matieres={[]} onCreateDocument={handleCreate} />
    </div>
  );
}
