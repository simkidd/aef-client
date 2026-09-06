"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Award,
  Calendar,
  ExternalLink,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  Copy,
  Loader2,
  QrCode,
} from "lucide-react";
import { Certificate } from "@/interfaces/certificate.interface";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import { TablePagination } from "@/components/ui/table-pagination";

interface CertificatesTableProps {
  certificates: Certificate[];
  isLoading: boolean;
  onViewCertificate: (cert: Certificate) => void;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export const CertificatesTable: React.FC<CertificatesTableProps> = ({
  certificates,
  isLoading,
  onViewCertificate,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}) => {
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Verification code copied to clipboard");
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Certificate #
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Graduate / Beneficiary
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Program & Cohort
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Attendance
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Score & Grade
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Issue Date
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-12 text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs font-medium">Loading accredited certificates registry...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : certificates && certificates.length > 0 ? (
            certificates.map((cert) => {
            const benName =
              typeof cert.beneficiaryId === "object"
                ? `${cert.beneficiaryId?.firstName || ""} ${cert.beneficiaryId?.lastName || ""}`.trim() ||
                  cert.beneficiaryId?.fullName ||
                  "Registered Graduate"
                : "Registered Graduate";

            const programTitle =
              typeof cert.programId === "object"
                ? cert.programId?.title
                : "Vocational Program";

            const cohortName =
              typeof cert.cohortId === "object"
                ? cert.cohortId?.name
                : "Cohort Alpha";

            return (
              <TableRow
                key={cert._id}
                className="border-border hover:bg-muted/40 transition-colors"
              >
                {/* Certificate Number & Verification Token */}
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground text-xs font-mono">
                      {cert.certificateNumber}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-muted-foreground font-mono truncate max-w-[110px]">
                        {cert.verificationCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(cert.verificationCode)}
                        className="text-muted-foreground hover:text-foreground"
                        title="Copy verification code"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </TableCell>

                {/* Beneficiary */}
                <TableCell className="py-3">
                  <div className="font-medium text-foreground text-sm">
                    {benName}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {typeof cert.centreId === "object"
                      ? cert.centreId?.name
                      : "Main Hub"}
                  </div>
                </TableCell>

                {/* Program & Cohort */}
                <TableCell className="py-3">
                  <div className="text-xs font-medium text-foreground">
                    {programTitle}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {cohortName}
                  </div>
                </TableCell>

                {/* Attendance */}
                <TableCell className="py-3">
                  <Badge
                    variant="outline"
                    className={
                      cert.overallAttendanceRate >= 80
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-semibold"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs font-semibold"
                    }
                  >
                    {cert.overallAttendanceRate}%
                  </Badge>
                </TableCell>

                {/* Score & Grade */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground text-xs">
                      {cert.overallAssessmentScore !== undefined
                        ? `${cert.overallAssessmentScore}%`
                        : "N/A"}
                    </span>
                    {cert.grade && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-bold py-0 px-1.5"
                      >
                        {cert.grade}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Issue Date */}
                <TableCell className="py-3 text-xs text-muted-foreground">
                  {cert.issueDate
                    ? format(new Date(cert.issueDate), "MMM dd, yyyy")
                    : "N/A"}
                </TableCell>

                {/* Status */}
                <TableCell className="py-3">
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-semibold"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {cert.status || "Issued"}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        />
                      }
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 bg-popover border-border"
                    >
                      <DropdownMenuItem
                        onClick={() => onViewCertificate(cert)}
                        className="text-xs cursor-pointer focus:bg-muted"
                      >
                        <Eye className="h-3.5 w-3.5 mr-2" />
                        View Certificate Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          window.open(
                            `/verify/${cert.verificationCode}`,
                            "_blank"
                          )
                        }
                        className="text-xs cursor-pointer focus:bg-muted"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-2" />
                        Public Verification Page
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={8}
              className="text-center py-12 text-muted-foreground"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <Award className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm font-semibold text-foreground">No certificates found</p>
                <p className="text-xs text-muted-foreground">
                  No certificate credentials have been issued matching the selected search query or filters.
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>

      {onPageChange && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
