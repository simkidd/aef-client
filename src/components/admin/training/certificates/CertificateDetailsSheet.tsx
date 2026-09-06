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
import { formatDate } from "@/lib/utils";
import { Certificate } from "@/interfaces/certificate.interface";
import {
  Award,
  Calendar,
  User,
  GraduationCap,
  Layers,
  MapPin,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Copy,
  Percent,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface CertificateDetailsSheetProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CertificateDetailsSheet: React.FC<CertificateDetailsSheetProps> = ({
  certificate,
  isOpen,
  onOpenChange,
}) => {
  if (!certificate) return null;

  const benName =
    typeof certificate.beneficiaryId === "object"
      ? `${certificate.beneficiaryId?.firstName || ""} ${certificate.beneficiaryId?.lastName || ""}`.trim() ||
        certificate.beneficiaryId?.fullName ||
        "Registered Graduate"
      : "Registered Graduate";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(certificate.verificationCode);
    toast.success("Verification code copied to clipboard");
  };

  return (
    <Sheet
      open={isOpen}
      disablePointerDismissal
      onOpenChange={(open, eventDetails) => {
        if (!open && eventDetails?.reason !== "outside-press") {
          onOpenChange(false);
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
                  Cert #{certificate.certificateNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </span>
              </div>
              <SheetTitle className="text-xl font-bold font-heading text-foreground pt-1">
                {benName}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                {typeof certificate.programId === "object"
                  ? certificate.programId?.title
                  : "Vocational Skills Program"}
              </SheetDescription>
            </SheetHeader>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Attendance
                </span>
                <span className="text-base font-bold text-emerald-500 font-heading">
                  {certificate.overallAttendanceRate}%
                </span>
              </div>
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Overall Score
                </span>
                <span className="text-base font-bold text-foreground font-heading">
                  {certificate.overallAssessmentScore !== undefined
                    ? `${certificate.overallAssessmentScore}%`
                    : "N/A"}
                </span>
              </div>
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Honors / Grade
                </span>
                <span className="text-base font-bold text-primary font-heading">
                  {certificate.grade || "Pass"}
                </span>
              </div>
            </div>

            {/* Verification Credentials Card */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Cryptographic Verification
              </h4>
              <div className="rounded-lg border p-3.5 bg-card space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">
                      Verification Hash Token
                    </span>
                    <span className="font-mono font-bold text-foreground select-all">
                      {certificate.verificationCode}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    className="h-7 text-xs gap-1 px-2.5 border-border"
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </Button>
                </div>
                <Link
                  href={`/verify/${certificate.verificationCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    size="sm"
                    className="w-full text-xs font-semibold gap-2 bg-primary text-primary-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Open Public Verification Page
                  </Button>
                </Link>
              </div>
            </div>

            {/* Program Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                Academic & Centre Record
              </h4>
              <div className="rounded-lg border divide-y bg-card text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5" /> Cohort
                  </span>
                  <span className="font-medium text-foreground">
                    {typeof certificate.cohortId === "object"
                      ? certificate.cohortId?.name
                      : "Cohort Alpha"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" /> Centre / Hub
                  </span>
                  <span className="font-medium text-foreground">
                    {typeof certificate.centreId === "object"
                      ? certificate.centreId?.name
                      : "Main Hub Facility"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" /> Date of Issuance
                  </span>
                  <span className="font-medium text-foreground">
                    {formatDate(certificate.issueDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Authorized Signatory */}
            {certificate.authorizedSignatory && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground tracking-wider uppercase">
                  Authorized Signatory
                </h4>
                <div className="p-3.5 rounded-lg border bg-card flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground text-sm">
                      {certificate.authorizedSignatory.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {certificate.authorizedSignatory.title}
                    </div>
                  </div>
                  <ShieldCheck className="h-6 w-6 text-primary/60" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="p-4 border-t bg-muted/40">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full text-xs"
          >
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
