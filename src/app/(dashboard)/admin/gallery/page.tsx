import React from "react";
import { Metadata } from "next";
import { GalleryManagementView } from "@/components/admin/gallery";

export const metadata: Metadata = {
  title: "Photo Gallery Management | Adele Foundation Admin",
  description:
    "Manage Adele Foundation field photographs, visual archives, and homepage impact highlights.",
};

export default function AdminGalleryPage() {
  return <GalleryManagementView />;
}
