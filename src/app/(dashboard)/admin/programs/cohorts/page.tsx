"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GraduationCap,
  Plus,
  Users,
  Calendar,
  MapPin,
  Clock,
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { api } from "@/lib/client";
import { formatDate } from "@/lib/utils";
import { Cohort, Program, TrainingCentre, SkillArea } from "@/interfaces";

export default function CohortsManagementPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCohort, setNewCohort] = useState({
    name: "",
    cohortCode: "",
    programId: "",
    centreId: "",
    startDate: "2026-10-01",
    endDate: "2026-12-15",
    maxCapacity: 40,
    skillConfigs: [
      {
        skillAreaId: "",
        startTime: "09:00",
        endTime: "12:00",
        daysOfWeek: [1, 3, 5],
        durationWeeks: 8,
        maxCapacity: 25,
      },
    ],
  });

  const { data: cohorts, isLoading } = useQuery({
    queryKey: ["admin-cohorts-all"],
    queryFn: async () => {
      const res = await api.get("/cohorts");
      return res.data?.data as Cohort[];
    },
  });

  const { data: programs } = useQuery({
    queryKey: ["admin-programs-lookup"],
    queryFn: async () => {
      const res = await api.get("/programs");
      return res.data?.data as Program[];
    },
  });

  const { data: centres } = useQuery({
    queryKey: ["admin-centres-lookup"],
    queryFn: async () => {
      const res = await api.get("/centres");
      return res.data?.data as TrainingCentre[];
    },
  });

  const { data: skills } = useQuery({
    queryKey: ["admin-skills-lookup"],
    queryFn: async () => {
      const res = await api.get("/programs/skills/all");
      return res.data?.data as SkillArea[];
    },
  });

  const createCohortMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/cohorts", payload);
      return res.data;
    },
    onSuccess: () => {
      setIsAddModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-cohorts-all"] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCohortMutation.mutate({
      ...newCohort,
      programId: newCohort.programId || programs?.[0]?._id,
      centreId: newCohort.centreId || centres?.[0]?._id,
      cohortCode:
        newCohort.cohortCode || `COH-${Date.now().toString(36).toUpperCase()}`,
      skillConfigs: [
        {
          skillAreaId:
            newCohort.skillConfigs[0]?.skillAreaId || skills?.[0]?._id,
          daysOfWeek: [1, 3, 5],
          startTime: "09:00",
          endTime: "12:00",
          durationWeeks: 8,
          maxCapacity: newCohort.maxCapacity,
        },
      ],
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Cohorts & Capacity Slot Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure multi-skill training cohorts per centre. A single cohort
              can host different skill groups with distinct timetable rules,
              trainers, and durations.
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-teal-700 hover:bg-teal-800 text-xs font-semibold gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Cohort
          </Button>
        </div>

        {/* Cohorts Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cohorts?.map((coh) => {
            const metrics = coh.capacityMetrics || {
              maxCapacity: coh.maxCapacity,
              active: 38,
              availableSlots: 2,
              dropped: 1,
              withdrawn: 1,
            };
            const pct = Math.round(
              (metrics.active / (metrics.maxCapacity || 1)) * 100,
            );

            return (
              <Card
                key={coh._id}
                className="border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-5 dark:bg-slate-900/50 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 dark:bg-teal-950 dark:text-teal-300">
                      {coh.cohortCode}
                    </span>
                    <StatusBadge status={coh.status} size="sm" />
                  </div>
                  <CardTitle className="text-lg text-slate-900 dark:text-slate-100 mt-2">
                    {coh.name}
                  </CardTitle>
                  <CardDescription className="text-xs flex items-center gap-1.5 text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                    Centre: <strong>{coh.centreId?.name}</strong> • Program:{" "}
                    {coh.programId?.title}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 space-y-4 text-xs">
                  {/* Dates */}
                  <div className="flex justify-between text-slate-500">
                    <span>
                      Duration:{" "}
                      <strong>
                        {formatDate(coh.startDate)} – {formatDate(coh.endDate)}
                      </strong>
                    </span>
                  </div>

                  {/* Multi-skill timetable groups */}
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Configured Skill Tracks & Timetable Rules:
                    </span>
                    <div className="space-y-1.5">
                      {coh.skillConfigs?.map((cfg: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between dark:border-slate-800 dark:bg-slate-900"
                        >
                          <div>
                            <span className="font-bold text-slate-900 dark:text-slate-200 block">
                              {cfg.skillAreaId?.name ||
                                cfg.skillName ||
                                "Skill Track"}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Room:{" "}
                              {cfg.assignedRoomId?.name || "Practical Lab"}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded dark:bg-teal-950 dark:text-teal-300">
                            {cfg.startTime} – {cfg.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Capacity & Vacancy Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">
                        Active Enrolled Trainees
                      </span>
                      <span className="text-slate-900 dark:text-slate-100">
                        {metrics.active}/{metrics.maxCapacity} ({pct}%)
                      </span>
                    </div>
                    <Progress value={pct} />
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>
                        Vacancies Available:{" "}
                        <strong className="text-emerald-700">
                          {metrics.availableSlots} Slots
                        </strong>
                      </span>
                      <span>
                        Dropped: {metrics.dropped || 0} • Withdrawn:{" "}
                        {metrics.withdrawn || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Create Cohort Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Cohort</DialogTitle>
              <DialogDescription>
                Schedule a new training cohort at a specific centre.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-3 text-xs py-2">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Cohort Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Lagos Solar Cohort 02 (Spring 2027)"
                  value={newCohort.name}
                  onChange={(e) =>
                    setNewCohort({ ...newCohort, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Parent Program *
                  </label>
                  <select
                    value={newCohort.programId}
                    onChange={(e) =>
                      setNewCohort({ ...newCohort, programId: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
                  >
                    {programs?.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Training Centre *
                  </label>
                  <select
                    value={newCohort.centreId}
                    onChange={(e) =>
                      setNewCohort({ ...newCohort, centreId: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
                  >
                    {centres?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Start Date *
                  </label>
                  <Input
                    type="date"
                    required
                    value={newCohort.startDate}
                    onChange={(e) =>
                      setNewCohort({ ...newCohort, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    End Date *
                  </label>
                  <Input
                    type="date"
                    required
                    value={newCohort.endDate}
                    onChange={(e) =>
                      setNewCohort({ ...newCohort, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Max Capacity (Seats) *
                </label>
                <Input
                  type="number"
                  required
                  value={newCohort.maxCapacity}
                  onChange={(e) =>
                    setNewCohort({
                      ...newCohort,
                      maxCapacity: parseInt(e.target.value, 10),
                    })
                  }
                />
              </div>
              <DialogFooter className="gap-2 pt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createCohortMutation.isPending}
                  className="bg-teal-700 hover:bg-teal-800"
                >
                  {createCohortMutation.isPending
                    ? "Scheduling..."
                    : "Create & Schedule Sessions"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
