import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Edit,
  Hash,
  Layers,
} from "lucide-react";

export default function UserProfileModal({
  open,
  onOpenChange,
  user,
  classe,
  loading,
  stats = {
    documentsCount: 0,
    savedCount: 0,
    pendingCount: 0,
  },
  onEditProfile,
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
  console.log(loading);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden sm:rounded-2xl border-border">
        {loading ? (
          <h1 className="p-7 font-bold text-xl">chargement ....</h1>
        ) : (
          <div>
            <DialogHeader className="sr-only">
              <DialogTitle>Profil de {fullName}</DialogTitle>
            </DialogHeader>

            {/* Banner de fond */}
            <div className="h-24 sm:h-32 bg-linear-to-r from-primary/20 via-primary/10 to-background border-b border-border/50" />

            {/* Corps du profil */}
            <div className="px-4 pb-6 sm:px-6 -mt-10 sm:-mt-14 space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 text-center sm:text-left">
                {/* Photo & Noms */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-4">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-4 border-card shadow-md bg-background shrink-0">
                    <AvatarImage
                      src={avatar_url}
                      alt={fullName}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-lg sm:text-xl font-bold bg-primary/10 text-primary rounded-2xl">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        {fullName}
                      </h2>
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-semibold ${roleInfo.className}`}
                      >
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        {roleInfo.label}
                      </Badge>
                    </div>

                    {/* Classe, Niveau & Matricule */}
                    <div className="flex items-center gap-2.5 justify-center sm:justify-start text-xs text-muted-foreground flex-wrap">
                      {classe ? (
                        <>
                          <span className="flex items-center gap-1 font-medium text-foreground/80">
                            <GraduationCap className="h-3.5 w-3.5 text-primary" />
                            {classe.mention || "Classe non définie"}
                          </span>
                          {classe.niveau && (
                            <span className="flex items-center gap-1">
                              <Layers className="h-3 w-3" />
                              Niveau : {classe.niveau}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="flex items-center gap-1 text-muted-foreground/70">
                          <GraduationCap className="h-3.5 w-3.5" />
                          Aucune classe
                        </span>
                      )}

                      {matricule && (
                        <span className="flex items-center gap-1 font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">
                          <Hash className="h-3 w-3" />
                          {matricule}
                        </span>
                      )}
                    </div>

                    {/* Contacts */}
                    <div className="flex items-center gap-3 justify-center sm:justify-start text-xs text-muted-foreground flex-wrap pt-0.5">
                      {email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {email}
                        </span>
                      )}
                      {phone_number && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {phone_number}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bouton Éditer */}
                {onEditProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs h-8 shrink-0"
                    onClick={() => {
                      onEditProfile(user);
                      onOpenChange(false);
                    }}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Modifier
                  </Button>
                )}
              </div>

              {/* Grille des statistiques */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-border">
                <div className="flex flex-col items-center sm:items-start p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/50 text-center sm:text-left">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary mb-1">
                    <FileText className="h-4 w-4" />
                  </div>
                  <p className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                    {stats.documentsCount ?? 0}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Documents
                  </p>
                </div>

                <div className="flex flex-col items-center sm:items-start p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/50 text-center sm:text-left">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-500 mb-1">
                    <Bookmark className="h-4 w-4" />
                  </div>
                  <p className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                    {stats.savedCount ?? 0}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Favoris
                  </p>
                </div>

                <div className="flex flex-col items-center sm:items-start p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/50 text-center sm:text-left">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-500 mb-1">
                    <User className="h-4 w-4" />
                  </div>
                  <p className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                    {stats.pendingCount ?? 0}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    En attente
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
