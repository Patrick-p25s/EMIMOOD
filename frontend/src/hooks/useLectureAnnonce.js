import { annonceLectureData } from "@/fake/lectureAnnonce";
import { useState } from "react";

export function useLectureAnnonce() {
  const [read, setRead] = useState(annonceLectureData);
  const readDocument = async (userId, annonceId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newReading = {
      id: crypto.randomUUID(),
      user_id: userId,
      annonce_id: annonceId,
      create_at: new Date().toISOString(),
    };
    setRead((prev) => [...prev, newReading]);
    return newReading;
  };
  return { read, readDocument };
}
