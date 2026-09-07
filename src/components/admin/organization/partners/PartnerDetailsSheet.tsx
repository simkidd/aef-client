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
  Phone,
  Globe,
  ExternalLink,
  Briefcase,
  Layers,
} from 'lucide-react';

import { Partner } from '@/interfaces';

export type PartnerOrg = Partner;

interface PartnerDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Partner | null;
}

export function PartnerDetailsSheet({
  isOpen,
  onClose,
  partner,
}: PartnerDetailsSheetProps) {
  if (!partner) return null;

  const contactName =
    typeof partner.contactPerson === 'object' && partner.contactPerson
      ? partner.contactPerson.name
      : partner.contactPerson || 'Representative';

  const contactEmail =
    (typeof partner.contactPerson === 'object' && partner.contactPerson
      ? partner.contactPerson.email
      : null) ||
    partner.email ||
    '-';

  const contactPhone =
    (typeof partner.contactPerson === 'object' && partner.contactPerson
      ? partner.contactPerson.phone
      : null) ||
    partner.phone ||
    '-';

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
                  {partner.code || partner._id?.toUpperCase() || '-'}
                </span>
                <StatusBadge status={partner.status} size="sm" />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {partner.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground capitalize">
                {partner.type} {partner.state ? `• ${partner.state}` : ''}
              </SheetDescription>
            </SheetHeader>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Partner Type
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate capitalize">{partner.type}</span>
                </span>
              </div>
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Location / State
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{partner.state || 'Nigeria'}</span>
                </span>
              </div>
            </div>

            {/* Notes / Collaboration Scope */}
            {partner.notes && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                  Collaboration Scope & Notes
                </h4>
                <div className="rounded-lg border bg-card p-3.5 text-xs">
                  <p className="text-muted-foreground leading-relaxed">
                    {partner.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Contact Person Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Contact & Liaison Details
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5" /> Contact Person
                  </span>
                  <span className="font-medium text-foreground">
                    {contactName}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> Email Address
                  </span>
                  <span className="font-medium text-foreground select-all">
                    {contactEmail}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> Phone
                  </span>
                  <span className="font-medium text-foreground font-mono">
                    {contactPhone}
                  </span>
                </div>
                {partner.website && (
                  <div className="flex items-center justify-between p-3">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5" /> Website
                    </span>
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Visit Site</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
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
