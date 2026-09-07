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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building2, MapPin, Users, Loader2 } from "lucide-react";

interface CentrePerformanceItem {
  centreId: string;
  name: string;
  code: string;
  state: string;
  capacity: number;
  activeTrainees: number;
  graduated: number;
  utilizationRate: number;
}

interface CentrePerformanceTableProps {
  data?: CentrePerformanceItem[];
  isLoading?: boolean;
}

export function CentrePerformanceTable({
  data = [],
  isLoading,
}: CentrePerformanceTableProps) {
  return (
    <Card className="overflow-hidden py-0 gap-0">
      <CardHeader className="p-4 sm:p-5 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold font-heading text-foreground">
              Training Centre Performance & Capacity Utilization
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Live capacity monitoring, active seat occupation, and completion
              metrics across all accredited TVET centres.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Training Centre</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Active Trainees</TableHead>
            <TableHead>Graduated</TableHead>
            <TableHead className="w-56">Capacity Utilization</TableHead>
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
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-xs">
                    Computing centre utilization statistics...
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-muted-foreground text-xs"
              >
                No centre performance metrics available yet.
              </TableCell>
            </TableRow>
          ) : (
            data.map((c) => {
              const util =
                c.utilizationRate ||
                (c.capacity > 0
                  ? Math.round((c.activeTrainees / c.capacity) * 100)
                  : 0);
              return (
                <TableRow
                  key={c.centreId}
                  className="hover:bg-muted/40 transition-colors"
                >
                  {/* Centre Name */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                        <Building2 className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-foreground block">
                          {c.name}
                        </strong>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {c.code}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Location */}
                  <TableCell className="text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3 text-primary shrink-0" />
                      <span>{c.state} State</span>
                    </span>
                  </TableCell>

                  {/* Capacity */}
                  <TableCell className="text-xs font-semibold text-foreground">
                    {c.capacity} Seats
                  </TableCell>

                  {/* Active Trainees */}
                  <TableCell className="text-xs font-bold text-primary">
                    {c.activeTrainees}
                  </TableCell>

                  {/* Graduated */}
                  <TableCell className="text-xs font-semibold text-muted-foreground">
                    {c.graduated || 0}
                  </TableCell>

                  {/* Utilization */}
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-3">
                      <Progress
                        value={Math.min(100, util)}
                        className="w-24 sm:w-28 h-2 rounded-full"
                      />
                      <span
                        className={`font-mono font-bold text-xs ${
                          util >= 85
                            ? "text-rose-600 dark:text-rose-400"
                            : util >= 60
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground"
                        }`}
                      >
                        {util}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
