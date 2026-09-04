"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  Plus,
  Building,
  Layers,
  Fingerprint,
  Users,
  CheckCircle2,
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
import { TrainingCentre } from "@/interfaces";

export default function TrainingCentresPage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCentre, setNewCentre] = useState({
    name: "",
    centreCode: "",
    address: "",
    state: "Lagos",
    lga: "",
    contactEmail: "",
    contactPhone: "",
    capacity: 100,
  });

  const { data: centres, isLoading } = useQuery({
    queryKey: ["centres-management"],
    queryFn: async () => {
      const res = await api.get("/centres");
      return res.data?.data as TrainingCentre[];
    },
  });

  const createCentreMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/centres", payload);
      return res.data;
    },
    onSuccess: () => {
      setIsAddModalOpen(false);
      setNewCentre({
        name: "",
        centreCode: "",
        address: "",
        state: "Lagos",
        lga: "",
        contactEmail: "",
        contactPhone: "",
        capacity: 100,
      });
      queryClient.invalidateQueries({ queryKey: ["centres-management"] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCentreMutation.mutate({
      ...newCentre,
      centreCode:
        newCentre.centreCode || `AEF-CTR-0${(centres?.length || 2) + 1}`,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Training Centres & Facilities
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Centrally manage accredited Adele training centres. Add new
              centres (Centre 3, Centre 4, etc.) dynamically as the foundation
              scales.
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-teal-700 hover:bg-teal-800 text-xs font-semibold gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Training Centre
          </Button>
        </div>

        {/* Centres Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {centres?.map((centre) => (
            <Card
              key={centre._id}
              className="border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-5 dark:bg-slate-900/50 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 dark:bg-teal-950 dark:text-teal-300">
                    {centre.centreCode}
                  </span>
                  <StatusBadge status={centre.status} size="sm" />
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-slate-100 mt-2">
                  {centre.name}
                </CardTitle>
                <CardDescription className="text-xs flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  {centre.address}, {centre.state} State
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 space-y-4 text-xs">
                {/* Centre Stats Grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Capacity
                    </span>
                    <p className="text-base font-bold text-slate-900 mt-0.5 dark:text-slate-100">
                      {centre.capacity} Seats
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Rooms / Labs
                    </span>
                    <p className="text-base font-bold text-teal-700 mt-0.5">
                      {centre.stats?.rooms || 2} Rooms
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Bio Scanners
                    </span>
                    <p className="text-base font-bold text-emerald-700 mt-0.5">
                      {centre.stats?.devices || 1} Online
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-slate-600 dark:text-slate-400 pt-1">
                  <div className="flex justify-between">
                    <span>Contact Email:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {centre.contactEmail}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {centre.contactPhone}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Centre Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Training Centre</DialogTitle>
              <DialogDescription>
                Register a new accredited training facility into the foundation
                network.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-3 text-xs py-2">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Centre Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Adele Tech Hub (Abuja Central)"
                  value={newCentre.name}
                  onChange={(e) =>
                    setNewCentre({ ...newCentre, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    State *
                  </label>
                  <Input
                    required
                    placeholder="e.g. FCT Abuja"
                    value={newCentre.state}
                    onChange={(e) =>
                      setNewCentre({ ...newCentre, state: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    LGA / District *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Garki"
                    value={newCentre.lga}
                    onChange={(e) =>
                      setNewCentre({ ...newCentre, lga: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Street Address *
                </label>
                <Input
                  required
                  placeholder="Full physical street location"
                  value={newCentre.address}
                  onChange={(e) =>
                    setNewCentre({ ...newCentre, address: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Contact Email *
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="centre@adelefoundation.org"
                    value={newCentre.contactEmail}
                    onChange={(e) =>
                      setNewCentre({
                        ...newCentre,
                        contactEmail: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Capacity (Seats) *
                  </label>
                  <Input
                    type="number"
                    required
                    value={newCentre.capacity}
                    onChange={(e) =>
                      setNewCentre({
                        ...newCentre,
                        capacity: parseInt(e.target.value, 10),
                      })
                    }
                  />
                </div>
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
                  disabled={createCentreMutation.isPending}
                  className="bg-teal-700 hover:bg-teal-800"
                >
                  {createCentreMutation.isPending
                    ? "Saving..."
                    : "Register Centre"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
