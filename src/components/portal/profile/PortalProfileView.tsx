"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Lock,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Loader2,
  FileBadge,
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  GraduationCap,
  Briefcase,
  Calendar,
  HeartHandshake,
  ShieldAlert,
  KeyRound,
  Fingerprint,
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useAuthStore } from "@/stores/auth.store";
import { formatDate } from "@/lib/utils";
import { isProfileComplete } from "@/lib/profile.utils";
import { BeneficiaryProfile } from "@/interfaces";
import {
  useCurrentUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/hooks";

// --- Form Validation Schemas ---

const personalSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.string().min(1, "Please select your gender"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  stateOfOrigin: z.string().min(2, "State of origin is required"),
  lgaOfOrigin: z.string().min(2, "LGA of origin is required"),
  highestEducation: z.string().min(1, "Please select education level"),
  employmentStatus: z.string().min(1, "Please select employment status"),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
});

type PersonalFormData = z.infer<typeof personalSchema>;

const contactSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  alternatePhone: z.string().optional(),
  address: z.string().min(5, "Residential address must be at least 5 characters"),
  stateOfResidence: z.string().min(2, "State of residence is required"),
  lgaOfResidence: z.string().min(2, "LGA of residence is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const emergencySchema = z.object({
  emergencyName: z.string().min(2, "Emergency contact name is required"),
  emergencyRelationship: z.string().min(2, "Relationship is required"),
  emergencyPhone: z.string().min(10, "Emergency contact phone must be at least 10 digits"),
});

type EmergencyFormData = z.infer<typeof emergencySchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

// Option Lists
const EDUCATION_OPTIONS = [
  "SSCE / WAEC / NECO",
  "OND / National Diploma",
  "HND / Higher National Diploma",
  "B.Sc / B.Tech / Bachelor's",
  "M.Sc / Master's",
  "Technical / Vocational Certificate",
  "Primary Education",
  "No Formal Education",
];

const EMPLOYMENT_OPTIONS = [
  "Unemployed (Job Seeker)",
  "Student",
  "Self-Employed / Artisan",
  "Employed (Part-time)",
  "Employed (Full-time)",
  "Intern / Apprentice",
];

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const ID_TYPES = [
  "National Identity Number (NIN)",
  "Voter's Card (VIN)",
  "Driver's License",
  "International Passport",
  "Student ID Card",
];

