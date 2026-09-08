"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Calendar,
  BookOpen,
  ArrowRight,
  Check,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  usePublishedProgramsQuery,
  useMyApplicationsQuery,
} from "@/hooks";

export function PortalProgramsView() {
  const router = useRouter();

  const { data: programs = [], isLoading } = usePublishedProgramsQuery();
  const { data: myApplications } = useMyApplicationsQuery();

  // Map of programs user has already applied for
  const appliedProgramIds = useMemo(() => {
    const ids = new Set<string>();
    if (myApplications && Array.isArray(myApplications)) {
      myApplications.forEach((app: any) => {
        const progId =
          typeof app.programId === "object"
            ? app.programId?._id
            : app.programId;
        if (progId) ids.add(progId);
      });
    }
    return ids;
  }, [myApplications]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
          Browse Programs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore vocational empowerment programs and technical training opportunities.
        </p>
      </div>

      {/* Programs List / Grid */}
      {isLoading ? (
        <div className="p-16 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent mx-auto" />
          <p className="text-xs text-slate-500 mt-3 font-semibold uppercase tracking-wider">
            Loading available programs...
          </p>
        </div>
      ) : programs.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No programs found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            There are currently no published programs accepting applications. Please check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {programs.map((prog) => {
            const hasApplied = appliedProgramIds.has(prog._id);

            return (
              <Card
                key={prog._id}
                className="flex flex-col justify-between border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs hover:shadow-md transition-all rounded-xl"
              >
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>
                        {prog.organizerName || "Adele Empowerment Foundation"}
                      </span>
                    </div>

                    {prog.applicationDeadline && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full font-medium">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span>
                          Deadline: {formatDate(prog.applicationDeadline)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Link
                      href={`/portal/programs/${prog._id}`}
                      className="group"
                    >
                      <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-primary transition-colors">
                        {prog.title}
                      </CardTitle>
                    </Link>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 text-xs flex-1">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {prog.description}
                  </p>

                  {/* Skill Tracks */}
                  {prog.skillAreaIds && prog.skillAreaIds.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Available Tracks:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {prog.skillAreaIds.map((skill: any) => (
                          <span
                            key={skill._id || skill}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary dark:bg-primary/15 text-[11px] font-medium"
                          >
                            <BookOpen className="h-3 w-3" />
                            {skill.name || skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Eligibility Criteria (if provided) */}
                  {prog.eligibilityCriteria &&
                    prog.eligibilityCriteria.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                          Eligibility:
                        </span>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 text-[11px] space-y-0.5">
                          {prog.eligibilityCriteria
                            .slice(0, 2)
                            .map((item, idx) => (
                              <li key={idx} className="truncate">
                                {item}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                </CardContent>

                <CardFooter className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  {hasApplied ? (
                    <div className="w-full flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-3.5 py-2 rounded-lg text-xs font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Application Submitted
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/portal/applications")}
                        className="h-7 text-xs text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50 px-2"
                      >
                        View Status &rarr;
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/portal/programs/${prog._id}`)}
                      className="w-full text-xs font-semibold gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
                    >
                      View Details & Tracks
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
