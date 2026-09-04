"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Plus,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  MapPin,
} from "lucide-react";
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
import { formatDate } from "@/lib/utils";
import { TrainingCentre } from "@/interfaces";

export default function TrainingCalendarPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    eventType: "Public Holiday",
    description: "",
    startDate: "2026-10-01",
    endDate: "2026-10-01",
    centreId: "",
    affectsAttendance: true,
  });

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-calendar-events"],
    queryFn: async () => {
      const res = await api.get("/cohorts/calendar/events");
      return res.data?.data;
    },
  });

  const { data: centres } = useQuery({
    queryKey: ["admin-centres-lookup"],
    queryFn: async () => {
      const res = await api.get("/centres");
      return res.data?.data as TrainingCentre[];
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/cohorts/calendar/events", payload);
      return res.data;
    },
    onSuccess: () => {
      setIsAddModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-calendar-events"] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createEventMutation.mutate({
      ...newEvent,
      centreId: newEvent.centreId || undefined,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Training Calendar & Exception Manager
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure non-training dates (Public Holidays, Centre Closures,
              Emergency weather closures). Non-training dates NEVER count as
              absences for trainees.
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-teal-700 hover:bg-teal-800 text-xs font-semibold gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Calendar Exception
          </Button>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Title & Description</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Affected Scope / Centre</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Attendance Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events && events.length > 0 ? (
                events.map((evt: any) => (
                  <TableRow key={evt._id}>
                    <TableCell>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                        {evt.title}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {evt.description || "No notes"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300">
                        {evt.eventType}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      {evt.centreId?.name || (
                        <span className="font-semibold text-teal-800 dark:text-teal-300">
                          Global (All Centres)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {formatDate(evt.startDate)}{" "}
                      {evt.startDate !== evt.endDate
                        ? `– ${formatDate(evt.endDate)}`
                        : ""}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> No Absence
                        Penalty
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-slate-500 text-xs"
                  >
                    No calendar exception dates recorded.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Add Event Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Training Calendar Exception</DialogTitle>
              <DialogDescription>
                Define a closure or holiday date that overrides normal recurring
                timetables.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-3 text-xs py-2">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Event Title *
                </label>
                <Input
                  required
                  placeholder="e.g. National Day Holiday"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Event Type *
                  </label>
                  <select
                    value={newEvent.eventType}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, eventType: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="Public Holiday">Public Holiday</option>
                    <option value="Centre Closed">Centre Closed</option>
                    <option value="Trainer Unavailable">
                      Trainer Unavailable
                    </option>
                    <option value="Emergency Closure">Emergency Closure</option>
                    <option value="Weather-related cancellation">
                      Weather Cancellation
                    </option>
                    <option value="Examination Day">Examination Day</option>
                    <option value="Rescheduled Training">
                      Rescheduled Training
                    </option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Target Centre
                  </label>
                  <select
                    value={newEvent.centreId}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, centreId: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="">Global (All Centres)</option>
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
                    value={newEvent.startDate}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, startDate: e.target.value })
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
                    value={newEvent.endDate}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Description / Details
                </label>
                <textarea
                  rows={2}
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
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
                  disabled={createEventMutation.isPending}
                  className="bg-teal-700 hover:bg-teal-800"
                >
                  {createEventMutation.isPending
                    ? "Saving..."
                    : "Save Exception Date"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
