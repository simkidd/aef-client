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
  Users,
  Tv,
  Wifi,
  Sparkles,
  Calendar,
  Layers,
  Wrench,
} from 'lucide-react';

export interface RoomFacility {
  id: string;
  name: string;
  code: string;
  centreName: string;
  type: 'Computer Lab' | 'Workshop / Practical Studio' | 'Lecture Hall' | 'Seminar Room';
  capacity: number;
  features: string[];
  status: 'Operational' | 'Maintenance' | 'Booked';
}

interface FacilityDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  facility: RoomFacility | null;
}

export function FacilityDetailsSheet({
  isOpen,
  onClose,
  facility,
}: FacilityDetailsSheetProps) {
  if (!facility) return null;

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
                  {facility.code}
                </span>
                <StatusBadge status={facility.status} size="sm" />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {facility.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {facility.type} • <span className="font-medium text-foreground">{facility.centreName}</span>
              </SheetDescription>
            </SheetHeader>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Seating / Lab Capacity
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{facility.capacity} Trainees</span>
                </span>
              </div>
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Assigned Training Centre
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{facility.centreName}</span>
                </span>
              </div>
            </div>

            {/* Equipment & Features */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Amenities, Workbenches & Hardware
              </h4>
              <div className="rounded-lg border bg-card p-3.5 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {facility.features && facility.features.length > 0 ? (
                    facility.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2.5 py-1 rounded-md bg-muted text-foreground border text-xs font-medium inline-flex items-center gap-1.5"
                      >
                        <Wrench className="h-3 w-3 text-primary" />
                        {feature}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Standard Classroom Setup</span>
                  )}
                </div>
              </div>
            </div>

            {/* Room Operations & Booking Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Facility Specifications
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5" /> Room Category
                  </span>
                  <span className="font-medium text-foreground">
                    {facility.type}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" /> Max Batch Capacity
                  </span>
                  <span className="font-medium text-foreground">
                    {facility.capacity} Seats
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" /> Centre Complex
                  </span>
                  <span className="font-medium text-foreground">
                    {facility.centreName}
                  </span>
                </div>
              </div>
            </div>
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
