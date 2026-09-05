"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Award,
  Clock,
  Layers,
  BookOpen,
  Edit2,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { SkillArea } from "@/interfaces";

interface SkillDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  skill: SkillArea | null;
  onOpenEdit?: (skill: SkillArea) => void;
}

export function SkillDetailsSheet({
  isOpen,
  onClose,
  skill,
  onOpenEdit,
}: SkillDetailsSheetProps) {
  if (!skill) return null;

  return (
    <Sheet
      open={isOpen}
      disablePointerDismissal
      onOpenChange={(open, eventDetails) => {
        if (!open && eventDetails?.reason !== "outside-press") {
          onClose();
        }
      }}
    >
      <SheetContent
        className="w-full! sm:max-w-lg! p-0 flex flex-col justify-between overflow-hidden gap-0"
        showCloseButton={false}
      >
        <ScrollArea className="flex-1 h-[calc(100vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Header */}
            <SheetHeader className="p-0 text-left border-b border-border pb-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 dark:bg-teal-950 dark:text-teal-300">
                  {skill.code}
                </span>
                <StatusBadge
                  status={skill.isActive ? "active" : "inactive"}
                  size="sm"
                />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground">
                {skill.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Discipline Category: <strong>{skill.category}</strong>
              </SheetDescription>
            </SheetHeader>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-border bg-muted/30">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block flex items-center gap-1">
                  <Clock className="h-3 w-3 text-teal-600" />
                  Curriculum Duration
                </span>
                <span className="text-base font-bold text-foreground mt-0.5 block">
                  {skill.defaultDurationWeeks} Weeks
                </span>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/30">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block flex items-center gap-1">
                  <Award className="h-3 w-3 text-teal-600" />
                  Certification Type
                </span>
                <span className="text-xs font-bold text-teal-700 dark:text-teal-400 mt-1 block truncate">
                  {skill.certificationType || "National Certification"}
                </span>
              </div>
            </div>

            {/* Discipline Summary & Competencies */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-teal-600" />
                Syllabus & Trade Competencies
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-3.5 rounded-lg border border-border">
                {skill.description}
              </p>
            </div>

            {/* Curriculum Integration Information */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-teal-600" />
                Curriculum Integration
              </h4>
              <div className="p-3.5 rounded-lg border border-border bg-muted/20 text-xs space-y-2 text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Standard Scheduling:</span>
                  <span className="font-semibold text-foreground">
                    Multi-Day Lab Sessions
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reusability:</span>
                  <span className="font-semibold text-foreground">
                    Global (All Adele Training Centres)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Assessment Standard:</span>
                  <span className="font-semibold text-foreground">
                    Practical + Biometric Attendance
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <SheetFooter className="p-4 border-t border-border bg-muted/40 flex flex-row gap-2 mt-auto">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 text-xs"
          >
            Close
          </Button>
          {onOpenEdit && (
            <Button
              onClick={() => {
                onClose();
                onOpenEdit(skill);
              }}
              className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs gap-1.5"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit Skill Area
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
