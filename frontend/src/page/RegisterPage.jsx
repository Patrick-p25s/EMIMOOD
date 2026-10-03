import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import InputLabeled from "@/components/common/forms/InputLabeled";
import { ButtonStyled } from "@/components/common/forms/ButtonStyled";
import FormCard from "@/components/common/forms/FormCard";
import Section from "@/components/landing/Section";
import { getErrorDetails } from "@/utils/getErrorMessage";

const REQUIRED_FIELDS = [
  ["firstName", "Le nom est obligatoire."],
  ["lastName", "Le prénom est obligatoire."],
  ["matricule", "Le matricule est obligatoire."],
  ["phoneNumber", "Le numéro de téléphone est obligatoire."],
  ["codeInvitation", "Le code d’invitation est obligatoire."],
];

function validateRegister(data) {
  const errors = {};
  REQUIRED_FIELDS.forEach(([field, message]) => {
    if (!data[field].trim()) errors[field] = message;
  });
  if (!data.email.trim()) errors.email = "L’adresse e-mail est obligatoire.";
  else if (!/^\S+@\S+\.\S+$/.test(data.email)) errors.email = "Saisissez une adresse e-mail valide.";
  if (!data.password) errors.password = "Le mot de passe est obligatoire.";
  return errors;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", matricule: "", phoneNumber: "", email: "", password: "", codeInvitation: "" });
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const clearFieldError = (field) => {
    setError(null);
    setFieldErrors((current) => {
      const { [field]: _, ...remaining } = current;
      return remaining;
    });
  };

  const handleSubmit = async () => {
    const validationErrors = validateRegister(formData);
    if (Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors);
      setError("Vérifiez les champs signalés ci-dessous.");
      return;
    }
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      const user = await register({ ...formData, email: formData.email.trim() });
      navigate(
        ["student", "etudiant"].includes(user.role) ? "/dashboard" : "/admin",
        { replace: true },
      );
    } catch (requestError) {
      const details = getErrorDetails(requestError);
      setError(details.message);
      setFieldErrors(details.fieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section className="bg-[radial-gradient(circle_at_top,oklch(from_var(--primary)_l_c_h_/_0.13),transparent_42%)]" title="Créez votre compte" description="Les informations demandées permettent de vous rattacher à votre classe.">
      <FormCard
        className="max-w-2xl"
        contentClassName="gap-5"
        title="Inscription"
        description="Les champs marqués d’un astérisque sont obligatoires."
        onSubmit={handleSubmit}
        error={error}
        loading={isSubmitting}
        footer={<p className="text-center text-sm text-muted-foreground">Vous avez déjà un compte ? <Link className="font-medium text-primary hover:underline" to="/login">Se connecter</Link></p>}
      >
        <ChampUsersCreate value={formData} setValue={setFormData} errors={fieldErrors} onFieldChange={clearFieldError} isCode className="grid gap-5 sm:grid-cols-2" />
        <ButtonStyled type="submit" size="lg" className="mt-2 w-full" icon={<UserPlus className="h-4 w-4" />} loading={isSubmitting} loadingText="Création du compte…">
          Créer mon compte
        </ButtonStyled>
      </FormCard>
    </Section>
  );
}

export function ChampUsersCreate({ value, setValue, errors = {}, onFieldChange, isCode = false, isEdit = false, className }) {
  const inputProps = (name) => ({ error: errors[name], onChange: () => onFieldChange?.(name) });
  return (
    <div className={className}>
      <InputLabeled value={value.firstName} name="firstName" label="Nom" setValue={setValue} required placeholder="Ex. Rakoto" autoComplete="family-name" {...inputProps("firstName")} />
      <InputLabeled value={value.lastName} name="lastName" label="Prénom" setValue={setValue} required placeholder="Ex. Jean" autoComplete="given-name" {...inputProps("lastName")} />
      <InputLabeled value={value.matricule} name="matricule" label="Matricule" setValue={setValue} required placeholder="Ex. 354I25" {...inputProps("matricule")} />
      <InputLabeled value={value.phoneNumber} name="phoneNumber" label="Numéro de téléphone" setValue={setValue} required placeholder="Ex. 038 85 454 19" autoComplete="tel" {...inputProps("phoneNumber")} />
      <InputLabeled type="email" name="email" label="Adresse e-mail" value={value.email} required setValue={setValue} placeholder="vous@exemple.com" autoComplete="email" {...inputProps("email")} />
      {!isEdit && <InputLabeled type="password" label="Mot de passe" value={value.password} name="password" setValue={setValue} required autoComplete="new-password" {...inputProps("password")} />}
      {isCode && <InputLabeled className="sm:col-span-2" label="Code d’invitation de la classe" value={value.codeInvitation} setValue={setValue} name="codeInvitation" required description="Le code vous est communiqué par votre établissement." {...inputProps("codeInvitation")} />}
    </div>
  );
}
