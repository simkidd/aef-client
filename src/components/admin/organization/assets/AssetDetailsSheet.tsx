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
  Boxes,
  Building2,
  MapPin,
  Calendar,
  Laptop,
  Sun,
  Scissors,
  Fingerprint,
  QrCode,
  Tag,
  Hash,
  Layers,
} from 'lucide-react';
import { toast } from '@/components/ui/toast';

export interface AssetRecord {
  id: string;
  tag: string;
  name: string;
  category: 'IT Equipment' | 'Solar Workshop Gear' | 'Esthetics Tools' | 'Biometric Hardware';
  serialNumber: string;
  centreName: string;
  roomName: string;
  purchaseDate: string;
  condition: 'Excellent' | 'Good' | 'Needs Repair' | 'Retired';
  assignedTo?: string;
}

interface AssetDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  asset: AssetRecord | null;
}

export function AssetDetailsSheet({
  isOpen,
  onClose,
  asset,
}: AssetDetailsSheetProps) {
  if (!asset) return null;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'IT Equipment':
        return <Laptop className="h-4 w-4 text-sky-500" />;
      case 'Solar Workshop Gear':
        return <Sun className="h-4 w-4 text-amber-500" />;
      case 'Esthetics Tools':
        return <Scissors className="h-4 w-4 text-pink-500" />;
      case 'Biometric Hardware':
        return <Fingerprint className="h-4 w-4 text-indigo-500" />;
      default:
        return <Boxes className="h-4 w-4 text-primary" />;
    }
  };

  const handlePrintQR = () => {
    toast.add({
      title: 'QR Tag Generated',
      description: `Dispatched printable barcode label for ${asset.tag}.`,
      type: 'success',
    });
  };

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
                  {asset.tag}
                </span>
                <StatusBadge status={asset.condition} size="sm" />
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {asset.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {asset.category} • <span className="font-medium text-foreground">{asset.centreName}</span>
              </SheetDescription>
            </SheetHeader>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Category
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  {getCategoryIcon(asset.category)}
                  <span className="truncate">{asset.category}</span>
                </span>
              </div>
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Location & Room
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{asset.roomName}</span>
                </span>
              </div>
            </div>

            {/* Hardware & Serial Specifications */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Hardware & Inventory Specifications
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5" /> Asset Inventory Tag
                  </span>
                  <span className="font-mono font-bold text-primary">
                    {asset.tag}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Hash className="h-3.5 w-3.5" /> Serial Number
                  </span>
                  <span className="font-mono text-foreground select-all">
                    {asset.serialNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" /> Assigned Centre
                  </span>
                  <span className="font-medium text-foreground">
                    {asset.centreName}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" /> Commissioned Date
                  </span>
                  <span className="font-medium text-foreground">
                    {asset.purchaseDate}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5" /> Assigned Workstation / Unit
                  </span>
                  <span className="font-medium text-foreground">
                    {asset.assignedTo || 'General Lab Facility'}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Label Generator Card */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Asset Tracking & QR Label
              </h4>
              <div className="rounded-lg border p-3.5 bg-card space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-primary" />
                    <span>Physical QR Identification</span>
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    READY
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrintQR}
                  className="w-full text-xs font-semibold gap-2"
                >
                  <QrCode className="h-3.5 w-3.5" /> Print QR Asset Tag
                </Button>
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
