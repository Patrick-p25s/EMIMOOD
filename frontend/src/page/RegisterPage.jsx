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
import useAuth from "@/hook/useAuth";

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
    setErreur("");
    setIsSubmiting(true);
    try {
      await register(formData);
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
          <CardTitle>Sign up to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => navigate("/login")}>
              Login
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* champ pour nom et prenom  */}
              <div className="grid gap-2">
                <Label htmlFor="email-spacing">Nom et prénom</Label>
                <Input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  id="email-spacing"
                  type="text"
                  placeholder="Ex : John Doe"
                  required
                />
              </div>

              {/* champ pour email  */}
              <div className="grid gap-2">
                <Label htmlFor="email-spacing">Email</Label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  id="email-spacing"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>

              {/* champ pour le mot de passe */}
              <div className="grid gap-2">
                <Label htmlFor="email-spacing">Mot de passe</Label>
                <Input
                  name="password_hash"
                  value={formData.password_hash}
                  onChange={handleChange}
                  id="email-spacing"
                  type="password"
                  placeholder="password123"
                  required
                />
              </div>

              {/* champ pour classe_id */}
              <div className="grid gap-2">
                <Label htmlFor="email-spacing">Classe id </Label>
                <Input
                  name="classe_id"
                  value={formData.classe_id}
                  onChange={handleChange}
                  id="email-spacing"
                  type="text"
                  placeholder="&111111"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmiting}>
              {isSubmiting ? "Loading ..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {erreur && <h1 className="text-accent-foreground">{erreur}</h1>}
        </CardFooter>
      </Card>
    </div>
  );
}
