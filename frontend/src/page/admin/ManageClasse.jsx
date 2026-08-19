import useAnnonce from "@/hooks/useAnnonce";
import useClasse from "@/hooks/useClasse";
import useStudent from "@/hooks/useStudent";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ManageClasse() {
  const { classeId } = useParams();

  // 1. Récupération des hooks
  const { classes, studentByClasse } = useClasse();
  const { getActiveAnnonce, annonces } = useAnnonce();

  // 2. États locaux pour stocker les résultats asynchrones
  const [annoncesClasse, setAnnoncesClasse] = useState([]);
  const [studentsClasse, setStudentsClasse] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. Recherche synchrone de la classe dans le tableau `classes`
  const classe = classes.find((cl) => cl.id === classeId);

  // 4. Chargement asynchrone des annonces et étudiants associés
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!classeId) return;
      setLoading(true);

      try {
        // Appels parallèles des fonctions asynchrones de vos hooks
        const [annoncesData, studentsData] = await Promise.all([
          getActiveAnnonce(classeId),
          studentByClasse(classeId),
        ]);

        if (isMounted) {
          setAnnoncesClasse(annoncesData);
          setStudentsClasse(studentsData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false; // Empêche les fuites de mémoire si le composant se démonte
    };
  }, [classeId]); // Se déclenche uniquement quand l'ID dans l'URL change

  // 5. Gestion des cas d'erreur et de chargement
  if (!classe) {
    return <div style={{ color: "red" }}>Classe introuvable.</div>;
  }

  if (loading) {
    return <div>Chargement des étudiants et annonces...</div>;
  }

  // 6. Affichage des vraies valeurs
  return (
    <div>
      <h1>ManageClasse : {classe.niveau || classe.mention || classeId}</h1>
      <p>Mention : {classe.mention}</p>
      <p>Code d'invitation : {classe.code_invitation}</p>
      <p>Étudiants inscrits : {studentsClasse.length}</p>
      <p>Annonces de la classe : {annoncesClasse.length}</p>
    </div>
  );
}
