"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Megaphone,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { Announcement } from "@/interfaces";
import { formatDate } from "@/lib/utils";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
  selectedAnnouncementId?: string | null;
  onDismissAnnouncement?: (id: string) => void;
}

export function AnnouncementModal({
  isOpen,
  onClose,
  announcements,
  selectedAnnouncementId,
  onDismissAnnouncement,
}: AnnouncementModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (selectedAnnouncementId && announcements.length > 0) {
      const idx = announcements.findIndex((a) => a._id === selectedAnnouncementId);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [selectedAnnouncementId, announcements]);

  if (!announcements || announcements.length === 0) return null;

  const current = announcements[currentIndex] || announcements[0];
  const total = announcements.length;

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case "Urgent":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
            <Flame className="h-3 w-3" />
            URGENT
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-3 w-3" />
            HIGH PRIORITY
          </span>
        );
      case "Normal":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Bell className="h-3 w-3" />
            ANNOUNCEMENT
          </span>
        );
    }
  };

  const handleDismiss = () => {
    if (current && onDismissAnnouncement) {
      onDismissAnnouncement(current._id);
    }
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-card border border-border shadow-2xl rounded-2xl">
        {/* Header decoration */}
        <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white relative">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
                <Megaphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-100 block">
                  Adele Empowerment Foundation
                </span>
                <span className="text-[11px] text-emerald-200">
                  Official Notice
                </span>
              </div>
            </div>
            <div>{getPriorityBadge(current?.priority)}</div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {current?.publishedAt ? formatDate(current.publishedAt, true) : "Recent"}
              </span>
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 font-heading leading-snug">
              {current?.title}
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed max-h-[260px] overflow-y-auto pr-1">
            {current?.content}
          </DialogDescription>
        </div>

        {/* Footer / Pagination & Actions */}
        <DialogFooter className="p-4 bg-slate-50/80 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between sm:justify-between">
          <div className="flex items-center gap-1.5">
            {total > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  title="Previous Announcement"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
                  {currentIndex + 1} / {total}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  disabled={currentIndex === total - 1}
                  onClick={() => setCurrentIndex((prev) => Math.min(total - 1, prev + 1))}
                  title="Next Announcement"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs font-medium h-9 rounded-lg"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleDismiss}
              className="text-xs font-semibold h-9 rounded-lg gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{currentIndex < total - 1 ? "Next Notice" : "Got It"}</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
