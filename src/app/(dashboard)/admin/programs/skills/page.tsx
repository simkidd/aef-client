"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles, Plus, Layers, Award, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
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
import { SkillArea } from "@/interfaces";

export default function SkillAreasRegistryPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    code: "",
    category: "Renewable Energy",
    description: "",
    defaultDurationWeeks: 8,
    certificationType: "National Certification",
  });

  const { data: skills, isLoading } = useQuery({
    queryKey: ["admin-skill-areas"],
    queryFn: async () => {
      const res = await api.get("/programs/skills/all");
      return res.data?.data as SkillArea[];
    },
  });

  const createSkillMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/programs/skills", payload);
      return res.data;
    },
    onSuccess: () => {
      setIsAddModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-skill-areas"] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createSkillMutation.mutate(newSkill);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Skill Areas Registry
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Reusable technical curriculum disciplines. A single skill area can
              be integrated across multiple programs and training centres
              without duplication.
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-teal-700 hover:bg-teal-800 text-xs font-semibold gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Skill Area
          </Button>
        </div>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill Code & Discipline</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Default Duration</TableHead>
                <TableHead>Certification Standard</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills && skills.length > 0 ? (
                skills.map((skill) => (
                  <TableRow key={skill._id}>
                    <TableCell>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                        {skill.name}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {skill.code}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 dark:text-slate-300">
                      {skill.category}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {skill.defaultDurationWeeks} Weeks
                    </TableCell>
                    <TableCell className="text-xs text-teal-700 font-semibold">
                      {skill.certificationType}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={skill.isActive ? "Active" : "Inactive"}
                        size="sm"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-slate-500 text-xs"
                  >
                    No skill areas found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Add Skill Area Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Skill Area</DialogTitle>
              <DialogDescription>
                Define a technical trade discipline available for cohort
                scheduling.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-3 text-xs py-2">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Skill Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Solar PV Installation"
                  value={newSkill.name}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Code *
                  </label>
                  <Input
                    required
                    placeholder="SOL-PV"
                    value={newSkill.code}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, code: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Default Duration (Weeks)
                  </label>
                  <Input
                    type="number"
                    required
                    value={newSkill.defaultDurationWeeks}
                    onChange={(e) =>
                      setNewSkill({
                        ...newSkill,
                        defaultDurationWeeks: parseInt(e.target.value, 10),
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Category *
                </label>
                <select
                  value={newSkill.category}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="Technical / Vocational">
                    Technical / Vocational
                  </option>
                  <option value="Digital & ICT">Digital & ICT</option>
                  <option value="Creative Arts">Creative Arts</option>
                  <option value="Business & Entrepreneurship">
                    Business & Entrepreneurship
                  </option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newSkill.description}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, description: e.target.value })
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
                  disabled={createSkillMutation.isPending}
                  className="bg-teal-700 hover:bg-teal-800"
                >
                  {createSkillMutation.isPending
                    ? "Saving..."
                    : "Register Skill"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
