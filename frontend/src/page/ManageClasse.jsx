import React from "react";
import { useParams } from "react-router-dom";

export default function ManageClasse() {
  const { classeId } = useParams();
  return <div>ManageClasse : {classeId}</div>;
}
