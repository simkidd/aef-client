import React, { Suspense } from "react";
import { Metadata } from "next";
import { ProgramsHubView } from "@/components/admin/programs";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Skill Areas Registry | Adele Foundation Admin",
  description:
    "Curriculum disciplines, technical competencies, and certification standards registry across Adele Foundation training facilities.",
};

export default function AdminSkillsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
      <ProgramsHubView defaultTab="skills" />
    </Suspense>
  );
}

