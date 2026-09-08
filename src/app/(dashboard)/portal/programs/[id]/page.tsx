"use client";

import React from "react";
import { useParams } from "next/navigation";
import { PortalProgramDetailView } from "@/components/portal/programs";

export default function PortalProgramDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  return <PortalProgramDetailView programId={id} />;
}
