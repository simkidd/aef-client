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
import { MoreHorizontal, Eye, Key } from "lucide-react";
import { Staff } from "@/interfaces";
import { StaffDetailsSheet } from "./StaffDetailsSheet";

interface StaffTableProps {
  staffList: Staff[];
  isLoading: boolean;
  onOpenProvision: (staff: Staff) => void;
}

export function StaffTable({
  staffList,
  isLoading,
  onOpenProvision,
}: StaffTableProps) {
  const [selectedStaffForDetails, setSelectedStaffForDetails] =
    useState<Staff | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleOpenDetails = (staff: Staff) => {
    setSelectedStaffForDetails(staff);
    setIsDetailsOpen(true);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return `${first}${last}`.toUpperCase() || "ST";
  };

  return (
    <>
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Role & Department</TableHead>
              <TableHead>Centre</TableHead>
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
                  className="text-center py-8 text-slate-500 text-xs"
                >
                  Loading staff directory...
                </TableCell>
              </TableRow>
            ) : staffList && staffList.length > 0 ? (
              staffList.map((st) => (
                <TableRow
                  key={st._id}
                  onClick={() => handleOpenDetails(st)}
                  className="cursor-pointer hover:bg-muted/60 transition-colors group"
                >
                  {/* Staff Member: Avatar + Name + Staff Code */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        size="sm"
                        className="bg-primary/10 text-primary border border-primary/20 font-bold text-xs"
                      >
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(st.firstName, st.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <span className="font-semibold text-xs text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors block truncate">
                          {st.firstName} {st.lastName}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground block truncate">
                          {st.staffCode} • {st.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role & Department */}
                  <TableCell>
                    <span className="font-medium text-xs text-foreground block truncate">
                      {st.position}
                    </span>
                    <span className="text-[11px] text-muted-foreground block truncate capitalize">
                      {st.category} • {st.departmentId?.name || "Central Org"}
                    </span>
                  </TableCell>

                  {/* Centre */}
                  <TableCell className="text-xs text-muted-foreground">
                    {st.assignedCentreId?.name || "Headquarters"}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <StatusBadge status={st.employmentStatus} size="sm" />
                  </TableCell>

                  {/* Action Dropdown Menu */}
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
                          onClick={() => handleOpenDetails(st)}
                          className="text-[13px] cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        {!st.hasSystemAccount && (
                          <DropdownMenuItem
                            onClick={() => onOpenProvision(st)}
                            className="text-[13px] cursor-pointer text-primary dark:text-primary font-medium focus:text-primary dark:focus:text-primary"
                          >
                            <Key className="h-3.5 w-3.5 text-primary dark:text-primary" />
                            <span>Provision Login</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground text-xs"
                >
                  No staff records found matching filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Staff Details Sheet */}
      <StaffDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        staff={selectedStaffForDetails}
        onOpenProvision={onOpenProvision}
      />
    </>
  );
}
