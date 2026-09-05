"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  MapPin,
  Mail,
  Phone,
  MoreHorizontal,
  Eye,
  Edit2,
  Users,
  DoorOpen,
  Fingerprint,
  GraduationCap,
  UserCheck,
} from "lucide-react";
import { TrainingCentre } from "@/interfaces";

interface CentreCardProps {
  centre: TrainingCentre;
  onOpenDetails: (centre: TrainingCentre) => void;
  onOpenEdit: (centre: TrainingCentre) => void;
}

export function CentreCard({
  centre,
  onOpenDetails,
  onOpenEdit,
}: CentreCardProps) {
  return (
    <Card className="border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col justify-between py-0">
      <div>
        {/* Header */}
        <CardHeader className="bg-slate-50/60 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 dark:bg-teal-950 dark:border-teal-800 dark:text-teal-300">
              {centre.centreCode}
            </span>

            <div className="flex items-center gap-2">
              <StatusBadge status={centre.status} size="sm" />
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
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 p-1 text-xs">
                  <DropdownMenuItem
                    onClick={() => onOpenEdit(centre)}
                    className="text-[13px] cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Edit Centre</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2 truncate">
            {centre.name}
          </CardTitle>
          <CardDescription className="text-xs flex items-center gap-1.5 text-muted-foreground truncate">
            <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
            <span className="truncate">
              {centre.address}, {centre.state}
            </span>
          </CardDescription>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-5 space-y-4 text-xs">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-center space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold flex items-center justify-center gap-1">
                <Users className="h-3 w-3 text-slate-400" /> Seats
              </span>
              <p className="text-sm font-bold text-foreground">
                {centre.capacity}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-center space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold flex items-center justify-center gap-1">
                <DoorOpen className="h-3 w-3 text-teal-500" /> Rooms
              </span>
              <p className="text-sm font-bold text-teal-700 dark:text-teal-400">
                {centre.stats?.rooms ?? 0}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-center space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold flex items-center justify-center gap-1">
                <Fingerprint className="h-3 w-3 text-emerald-500" /> Scanners
              </span>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {centre.stats?.devices ?? 0}
              </p>
            </div>
          </div>

          {/* Contact Details & Manager */}
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-muted-foreground">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3 w-3" /> Email
              </span>
              <span className="font-medium text-foreground truncate max-w-[180px]">
                {centre.contactEmail}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3 w-3" /> Phone
              </span>
              <span className="font-medium text-foreground font-mono">
                {centre.contactPhone}
              </span>
            </div>
            {centre.centreManagerId &&
              typeof centre.centreManagerId === "object" && (
                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="h-3 w-3 text-teal-600" /> Manager
                  </span>
                  <span className="font-semibold text-foreground">
                    {centre.centreManagerId.firstName}{" "}
                    {centre.centreManagerId.lastName}
                  </span>
                </div>
              )}
          </div>
        </CardContent>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/30 flex items-center justify-between text-xs text-muted-foreground">
        <span className="text-[11px] flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
          <GraduationCap className="h-3.5 w-3.5 text-teal-600" />
          {centre.stats?.activeCohorts ?? 0} active cohort
          {(centre.stats?.activeCohorts ?? 0) !== 1 ? "s" : ""}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenDetails(centre)}
          className="h-7 text-xs font-semibold gap-1.5 text-slate-700 dark:text-slate-300 hover:text-foreground"
        >
          <Eye className="h-3.5 w-3.5" /> View Details
        </Button>
      </div>
    </Card>
  );
}

