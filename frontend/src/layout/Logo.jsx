import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { SITE } from "@/config/landing";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <GraduationCap className="h-4 w-4" />
      </span>
      <span className="font-semibold tracking-tight text-foreground">
        {SITE.name}
      </span>
    </Link>
  );
}
