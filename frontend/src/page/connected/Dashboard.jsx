import React, { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import StudentLayout from "@/layout/StudentLayout";
import useDocument from "@/hooks/useDocument";
import useClasse from "@/hooks/useClasse";
export default function Dashboard() {
  const { user } = useAuth();

  // States pour stocker les données de la classe et des matières
  const [classe, setClasse] = useState(null);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const { classDocs, getStudentClasse, getMatiere } = useClasse();

  // Hook ou state pour gérer les documents
  const { documents, createDocument } = useDocument();

  useEffect(() => {
    const loadStudentData = async () => {
      if (!user?.classe_id) return;

      try {
        setLoading(true);

        const classeStudent = await getStudentClasse(user.id);
        const matiereStudent = await getMatiere(user.classe_id);
        setClasse(classeStudent);

        setMatieres(matiereStudent);

        if (classDocs) {
          await classDocs(user.classe_id);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [user]);

  const handleCreateDocument = async (documentData, matiereId) => {
    return await createDocument(documentData, matiereId, user.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Chargement de l'espace étudiant...
      </div>
    );
  }

  return (
    <StudentLayout
      user={user}
      classe={classe}
      matieres={matieres}
      documents={documents}
      onCreateDocument={handleCreateDocument}
    />
  );
}
