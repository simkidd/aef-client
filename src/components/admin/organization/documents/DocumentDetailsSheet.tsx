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
  FileText,
  FileSpreadsheet,
  FileCheck,
  Download,
  Lock,
  Calendar,
  Layers,
  HardDrive,
  ShieldCheck,
} from 'lucide-react';
import { toast } from '@/components/ui/toast';

export interface DocRecord {
  id: string;
  title: string;
  category: 'Policy & Governance' | 'Training Curriculum' | 'Legal & Compliance' | 'Forms & Templates';
  fileType: 'PDF' | 'DOCX' | 'XLSX';
  fileSize: string;
  accessLevel: 'Public' | 'Staff Only' | 'Executive / Admin';
  lastUpdated: string;
  downloadsCount: number;
}

interface DocumentDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocRecord | null;
  onDownload?: (doc: DocRecord) => void;
}

export function DocumentDetailsSheet({
  isOpen,
  onClose,
  document: doc,
  onDownload,
}: DocumentDetailsSheetProps) {
  if (!doc) return null;

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="h-4 w-4 text-rose-500" />;
      case 'XLSX':
        return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />;
      default:
        return <FileCheck className="h-4 w-4 text-sky-500" />;
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(doc);
    } else {
      toast.add({
        title: 'Downloading Document',
        description: `Starting download for "${doc.title}".`,
        type: 'success',
      });
    }
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
                  {doc.fileType} • {doc.fileSize}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded border bg-primary/10 text-primary border-primary/20">
                  {doc.accessLevel}
                </span>
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {doc.title}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {doc.category} • <span className="font-medium text-foreground">Updated {doc.lastUpdated}</span>
              </SheetDescription>
            </SheetHeader>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  File Format & Size
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  {getDocIcon(doc.fileType)}
                  <span>{doc.fileType} ({doc.fileSize})</span>
                </span>
              </div>
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Total Repository Downloads
                </span>
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{doc.downloadsCount} times</span>
                </span>
              </div>
            </div>

            {/* Document Details Specifications */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Metadata & Governance
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5" /> Category Mandate
                  </span>
                  <span className="font-medium text-foreground">
                    {doc.category}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5" /> Access Restriction Level
                  </span>
                  <span className="font-medium text-foreground">
                    {doc.accessLevel}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" /> Last Revision Date
                  </span>
                  <span className="font-medium text-foreground">
                    {doc.lastUpdated}
                  </span>
                </div>
              </div>
            </div>

            {/* Download Action Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                File Actions
              </h4>
              <div className="rounded-lg border p-3.5 bg-card space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Verified Official Document</span>
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    AEF-SECURE
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={handleDownload}
                  className="w-full text-xs font-semibold gap-2"
                >
                  <Download className="h-3.5 w-3.5" /> Download {doc.fileType} Document
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
