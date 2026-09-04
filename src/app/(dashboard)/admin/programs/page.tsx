"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Plus,
  Sparkles,
  Building,
  CheckCircle2,
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
import { Input } from "@/components/ui/input";
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
import { Program, SkillArea } from "@/interfaces";

export default function AdminProgramsPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProgram, setNewProgram] = useState({
    title: "",
    code: "",
    description: "",
    organizerType: "Adele Owned",
    organizerName: "Adele Empowerment Foundation",
    deliveryRole: "Primary Host",
    skillAreaIds: [] as string[],
    maxSlots: 100,
    applicationDeadline: "2026-10-15",
    published: true,
  });

  const { data: programs, isLoading } = useQuery({
    queryKey: ["admin-programs"],
    queryFn: async () => {
      const res = await api.get("/programs");
      return res.data?.data as Program[];
    },
  });

  const { data: skills } = useQuery({
    queryKey: ["skill-areas-list"],
    queryFn: async () => {
      const res = await api.get("/programs/skills/all");
      return res.data?.data as SkillArea[];
    },
  });

  const createProgramMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/programs", payload);
      return res.data;
    },
    onSuccess: () => {
      setIsAddModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createProgramMutation.mutate({
      ...newProgram,
      skillAreaIds:
        newProgram.skillAreaIds.length > 0
          ? newProgram.skillAreaIds
          : [skills?.[0]?._id],
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Programs & Initiatives
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage internal and partner-sponsored empowerment initiatives.
              Adele operates as both program owner and accredited training
              delivery host.
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-teal-700 hover:bg-teal-800 text-xs font-semibold gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Program
          </Button>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs?.map((prog) => (
            <Card
              key={prog._id}
              className="border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-5 dark:bg-slate-900/50 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 dark:bg-teal-950 dark:text-teal-300">
                    {prog.code}
                  </span>
                  <StatusBadge status={prog.status} size="sm" />
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-slate-100 mt-2">
                  {prog.title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Organizer: <strong>{prog.organizerName}</strong> (
                  {prog.organizerType}) • Role: {prog.deliveryRole}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 space-y-4 text-xs">
                <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                  {prog.description}
                </p>

                {/* Skill Tracks */}
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Integrated Skill Areas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {prog.skillAreaIds?.map((skill: any) => (
                      <span
                        key={skill._id}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium dark:bg-slate-800 dark:text-slate-200"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Active Cohorts
                    </span>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {prog.stats?.cohorts || 1} Cohorts
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Total Applicants
                    </span>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {prog.stats?.applications || 42} Applied
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Program Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Program</DialogTitle>
              <DialogDescription>
                Configure a new empowerment or vocational program.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-3 text-xs py-2">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Program Title *
                </label>
                <Input
                  required
                  placeholder="e.g. National Solar PV & Renewable Energy 2026"
                  value={newProgram.title}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Program Code *
                  </label>
                  <Input
                    required
                    placeholder="PROG-SOLAR-2026"
                    value={newProgram.code}
                    onChange={(e) =>
                      setNewProgram({ ...newProgram, code: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Organizer Type *
                  </label>
                  <select
                    value={newProgram.organizerType}
                    onChange={(e) =>
                      setNewProgram({
                        ...newProgram,
                        organizerType: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="Adele Owned">Adele Owned</option>
                    <option value="Government Owned">Government Owned</option>
                    <option value="NGO Partner">NGO Partner</option>
                    <option value="Private Sector">Private Sector</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Organizer / Owner Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Federal Ministry of Labour"
                  value={newProgram.organizerName}
                  onChange={(e) =>
                    setNewProgram({
                      ...newProgram,
                      organizerName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newProgram.description}
                  onChange={(e) =>
                    setNewProgram({
                      ...newProgram,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
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
                  disabled={createProgramMutation.isPending}
                  className="bg-teal-700 hover:bg-teal-800"
                >
                  {createProgramMutation.isPending
                    ? "Saving..."
                    : "Create Program"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
