"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { GalleryPhotoItem } from "@/interfaces";
import { useDeleteGalleryPhotoMutation } from "@/hooks";

interface PhotoDeleteModalProps {
  photo: GalleryPhotoItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PhotoDeleteModal({
  photo,
  isOpen,
  onClose,
}: PhotoDeleteModalProps) {
  const deleteMutation = useDeleteGalleryPhotoMutation({
    onSuccess: () => {
      onClose();
    },
  });

  const handleDelete = () => {
    if (!photo?._id) return;
    deleteMutation.mutate(photo._id);
  };

  return (
    <Dialog
      open={isOpen}
      disablePointerDismissal
      onOpenChange={(open, eventDetails) => {
        if (!open && eventDetails?.reason !== "outside-press" && !deleteMutation.isPending) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-bold text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            <span>Confirm Photo Deletion</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Are you sure you want to permanently delete{" "}
            <strong className="text-foreground">{photo?.title}</strong>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4 border-t border-border mt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={deleteMutation.isPending}
            onClick={onClose}
            className="cursor-pointer text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
            className="cursor-pointer font-bold text-xs gap-1.5"
          >
            {deleteMutation.isPending && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}
            <span>
              {deleteMutation.isPending ? "Deleting..." : "Delete Photograph"}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
