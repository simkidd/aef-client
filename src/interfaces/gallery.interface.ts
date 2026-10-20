export interface GalleryPhotoItem {
  _id?: string;
  id?: number | string;
  title: string;
  description?: string;
  imageUrl: string;
  src?: string;
  publicId: string;
  category: string;
  location?: string;
  date?: string;
  aspectClass?: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}
