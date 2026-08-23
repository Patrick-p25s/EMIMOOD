import { ButtonStyled } from "@/components/shared/ButtonStyled";
import FormModal from "@/components/shared/FormModal";
import StudentCard from "@/components/shared/StudentCard";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
export default function Gestion() {
  // 1. Valeurs de secours pour éviter que 'allStudents' ou 'userClasse' fasse planter le composant
  const {
    allStudents = [],
    pendingDocs,
    rejectedDocs,
    allDocuments,
    allSubjects,
    allAnnonces,
  } = useOutletContext() || {};

  // const pendingDocsClasse = pendingDocs.filter(docs => docs.cla)

  return <div className="space-y-6">re</div>;
}
