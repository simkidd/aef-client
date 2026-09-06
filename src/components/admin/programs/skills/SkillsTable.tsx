"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit2,
  Eye,
  Award,
  Clock,
  Loader2,
} from "lucide-react";
import { SkillArea } from "@/interfaces";
import { TablePagination } from "@/components/ui/table-pagination";

interface SkillsTableProps {
  skills: SkillArea[];
  isLoading: boolean;
  onOpenDetails: (skill: SkillArea) => void;
  onOpenEdit: (skill: SkillArea) => void;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function SkillsTable({
  skills,
  isLoading,
  onOpenDetails,
  onOpenEdit,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
}: SkillsTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Skill Code & Discipline</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Certification Standard</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[60px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center py-12 text-muted-foreground"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-xs font-medium">
                  Loading skill disciplines...
                </p>
              </div>
            </TableCell>
          </TableRow>
        ) : skills && skills.length > 0 ? (
          skills.map((skill) => (
            <TableRow key={skill._id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-foreground">
                    {skill.name}
                  </span>
                  <span className="font-mono text-[10px] text-primary dark:text-primary font-medium">
                    {skill.code}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-xs text-muted-foreground">
                <span className="px-2 py-0.5 rounded bg-muted text-foreground text-[11px] font-medium border border-border">
                  {skill.category}
                </span>
              </TableCell>

              <TableCell className="text-xs">
                <span className="flex items-center gap-1.5 text-foreground font-medium">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {skill.defaultDurationWeeks} Weeks
                </span>
              </TableCell>

              <TableCell className="text-xs">
                <span className="text-primary dark:text-primary font-semibold bg-primary/10 dark:bg-primary/15 px-2 py-0.5 rounded border border-primary/20 dark:border-primary/20 text-[11px]">
                  {skill.certificationType || "National Certification"}
                </span>
              </TableCell>

              <TableCell>
                <StatusBadge
                  status={skill.isActive ? "active" : "inactive"}
                  size="sm"
                />
              </TableCell>

              <TableCell className="text-right">
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
                    <span className="sr-only">Actions</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 text-xs">
                    <DropdownMenuItem
                      onClick={() => onOpenDetails(skill)}
                      className="cursor-pointer gap-2"
                    >
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onOpenEdit(skill)}
                      className="cursor-pointer gap-2 text-primary dark:text-primary"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit Skill
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center py-12 text-muted-foreground"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <Award className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm font-semibold text-foreground">
                  No skill disciplines found
                </p>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your search criteria or category filter.
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
}
