import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { galleryApi } from "@/lib/api/gallery.api";
import { GalleryPhotoItem } from "@/interfaces";

/**
 * Hook to fetch active public gallery photos with infinite scroll pagination.
 */
export function useGalleryInfiniteQuery(params?: {
  category?: string;
  limit?: number;
}) {
  return useInfiniteQuery({
    queryKey: ["gallery", "infinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await galleryApi.getActive({
        category: params?.category,
        page: pageParam as number,
        limit: params?.limit || 12,
      });
      return {
        photos: (res?.data || []) as GalleryPhotoItem[],
        pagination: res?.pagination,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination) return undefined;
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}

/**
 * Hook to fetch active public gallery photos (for exhibition & homepage).
 */
export function useGalleryPhotosQuery(params?: {
  category?: string;
  featured?: boolean;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["gallery", "public", params],
    queryFn: async () => {
      const res = await galleryApi.getActive(params);
      return (res?.data || []) as GalleryPhotoItem[];
    },
  });
}

/**
 * Hook to fetch all gallery photos for the admin dashboard (with search & filters).
 */
export function useGalleryAdminPhotosQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["gallery", "admin", params],
    queryFn: async () => {
      const res = await galleryApi.getAllAdmin(params);
      return (res?.data || []) as GalleryPhotoItem[];
    },
  });
}

/**
 * Hook to fetch a single gallery photo by ID.
 */
export function useGalleryPhotoQuery(id: string) {
  return useQuery({
    queryKey: ["gallery", "detail", id],
    queryFn: async () => {
      const res = await galleryApi.getById(id);
      return res?.data as GalleryPhotoItem;
    },
    enabled: Boolean(id),
  });
}
