import * as React from "react";

import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import InputLabeled from "@/components/shared/InputLabeled";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import FormCard from "@/components/shared/FormCard";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [erreur, setErreur] = React.useState(null);
  const [isSubmiting, setIsSubmiting] = React.useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleSubmit = async () => {
    setErreur("");
    setIsSubmiting(true);
    try {
      await login(email, password);

      user?.role !== "student"
        ? navigate("/admin", { replace: true })
        : navigate("/dashboard", { replace: true });
    } catch (e) {
      console.log(e.message);
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
