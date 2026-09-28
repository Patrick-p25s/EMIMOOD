import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { FOOTER_COLUMNS, SITE } from "@/config/landing";
import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3 md:col-span-1">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              {SITE.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:justify-items-end">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title} className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  {column.title}
                </h4>
                <ul className="space-y-2">
                  {column.links.map(({ href, label }) => (
                    <li key={href}>
                      {href.startsWith("/#") ? (
                        <a
                          href={href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {label}
                        </a>
                      ) : (
                        <Link
                          to={href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        <p className="text-center text-xs text-muted-foreground">
          © {year} {SITE.name}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
