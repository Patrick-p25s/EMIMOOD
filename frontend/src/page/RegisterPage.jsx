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
    code_invitation: "",
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
      const user = await register(formData);
      user.role === "admin"
        ? navigate("/admin", { replace: true })
        : user.role === "moderator"
          ? navigate("/moderator", { replace: true })
          : navigate("/dashboard", { replace: true });
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
        <ChampUsersCreate value={formData} setValue={setFormData} isCode />
      </div>
      <ButtonStyled loading={isSubmiting} loadingText="Inscritption en cours ">
        S'inscrire
      </ButtonStyled>
    </FormCard>
  );
}

export function ChampUsersCreate({ value, setValue, isCode = false }) {
  return (
    <div>
      <InputLabeled
        value={value.first_name}
        name="first_name"
        label="Nom et prénom"
        setValue={setValue}
        required
        description="Entre nom et prénom ici"
      />

      {/* champ pour email  */}
      <InputLabeled
        type="email"
        name="email"
        label="Email"
        value={value.email}
        required
        setValue={setValue}
      />

      {/* champ pour le mot de passe */}
      <InputLabeled
        type="password"
        label="Mot de passe "
        value={value.password_hash}
        name="password_hash"
        setValue={setValue}
        required
      />

      {/* champ pour classe_id */}
      {isCode && (
        <InputLabeled
          label="Identifiant d'une classe "
          value={value.code_invitation}
          setValue={setValue}
          name="code_invitation"
          description="Entrer l'id de votre classe"
        />
      )}
    </div>
  );
}
