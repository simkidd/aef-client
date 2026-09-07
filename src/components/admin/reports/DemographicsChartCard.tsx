"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, GraduationCap, Sparkles } from "lucide-react";

interface DemographicItem {
  _id: string;
  count: number;
}

interface DemographicsChartCardProps {
  genderData?: DemographicItem[];
  educationData?: DemographicItem[];
  isLoading?: boolean;
}

export function DemographicsChartCard({
  genderData = [],
  educationData = [],
  isLoading,
}: DemographicsChartCardProps) {
  const totalGender =
    genderData.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const totalEducation =
    educationData.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gender Inclusion Card */}
      <Card className="py-0 gap-0">
        <CardHeader className="p-4 sm:p-5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-bold font-heading text-foreground">
              Gender Demographics & Inclusion
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Targeting 50%+ female participation in technical and solar tracks.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-4 text-xs">
          {isLoading ? (
            <p className="text-muted-foreground py-6 text-center">
              Loading demographic metrics...
            </p>
          ) : genderData.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center">
              No gender distribution data available.
            </p>
          ) : (
            genderData.map((g) => {
              const pct = Math.round((g.count / totalGender) * 100);
              return (
                <div key={g._id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground capitalize">
                      {g._id || "Unspecified"}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      <strong>{g.count}</strong> ({pct}%)
                    </span>
                  </div>
                  <Progress value={pct} className="h-2 rounded-full" />
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Education Distribution Card */}
      <Card className="py-0 gap-0">
        <CardHeader className="p-4 sm:p-5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-bold font-heading text-foreground">
              Educational Background Distribution
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Breakdown of highest qualification held by registered trainees.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 space-y-4 text-xs">
          {isLoading ? (
            <p className="text-muted-foreground py-6 text-center">
              Loading education distribution...
            </p>
          ) : educationData.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center">
              No educational metrics available.
            </p>
          ) : (
            educationData.map((e) => {
              const pct = Math.round((e.count / totalEducation) * 100);
              return (
                <div key={e._id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">
                      {e._id || "Secondary / Other"}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      <strong>{e.count}</strong> ({pct}%)
                    </span>
                  </div>
                  <Progress value={pct} className="h-2 rounded-full" />
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
