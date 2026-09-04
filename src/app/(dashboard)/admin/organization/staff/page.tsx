"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Plus,
  ShieldCheck,
  Key,
  Mail,
  Phone,
  Building,
  UserCheck,
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
import { Staff, Department, TrainingCentre } from "@/interfaces";

export default function StaffDirectoryPage() {
  const queryClient = useQueryClient();
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [provisionRole, setProvisionRole] = useState("TRAINER");

  // Form states for creating staff
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    gender: "Male",
    email: "",
    phone: "",
    position: "",
    category: "Trainers",
    departmentId: "",
    assignedCentreId: "",
  });

  const { data: staffList, isLoading } = useQuery({
    queryKey: ["staff-list", categoryFilter, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryFilter) params.append("category", categoryFilter);
      if (search) params.append("search", search);
      const res = await api.get(`/staff?${params.toString()}`);
      return res.data?.data as Staff[];
    },
  });

  const { data: departments } = useQuery({
    queryKey: ["departments-list"],
    queryFn: async () => {
      const res = await api.get("/org/departments");
      return res.data?.data as Department[];
    },
  });

  const { data: centres } = useQuery({
    queryKey: ["centres-list"],
    queryFn: async () => {
      const res = await api.get("/centres");
      return res.data?.data as TrainingCentre[];
    },
  });

  const createStaffMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/staff", payload);
      return res.data;
    },
    onSuccess: () => {
      setIsAddModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["staff-list"] });
    },
  });

  const provisionAccountMutation = useMutation({
    mutationFn: async ({
      staffId,
      roles,
    }: {
      staffId: string;
      roles: string[];
    }) => {
      const res = await api.post(`/staff/${staffId}/provision-account`, {
        roles,
      });
      return res.data;
    },
    onSuccess: () => {
      setIsProvisionModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["staff-list"] });
    },
  });

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    createStaffMutation.mutate({
      ...newStaff,
      departmentId: newStaff.departmentId || departments?.[0]?._id,
      assignedCentreId: newStaff.assignedCentreId || centres?.[0]?._id,
    });
  };

  const handleOpenProvision = (st: Staff) => {
    setSelectedStaff(st);
    setIsProvisionModalOpen(true);
  };

  const handleConfirmProvision = () => {
    if (!selectedStaff) return;
    provisionAccountMutation.mutate({
      staffId: selectedStaff._id,
      roles: [provisionRole],
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Staff & Employee Directory
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Organization HR registry for all employees (Trainers, Management,
              Operations, Cleaners, Drivers). System login accounts are
              provisioned separately on-demand.
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-teal-700 hover:bg-teal-800 text-xs font-semibold gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Staff Record
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <Input
              placeholder="Search by name, staff code, position, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">
                All Categories (Management, Trainers, Operations, Drivers, etc.)
              </option>
              <option value="Management">Management</option>
              <option value="Trainers">Trainers & Instructors</option>
              <option value="Administration">Administration</option>
              <option value="Operations">Operations</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
              <option value="Drivers">Drivers</option>
              <option value="Security">Security</option>
              <option value="Cleaning">Cleaning</option>
            </select>
          </div>
        </Card>

        {/* Staff Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Code & Name</TableHead>
                <TableHead>Position & Category</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Assigned Centre</TableHead>
                <TableHead>Employment Status</TableHead>
                <TableHead>System Account</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList && staffList.length > 0 ? (
                staffList.map((st) => (
                  <TableRow key={st._id}>
                    <TableCell>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                        {st.firstName} {st.lastName}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {st.staffCode} • {st.email}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {st.position}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {st.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                      {st.departmentId?.name || "Central Org"}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                      {st.assignedCentreId?.name || "Headquarters"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={st.employmentStatus} size="sm" />
                    </TableCell>
                    <TableCell>
                      {st.hasSystemAccount ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300">
                          <ShieldCheck className="h-3.5 w-3.5" /> Login Active
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          No account
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {!st.hasSystemAccount ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenProvision(st)}
                          className="h-7 text-xs font-semibold gap-1 text-teal-800"
                        >
                          <Key className="h-3 w-3" /> Provision Login
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Provisioned
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-slate-500 text-xs"
                  >
                    No staff records found matching filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Add Staff Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Staff Record</DialogTitle>
              <DialogDescription>
                Create a new employee record in the organizational HR database.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleCreateStaff}
              className="space-y-3 text-xs py-2"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    First Name *
                  </label>
                  <Input
                    required
                    value={newStaff.firstName}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Last Name *
                  </label>
                  <Input
                    required
                    value={newStaff.lastName}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, lastName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    required
                    value={newStaff.email}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Phone Number *
                  </label>
                  <Input
                    required
                    value={newStaff.phone}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Position / Job Title *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Lead Trainer"
                    value={newStaff.position}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, position: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Category *
                  </label>
                  <select
                    value={newStaff.category}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="Trainers">Trainers</option>
                    <option value="Management">Management</option>
                    <option value="Operations">Operations</option>
                    <option value="Administration">Administration</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="Drivers">Drivers</option>
                    <option value="Security">Security</option>
                    <option value="Cleaning">Cleaning</option>
                  </select>
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
                  disabled={createStaffMutation.isPending}
                  className="bg-teal-700 hover:bg-teal-800"
                >
                  {createStaffMutation.isPending
                    ? "Saving..."
                    : "Save Staff Record"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Provision Account Modal */}
        <Dialog
          open={isProvisionModalOpen}
          onOpenChange={setIsProvisionModalOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Provision System Account</DialogTitle>
              <DialogDescription>
                Assign system credentials and roles to{" "}
                <strong>
                  {selectedStaff?.firstName} {selectedStaff?.lastName}
                </strong>{" "}
                ({selectedStaff?.email}).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Assign System Role
                </label>
                <select
                  value={provisionRole}
                  onChange={(e) => setProvisionRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="TRAINER">
                    Trainer / Instructor (Delivering specific skills &
                    gradebook)
                  </option>
                  <option value="CENTRE_MANAGER">
                    Centre Manager (Centre scoped)
                  </option>
                  <option value="PROGRAM_MANAGER">
                    Program Manager (Program scoped)
                  </option>
                  <option value="HR_OFFICER">
                    HR Officer (Staff & volunteer records)
                  </option>
                  <option value="SUPER_ADMIN">
                    Super Administrator (Full unrestricted access)
                  </option>
                </select>
              </div>
              <p className="text-slate-500 text-[11px]">
                A default temporary password <strong>Adele@2026</strong> will be
                assigned to their work email.
              </p>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsProvisionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmProvision}
                disabled={provisionAccountMutation.isPending}
                className="bg-teal-700 hover:bg-teal-800"
              >
                {provisionAccountMutation.isPending
                  ? "Provisioning..."
                  : "Confirm & Create Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
