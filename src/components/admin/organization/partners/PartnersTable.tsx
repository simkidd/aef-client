"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  MoreHorizontal,
  Eye,
  ExternalLink,
  Loader2,
  Handshake,
} from "lucide-react";
import { PartnerOrg, PartnerDetailsSheet } from "./PartnerDetailsSheet";
import { TablePagination } from "@/components/ui/table-pagination";

interface PartnersTableProps {
  partners: PartnerOrg[];
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function PartnersTable({
  partners,
  isLoading = false,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}: PartnersTableProps) {
  const [selectedPartner, setSelectedPartner] = useState<PartnerOrg | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleOpenDetails = (partner: PartnerOrg) => {
    setSelectedPartner(partner);
    setIsDetailsOpen(true);
  };

  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return (name.slice(0, 2) || "PA").toUpperCase();
  };

  return (
    <>
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner Organization</TableHead>
              <TableHead>Partner Type</TableHead>
              <TableHead>Contact Liaison</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px] text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-xs font-medium">
                      Loading partner alliances...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : partners && partners.length > 0 ? (
              partners.map((partner) => {
                const contactName =
                  typeof partner.contactPerson === 'object' && partner.contactPerson
                    ? partner.contactPerson.name
                    : partner.contactPerson || '-';
                const contactEmail =
                  (typeof partner.contactPerson === 'object' && partner.contactPerson
                    ? partner.contactPerson.email
                    : null) ||
                  partner.email ||
                  '-';

                return (
                  <TableRow
                    key={partner._id || (partner as any).id || partner.code}
                    className="hover:bg-muted/60 transition-colors group cursor-pointer"
                    onClick={() => handleOpenDetails(partner)}
                  >
                    {/* Partner: Avatar + Name + Code */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          size="sm"
                          className="bg-primary/10 text-primary border border-primary/20 font-bold text-xs"
                        >
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(partner.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 max-w-[240px]">
                          <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors block truncate">
                            {partner.name}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground block truncate">
                            {partner.code || "-"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Partner Type */}
                    <TableCell>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                        {partner.type}
                      </span>
                    </TableCell>

                    {/* Contact Liaison */}
                    <TableCell>
                      <span className="font-medium text-xs text-foreground block truncate">
                        {contactName}
                      </span>
                      <span className="text-[11px] text-muted-foreground block truncate">
                        {contactEmail}
                      </span>
                    </TableCell>

                    {/* Status */}
                  <TableCell>
                    <StatusBadge status={partner.status} size="sm" />
                  </TableCell>

                  {/* Action Menu */}
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          />
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 p-1">
                        <DropdownMenuItem
                          onClick={() => handleOpenDetails(partner)}
                          className="text-[13px] cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>View Profile</span>
                        </DropdownMenuItem>
                        {partner.website && (
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(partner.website, "_blank")
                            }
                            className="text-[13px] cursor-pointer"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Visit Website</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Handshake className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm font-semibold text-foreground">
                      No partner alliances found
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your search filters or add a new partner.
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
      </Card>

      {/* Partner Details Sheet */}
      <PartnerDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        partner={selectedPartner}
      />
    </>
  );
}
