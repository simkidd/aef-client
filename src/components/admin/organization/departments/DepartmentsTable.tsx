'use client';

import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { MoreHorizontal, Eye, Edit2, Loader2, Building2 } from 'lucide-react';
import { Department } from '@/interfaces';
import { DepartmentDetailsSheet } from './DepartmentDetailsSheet';
import { TablePagination } from '@/components/ui/table-pagination';

interface DepartmentsTableProps {
  departments: Department[];
  isLoading: boolean;
  onOpenEdit: (department: Department) => void;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function DepartmentsTable({
  departments,
  isLoading,
  onOpenEdit,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}: DepartmentsTableProps) {
  const [selectedDeptForDetails, setSelectedDeptForDetails] =
    useState<Department | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleOpenDetails = (dept: Department) => {
    setSelectedDeptForDetails(dept);
    setIsDetailsOpen(true);
  };

  const getInitials = (name?: string) => {
    return name
      ? name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'DP';
  };

  return (
    <>
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Head of Department (HOD)</TableHead>
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
                  colSpan={4}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-xs font-medium">Loading departments...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : departments && departments.length > 0 ? (
              departments.map((dept) => {
                const hod = dept.headOfDepartmentId;
                const hodName =
                  typeof hod === 'object' && hod
                    ? `${hod.firstName || ''} ${hod.lastName || ''}`.trim()
                    : null;
                const hodPosition =
                  typeof hod === 'object' && hod ? hod.position : null;

                return (
                  <TableRow
                    key={dept._id}
                    className="hover:bg-muted/60 transition-colors group cursor-pointer"
                    onClick={() => handleOpenDetails(dept)}
                  >
                    {/* Department: Code + Name */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          size="sm"
                          className="bg-primary/10 text-primary border border-primary/20 font-bold text-xs"
                        >
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(dept.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <span className="font-semibold text-xs text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors block truncate">
                            {dept.name}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground block truncate">
                            Code: {dept.code}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* HOD */}
                    <TableCell>
                      {hodName ? (
                        <div>
                          <span className="font-medium text-xs text-foreground block truncate">
                            {hodName}
                          </span>
                          <span className="text-[11px] text-muted-foreground block truncate">
                            {hodPosition || 'Lead'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Unassigned
                        </span>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge
                        status={dept.isActive ? 'active' : 'inactive'}
                        size="sm"
                      />
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
                            onClick={() => handleOpenDetails(dept)}
                            className="text-[13px] cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onOpenEdit(dept)}
                            className="text-[13px] cursor-pointer text-primary dark:text-primary font-medium focus:text-primary dark:focus:text-primary"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-primary dark:text-primary" />
                            <span>Edit Department</span>
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
                  colSpan={4}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Building2 className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm font-semibold text-foreground">
                      No departments found
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your search query or status filter.
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

      {/* Details Sheet */}
      <DepartmentDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        department={selectedDeptForDetails}
        onOpenEdit={onOpenEdit}
      />
    </>
  );
}
