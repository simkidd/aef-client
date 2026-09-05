import React from "react";
import { Metadata } from "next";
import { SkillsRegistryView } from "@/components/admin/programs/skills";

export const metadata: Metadata = {
  title: "Skill Areas Registry | Adele Foundation Admin",
  description:
    "Curriculum disciplines, technical competencies, and certification standards registry across Adele Foundation training facilities.",
};

export default function AdminSkillsPage() {
  return <SkillsRegistryView />;
}
