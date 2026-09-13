import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

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
}) {
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
        return {
          label: "Administrateur",
          className: "bg-purple-500/10 text-purple-600 border-purple-500/30",
        };
      case "moderateur":
        return {
          label: "Modérateur",
          className: "bg-blue-500/10 text-blue-600 border-blue-500/30",
        };
      case "etudiant":
      default:
        return {
          label: "Étudiant",
          className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
        };
    }
  };

  const roleInfo = getRoleBadge(role);

  // Regroupe les actions disponibles selon les handlers reçus en props
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

  return (
    <Card className="relative overflow-hidden border border-border shadow-sm bg-card">
      {/* Couverture / Fond supérieur décoratif */}
      <div className="h-28 md:h-36 bg-linear-to-r from-primary/20 via-primary/10 to-background border-b border-border/50" />

      {/* Actions — flottent au-dessus de la couverture, toujours visibles */}
      {actions.length > 0 && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {actions.map(({ key, label, icon: Icon, onClick }) => (
            <Button
              key={key}
              variant="secondary"
              size="sm"
              className="gap-1.5 text-xs bg-background/80 backdrop-blur-sm border border-border/60 hover:bg-background shadow-sm"
              onClick={onClick}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          ))}
        </div>
      )}

      <CardContent className="relative px-4 pb-6 md:px-8 -mt-12 md:-mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Bloc Photo + Infos Principales */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 rounded-2xl border-4 border-card shadow-md bg-background shrink-0 ring-1 ring-border/50 transition-transform hover:scale-[1.02]">
              <AvatarImage
                src={avatar_url}
                alt={fullName}
                className="object-cover"
              />
              <AvatarFallback className="text-xl md:text-2xl font-bold bg-primary/10 text-primary rounded-2xl">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1.5 pb-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  {fullName}
                </h2>
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold ${roleInfo.className}`}
                >
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  {roleInfo.label}
                </Badge>
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

        {/* Grille de Statistiques Générales */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-8 pt-6 border-t border-border">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/50 transition-colors hover:bg-muted/50">
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

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/50 transition-colors hover:bg-muted/50">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-500 shrink-0">
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

          <div className="col-span-2 md:col-span-1 flex items-center gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/50 transition-colors hover:bg-muted/50">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-500 shrink-0">
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
