"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Upload, X, Loader2 } from "lucide-react";
import { GalleryPhotoItem } from "@/interfaces";
import {
  useCreateGalleryPhotoMutation,
  useUpdateGalleryPhotoMutation,
} from "@/hooks";

export const GALLERY_CATEGORIES = [
  "Cloud Engineering",
  "Clean Energy",
  "Fashion Design",
  "Automotive Mechatronics",
  "UI/UX & Product Design",
  "Robotics & IoT",
  "Cybersecurity",
  "Construction Trades",
  "Creative Arts",
  "Field Projects",
  "General",
] as const;

export const galleryPhotoFormSchema = z.object({
  title: z
    .string()
    .min(3, "Photograph title must be at least 3 characters")
    .max(120, "Title is too long (maximum 120 characters)"),
  description: z.string().optional(),
  category: z.string().min(1, "Please select a vocational category"),
  location: z.string().optional(),
  date: z.string().optional(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

export type GalleryPhotoFormData = z.infer<typeof galleryPhotoFormSchema>;

interface PhotoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: GalleryPhotoItem | null;
}

export function PhotoFormModal({
  isOpen,
  onClose,
  initialData,
}: PhotoFormModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createMutation = useCreateGalleryPhotoMutation({
    onSuccess: () => {
      onClose();
    },
  });

  const updateMutation = useUpdateGalleryPhotoMutation({
    onSuccess: () => {
      onClose();
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<GalleryPhotoFormData>({
    resolver: zodResolver(galleryPhotoFormSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      category: "Cloud Engineering",
      location: "Victoria Island Hub, Lagos",
      date: `Cohort ${new Date().getFullYear()}`,
      isFeatured: false,
      isActive: true,
    },
  });

  const selectedCategory = watch("category");

  // Sync form state when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          title: initialData.title || "",
          description: initialData.description || "",
          category: initialData.category || "Cloud Engineering",
          location: initialData.location || "Victoria Island Hub, Lagos",
          date: initialData.date || `Cohort ${new Date().getFullYear()}`,
          isFeatured: Boolean(initialData.isFeatured),
          isActive: initialData.isActive !== false,
        });
        setPreviewUrl(initialData.imageUrl || initialData.src || "");
      } else {
        reset({
          title: "",
          description: "",
          category: "Cloud Engineering",
          location: "Victoria Island Hub, Lagos",
          date: `Cohort ${new Date().getFullYear()}`,
          isFeatured: false,
          isActive: true,
        });
        setPreviewUrl("");
      }
      setSelectedFile(null);
      setFileError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen, initialData, reset]);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("Only image files (JPG, PNG, WebP) are allowed.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setFileError("Selected file exceeds the 15MB limit.");
      return;
    }

    setFileError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearSelectedFile = () => {
    setSelectedFile(null);
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (initialData) {
      setPreviewUrl(initialData.imageUrl || initialData.src || "");
    } else {
      setPreviewUrl("");
    }
  };

  // Form submission via React Hook Form
  const onSubmit = (data: GalleryPhotoFormData) => {
    // If creating new photo, an image is strictly required
    if (!initialData && !selectedFile) {
      setFileError("Please select an image file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title.trim());
    if (data.description) formData.append("description", data.description.trim());
    formData.append("category", data.category || "General");
    if (data.location) formData.append("location", data.location.trim());
    if (data.date) formData.append("date", data.date.trim());
    formData.append("isFeatured", String(data.isFeatured));
    formData.append("isActive", String(data.isActive));

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    if (initialData?._id) {
      updateMutation.mutate({ id: initialData._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Dialog
      open={isOpen}
      disablePointerDismissal
      onOpenChange={(open, details) => {
        if (!open && details?.reason !== "outside-press" && !isSubmitting) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-xl flex flex-col gap-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-bold font-heading">
            {initialData ? "Edit Photograph Record" : "Upload New Photograph"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update photographic metadata, category track, or replace image asset."
              : "Register a high-resolution photograph to the foundation's public visual archive."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-0 flex-1 flex flex-col"
        >
          <ScrollArea className="h-[380px] sm:h-[420px] py-2">
            <FieldGroup className="px-6 py-2">
              {/* Photo Title */}
              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Photograph Title *
                </FieldLabel>
                <Input
                  {...register("title")}
                  placeholder="e.g. Photovoltaic Solar Array Workshop"
                  className="text-xs"
                />
                {errors.title && (
                  <FieldError className="text-xs">
                    {errors.title.message}
                  </FieldError>
                )}
              </Field>

              {/* Image File Selector */}
              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Photograph Image File {!initialData && "*"}
                </FieldLabel>

                <div className="border border-dashed border-border hover:border-primary/50 transition-colors rounded-lg p-3 text-center bg-muted/20">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="photo-file-upload-input"
                    accept="image/png, image/jpeg, image/webp, image/jpg"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="photo-file-upload-input"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5 py-1"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Upload className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      {selectedFile
                        ? selectedFile.name
                        : initialData
                        ? "Click to choose replacement image (Optional)"
                        : "Click to choose image from computer"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Supports JPG, PNG, WebP up to 15MB
                    </span>
                  </label>
                </div>

                {fileError && (
                  <FieldError className="text-xs">{fileError}</FieldError>
                )}

                {/* Preview Box */}
                {previewUrl && (
                  <div className="relative w-full h-36 rounded-lg overflow-hidden bg-slate-900 border border-border mt-2">
                    <Image
                      src={previewUrl}
                      alt="Selected Preview"
                      fill
                      className="object-cover"
                      onError={() => {}}
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={handleClearSelectedFile}
                          className="p-1 rounded-full bg-black/75 hover:bg-black text-white transition-colors cursor-pointer"
                          title="Remove selected file"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="absolute bottom-1.5 left-2 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white">
                      {selectedFile ? "New file preview" : "Current image"}
                    </div>
                  </div>
                )}
              </Field>

              {/* Category Track */}
              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Vocational Track / Category *
                </FieldLabel>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder="Select Category">
                          {selectedCategory}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {GALLERY_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <FieldError className="text-xs">
                    {errors.category.message}
                  </FieldError>
                )}
              </Field>

              {/* Location & Cohort Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Location / Training Center
                  </FieldLabel>
                  <Input
                    {...register("location")}
                    placeholder="e.g. Victoria Island Hub, Lagos"
                    className="text-xs"
                  />
                  {errors.location && (
                    <FieldError className="text-xs">
                      {errors.location.message}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel className="text-xs font-semibold">
                    Cohort / Date
                  </FieldLabel>
                  <Input
                    {...register("date")}
                    placeholder="e.g. Cohort 2025"
                    className="text-xs"
                  />
                  {errors.date && (
                    <FieldError className="text-xs">
                      {errors.date.message}
                    </FieldError>
                  )}
                </Field>
              </div>

              {/* Description */}
              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Photograph Description
                </FieldLabel>
                <Textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Outline workshop activities, equipment used, or trainee milestones..."
                  className="text-xs"
                />
                {errors.description && (
                  <FieldError className="text-xs">
                    {errors.description.message}
                  </FieldError>
                )}
              </Field>

              {/* Status & Options Toggles */}
              <div className="flex items-center gap-6 h-9 pt-1">
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="font-medium text-foreground">
                        Published
                      </span>
                    </label>
                  )}
                />

                <Controller
                  control={control}
                  name="isFeatured"
                  render={({ field }) => (
                    <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="font-medium text-foreground">
                        Featured
                      </span>
                    </label>
                  )}
                />
              </div>
            </FieldGroup>
          </ScrollArea>

          <DialogFooter className="">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="font-semibold text-xs gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {initialData ? "Updating..." : "Uploading..."}
                </>
              ) : initialData ? (
                "Update Photograph"
              ) : (
                "Upload Photograph"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
