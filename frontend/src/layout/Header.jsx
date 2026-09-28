import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AUTH_LINKS, NAV_LINKS, SITE } from "@/config/landing";
import Logo from "./Logo";

export default function Header({ isAuth }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
        <Logo />

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Actions desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild>
            <Link to={isAuth ? AUTH_LINKS.dashboard : AUTH_LINKS.login}>
              {!isAuth ? "Connexion" : "Dashboard"}
            </Link>
          </Button>
          {!isAuth && (
            <Button asChild>
              <Link to={AUTH_LINKS.register}>Créer un compte</Link>
            </Button>
          )}
        </div>

        {/* Menu mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>{SITE.name}</SheetTitle>
            </SheetHeader>

            <nav className="mt-6 flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <SheetClose asChild key={href}>
                  <a
                    href={href}
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {label}
                  </a>
                </SheetClose>
              ))}
            </nav>

            <div className="mt-6 flex flex-col gap-2">
              <SheetClose asChild>
                <Button variant="outline" asChild>
                  <Link to={AUTH_LINKS.login}>Connexion</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild>
                  <Link to={AUTH_LINKS.register}>Créer un compte</Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
