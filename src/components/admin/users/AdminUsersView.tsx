"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  Search,
  MoreHorizontal,
  Briefcase,
  GraduationCap,
  Calendar,
  Clock,
  ExternalLink,
  Edit3,
  RefreshCw,
  UserPlus,
  Loader2,
  Eye,
} from "lucide-react";
import {
  useUsersQuery,
  useUserStatsQuery,
} from "@/hooks/queries/useAdminQueries";
import { useUpdateUserRolesAndScopesMutation } from "@/hooks/mutations/useAdminMutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MetricCard } from "@/components/common/MetricCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TablePagination } from "@/components/ui/table-pagination";
import { EditUserModal } from "./EditUserModal";
import { UserDetailsSheet } from "./UserDetailsSheet";
import { User } from "@/interfaces";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "@/components/ui/toast";

type TabType = "all" | "staff" | "beneficiaries" | "inactive";

const ROLE_BADGES: Record<string, { label: string; color: string }> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  },
  CENTRE_MANAGER: {
    label: "Centre Manager",
    color:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  PROGRAM_MANAGER: {
    label: "Program Manager",
    color:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  },
  TRAINER: {
    label: "Trainer",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
  HR_OFFICER: {
    label: "HR Officer",
    color:
      "bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800",
  },
  REGISTRATION_OFFICER: {
    label: "Reg. Officer",
    color:
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  },
  BENEFICIARY: {
    label: "Beneficiary",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
};

export function AdminUsersView() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Construct query parameters
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page,
      limit: 15,
    };

    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    if (activeTab === "staff") {
      params.isStaff = true;
    } else if (activeTab === "beneficiaries") {
      params.isStaff = false;
    }

    return params;
  }, [activeTab, searchQuery, page]);

  const { data, isPending, refetch, isFetching } = useUsersQuery(queryParams);
  const {
    data: stats,
    isPending: isStatsLoading,
    refetch: refetchStats,
  } = useUserStatsQuery();

  const users = data?.users || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  };

  const updateMutation = useUpdateUserRolesAndScopesMutation();

  const handleRefresh = () => {
    refetch();
    refetchStats();
  };

  const handleOpenDetails = (user: User) => {
    setSelectedUserForDetails(user);
    setIsDetailsOpen(true);
  };

  const handleToggleStatus = (user: User) => {
    const userId = user.id || user._id;
    if (!userId) return;

    const currentUserId = currentUser?.id || currentUser?._id;
    const isSelf = !!(currentUserId && userId.toString() === currentUserId.toString());
    const currentActive = user.isActive !== false;

    if (isSelf && currentActive) {
      toast.add({
        title: "Action Denied",
        description: "You cannot deactivate your own administrator account.",
        type: "warning",
      });
      return;
    }

    updateMutation.mutate({
      id: userId,
      payload: {
        isActive: !currentActive,
      },
    });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return `${first}${last}`.toUpperCase() || "U";
  };

  // Filter for client-side inactive tab if needed
  const displayedUsers = useMemo(() => {
    if (activeTab === "inactive") {
      return users.filter((u) => u.isActive === false);
    }
    return users;
  }, [users, activeTab]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
            User Accounts & Security
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage platform authentication, accounts, system roles, and access scopes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="text-xs h-8 gap-1.5 cursor-pointer"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>
          <Link href="/admin/organization/staff">
            <Button
              size="sm"
              className="text-xs h-8 font-semibold gap-1.5 cursor-pointer bg-primary"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Provision Staff User</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Accounts"
          value={isStatsLoading ? "..." : (stats?.totalUsers ?? 0)}
          subtitle="Registered in database"
          icon={Users}
          color="primary"
        />
        <MetricCard
          title="Staff & Admins"
          value={isStatsLoading ? "..." : (stats?.staffUsers ?? 0)}
          subtitle="Privileged system operators"
          icon={ShieldCheck}
          color="purple"
        />
        <MetricCard
          title="Beneficiaries"
          value={isStatsLoading ? "..." : (stats?.beneficiaryUsers ?? 0)}
          subtitle="Trainees & Candidates"
          icon={GraduationCap}
          color="emerald"
        />
        <MetricCard
          title="Active State"
          value={isStatsLoading ? "..." : (stats?.activeUsers ?? 0)}
          subtitle="Accounts currently enabled"
          icon={UserCheck}
          color="blue"
        />
      </div>

      {/* Main Table Card */}
      <Card className="py-0 overflow-hidden">
        {/* Search and Tabs Toolbar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-muted/20">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-9 h-9 text-xs bg-background"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setPage(1);
                }}
                className="absolute right-2.5 top-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val as TabType);
              setPage(1);
            }}
            className="w-full md:w-auto overflow-x-auto"
          >
            <TabsList className="h-9 bg-muted/80 p-1 rounded-lg">
              <TabsTrigger
                value="all"
                className="text-xs font-semibold px-3 cursor-pointer"
              >
                All Users
              </TabsTrigger>
              <TabsTrigger
                value="staff"
                className="text-xs font-semibold px-3 cursor-pointer"
              >
                Admins & Staff
              </TabsTrigger>
              <TabsTrigger
                value="beneficiaries"
                className="text-xs font-semibold px-3 cursor-pointer"
              >
                Beneficiaries
              </TabsTrigger>
              <TabsTrigger
                value="inactive"
                className="text-xs font-semibold px-3 cursor-pointer"
              >
                Disabled
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Table Content */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Account</TableHead>
              <TableHead>Roles & Permissions</TableHead>
              <TableHead>Entity Link</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-[60px] text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {isPending ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-xs font-medium">Loading user accounts...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : displayedUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-12 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <UserX className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm font-semibold text-foreground">
                      No user accounts found
                    </p>
                    <p className="text-xs">
                      {searchQuery
                        ? "Try adjusting your search criteria."
                        : "No accounts match this category."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              displayedUsers.map((user: User) => {
                const userId = user.id || user._id;
                const currentUserId = currentUser?.id || currentUser?._id;
                const isSelf = !!(userId && currentUserId && userId.toString() === currentUserId.toString());
                const isActiveAccount = user.isActive !== false;
                const primaryRole =
                  user.roles?.[0] || (user.isStaff ? "TRAINER" : "BENEFICIARY");
                const badgeInfo = ROLE_BADGES[primaryRole] || {
                  label: primaryRole,
                  color: "bg-muted text-foreground border-border",
                };

                return (
                  <TableRow
                    key={user.id || user._id}
                    className="hover:bg-muted/60 transition-colors group"
                  >
                    {/* User details */}
                    <TableCell className="py-3 px-4">
                      <div
                        onClick={() => handleOpenDetails(user)}
                        className="flex items-center gap-3 cursor-pointer group-hover/row:opacity-90"
                      >
                        <Avatar className="h-9 w-9">
                          {user.avatarUrl && (
                            <AvatarImage
                              src={user.avatarUrl}
                              alt={user.firstName}
                            />
                          )}
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {getInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                            {user.firstName} {user.lastName}
                            {isSelf && (
                              <span className="text-[11px] font-normal text-primary ml-1.5">
                                (You)
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {user.email}
                          </p>
                          {user.phone && (
                            <p className="text-[10px] text-muted-foreground/70">
                              {user.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Roles */}
                    <TableCell className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 items-center">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold px-2 py-0.5 ${badgeInfo.color}`}
                        >
                          {badgeInfo.label}
                        </Badge>
                        {user.roles && user.roles.length > 1 && (
                          <Badge
                            variant="secondary"
                            className="text-[9px] px-1.5 py-0 text-muted-foreground"
                          >
                            +{user.roles.length - 1}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Entity Link */}
                    <TableCell className="py-3 px-4">
                      {user.isStaff ? (
                        <Link
                          href="/admin/organization/staff"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                        >
                          <Briefcase className="h-3 w-3" />
                          <span>Staff Record</span>
                        </Link>
                      ) : (
                        <Link
                          href="/admin/beneficiaries/trainees"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          <GraduationCap className="h-3 w-3" />
                          <span>
                            {user.beneficiaryProfileId?.beneficiaryCode ||
                              "Beneficiary"}
                          </span>
                        </Link>
                      )}
                    </TableCell>

                    {/* Scope */}
                    <TableCell className="py-3 px-4">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {user.scopeAssignments?.[0]?.targetName ||
                          user.scopeAssignments?.[0]?.scopeType ||
                          "GLOBAL"}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3 px-4">
                      <StatusBadge
                        status={isActiveAccount ? "Active" : "Inactive"}
                        size="sm"
                      />
                    </TableCell>

                    {/* Created Date */}
                    <TableCell className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {user.createdAt ? (
                        <div className="flex items-center gap-1.5 text-[11px] text-foreground">
                          <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">
                          —
                        </span>
                      )}
                    </TableCell>

                    {/* Last Login */}
                    <TableCell className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {user.lastLoginAt ? (
                        <div className="flex items-center gap-1.5 text-[11px] text-foreground">
                          <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span>{formatDate(user.lastLoginAt)}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">
                          Never logged in
                        </span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                            />
                          }
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 text-xs"
                        >
                          <DropdownMenuItem
                            onClick={() => handleOpenDetails(user)}
                            className="gap-2 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 text-primary" />
                            <span>View Security Profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setEditingUser(user)}
                            className="gap-2 cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span>Edit Roles & Access</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              if (isSelf && isActiveAccount) return;
                              handleToggleStatus(user);
                            }}
                            disabled={isSelf && isActiveAccount}
                            className="gap-2 cursor-pointer"
                          >
                            {isActiveAccount ? (
                              <>
                                <UserX className="h-3.5 w-3.5 text-rose-500" />
                                <span className={isSelf ? "text-muted-foreground" : "text-rose-600"}>
                                  Disable Account {isSelf && "(You)"}
                                </span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="text-emerald-600">
                                  Enable Account
                                </span>
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.isStaff ? (
                            <DropdownMenuItem
                              onClick={() =>
                                router.push("/admin/organization/staff")
                              }
                              className="gap-2 cursor-pointer"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>View Staff File</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() =>
                                router.push("/admin/beneficiaries/trainees")
                              }
                              className="gap-2 cursor-pointer"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>View Trainee File</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Standard Table Pagination Footer */}
        <TablePagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={(p) => setPage(p)}
        />
      </Card>

      {/* User Details Sheet */}
      <UserDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        user={selectedUserForDetails}
        onOpenEdit={(user) => setEditingUser(user)}
        onToggleStatus={handleToggleStatus}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
      />
    </div>
  );
}
