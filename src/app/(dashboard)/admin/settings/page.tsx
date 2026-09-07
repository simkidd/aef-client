"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Building2,
  Clock,
  CheckCircle2,
  Save,
  Loader2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Layers,
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import { useOrgInfoQuery } from "@/hooks/queries/useOrgQueries";
import { useUpdateOrgInfoMutation } from "@/hooks/mutations/useOrgMutations";
import { api } from "@/lib/client";
import { toast } from "@/components/ui/toast";

const orgInfoSchema = z.object({
  name: z.string().min(2, "Organization name is required"),
  code: z.string().min(2, "Organization code is required"),
  tagline: z.string().optional(),
  email: z.string().email("Valid email address is required"),
  phone: z.string().min(5, "Contact phone number is required"),
  address: z.string().min(3, "Physical address is required"),
  state: z.string().min(2, "State is required"),
  lga: z.string().min(2, "LGA is required"),
  country: z.string().min(2, "Country is required"),
});

type OrgInfoFormValues = z.infer<typeof orgInfoSchema>;

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();

  // --- Organization Info Hook Form ---
  const { data: orgInfo, isLoading: isOrgLoading } = useOrgInfoQuery();
  const updateOrgMutation = useUpdateOrgInfoMutation();

  const {
    register: registerOrg,
    handleSubmit: handleOrgSubmit,
    reset: resetOrgForm,
    formState: { errors: orgErrors, isDirty: isOrgDirty },
  } = useForm<OrgInfoFormValues>({
    resolver: zodResolver(orgInfoSchema),
    defaultValues: {
      name: "",
      code: "",
      tagline: "",
      email: "",
      phone: "",
      address: "",
      state: "Lagos",
      lga: "Ikeja",
      country: "Nigeria",
    },
  });

  useEffect(() => {
    if (orgInfo) {
      resetOrgForm({
        name: orgInfo.name || "Adele Empowerment Foundation",
        code: orgInfo.code || "AEF",
        tagline: orgInfo.tagline || "Building Skills, Empowering Lives",
        email: orgInfo.email || "info@adelefoundation.org",
        phone: orgInfo.phone || "+234 800 ADELE FDN",
        address: orgInfo.address || "Plot 104, Adele Empowerment Crescent, CBD",
        state: orgInfo.state || "Lagos",
        lga: orgInfo.lga || "Ikeja",
        country: orgInfo.country || "Nigeria",
      });
    }
  }, [orgInfo, resetOrgForm]);

  const onSaveOrgProfile = (data: OrgInfoFormValues) => {
    updateOrgMutation.mutate(data);
  };

  // --- Attendance Policies Form ---
  const { data: policiesData } = useQuery({
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
        gracePeriodMinutes: policiesData.gracePeriodMinutes || 15,
        lateThresholdMinutes: policiesData.lateThresholdMinutes || 45,
        minDailyDurationMinutes: policiesData.minDailyDurationMinutes || 120,
        minAttendancePercentForCertificate:
          policiesData.minAttendancePercentForCertificate || 80,
        lowAttendanceAlertThreshold:
          policiesData.lowAttendanceAlertThreshold || 75,
        criticalAttendanceAlertThreshold:
          policiesData.criticalAttendanceAlertThreshold || 60,
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
        description: err?.response?.data?.message || err?.message || "Unable to save attendance rules.",
        type: "error",
      });
    },
  });

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    savePolicyMutation.mutate(policyForm);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
          System & Organization Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Configure foundation legal profile, contact information, operational rules, and attendance criteria.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="org-profile" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl h-10 w-fit">
          <TabsTrigger value="org-profile" className="gap-2 text-xs font-semibold">
            <Building2 className="h-4 w-4" />
            <span>Organization Profile</span>
          </TabsTrigger>
          <TabsTrigger value="attendance-rules" className="gap-2 text-xs font-semibold">
            <Clock className="h-4 w-4" />
            <span>Attendance & Biometric Rules</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Organization Master Profile */}
        <TabsContent value="org-profile">
          <form onSubmit={handleOrgSubmit(onSaveOrgProfile)}>
            <Card>
              <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-bold font-heading">
                    Foundation Master Profile
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Official identity, registration acronym, communication channels, and headquarters location.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <FieldSet className="space-y-5 text-xs">
                  <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field className="md:col-span-2">
                      <FieldLabel className="text-xs font-semibold">
                        Foundation Full Legal Name *
                      </FieldLabel>
                      <Input
                        {...registerOrg("name")}
                        placeholder="Adele Empowerment Foundation"
                        className="text-xs h-9 min-h-9"
                        disabled={isOrgLoading}
                      />
                      {orgErrors.name && (
                        <FieldError className="text-xs">{orgErrors.name.message}</FieldError>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel className="text-xs font-semibold">
                        Acronym / Code *
                      </FieldLabel>
                      <Input
                        {...registerOrg("code")}
                        placeholder="AEF"
                        className="text-xs h-9 min-h-9 font-mono uppercase"
                        disabled={isOrgLoading}
                      />
                      {orgErrors.code && (
                        <FieldError className="text-xs">{orgErrors.code.message}</FieldError>
                      )}
                    </Field>
                  </FieldGroup>

                  <Field>
                    <FieldLabel className="text-xs font-semibold">
                      Organization Tagline / Motto
                    </FieldLabel>
                    <Input
                      {...registerOrg("tagline")}
                      placeholder="Building Skills, Empowering Lives"
                      className="text-xs h-9 min-h-9"
                      disabled={isOrgLoading}
                    />
                    {orgErrors.tagline && (
                      <FieldError className="text-xs">{orgErrors.tagline.message}</FieldError>
                    )}
                  </Field>

                  <div className="pt-2 border-t">
                    <h4 className="text-xs font-bold text-foreground tracking-wider uppercase mb-3">
                      Official Contact Channels
                    </h4>
                    <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel className="text-xs font-semibold flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          Primary Official Email *
                        </FieldLabel>
                        <Input
                          type="email"
                          {...registerOrg("email")}
                          placeholder="info@adelefoundation.org"
                          className="text-xs h-9 min-h-9"
                          disabled={isOrgLoading}
                        />
                        {orgErrors.email && (
                          <FieldError className="text-xs">{orgErrors.email.message}</FieldError>
                        )}
                      </Field>

                      <Field>
                        <FieldLabel className="text-xs font-semibold flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          Primary Contact Phone *
                        </FieldLabel>
                        <Input
                          {...registerOrg("phone")}
                          placeholder="+234 800 ADELE FDN"
                          className="text-xs h-9 min-h-9 font-mono"
                          disabled={isOrgLoading}
                        />
                        {orgErrors.phone && (
                          <FieldError className="text-xs">{orgErrors.phone.message}</FieldError>
                        )}
                      </Field>
                    </FieldGroup>
                  </div>

                  <div className="pt-2 border-t">
                    <h4 className="text-xs font-bold text-foreground tracking-wider uppercase mb-3">
                      Headquarters & Secretariat Location
                    </h4>
                    <FieldGroup className="space-y-4">
                      <Field>
                        <FieldLabel className="text-xs font-semibold flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          Street Address *
                        </FieldLabel>
                        <Input
                          {...registerOrg("address")}
                          placeholder="Plot 104, Adele Empowerment Crescent, Central Business District"
                          className="text-xs h-9 min-h-9"
                          disabled={isOrgLoading}
                        />
                        {orgErrors.address && (
                          <FieldError className="text-xs">{orgErrors.address.message}</FieldError>
                        )}
                      </Field>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Field>
                          <FieldLabel className="text-xs font-semibold">State *</FieldLabel>
                          <Input
                            {...registerOrg("state")}
                            placeholder="Lagos"
                            className="text-xs h-9 min-h-9"
                            disabled={isOrgLoading}
                          />
                          {orgErrors.state && (
                            <FieldError className="text-xs">{orgErrors.state.message}</FieldError>
                          )}
                        </Field>

                        <Field>
                          <FieldLabel className="text-xs font-semibold">L.G.A. *</FieldLabel>
                          <Input
                            {...registerOrg("lga")}
                            placeholder="Ikeja"
                            className="text-xs h-9 min-h-9"
                            disabled={isOrgLoading}
                          />
                          {orgErrors.lga && (
                            <FieldError className="text-xs">{orgErrors.lga.message}</FieldError>
                          )}
                        </Field>

                        <Field>
                          <FieldLabel className="text-xs font-semibold">Country *</FieldLabel>
                          <Input
                            {...registerOrg("country")}
                            placeholder="Nigeria"
                            className="text-xs h-9 min-h-9"
                            disabled={isOrgLoading}
                          />
                          {orgErrors.country && (
                            <FieldError className="text-xs">{orgErrors.country.message}</FieldError>
                          )}
                        </Field>
                      </div>
                    </FieldGroup>
                  </div>
                </FieldSet>
              </CardContent>

              <CardFooter className="bg-muted/30 border-t flex justify-end gap-3 p-4">
                <Button
                  type="submit"
                  disabled={updateOrgMutation.isPending || isOrgLoading}
                  className="gap-2 text-xs font-semibold h-9 min-h-9"
                >
                  {updateOrgMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Organization Profile</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* TAB 2: Attendance & Biometric Rules */}
        <TabsContent value="attendance-rules">
          <form onSubmit={handleSavePolicy}>
            <Card>
              <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-bold font-heading">
                    Biometric Attendance Engine Rules
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Fine-tune grace windows, minimum training duration per session, and completion certificate requirements.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-5 text-xs">
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
                          gracePeriodMinutes: parseInt(e.target.value, 10),
                        })
                      }
                      className="text-xs h-9 min-h-9"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Arrival within this window (e.g. 15 mins after session start) is marked On-Time.
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
                          lateThresholdMinutes: parseInt(e.target.value, 10),
                        })
                      }
                      className="text-xs h-9 min-h-9"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Arrival beyond grace period but before threshold is flagged as Late without absence penalty.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t">
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
                          minDailyDurationMinutes: parseInt(e.target.value, 10),
                        })
                      }
                      className="text-xs h-9 min-h-9"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Minimum duration between clock-in and clock-out to count as full session attendance.
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
                          minAttendancePercentForCertificate: parseInt(
                            e.target.value,
                            10,
                          ),
                        })
                      }
                      className="text-xs h-9 min-h-9"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Default minimum threshold (e.g. 80%) required to issue completion certificate.
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-muted/30 border-t flex justify-end gap-3 p-4">
                <Button
                  type="submit"
                  disabled={savePolicyMutation.isPending}
                  className="gap-2 text-xs font-semibold h-9 min-h-9"
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
