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
import { MoreHorizontal, Edit2, Eye, Award, Clock } from "lucide-react";
import { SkillArea } from "@/interfaces";

interface SkillsTableProps {
  skills: SkillArea[];
  isLoading: boolean;
  onOpenDetails: (skill: SkillArea) => void;
  onOpenEdit: (skill: SkillArea) => void;
}

export function SkillsTable({
  skills,
  isLoading,
  onOpenDetails,
  onOpenEdit,
}: SkillsTableProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center space-y-3">
        <div className="h-6 bg-muted rounded w-1/3 mx-auto animate-pulse" />
        <div className="h-4 bg-muted rounded w-1/2 mx-auto animate-pulse" />
        <div className="h-4 bg-muted rounded w-1/4 mx-auto animate-pulse" />
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        <Award className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm font-semibold text-foreground">
          No skill disciplines found
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Try adjusting your search criteria or category filter.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[300px] text-xs font-semibold">
            Skill Code & Discipline
          </TableHead>
          <TableHead className="text-xs font-semibold">Category</TableHead>
          <TableHead className="text-xs font-semibold">Duration</TableHead>
          <TableHead className="text-xs font-semibold">
            Certification Standard
          </TableHead>
          <TableHead className="text-xs font-semibold">Status</TableHead>
          <TableHead className="w-[60px] text-right text-xs font-semibold">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skills.map((skill) => (
          <TableRow key={skill._id} className="hover:bg-muted/50">
            <TableCell>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-foreground">
                  {skill.name}
                </span>
                <span className="font-mono text-[10px] text-teal-700 dark:text-teal-400 font-medium">
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
              <span className="text-teal-700 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/80 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800 text-[11px]">
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
                    className="cursor-pointer gap-2 text-teal-700 dark:text-teal-400"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit Skill
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
