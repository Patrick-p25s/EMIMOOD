import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import InputLabeled from "@/components/shared/InputLabeled";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import FormCard from "@/components/shared/FormCard";

export default function RegisterPage() {
  const [formData, setFormData] = React.useState({
    first_name: "",
    email: "",
    password_hash: "",
    classe_id: "",
  });
  const [erreur, setErreur] = React.useState(null);
  const [isSubmiting, setIsSubmiting] = React.useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur(null);
    setIsSubmiting(true);
    try {
      await register(formData);
      navigate("/admin");
    } catch (e) {
      setErreur(e.message.toString());
    } finally {
      setIsSubmiting(false);
    }
  };
  return (
    <FormCard
      title="S'inscrire dans notre plateforme"
      description="Remplir tous les champs par des value que vous souviendrez"
      onSubmit={handleSubmit}
      error={erreur}
      loading={isSubmiting}
    >
      <div className="flex flex-col gap-6">
        {/* champ pour nom et prenom  */}
        <InputLabeled
          value={formData.first_name}
          name="first_name"
          label="Nom et prénom"
          setValue={setFormData}
          required
          description="Entre nom et prénom ici"
        />

        {/* champ pour email  */}
        <InputLabeled
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          required
          setValue={setFormData}
        />

        {/* champ pour le mot de passe */}
        <InputLabeled
          type="password"
          label="Mot de passe "
          value={formData.password_hash}
          name="password_hash"
          setValue={setFormData}
          required
        />

        {/* champ pour classe_id */}
        <InputLabeled
          label="Identifiant d'une classe "
          value={formData.classe_id}
          setValue={setFormData}
          name="classe_id"
          description="Entrer l'id de votre classe"
        />
      </div>
      <ButtonStyled loading={isSubmiting} loadingText="Inscritption en cours ">
        S'inscrire
      </ButtonStyled>
    </FormCard>
  );
}
