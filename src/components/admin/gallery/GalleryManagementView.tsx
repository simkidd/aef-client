"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Camera,
  Star,
  Eye,
  EyeOff,
  Trash2,
  Edit2,
  RefreshCw,
  Sparkles,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/common/MetricCard";
import { GalleryPhotoItem } from "@/interfaces";
import {
  useGalleryAdminPhotosQuery,
  useUpdateGalleryPhotoMutation,
} from "@/hooks";
import { GalleryFilters } from "./GalleryFilters";
import { PhotoFormModal } from "./PhotoFormModal";
import { PhotoDeleteModal } from "./PhotoDeleteModal";

export function GalleryManagementView() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  // Add / Edit Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhotoItem | null>(
    null,
  );

  // Delete modal state
  const [photoToDelete, setPhotoToDelete] = useState<GalleryPhotoItem | null>(
    null,
  );

  // TanStack Query & Mutations
  const {
    data: photos = [],
    isLoading,
    refetch,
    isRefetching,
  } = useGalleryAdminPhotosQuery();

  const updateMutation = useUpdateGalleryPhotoMutation();

  // Open modal for Create
  const handleOpenAdd = () => {
    setEditingPhoto(null);
    setIsFormModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (photo: GalleryPhotoItem) => {
    setEditingPhoto(photo);
    setIsFormModalOpen(true);
  };

  // Toggle Active directly on card
  const handleToggleActive = (photo: GalleryPhotoItem) => {
    if (!photo._id) return;
    updateMutation.mutate({
      id: photo._id,
      data: { isActive: !photo.isActive },
    });
  };

  // Toggle Featured directly on card
  const handleToggleFeatured = (photo: GalleryPhotoItem) => {
    if (!photo._id) return;
    updateMutation.mutate({
      id: photo._id,
      data: { isFeatured: !photo.isFeatured },
    });
  };

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        photo.title.toLowerCase().includes(q) ||
        (photo.location && photo.location.toLowerCase().includes(q)) ||
        (photo.category && photo.category.toLowerCase().includes(q)) ||
        (photo.description && photo.description.toLowerCase().includes(q));

      const matchesCat =
        categoryFilter === "All" ||
        !categoryFilter ||
        photo.category === categoryFilter;

      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && photo.isFeatured) ||
        (featuredFilter === "standard" && !photo.isFeatured);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && photo.isActive) ||
        (statusFilter === "inactive" && !photo.isActive);

      return matchesSearch && matchesCat && matchesFeatured && matchesStatus;
    });
  }, [photos, search, categoryFilter, featuredFilter, statusFilter]);

  // KPIs
  const totalCount = photos.length;
  const activeCount = photos.filter((p) => p.isActive).length;
  const featuredCount = photos.filter((p) => p.isFeatured).length;
  const distinctCategoriesCount = useMemo(() => {
    const set = new Set(photos.map((p) => p.category).filter(Boolean));
    return set.size;
  }, [photos]);

  return (
    <div className="space-y-6">
      {/* 1. Standard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
            Photo Gallery Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage authentic field training photography, workshop sessions, and
            homepage featured highlights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="text-xs h-8 gap-1.5 cursor-pointer"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading || isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            onClick={handleOpenAdd}
            className="text-xs h-8 font-semibold gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Photograph
          </Button>
        </div>
      </div>

      {/* 2. Standard MetricCard KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Photographs"
          value={isLoading ? "..." : totalCount}
          subtitle={
            totalCount === 0
              ? "No uploaded photographs"
              : "Archived in database"
          }
          icon={Camera}
          color="primary"
        />
        <MetricCard
          title="Public Visibility"
          value={isLoading ? "..." : activeCount}
          subtitle="Published on /gallery"
          icon={Eye}
          color="emerald"
        />
        <MetricCard
          title="Featured Highlights"
          value={isLoading ? "..." : featuredCount}
          subtitle="Showcased on homepage"
          icon={Star}
          color="amber"
        />
        <MetricCard
          title="Vocational Tracks"
          value={isLoading ? "..." : distinctCategoriesCount}
          subtitle="Distinct training areas"
          icon={Sparkles}
          color="purple"
        />
      </div>

      {/* 3. Standard GalleryFilters Card */}
      <GalleryFilters
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        featuredFilter={featuredFilter}
        onFeaturedFilterChange={setFeaturedFilter}
      />

      {/* 4. Photos Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 text-center animate-pulse">
              <div className="w-full aspect-[16/10] bg-muted rounded-xl mb-4" />
              <div className="h-4 bg-muted rounded w-2/3 mx-auto mb-2" />
              <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
            </Card>
          ))}
        </div>
      ) : filteredPhotos.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          <Camera className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold text-foreground">
            No photographs found
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {search ||
            categoryFilter !== "All" ||
            statusFilter !== "all" ||
            featuredFilter !== "all"
              ? "No photos match the selected filter criteria."
              : "No photographs have been saved in the database yet."}
          </p>
          <div>
            <Button
              onClick={handleOpenAdd}
              size="sm"
              className="mt-4 text-xs font-semibold gap-1.5 cursor-pointer h-8"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add First Photograph</span>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPhotos.map((photo) => (
            <Card
              key={photo._id || photo.publicId}
              className={`overflow-hidden border transition-all duration-200 hover:shadow-md flex flex-col py-0 ${
                photo.isActive
                  ? "border-border bg-card"
                  : "border-border/60 bg-muted/20 opacity-80"
              }`}
            >
              {/* Image Preview Box */}
              <div className="relative w-full aspect-[16/10] bg-slate-900 overflow-hidden group">
                <Image
                  src={
                    photo.imageUrl ||
                    photo.src ||
                    "/images/auth-hero-social.jpg"
                  }
                  alt={photo.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Badges on Top */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] font-bold text-white bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15">
                    {photo.category}
                  </span>

                  {photo.isFeatured && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-500/30">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                {/* Quick actions overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 px-3 text-xs font-semibold gap-1 cursor-pointer"
                    onClick={() => handleOpenEdit(photo)}
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 px-2.5 cursor-pointer"
                    onClick={() => setPhotoToDelete(photo)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Photo Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-heading font-semibold text-xs text-foreground line-clamp-1">
                    {photo.title}
                  </h4>
                  {photo.description && (
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {photo.description}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 truncate max-w-[60%]">
                      <MapPin className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span className="truncate">
                        {photo.location || "Adele Hub"}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Calendar className="h-3 w-3" />
                      <span>{photo.date || "2025"}</span>
                    </span>
                  </div>
                </div>

                {/* Quick Action Toggles */}
                <div className="pt-3 mt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(photo)}
                    disabled={updateMutation.isPending}
                    className={`flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                      photo.isFeatured
                        ? "text-amber-500 hover:text-amber-600"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title={
                      photo.isFeatured ? "Featured on Home" : "Make Featured"
                    }
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${photo.isFeatured ? "fill-amber-400" : ""}`}
                    />
                    <span>
                      {photo.isFeatured ? "Home Featured" : "Feature"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(photo)}
                    disabled={updateMutation.isPending}
                    className={`flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                      photo.isActive
                        ? "text-emerald-500 hover:text-emerald-600"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {photo.isActive ? (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        <span>Published</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 5. Photo Form Modal (Add & Edit) */}
      <PhotoFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingPhoto(null);
        }}
        initialData={editingPhoto}
      />

      {/* 6. Delete Confirmation Modal */}
      <PhotoDeleteModal
        isOpen={Boolean(photoToDelete)}
        photo={photoToDelete}
        onClose={() => setPhotoToDelete(null)}
      />
    </div>
  );
}
