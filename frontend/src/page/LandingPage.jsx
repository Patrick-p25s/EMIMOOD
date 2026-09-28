import React from "react";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeatureSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import RolesSection from "@/components/landing/RoleSection";
import CtaSection from "@/components/landing/CtaSection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <RolesSection />
      <CtaSection />
    </>
  );
}
