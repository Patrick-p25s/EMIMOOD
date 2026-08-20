import React from "react";
import { useParams } from "react-router-dom";

export default function OneSubjectModerator() {
  const { subjectId } = useParams();
  return <div>OneSubjectModerator {subjectId}</div>;
}
