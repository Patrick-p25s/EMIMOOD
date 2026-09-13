import { ButtonStyled } from "@/components/shared/ButtonStyled";
import FormModal from "@/components/shared/FormModal";
import InputLabeled from "@/components/shared/InputLabeled";
import TextareaLabeled from "@/components/shared/TextareaLabeled";
import ProfileStudent from "@/components/special/ProfileStudent";
import useAuth from "@/hooks/useAuth";
import { useMe } from "@/hooks/useMe";
import React, { useEffect, useMemo, useState } from "react";

export default function ProfileManage() {
  const { user } = useAuth();
  const {
    classe,
    updatePassword,
    updateProfile,
    // envoyerSignalement,
    error,
    loading,
  } = useMe();

  // Un état d'ouverture PAR modal — c'est ça qui manquait
  const [openProfile, setOpenProfile] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [openSignal, setOpenSignal] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [password, setPassword] = useState({
    password: "",
    newPassword: "",
  });

  const [signal, setSignal] = useState({
    titre: "",
    contenus: "",
    contact: "",
  });
  const me = useMemo(() => {
    return user;
  }, [user]);
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phoneNumber: user.phone_number || "",
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    await updateProfile(profile);
    setOpenProfile(false);
  };

  const handleUpdatePassword = async () => {
    await updatePassword(password);
    setPassword({ password: "", newPassword: "" });
    setOpenPassword(false);
  };

  const handleEnvoyerSignal = async () => {
    return null;
    // await envoyerSignalement(signal);
    // setSignal({ titre: "", contenus: "", contact: "" });
    // setOpenSignal(false);
  };

  return (
    <div>
      <ProfileStudent
        user={me}
        classe={classe}
        onEditProfile={() => setOpenProfile(true)}
        onEditPassword={() => setOpenPassword(true)}
        onSignaler={() => setOpenSignal(true)}
      />
      {/* Modal : modifier le profil */}
      <FormModal
        open={openProfile}
        onOpenChange={setOpenProfile}
        onSubmit={handleUpdateProfile}
        loading={loading}
        error={error}
        title="Modifier mon profil"
        submitLabel="Enregistrer"
      >
        <InputLabeled
          label="Prénom"
          name="firstName"
          value={profile.firstName}
          setValue={setProfile}
        />
        <InputLabeled
          label="Nom"
          name="lastName"
          value={profile.lastName}
          setValue={setProfile}
        />
        <InputLabeled
          label="Email"
          name="email"
          type="email"
          value={profile.email}
          setValue={setProfile}
        />
        <InputLabeled
          label="Téléphone"
          name="phoneNumber"
          value={profile.phoneNumber}
          setValue={setProfile}
        />
      </FormModal>

      {/* Modal : modifier le mot de passe */}
      <FormModal
        open={openPassword}
        onOpenChange={setOpenPassword}
        onSubmit={handleUpdatePassword}
        loading={loading}
        error={error}
        title="Modifier le mot de passe"
        submitLabel="Mettre à jour"
      >
        <InputLabeled
          label="Mot de passe actuel"
          name="password"
          type="password"
          value={password.password}
          setValue={setPassword}
        />
        <InputLabeled
          label="Nouveau mot de passe"
          name="newPassword"
          type="password"
          value={password.newPassword}
          setValue={setPassword}
        />
      </FormModal>

      {/* Modal : envoyer un signalement à l'admin */}
      <FormModal
        open={openSignal}
        onOpenChange={setOpenSignal}
        onSubmit={handleEnvoyerSignal}
        loading={loading}
        error={error}
        title="Signaler un problème"
        submitLabel="Envoyer"
      >
        <InputLabeled
          label="Titre"
          name="titre"
          value={signal.titre}
          setValue={setSignal}
          placeholder="Résumé du problème"
        />
        <TextareaLabeled
          label="Description"
          id="contenus"
          value={signal.contenus}
          setValue={setSignal}
          placeholder="Détaille le problème rencontré..."
        />
        <InputLabeled
          label="Contact (optionnel)"
          name="contact"
          value={signal.contact}
          setValue={setSignal}
          placeholder="Email ou téléphone pour te recontacter"
        />
      </FormModal>
    </div>
  );
}
