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
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  MoreHorizontal,
  Eye,
  Calendar,
  Loader2,
  Layers,
  Users,
  Building2,
  Laptop,
  Sun,
  Tv,
} from 'lucide-react';
import { RoomFacility, FacilityDetailsSheet } from './FacilityDetailsSheet';
import { TablePagination } from '@/components/ui/table-pagination';

interface FacilitiesTableProps {
  facilities: RoomFacility[];
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function FacilitiesTable({
  facilities,
  isLoading = false,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}: FacilitiesTableProps) {
  const [selectedFacility, setSelectedFacility] = useState<RoomFacility | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleOpenDetails = (facility: RoomFacility) => {
    setSelectedFacility(facility);
    setIsDetailsOpen(true);
  };

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'Computer Lab':
        return <Laptop className="h-4 w-4 text-sky-500" />;
      case 'Workshop / Practical Studio':
        return <Sun className="h-4 w-4 text-amber-500" />;
      case 'Lecture Hall':
        return <Tv className="h-4 w-4 text-purple-500" />;
      default:
        return <Building2 className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <>
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Facility / Room</TableHead>
              <TableHead>Type & Centre</TableHead>
              <TableHead>Capacity</TableHead>
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
                    <p className="text-xs font-medium">Loading training facilities...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : facilities && facilities.length > 0 ? (
              facilities.map((facility) => (
                <TableRow
                  key={facility.id}
                  className="hover:bg-muted/60 transition-colors group cursor-pointer"
                  onClick={() => handleOpenDetails(facility)}
                >
                  {/* Facility: Code + Name */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {getRoomIcon(facility.type)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors block truncate">
                          {facility.name}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground block truncate">
                          {facility.code}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Type & Centre */}
                  <TableCell>
                    <span className="font-medium text-xs text-foreground block truncate">
                      {facility.type}
                    </span>
                    <span className="text-[11px] text-muted-foreground block truncate">
                      {facility.centreName}
                    </span>
                  </TableCell>

                  {/* Capacity */}
                  <TableCell>
                    <span className="inline-flex items-center gap-1 font-semibold text-xs text-foreground">
                      <Users className="h-3 w-3 text-primary" />
                      {facility.capacity} seats
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <StatusBadge status={facility.status} size="sm" />
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
                          onClick={() => handleOpenDetails(facility)}
                          className="text-[13px] cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>View Facility</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Layers className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm font-semibold text-foreground">
                      No facilities found
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your search query or add a new room.
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

      {/* Facility Details Sheet */}
      <FacilityDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        facility={selectedFacility}
      />
    </>
  );
}
