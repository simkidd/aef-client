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
import {
  AlertTriangle,
  LogOut,
  Info,
  CheckCircle2,
  Loader2,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "warning" | "info" | "success";
  icon?: LucideIcon;
  isLoading?: boolean;
}

const variantStyles = {
  destructive: {
    iconBg:
      "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-900",
    confirmBtn:
      "bg-rose-600 hover:bg-rose-700 text-white focus-visible:ring-rose-500",
    defaultIcon: LogOut,
  },
  warning: {
    iconBg:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    confirmBtn:
      "bg-amber-600 hover:bg-amber-700 text-white focus-visible:ring-amber-500",
    defaultIcon: AlertTriangle,
  },
  info: {
    iconBg:
      "bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary border-primary/20 dark:border-primary/20",
    confirmBtn:
      "bg-primary hover:bg-primary/90 text-primary-foreground focus-visible:ring-ring",
    defaultIcon: Info,
  },
  success: {
    iconBg:
      "bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary border-primary/20 dark:border-primary/20",
    confirmBtn:
      "bg-primary hover:bg-primary text-white focus-visible:ring-emerald-500",
    defaultIcon: CheckCircle2,
  },
};

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  icon,
  isLoading = false,
}: ConfirmationModalProps) {
  const config = variantStyles[variant];
  const IconComponent = icon || config.defaultIcon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-md p-6 gap-5 bg-card border border-border shadow-2xl rounded-2xl"
        showCloseButton={false}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
              config.iconBg,
            )}
          >
            <IconComponent className="h-5 w-5" />
          </div>

          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100 font-heading">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="mt-2 sm:mt-0 flex gap-2 sm:justify-end border-t border-border/60 pt-4 -mx-6 -mb-6 px-6 pb-4 bg-muted/20">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs font-semibold h-9 rounded-lg"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "text-xs font-semibold h-9 rounded-lg shadow-xs gap-2",
              config.confirmBtn,
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Please wait...</span>
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmationModal;
