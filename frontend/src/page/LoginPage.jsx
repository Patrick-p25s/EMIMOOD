import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import InputLabeled from "@/components/common/forms/InputLabeled";
import { ButtonStyled } from "@/components/common/forms/ButtonStyled";
import FormCard from "@/components/common/forms/FormCard";
import Section from "@/components/landing/Section";
import { getErrorDetails } from "@/utils/getErrorMessage";

const validateLogin = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) errors.email = "L’adresse e-mail est obligatoire.";
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Saisissez une adresse e-mail valide.";
  if (!password) errors.password = "Le mot de passe est obligatoire.";
  return errors;
};

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const clearFieldError = (field) => {
    setError(null);
    setFieldErrors((current) => {
      const { [field]: _, ...remaining } = current;
      return remaining;
    });
  };

  const handleSubmit = async () => {
    const validationErrors = validateLogin({ email, password });
    if (Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors);
      setError("Vérifiez les champs signalés ci-dessous.");
      return;
    }

    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      const loggedUser = await login(email.trim(), password);
      navigate(
        ["student", "etudiant"].includes(loggedUser?.role)
          ? "/dashboard"
          : "/admin",
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
    <Section
      className="grid min-h-[calc(100vh-11rem)] place-items-center bg-[radial-gradient(circle_at_top,oklch(from_var(--primary)_l_c_h_/_0.13),transparent_42%)]"
      title="Bon retour parmi nous"
      description="Connectez-vous pour retrouver vos documents, classes et annonces."
    >
      <FormCard
        title="Connexion"
        description="Utilisez l’adresse e-mail associée à votre compte."
        error={error}
        onSubmit={handleSubmit}
        loading={isSubmitting}
        footer={<p className="text-center text-sm text-muted-foreground">Vous n’avez pas encore de compte ? <Link className="font-medium text-primary hover:underline" to="/register">S’inscrire</Link></p>}
      >
        <div className="flex flex-col gap-5">
          <InputLabeled onChange={() => clearFieldError("email")} label="Adresse e-mail" type="email" value={email} error={fieldErrors.email} required autoComplete="email" placeholder="vous@exemple.com" setValue={setEmail} />
          <InputLabeled onChange={() => clearFieldError("password")} required type="password" label="Mot de passe" value={password} error={fieldErrors.password} autoComplete="current-password" setValue={setPassword} />
        </div>
        <ButtonStyled type="submit" size="lg" className="mt-2 w-full" icon={<LockKeyhole className="h-4 w-4" />} loading={isSubmitting} loadingText="Connexion en cours…">
          Se connecter <ArrowRight className="h-4 w-4" />
        </ButtonStyled>
      </FormCard>
    </Section>
  );
}
