"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, Save, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
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
import { api } from "@/lib/client";
import { toast } from "@/components/ui/toast";

export function AttendancePolicySettingsForm() {
  const queryClient = useQueryClient();

  const { data: policiesData, isLoading } = useQuery({
    queryKey: ["admin-attendance-policies"],
    queryFn: async () => {
      const res = await api.get("/attendance/policies");
      return res.data?.data?.[0];
    },
  });

  const [policyForm, setPolicyForm] = useState({
    gracePeriodMinutes: 15,
    lateThresholdMinutes: 45,
    minDailyDurationMinutes: 120,
    minAttendancePercentForCertificate: 80,
    lowAttendanceAlertThreshold: 75,
    criticalAttendanceAlertThreshold: 60,
  });

  useEffect(() => {
    if (policiesData) {
      setPolicyForm({
        gracePeriodMinutes: policiesData.gracePeriodMinutes ?? 15,
        lateThresholdMinutes: policiesData.lateThresholdMinutes ?? 45,
        minDailyDurationMinutes: policiesData.minDailyDurationMinutes ?? 120,
        minAttendancePercentForCertificate:
          policiesData.minAttendancePercentForCertificate ?? 80,
        lowAttendanceAlertThreshold:
          policiesData.lowAttendanceAlertThreshold ?? 75,
        criticalAttendanceAlertThreshold:
          policiesData.criticalAttendanceAlertThreshold ?? 60,
      });
    }
  }, [policiesData]);

  const savePolicyMutation = useMutation({
    mutationFn: async (payload: any) => {
      const policyId = policiesData?._id || "default";
      const res = await api.put(`/attendance/policies/${policyId}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-attendance-policies"],
      });
      toast.add({
        title: "Attendance Policies Saved",
        description: "Operational attendance rules updated successfully.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to save policies",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Unable to save attendance rules.",
        type: "error",
      });
    },
  });

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    savePolicyMutation.mutate(policyForm);
  };

  return (
    <form onSubmit={handleSavePolicy}>
      <Card className="overflow-hidden py-0 gap-0 border-border bg-card shadow-2xs">
        <CardHeader className="p-4 sm:p-5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold font-heading text-foreground">
              Biometric Attendance Engine Rules
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Fine-tune grace windows, minimum training duration per session, and
            completion certificate requirements.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Grace Period (Minutes) *
              </label>
              <Input
                type="number"
                value={policyForm.gracePeriodMinutes}
                onChange={(e) =>
                  setPolicyForm({
                    ...policyForm,
                    gracePeriodMinutes: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="text-xs h-9 min-h-9"
              />
              <p className="text-[11px] text-muted-foreground">
                Arrival within this window (e.g. 15 mins after session start) is
                marked On-Time.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Late Threshold (Minutes) *
              </label>
              <Input
                type="number"
                value={policyForm.lateThresholdMinutes}
                onChange={(e) =>
                  setPolicyForm({
                    ...policyForm,
                    lateThresholdMinutes: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="text-xs h-9 min-h-9"
              />
              <p className="text-[11px] text-muted-foreground">
                Arrival beyond grace period but before threshold is flagged as
                Late without absence penalty.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Minimum Daily Duration (Minutes) *
              </label>
              <Input
                type="number"
                value={policyForm.minDailyDurationMinutes}
                onChange={(e) =>
                  setPolicyForm({
                    ...policyForm,
                    minDailyDurationMinutes: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="text-xs h-9 min-h-9"
              />
              <p className="text-[11px] text-muted-foreground">
                Minimum duration between clock-in and clock-out to count as full
                session attendance.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Certification Attendance Requirement (%) *
              </label>
              <Input
                type="number"
                value={policyForm.minAttendancePercentForCertificate}
                onChange={(e) =>
                  setPolicyForm({
                    ...policyForm,
                    minAttendancePercentForCertificate:
                      parseInt(e.target.value, 10) || 0,
                  })
                }
                className="text-xs h-9 min-h-9"
              />
              <p className="text-[11px] text-muted-foreground">
                Default minimum threshold (e.g. 80%) required to issue
                completion certificate.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/20 border-t border-border flex justify-end gap-3 p-4">
          <Button
            type="submit"
            disabled={savePolicyMutation.isPending || isLoading}
            className="gap-2 text-xs font-semibold h-9 min-h-9 shadow-2xs"
          >
            {savePolicyMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Policies...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Attendance Policies</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
