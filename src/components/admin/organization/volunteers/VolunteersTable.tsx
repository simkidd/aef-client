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
import {
  MoreHorizontal,
  Eye,
  Plus,
  Loader2,
  Users,
  MapPin,
} from 'lucide-react';
import { Volunteer, VolunteerDetailsSheet } from './VolunteerDetailsSheet';
import { TablePagination } from '@/components/ui/table-pagination';

interface VolunteersTableProps {
  volunteers: Volunteer[];
  isLoading?: boolean;
  onLogHours?: (volunteer: Volunteer) => void;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function VolunteersTable({
  volunteers,
  isLoading = false,
  onLogHours,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}: VolunteersTableProps) {
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleOpenDetails = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsDetailsOpen(true);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (name.slice(0, 2) || 'VO').toUpperCase();
  };

  return (
    <>
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Volunteer</TableHead>
              <TableHead>Role & Skills</TableHead>
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
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-xs font-medium">Loading volunteer roster...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : volunteers && volunteers.length > 0 ? (
              volunteers.map((vol) => (
                <TableRow
                  key={vol.id}
                  className="hover:bg-muted/60 transition-colors group cursor-pointer"
                  onClick={() => handleOpenDetails(vol)}
                >
                  {/* Volunteer Member: Avatar + Name + Email */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        size="sm"
                        className="bg-primary/10 text-primary border border-primary/20 font-bold text-xs"
                      >
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(vol.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors block truncate">
                          {vol.name}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground block truncate">
                          {vol.code || vol.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role & Skills */}
                  <TableCell>
                    <span className="font-medium text-xs text-foreground block truncate">
                      {vol.role}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      {vol.skills.slice(0, 2).map((skill) => (
                        <span
                          key={skill}
                          className="px-1.5 py-0.2 rounded bg-muted text-[10px] text-muted-foreground font-medium truncate max-w-[110px]"
                        >
                          {skill}
                        </span>
                      ))}
                      {vol.skills.length > 2 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{vol.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Centre */}
                  <TableCell className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {vol.centre}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <StatusBadge status={vol.status} size="sm" />
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
                          onClick={() => handleOpenDetails(vol)}
                          className="text-[13px] cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>View Profile</span>
                        </DropdownMenuItem>
                        {onLogHours && (
                          <DropdownMenuItem
                            onClick={() => onLogHours(vol)}
                            className="text-[13px] cursor-pointer text-primary font-medium focus:text-primary"
                          >
                            <Plus className="h-3.5 w-3.5 text-primary" />
                            <span>Log +4 Hours</span>
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
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm font-semibold text-foreground">
                      No volunteer records found
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your search filters or register a new volunteer.
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

      {/* Volunteer Details Sheet */}
      <VolunteerDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        volunteer={selectedVolunteer}
        onLogHours={onLogHours}
      />
    </>
  );
}
