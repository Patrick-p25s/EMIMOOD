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
      await login(email, password);
      navigate("/dashboard");
    } catch (e) {
      setErreur(e.message.toString());
    } finally {
      setIsSubmiting(false);
    }
  };
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => navigate("/register")}>
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <InputLabeled
                label="Email "
                description="Entrer une email validé"
                type="email"
                value={email}
                required
                setValue={setEmail}
              />
              <InputLabeled
                required
                type="password"
                label="Mot de passe"
                value={password}
                setValue={setPassword}
              />
            </div>
            <ButtonStyled
              loading={isSubmiting}
              loadingText="Connection  en cours "
            >
              Se connecter
            </ButtonStyled>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {erreur && <h1 className="text-accent-foreground">{erreur}</h1>}
        </CardFooter>
      </Card>
    </div>
  );
}
