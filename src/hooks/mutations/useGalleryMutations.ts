import { useMutation, useQueryClient } from "@tanstack/react-query";
import { galleryApi } from "@/lib/api/gallery.api";
import { GalleryPhotoItem } from "@/interfaces";
import { toast } from "@/components/ui/toast";

export function useCreateGalleryPhotoMutation(options?: {
  onSuccess?: (data?: GalleryPhotoItem) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData | Partial<GalleryPhotoItem>) => {
      const res = await galleryApi.create(data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      options?.onSuccess?.(data);
      toast.add({
        title: "Photograph Saved",
        description: `"${data?.title || "Photograph"}" has been added to the gallery.`,
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to save photograph",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Unable to upload or save photographic record.",
        type: "error",
      });
      options?.onError?.(err);
    },
  });
}

export function useUpdateGalleryPhotoMutation(options?: {
  onSuccess?: (data?: GalleryPhotoItem) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: FormData | Partial<GalleryPhotoItem>;
    }) => {
      const res = await galleryApi.update(id, data);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery", "detail", variables.id] });
      options?.onSuccess?.(data);
      toast.add({
        title: "Photograph Updated",
        description: `"${data?.title || "Photograph"}" updated successfully.`,
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to update photograph",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Unable to update photographic record.",
        type: "error",
      });
      options?.onError?.(err);
    },
  });
}

export function useDeleteGalleryPhotoMutation(options?: {
  onSuccess?: (data?: { deletedId: string; publicId: string }) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await galleryApi.delete(id);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      options?.onSuccess?.(data);
      toast.add({
        title: "Photograph Deleted",
        description: "The photographic record was permanently removed.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to delete photograph",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Unable to delete photograph. Please check permissions.",
        type: "error",
      });
      options?.onError?.(err);
    },
  });
}
