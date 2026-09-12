import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import InputLabeled from "@/components/shared/InputLabeled";
import { ButtonStyled } from "@/components/shared/ButtonStyled";
import FormCard from "@/components/shared/FormCard";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    matricule: "",
    phoneNumber: "",
    email: "",
    password: "",
    codeInvitation: "",
  });
  const [erreur, setErreur] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

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

export function ChampUsersCreate({
  value,
  setValue,
  isCode = false,
  isEdit = false,
  className,
}) {
  return (
    <div className={className}>
      {/* champ pour nom  */}
      <InputLabeled
        value={value.firstName}
        name="firstName"
        label="Entrez votre nom"
        setValue={setValue}
        required
        placeholder="Ex: John"
      />
      <InputLabeled
        value={value.lastName}
        name="lastName"
        label="Entrez votre prénom"
        setValue={setValue}
        required
        placeholder="Ex : Doe"
      />

      <InputLabeled
        value={value.matricule}
        name="matricule"
        label="Entre votre matricule"
        setValue={setValue}
        required
        placeholder="354I25"
      />
      <InputLabeled
        value={value.phoneNumber}
        name="phoneNumber"
        label="Numéro de téléphone"
        setValue={setValue}
        placeholder="Ex : 038 85 454 19"
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
      {!isEdit && (
        <InputLabeled
          type="password"
          label="Mot de passe "
          value={value.password}
          name="password"
          setValue={setValue}
          required
        />
      )}

      {/* champ pour classe_id */}
      {isCode && (
        <InputLabeled
          label="Identifiant d'une classe "
          value={value.codeInvitation}
          setValue={setValue}
          name="codeInvitation"
          description="Entrer l'id de votre classe"
        />
      )}
    </div>
  );
}
