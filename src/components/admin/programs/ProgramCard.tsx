"use client";

import React from "react";
import {
  MoreHorizontal,
  Edit2,
  Eye,
  Briefcase,
  Users,
  GraduationCap,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Program } from "@/interfaces";

interface ProgramCardProps {
  program: Program;
  onOpenDetails: (program: Program) => void;
  onOpenEdit: (program: Program) => void;
}

export function ProgramCard({
  program,
  onOpenDetails,
  onOpenEdit,
}: ProgramCardProps) {
  const skillCount = program.skillAreaIds?.length || 0;
  const cohortCount = program.stats?.cohorts || 0;
  const appCount = program.stats?.applications || 0;

  return (
    <Card className="flex flex-col justify-between hover:border-primary/20 transition-colors py-0 gap-0">
      <div>
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20 dark:bg-primary/15 dark:text-primary">
                {program.code}
              </span>
              <StatusBadge status={program.status} size="sm" />
              {program.isFeatured && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300">
                  Featured
                </span>
              )}
            </div>

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
                  onClick={() => onOpenDetails(program)}
                  className="cursor-pointer gap-2"
                >
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onOpenEdit(program)}
                  className="cursor-pointer gap-2 text-primary dark:text-primary"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit Program
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardTitle className="text-base font-bold text-foreground mt-2.5 font-heading">
            {program.title}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Organizer:{" "}
            <strong className="text-foreground">{program.organizerName}</strong>{" "}
            ({program.organizerType}) • Role: {program.deliveryRole}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 pt-0 space-y-4 text-xs">
          <p className="text-muted-foreground line-clamp-2">
            {program.description}
          </p>

          {/* Integrated Skill Areas */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                Integrated Skill Disciplines ({skillCount})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 min-h-[26px]">
              {program.skillAreaIds && program.skillAreaIds.length > 0 ? (
                <>
                  {program.skillAreaIds
                    .slice(0, 2)
                    .map((skill: any, idx: number) => (
                      <span
                        key={skill._id || idx}
                        className="px-2 py-0.5 rounded bg-muted text-foreground text-[11px] font-medium border border-border truncate max-w-[140px]"
                      >
                        {skill.name || skill.code || "Skill"}
                      </span>
                    ))}
                  {program.skillAreaIds.length > 2 && (
                    <span className="px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground text-[11px] font-semibold border border-border">
                      +{program.skillAreaIds.length - 2}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[11px] text-muted-foreground italic">
                  No skills assigned
                </span>
              )}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border text-center">
            <div className="p-2 rounded bg-muted/40">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Cohorts
              </span>
              <span className="font-bold text-foreground text-sm">
                {cohortCount}
              </span>
            </div>
            <div className="p-2 rounded bg-muted/40">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Applicants
              </span>
              <span className="font-bold text-foreground text-sm">
                {appCount}
              </span>
            </div>
            <div className="p-2 rounded bg-muted/40">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Max Slots
              </span>
              <span className="font-bold text-foreground text-sm">
                {program.maxSlots || "∞"}
              </span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenDetails(program)}
          className="w-full text-xs font-semibold hover:bg-muted gap-2 justify-between"
        >
          <span>View Full Overview</span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </CardFooter>
    </Card>
  );
}
