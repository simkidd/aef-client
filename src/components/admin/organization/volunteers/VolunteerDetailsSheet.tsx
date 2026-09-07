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
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Award,
  Plus,
} from 'lucide-react';

export interface Volunteer {
  id: string;
  code?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  centre: string;
  hoursLogged: number;
  status: 'Active' | 'Onboarding' | 'Inactive';
  skills: string[];
  joinedDate: string;
}

interface VolunteerDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: Volunteer | null;
  onLogHours?: (volunteer: Volunteer) => void;
}

export function VolunteerDetailsSheet({
  isOpen,
  onClose,
  volunteer,
  onLogHours,
}: VolunteerDetailsSheetProps) {
  if (!volunteer) return null;

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
                  {volunteer.code || volunteer.id.toUpperCase()}
                </span>
                <StatusBadge status={volunteer.status} size="sm" />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {volunteer.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {volunteer.role} • <span className="font-medium text-foreground">{volunteer.centre}</span>
              </SheetDescription>
            </SheetHeader>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Service Hours Logged
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{volunteer.hoursLogged} Hours</span>
                </span>
              </div>
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Assigned Centre
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{volunteer.centre}</span>
                </span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Contact & Profile Details
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> Email Address
                  </span>
                  <span className="font-medium text-foreground select-all">
                    {volunteer.email}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> Phone Number
                  </span>
                  <span className="font-medium text-foreground font-mono">
                    {volunteer.phone}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" /> Date Joined
                  </span>
                  <span className="font-medium text-foreground">
                    {volunteer.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills & Training Competencies */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Skills & Volunteer Specialization
              </h4>
              <div className="rounded-lg border bg-card p-3.5 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {volunteer.skills && volunteer.skills.length > 0 ? (
                    volunteer.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 text-xs font-medium inline-flex items-center gap-1"
                      >
                        <Sparkles className="h-3 w-3" />
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">General Community Volunteer</span>
                  )}
                </div>
              </div>
            </div>

            {/* Service Action Card */}
            {onLogHours && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                  Service Tracking
                </h4>
                <div className="rounded-lg border p-3.5 bg-card space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span>Log Service Session</span>
                    </span>
                    <span className="font-semibold text-primary">
                      {volunteer.hoursLogged} hrs total
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onLogHours(volunteer)}
                    className="w-full text-xs font-semibold gap-2"
                  >
                    <Plus className="h-3.5 w-3.5" /> +4 Hours Volunteer Service
                  </Button>
                </div>
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
