import { getStats } from "@/api/documentService";
import { updatePassword } from "@/api/userService";
import AlertBox from "@/components/common/feedback/AlertBox";
import FormModal from "@/components/common/forms/FormModal";
import InputLabeled from "@/components/common/forms/InputLabeled";
import TextareaLabeled from "@/components/common/forms/TextareaLabeled";
import ProfileStudent from "@/components/features/users/ProfileStudent";
import useAuth from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";

export default function ProfileManage() {
  const { user, update } = useAuth();

  const [stats, setStats] = useState({
    documentsCount: 0,
    savedCount: 0,
    pendingCount: 0,
  });

  const [actError, setActError] = useState(null);
  const [actLoading, setActLoading] = useState(false);

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

  const getStatiStique = async (userId = null) => {
    setActError(null);
    setActLoading(true);
    try {
      const response = await getStats(userId);
      setStats({
        documentsCount: response.document,
        savedCount: response.saved,
        pendingCount: response.pending,
      });
      return response;
    } catch (err) {
      setActError(err);
    } finally {
      setActLoading(false);
    }
  };

  useEffect(() => {
    getStatiStique();
  }, []);

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
    setActError(null);
    setActLoading(true);
    try {
      await update(profile);
      setOpenProfile(false);
    } catch (err) {
      setActError(err.message?.toString());
    } finally {
      setActLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    setActError(null);
    setActLoading(true);
    try {
      await updatePassword({
        password: password.password,
        newPassword: password.newPassword,
      });
      setPassword({ password: "", newPassword: "" });
      setOpenPassword(false);
    } catch (err) {
      setActError(err.message?.toString());
    } finally {
      setActLoading(false);
    }
  };

  const handleEnvoyerSignal = async () => {
    return null;
    // await envoyerSignalement(signal);
    // setSignal({ titre: "", contenus: "", contact: "" });
    // setOpenSignal(false);
  };

  return (
    <div>
      {actError && (
        <AlertBox variant="error" title="Un erreur se produit">
          {actError || error?.message}
        </AlertBox>
      )}
      <ProfileStudent
        user={user}
        classe={user.classe}
        stats={stats}
        onEditProfile={() => {
          setOpenProfile(true);
          setActError(null);
        }}
        onEditPassword={() => {
          setOpenPassword(true);
          setActError(null);
        }}
        onSignaler={() => {
          setOpenSignal(true);
          setActError(null);
        }}
      />

      {/* Modal : modifier le profil */}
      <FormModal
        open={openProfile}
        onOpenChange={setOpenProfile}
        onSubmit={handleUpdateProfile}
        loading={actLoading}
        error={actError}
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
        loading={actLoading}
        error={actError}
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
        loading={actLoading}
        error={actError}
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
