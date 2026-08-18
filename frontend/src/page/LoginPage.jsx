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
import { useNavigate } from "react-router-dom";
import useAuth from "@/hook/useAuth";
import InputLabeled from "@/components/shared/InputLabeled";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import FormCard from "@/components/shared/FormCard";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [erreur, setErreur] = React.useState(null);
  const [isSubmiting, setIsSubmiting] = React.useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setIsSubmiting(true);
    console.log(email, password);
    try {
      const user = await login(email, password);
      user.role === "admin"
        ? navigate("/admin", { replace: true })
        : navigate("/dashboard", { replace: true });
    } catch (e) {
      setErreur(e.message.toString());
    } finally {
      setIsSubmiting(false);
    }
  };
  return (
    <FormCard
      title="Formulaire de connection"
      description="Entrez votre email et mot de passe pour connecter"
      error={erreur ? erreur : null}
      onSubmit={handleSubmit}
      loading={isSubmiting}
    >
      <div className="flex flex-col gap-6">
        <InputLabeled
          onChange={() => setErreur(null)}
          label="Email "
          description="Entrer une email validé"
          type="email"
          value={email}
          required
          setValue={setEmail}
        />
        <InputLabeled
          onChange={() => setErreur(null)}
          required
          type="password"
          label="Mot de passe"
          value={password}
          setValue={setPassword}
        />
      </div>
      <ButtonStyled loading={isSubmiting} loadingText="Connection  en cours ">
        Se connecter
      </ButtonStyled>
    </FormCard>
  );
}
