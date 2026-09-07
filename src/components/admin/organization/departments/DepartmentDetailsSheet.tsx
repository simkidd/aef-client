'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Building2,
  Mail,
  User,
  Calendar,
  Layers,
  Edit2,
  Sparkles,
} from 'lucide-react';
import { Department } from '@/interfaces';

interface DepartmentDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
  onOpenEdit?: (department: Department) => void;
}

export function DepartmentDetailsSheet({
  isOpen,
  onClose,
  department,
  onOpenEdit,
}: DepartmentDetailsSheetProps) {
  if (!department) return null;

  const hod = department.headOfDepartmentId;
  const hodName =
    typeof hod === 'object' && hod
      ? `${hod.firstName || ''} ${hod.lastName || ''}`.trim()
      : null;
  const hodPosition = typeof hod === 'object' && hod ? hod.position : null;
  const hodEmail = typeof hod === 'object' && hod ? hod.email : null;

  return (
    <Sheet
      open={isOpen}
      disablePointerDismissal
      onOpenChange={(open, eventDetails) => {
        if (!open && eventDetails?.reason !== 'outside-press') {
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
            <SheetHeader className="p-0 text-left border-b pb-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                  {department.code}
                </span>
                <StatusBadge
                  status={department.isActive ? 'active' : 'inactive'}
                  size="sm"
                />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {department.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Organizational Business Unit • {department.code}
              </SheetDescription>
            </SheetHeader>

            {/* Mandate & Overview */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Department Mandate
              </h4>
              <div className="rounded-lg border bg-card p-3.5 text-xs text-muted-foreground leading-relaxed">
                {department.description || (
                  <span className="italic">
                    No detailed mandate description recorded for this department.
                  </span>
                )}
              </div>
            </div>

            {/* Appointed Leadership */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Head of Department (HOD)
              </h4>
              <div className="rounded-lg border bg-card p-4 text-xs space-y-3">
                {hodName ? (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {hodName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {hodName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {hodPosition || 'Designated Lead'}
                      </p>
                      {hodEmail && (
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5 flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {hodEmail}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <User className="h-8 w-8 mx-auto mb-1 opacity-40" />
                    <p className="font-semibold text-foreground text-xs">
                      No Head of Department Assigned
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Edit this department to assign a staff lead.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Quick-Launch */}
            {onOpenEdit && (
              <div className="pt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    onClose();
                    onOpenEdit(department);
                  }}
                  className="w-full text-xs font-semibold gap-2"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit Department Configuration
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="p-4 border-t bg-muted/40">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full text-xs"
          >
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