export function PortalProfileView() {
  const { user } = useAuthStore();
  const { data: meData, refetch } = useCurrentUserQuery();
  const profile = (meData as any)?.beneficiaryProfile as BeneficiaryProfile | undefined;

  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();

  const [activeTab, setActiveTab] = useState("personal");
  const [copiedCode, setCopiedCode] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile completion status
  const profileCompletion = useMemo(() => isProfileComplete(profile), [profile]);

  // Copy Beneficiary Code
  const handleCopyCode = () => {
    const code = profile?.beneficiaryCode || "AEF-2026";
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.add({
      title: "Code Copied",
      description: `Beneficiary ID ${code} copied to clipboard.`,
      type: "info",
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Form 1: Personal & Demographics
  const {
    register: registerPersonal,
    handleSubmit: handlePersonalSubmit,
    control: controlPersonal,
    reset: resetPersonal,
    formState: { errors: personalErrors },
  } = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
  });

  // Form 2: Contact & Address
  const {
    register: registerContact,
    handleSubmit: handleContactSubmit,
    reset: resetContact,
    formState: { errors: contactErrors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  // Form 3: Emergency Contact
  const {
    register: registerEmergency,
    handleSubmit: handleEmergencySubmit,
    reset: resetEmergency,
    formState: { errors: emergencyErrors },
  } = useForm<EmergencyFormData>({
    resolver: zodResolver(emergencySchema),
  });

  // Form 4: Security
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Populate form fields on query resolve
  useEffect(() => {
    if (profile || meData || user) {
      const rawDob = profile?.dateOfBirth ? new Date(profile.dateOfBirth) : null;
      const formattedDob =
        rawDob && !isNaN(rawDob.getTime())
          ? rawDob.toISOString().split("T")[0]
          : "";

      resetPersonal({
        firstName: profile?.firstName || (meData as any)?.firstName || user?.firstName || "",
        lastName: profile?.lastName || (meData as any)?.lastName || user?.lastName || "",
        gender: profile?.gender || "",
        dateOfBirth: formattedDob,
        stateOfOrigin: profile?.stateOfOrigin || "",
        lgaOfOrigin: profile?.lgaOfOrigin || "",
        highestEducation: profile?.highestEducation || "",
        employmentStatus: profile?.employmentStatus || "",
        identificationType: profile?.identificationType || "National Identity Number (NIN)",
        identificationNumber: profile?.identificationNumber || "",
      });

      resetContact({
        phone: profile?.phone || (meData as any)?.phone || user?.phone || "",
        alternatePhone: profile?.alternatePhone || "",
        address: profile?.address || "",
        stateOfResidence: profile?.stateOfResidence || "Lagos",
        lgaOfResidence: profile?.lgaOfResidence || "",
      });

      resetEmergency({
        emergencyName: profile?.emergencyContact?.name || "",
        emergencyRelationship: profile?.emergencyContact?.relationship || "",
        emergencyPhone: profile?.emergencyContact?.phone || "",
      });
    }
  }, [profile, meData, user, resetPersonal, resetContact, resetEmergency]);

  // Submit Handlers
  const onSavePersonal = async (data: PersonalFormData) => {
    try {
      await updateProfileMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        stateOfOrigin: data.stateOfOrigin,
        lgaOfOrigin: data.lgaOfOrigin,
        highestEducation: data.highestEducation,
        employmentStatus: data.employmentStatus,
        identificationType: data.identificationType,
        identificationNumber: data.identificationNumber,
      });
      toast.add({
        title: "Personal Details Saved",
        description: "Your demographic and personal information have been updated.",
        type: "success",
      });
      refetch();
    } catch (err: any) {
      toast.add({
        title: "Update Failed",
        description:
          err?.response?.data?.message || err?.message || "Failed to update personal details.",
        type: "error",
      });
    }
  };

  const onSaveContact = async (data: ContactFormData) => {
    try {
      await updateProfileMutation.mutateAsync({
        phone: data.phone,
        alternatePhone: data.alternatePhone,
        address: data.address,
        stateOfResidence: data.stateOfResidence,
        lgaOfResidence: data.lgaOfResidence,
      });
      toast.add({
        title: "Contact Details Saved",
        description: "Your residential address and active phone numbers have been updated.",
        type: "success",
      });
      refetch();
    } catch (err: any) {
      toast.add({
        title: "Update Failed",
        description:
          err?.response?.data?.message || err?.message || "Failed to update contact details.",
        type: "error",
      });
    }
  };

  const onSaveEmergency = async (data: EmergencyFormData) => {
    try {
      await updateProfileMutation.mutateAsync({
        emergencyContact: {
          name: data.emergencyName,
          relationship: data.emergencyRelationship,
          phone: data.emergencyPhone,
        },
      });
      toast.add({
        title: "Emergency Contact Saved",
        description: "Next of kin emergency contact details have been safely registered.",
        type: "success",
      });
      refetch();
    } catch (err: any) {
      toast.add({
        title: "Update Failed",
        description:
          err?.response?.data?.message || err?.message || "Failed to update emergency contact.",
        type: "error",
      });
    }
  };

  const onSavePassword = async (data: PasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.add({
        title: "Password Changed",
        description: "Your account password has been updated securely.",
        type: "success",
      });
      resetPassword();
    } catch (err: any) {
      toast.add({
        title: "Password Change Failed",
        description:
          err?.response?.data?.message || err?.message || "Failed to update password. Verify current password.",
        type: "error",
      });
    }
  };

  const firstName = profile?.firstName || user?.firstName || "Trainee";
  const lastName = profile?.lastName || user?.lastName || "";
  const beneficiaryCode = profile?.beneficiaryCode || "AEF-BEN-PENDING";

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
            Trainee Profile & Settings
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your digital trainee identity, personal records, and login security credentials.
          </p>
        </div>
      </div>

      {/* Hero Trainee Identity & Completion Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-emerald-950/40 via-card to-background p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Identity Snapshot */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-md shrink-0 ring-4 ring-background">
              {firstName?.[0]}
              {lastName?.[0]}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
                  {firstName} {lastName}
                </h2>
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold px-2 py-0.5"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Beneficiary
                </Badge>
              </div>

              {/* Beneficiary Code Pill with Copy */}
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/80 hover:bg-muted border border-border text-xs font-mono font-medium text-foreground transition-all cursor-pointer"
                  title="Click to copy your Beneficiary ID"
                >
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-semibold text-primary">{beneficiaryCode}</span>
                  {copiedCode ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                  )}
                </button>

                {profile?.biometricRegistered ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Biometrics Enrolled</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>Biometrics Pending</span>
                  </div>
                )}
              </div>

              {/* Quick Contacts */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{profile?.email || user?.email}</span>
                </div>
                {(profile?.phone || user?.phone) && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{profile?.phone || user?.phone}</span>
                  </div>
                )}
                {profile?.stateOfResidence && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>
                      {profile.stateOfResidence}
                      {profile.lgaOfResidence ? `, ${profile.lgaOfResidence}` : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Completion Card */}
          <div className="bg-card/80 backdrop-blur-xs p-4 rounded-xl border border-border max-w-sm w-full space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <FileBadge className="h-4 w-4 text-primary" />
                Profile Completion
              </span>
              <span
                className={`font-bold font-mono ${
                  profileCompletion.completionPercent === 100
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {profileCompletion.completionPercent}%
              </span>
            </div>

            <Progress
              value={profileCompletion.completionPercent}
              className="h-2"
            />

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {profileCompletion.isComplete ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 inline shrink-0" />
                  Profile complete. Eligible for all program admissions!
                </span>
              ) : (
                <>
                  <span className="font-medium text-amber-600 dark:text-amber-400">
                    Missing:{" "}
                  </span>
                  {profileCompletion.missingFields.slice(0, 2).join(", ")}
                  {profileCompletion.missingFields.length > 2 && "..."}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabbed Profile Editor */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-6"
      >
        <div className="overflow-x-auto pb-1 -mb-1">
          <TabsList className="bg-muted p-1 rounded-xl h-10 w-fit flex items-center border border-border">
            <TabsTrigger
              value="personal"
              className="gap-2 text-xs font-semibold px-3.5 py-1.5 cursor-pointer"
            >
              <UserIcon className="h-4 w-4 text-primary" />
              <span>Personal & Bio</span>
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="gap-2 text-xs font-semibold px-3.5 py-1.5 cursor-pointer"
            >
              <Phone className="h-4 w-4 text-primary" />
              <span>Contact & Address</span>
            </TabsTrigger>
            <TabsTrigger
              value="emergency"
              className="gap-2 text-xs font-semibold px-3.5 py-1.5 cursor-pointer"
            >
              <HeartHandshake className="h-4 w-4 text-primary" />
              <span>Next of Kin</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="gap-2 text-xs font-semibold px-3.5 py-1.5 cursor-pointer"
            >
              <Lock className="h-4 w-4 text-primary" />
              <span>Security & Password</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- TAB 1: Personal & Demographic Details --- */}
        <TabsContent value="personal" className="mt-0">
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                <UserIcon className="h-4 w-4" />
                <span>Demographic & Institutional Records</span>
              </div>
              <CardTitle className="text-lg font-heading font-bold text-foreground mt-1">
                Personal Information
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Official information used for accreditation, certificate issuance, and skill program records.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handlePersonalSubmit(onSavePersonal)} className="space-y-6">
                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...registerPersonal("firstName")}
                      placeholder="e.g. Samuel"
                      className="text-xs h-9"
                    />
                    {personalErrors.firstName && (
                      <p className="text-[11px] text-destructive font-medium">
                        {personalErrors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Last Name / Surname <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...registerPersonal("lastName")}
                      placeholder="e.g. Adeyemi"
                      className="text-xs h-9"
                    />
                    {personalErrors.lastName && (
                      <p className="text-[11px] text-destructive font-medium">
                        {personalErrors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Gender & DOB */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Gender <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      control={controlPersonal}
                      name="gender"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(val) => field.onChange(val || "")}
                        >
                          <SelectTrigger className="w-full text-xs h-9">
                            <SelectValue placeholder="Select gender..." />
                          </SelectTrigger>
                          <SelectContent className="text-xs">
                            {GENDER_OPTIONS.map((g) => (
                              <SelectItem key={g} value={g}>
                                {g}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {personalErrors.gender && (
                      <p className="text-[11px] text-destructive font-medium">
                        {personalErrors.gender.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Date of Birth <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="date"
                      {...registerPersonal("dateOfBirth")}
                      className="text-xs h-9"
                    />
                    {personalErrors.dateOfBirth && (
                      <p className="text-[11px] text-destructive font-medium">
                        {personalErrors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* State & LGA of Origin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      State of Origin <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...registerPersonal("stateOfOrigin")}
                      placeholder="e.g. Ogun State"
                      className="text-xs h-9"
                    />
                    {personalErrors.stateOfOrigin && (
                      <p className="text-[11px] text-destructive font-medium">
                        {personalErrors.stateOfOrigin.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      LGA of Origin <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...registerPersonal("lgaOfOrigin")}
                      placeholder="e.g. Abeokuta South"
                      className="text-xs h-9"
                    />
                    {personalErrors.lgaOfOrigin && (
                      <p className="text-[11px] text-destructive font-medium">
                        {personalErrors.lgaOfOrigin.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Education & Employment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Highest Education Qualification <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      control={controlPersonal}
                      name="highestEducation"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(val) => field.onChange(val || "")}
                        >
                          <SelectTrigger className="w-full text-xs h-9">
                            <SelectValue placeholder="Select qualification level..." />
                          </SelectTrigger>
                          <SelectContent className="text-xs">
                            {EDUCATION_OPTIONS.map((edu) => (
                              <SelectItem key={edu} value={edu}>
                                {edu}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {personalErrors.highestEducation && (
                      <p className="text-[11px] text-destructive font-medium">
                        {personalErrors.highestEducation.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Current Employment Status <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      control={controlPersonal}
                      name="employmentStatus"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(val) => field.onChange(val || "")}
                        >
                          <SelectTrigger className="w-full text-xs h-9">
                            <SelectValue placeholder="Select employment status..." />
                          </SelectTrigger>
                          <SelectContent className="text-xs">
                            {EMPLOYMENT_OPTIONS.map((emp) => (
                              <SelectItem key={emp} value={emp}>
                                {emp}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {personalErrors.employmentStatus && (
                      <p className="text-[11px] text-destructive font-medium">
                        {personalErrors.employmentStatus.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Identification Document */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>National Identification & Verification</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">
                        Document Type
                      </Label>
                      <Controller
                        control={controlPersonal}
                        name="identificationType"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(val) => field.onChange(val || "")}
                          >
                            <SelectTrigger className="w-full text-xs h-9">
                              <SelectValue placeholder="Select ID document..." />
                            </SelectTrigger>
                            <SelectContent className="text-xs">
                              {ID_TYPES.map((idType) => (
                                <SelectItem key={idType} value={idType}>
                                  {idType}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">
                        Identification / NIN Number
                      </Label>
                      <Input
                        {...registerPersonal("identificationNumber")}
                        placeholder="e.g. 12345678901"
                        className="text-xs h-9 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={updateProfileMutation.isPending}
                    className="text-xs font-semibold gap-1.5 bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Saving Personal Info...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        <span>Save Personal Information</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- TAB 2: Contact & Residential Details --- */}
        <TabsContent value="contact" className="mt-0">
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                <span>Contact & Living Residence</span>
              </div>
              <CardTitle className="text-lg font-heading font-bold text-foreground mt-1">
                Contact & Residential Details
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Your reachable phone number and home address are used for training centre assignment and class dispatch.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleContactSubmit(onSaveContact)} className="space-y-5">
                {/* Phones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Primary Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...registerContact("phone")}
                      placeholder="e.g. 08012345678"
                      className="text-xs h-9 font-mono"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Receives attendance reminders and official Foundation SMS alerts.
                    </p>
                    {contactErrors.phone && (
                      <p className="text-[11px] text-destructive font-medium">
                        {contactErrors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Alternate / WhatsApp Phone Number
                    </Label>
                    <Input
                      {...registerContact("alternatePhone")}
                      placeholder="e.g. 08087654321"
                      className="text-xs h-9 font-mono"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Optional secondary contact for emergency notifications.
                    </p>
                  </div>
                </div>

                {/* Street Address */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Residential Street Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    {...registerContact("address")}
                    placeholder="e.g. 15 Adele Close, off Commercial Avenue, Ikeja"
                    className="text-xs h-9"
                  />
                  {contactErrors.address && (
                    <p className="text-[11px] text-destructive font-medium">
                      {contactErrors.address.message}
                    </p>
                  )}
                </div>

                {/* State & LGA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      State of Residence <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...registerContact("stateOfResidence")}
                      placeholder="e.g. Lagos"
                      className="text-xs h-9"
                    />
                    {contactErrors.stateOfResidence && (
                      <p className="text-[11px] text-destructive font-medium">
                        {contactErrors.stateOfResidence.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      LGA of Residence <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...registerContact("lgaOfResidence")}
                      placeholder="e.g. Ikeja"
                      className="text-xs h-9"
                    />
                    {contactErrors.lgaOfResidence && (
                      <p className="text-[11px] text-destructive font-medium">
                        {contactErrors.lgaOfResidence.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={updateProfileMutation.isPending}
                    className="text-xs font-semibold gap-1.5 bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Saving Contacts...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        <span>Save Contact Details</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- TAB 3: Emergency Contact & Next of Kin --- */}
        <TabsContent value="emergency" className="mt-0">
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                <HeartHandshake className="h-4 w-4" />
                <span>Next of Kin & Safety Protocol</span>
              </div>
              <CardTitle className="text-lg font-heading font-bold text-foreground mt-1">
                Emergency Contact Person
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                In compliance with workshop safety regulations, provide a reliable contact to notify in case of an emergency during training sessions.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleEmergencySubmit(onSaveEmergency)} className="space-y-5">
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-primary flex items-start gap-2.5">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    This person will only be contacted in urgent safety situations or medical emergencies while you are on campus at an Adele Foundation training centre.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Contact Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...registerEmergency("emergencyName")}
                      placeholder="e.g. Mrs. Grace Adeyemi"
                      className="text-xs h-9"
                    />
                    {emergencyErrors.emergencyName && (
                      <p className="text-[11px] text-destructive font-medium">
                        {emergencyErrors.emergencyName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Relationship <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...registerEmergency("emergencyRelationship")}
                      placeholder="e.g. Mother, Brother, Spouse"
                      className="text-xs h-9"
                    />
                    {emergencyErrors.emergencyRelationship && (
                      <p className="text-[11px] text-destructive font-medium">
                        {emergencyErrors.emergencyRelationship.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Emergency Phone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      {...registerEmergency("emergencyPhone")}
                      placeholder="e.g. 08098765432"
                      className="text-xs h-9 font-mono"
                    />
                    {emergencyErrors.emergencyPhone && (
                      <p className="text-[11px] text-destructive font-medium">
                        {emergencyErrors.emergencyPhone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={updateProfileMutation.isPending}
                    className="text-xs font-semibold gap-1.5 bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Saving Emergency Contact...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        <span>Save Emergency Contact</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- TAB 4: Security & Password --- */}
        <TabsContent value="security" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border border-border shadow-xs">
              <CardHeader className="pb-4 border-b border-border">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                  <KeyRound className="h-4 w-4" />
                  <span>Credential Management</span>
                </div>
                <CardTitle className="text-lg font-heading font-bold text-foreground mt-1">
                  Change Account Password
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Update your password regularly to protect your trainee wallet, assessment records, and certificates.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handlePasswordSubmit(onSavePassword)} className="space-y-4 max-w-lg">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Current Password <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        {...registerPassword("currentPassword")}
                        placeholder="Enter your current password"
                        className="text-xs h-9 pr-9 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-[11px] text-destructive font-medium">
                        {passwordErrors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      New Password <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        {...registerPassword("newPassword")}
                        placeholder="At least 8 characters"
                        className="text-xs h-9 pr-9 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-[11px] text-destructive font-medium">
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Confirm New Password <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        {...registerPassword("confirmPassword")}
                        placeholder="Re-type new password"
                        className="text-xs h-9 pr-9 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-[11px] text-destructive font-medium">
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={changePasswordMutation.isPending}
                      className="text-xs font-semibold gap-1.5 bg-primary hover:bg-primary/90 cursor-pointer"
                    >
                      {changePasswordMutation.isPending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5" />
                          <span>Update Password</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Security Snapshot Card */}
            <Card className="border border-border shadow-xs h-fit space-y-4 p-5">
              <div className="flex items-center gap-2 text-xs font-bold font-heading text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Account Security Posture</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                    Account Status
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                    Active Trainee Account
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                    Biometric Identity
                  </span>
                  {profile?.biometricRegistered ? (
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Fingerprint className="h-3.5 w-3.5 text-emerald-500" />
                      Enrolled & Verified {profile?.biometricIdentifier ? `(${profile.biometricIdentifier})` : ""}
                    </span>
                  ) : (
                    <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Fingerprint className="h-3.5 w-3.5 text-amber-500" />
                      Pending Scan at Training Centre
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                    Account Registered
                  </span>
                  <span className="font-medium text-foreground">
                    {user?.createdAt
                      ? formatDate(user.createdAt)
                      : (profile as any)?.createdAt
                      ? formatDate((profile as any).createdAt)
                      : "Active Trainee 2026"}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PortalProfileView;