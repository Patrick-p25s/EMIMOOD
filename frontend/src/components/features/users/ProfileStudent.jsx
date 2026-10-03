import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Mail,
  Phone,
  GraduationCap,
  FileText,
  Bookmark,
  ShieldCheck,
  User,
  Pencil,
  KeyRound,
  Flag,
  Hash,
  Layers,
  Camera,
} from "lucide-react";
import { getFileUrl } from "@/utils/file";
import { ButtonStyled } from "@/components/common/forms/ButtonStyled";
import IconBadge from "@/components/shared/IconBadge";
import AlertBox from "@/components/common/feedback/AlertBox";
import { uploadeProfilePicture } from "@/api/userService";

export default function ProfileStudent({
  user,
  classe,
  stats = {
    documentsCount: 0,
    savedCount: 0,
    pendingCount: 0,
  },
  onEditProfile,
  onEditPassword,
  onSignaler,
  onUploadAvatar,
}) {
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState(null);

  // Nettoie l'URL locale de prévisualisation à chaque changement/démontage,
  // sinon on accumule des object URLs jamais libérées en mémoire.
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  if (!user) return null;

  const {
    first_name,
    last_name,
    avatar_url,
    email,
    phone_number,
    role,
    matricule,
  } = user;

  const fullName =
    `${first_name || ""} ${last_name || ""}`.trim() || "Utilisateur";

  const userInitials =
    `${first_name?.[0] || ""}${last_name?.[0] || ""}`.toUpperCase() || "U";

  const getRoleBadge = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case "admin":
        return { label: "Administrateur", tone: "primary" };
      case "moderateur":
        return { label: "Modérateur", tone: "primary" };
      case "etudiant":
      default:
        return { label: "Étudiant", tone: "success" };
    }
  };

  const roleInfo = getRoleBadge(role);

  const actions = [
    onEditProfile && {
      key: "profile",
      label: "Modifier le profil",
      icon: Pencil,
      onClick: () => onEditProfile(user),
    },
    onEditPassword && {
      key: "password",
      label: "Modifier le mot de passe",
      icon: KeyRound,
      onClick: () => onEditPassword(user),
    },
    onSignaler && {
      key: "signaler",
      label: "Signaler un problème",
      icon: Flag,
      onClick: () => onSignaler(user),
    },
  ].filter(Boolean);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);
    setAvatarUploading(true);

    try {
      const uploadedAvatar = await uploadeProfilePicture?.(file);
      onUploadAvatar?.(uploadedAvatar);
    } catch {
      setAvatarError("L'envoi de la photo a échoué. Réessaie.");
      setAvatarPreview(null);
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  const displayedAvatarSrc = avatarPreview || getFileUrl(avatar_url);

  return (
    <Card className="relative overflow-hidden bg-card">
      <div className="h-20 border-b bg-muted/45 md:h-24" />

      {actions.length > 0 && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {actions.map(({ key, label, icon: Icon, onClick }) => (
            <ButtonStyled
              key={key}
              variant="secondary"
              size="sm"
              className="gap-1.5 border bg-background text-foreground text-xs shadow-none hover:bg-muted"
              onClick={onClick}
              icon={<Icon className="h-3.5 w-3.5" />}
            >
              <span className="hidden sm:inline">{label}</span>
            </ButtonStyled>
          ))}
        </div>
      )}

      <CardContent className="relative px-4 pb-6 md:px-8 -mt-12 md:-mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            {/* Avatar + overlay upload */}
            <div className="relative shrink-0 group/avatar">
              <Avatar className="h-24 w-24 rounded-2xl border-4 border-card bg-background ring-1 ring-border/50 md:h-32 md:w-32">
                <AvatarImage
                  src={displayedAvatarSrc}
                  alt={fullName}
                  className={`object-cover ${avatarUploading ? "opacity-50" : ""}`}
                />
                <AvatarFallback className="text-xl md:text-2xl font-bold bg-primary/10 text-primary rounded-2xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <ButtonStyled
                variant="secondary"
                size="icon"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full border-2 border-card shadow-none"
                onClick={openFilePicker}
                loading={avatarUploading}
                icon={<Camera className="h-3.5 w-3.5" />}
                title="Changer la photo de profil"
              />
            </div>

            <div className="space-y-1.5 pb-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  {fullName}
                </h2>
                <IconBadge
                  icon={ShieldCheck}
                  tone={roleInfo.tone}
                  className="font-semibold"
                >
                  {roleInfo.label}
                </IconBadge>
              </div>

              <div className="flex items-center gap-3 justify-center sm:justify-start text-xs md:text-sm text-muted-foreground flex-wrap">
                {classe ? (
                  <>
                    <span className="flex items-center gap-1 font-medium text-foreground/80">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      {classe.mention || "Classe non définie"}
                    </span>
                    {classe.niveau && (
                      <span className="flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5" />
                        Niveau : {classe.niveau}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="flex items-center gap-1 text-muted-foreground/70">
                    <GraduationCap className="h-4 w-4" />
                    Aucune classe assignée
                  </span>
                )}

                {matricule && (
                  <span className="flex items-center gap-1 font-mono text-xs bg-muted px-2 py-0.5 rounded">
                    <Hash className="h-3 w-3" />
                    {matricule}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 justify-center sm:justify-start text-xs text-muted-foreground flex-wrap pt-1">
                {email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground/70" />
                    {email}
                  </span>
                )}
                {phone_number && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground/70" />
                    {phone_number}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {avatarError && (
          <div className="mt-4">
            <AlertBox variant="error">{avatarError}</AlertBox>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-8 pt-6 border-t border-border">
          <div className="flex items-center gap-3 rounded-xl border border-border/50 p-3.5">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-foreground">
                {stats.documentsCount ?? 0}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Documents ajoutés
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border/50 p-3.5">
            <div className="p-2.5 rounded-lg bg-warning/10 text-warning shrink-0">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-foreground">
                {stats.savedCount ?? 0}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Enregistrements
              </p>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-3 rounded-xl border border-border/50 p-3.5 md:col-span-1">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-foreground">
                {stats.pendingCount ?? 0}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                En attente de validation
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
