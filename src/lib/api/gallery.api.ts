import { api } from "../client";
import { ApiResponse, GalleryPhotoItem } from "@/interfaces";

export const galleryApi = {
  /** [PUBLIC] Fetch all active gallery photos with pagination */
  getActive: async (params?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<GalleryPhotoItem[]>> => {
    const res = await api.get("/gallery", { params });
    return res.data;
  },

  /** [PUBLIC] Fetch single photograph */
  getById: async (id: string): Promise<ApiResponse<GalleryPhotoItem>> => {
    const res = await api.get(`/gallery/view/${id}`);
    return res.data;
  },

  /** [ADMIN] Fetch all gallery photos with filters & search */
  getAllAdmin: async (
    params?: Record<string, any>,
  ): Promise<ApiResponse<GalleryPhotoItem[]>> => {
    const res = await api.get("/gallery/admin/all", { params });
    return res.data;
  },

  /** [ADMIN] Create new photo record (multipart/form-data) */
  create: async (
    data: FormData | Partial<GalleryPhotoItem>,
  ): Promise<ApiResponse<GalleryPhotoItem>> => {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const res = await api.post("/gallery", data, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    });
    return res.data;
  },

  /** [ADMIN] Update existing photo (supports multipart/form-data) */
  update: async (
    id: string,
    data: FormData | Partial<GalleryPhotoItem>,
  ): Promise<ApiResponse<GalleryPhotoItem>> => {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const res = await api.put(`/gallery/${id}`, data, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    });
    return res.data;
  },

  /** [ADMIN] Delete photo (backend automatically cleans up Cloudinary asset) */
  delete: async (
    id: string,
  ): Promise<ApiResponse<{ deletedId: string; publicId: string }>> => {
    const res = await api.delete(`/gallery/${id}`);
    return res.data;
  },
};
