"use client";

import React from "react";
import {
  MoreHorizontal,
  Edit2,
  Eye,
  MapPin,
  Calendar,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
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
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Cohort } from "@/interfaces";
import { formatDate } from "@/lib/utils";

interface CohortCardProps {
  cohort: Cohort;
  onOpenDetails: (cohort: Cohort) => void;
  onOpenEdit: (cohort: Cohort) => void;
}

export function CohortCard({
  cohort,
  onOpenDetails,
  onOpenEdit,
}: CohortCardProps) {
  const metrics = cohort.capacityMetrics || {
    maxCapacity: cohort.maxCapacity || 40,
    active: 0,
    availableSlots: cohort.maxCapacity || 40,
    dropped: 0,
    withdrawn: 0,
    completed: 0,
    selectedPending: 0,
  };

  const pct = Math.min(
    100,
    Math.round(((metrics.active || 0) / (cohort.maxCapacity || 1)) * 100),
  );

  return (
    <Card className="flex flex-col justify-between hover:border-teal-600/40 transition-colors py-0 gap-0">
      <div>
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 dark:bg-teal-950 dark:text-teal-300">
                {cohort.cohortCode}
              </span>
              <StatusBadge status={cohort.status} size="sm" />
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
                  onClick={() => onOpenDetails(cohort)}
                  className="cursor-pointer gap-2"
                >
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onOpenEdit(cohort)}
                  className="cursor-pointer gap-2 text-teal-700 dark:text-teal-400"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit Cohort
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardTitle className="text-base font-bold text-foreground mt-2.5 font-heading">
            {cohort.name}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-foreground font-medium">
              <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              {cohort.centreId?.name || "Unassigned Centre"}
            </span>
            <span>•</span>
            <span className="truncate">
              Program: {cohort.programId?.title || "Vocational Track"}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 pt-0 space-y-4 text-xs">
          {/* Duration info */}
          <div className="flex items-center justify-between text-muted-foreground p-2 rounded bg-muted/40 text-[11px]">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-teal-600" />
              Timeline:
            </span>
            <span className="font-semibold text-foreground">
              {formatDate(cohort.startDate)} – {formatDate(cohort.endDate)}
            </span>
          </div>

          {/* Timetable and Skill tracks */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-foreground text-[11px] block">
                Configured Skill Tracks ({cohort.skillConfigs?.length || 0}):
              </span>
              {cohort.skillConfigs && cohort.skillConfigs.length > 2 && (
                <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                  +{cohort.skillConfigs.length - 2} more
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              {cohort.skillConfigs && cohort.skillConfigs.length > 0 ? (
                cohort.skillConfigs.slice(0, 2).map((cfg: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg border border-border bg-card flex items-center justify-between gap-2"
                  >
                    <div className="truncate">
                      <span className="font-bold text-foreground block truncate text-xs">
                        {cfg.skillAreaId?.name ||
                          cfg.skillName ||
                          "Technical Track"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Room: {cfg.assignedRoomId?.name || "Practical Lab"}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 dark:bg-teal-950 dark:text-teal-300 shrink-0">
                      {cfg.startTime || "09:00"} – {cfg.endTime || "12:00"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-2 rounded bg-muted/20 text-muted-foreground italic text-[11px]">
                  No specific skill configs attached.
                </div>
              )}
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="space-y-1.5 pt-2 border-t border-border">
            <div className="flex justify-between font-semibold">
              <span className="text-muted-foreground text-[11px]">
                Enrolled Beneficiaries
              </span>
              <span className="text-foreground text-xs">
                {metrics.active}/{cohort.maxCapacity} ({pct}%)
              </span>
            </div>
            <Progress value={pct} className="h-2" />
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
              <span>
                Available Slots:{" "}
                <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                  {metrics.availableSlots}
                </strong>
              </span>
              <span>
                Dropped: {metrics.dropped || 0} • Withdrawn:{" "}
                {metrics.withdrawn || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenDetails(cohort)}
          className="w-full text-xs font-semibold hover:bg-muted gap-2 justify-between"
        >
          <span>View Cohort Overview</span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </CardFooter>
    </Card>
  );
}
