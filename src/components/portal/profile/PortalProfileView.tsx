"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/auth.store";
import { formatDate } from "@/lib/utils";
import { BeneficiaryProfile } from "@/interfaces";
import {
  useCurrentUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "@/hooks";

// Contact Edit Schema
const contactSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  alternatePhone: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  stateOfResidence: z.string().min(2, "State of residence is required"),
  lgaOfResidence: z.string().min(2, "LGA of residence is required"),
  emergencyName: z.string().min(2, "Emergency contact name is required"),
  emergencyRelationship: z.string().min(2, "Relationship is required"),
  emergencyPhone: z.string().min(10, "Emergency phone must be at least 10 digits"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Password Change Schema
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

export function PortalProfileView() {
  const { user } = useAuthStore();
  const { data: meData, isLoading } = useCurrentUserQuery();
  const profile = (meData as any)?.beneficiaryProfile as BeneficiaryProfile | undefined;

  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();

  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile Form
  const {
    register: registerContact,
    handleSubmit: handleContactSubmit,
    reset: resetContact,
    formState: { errors: contactErrors, isDirty: isContactDirty },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  // Pre-fill form when profile data loads
  useEffect(() => {
    if (profile || meData) {
      resetContact({
        phone: profile?.phone || (meData as any)?.phone || "",
        alternatePhone: profile?.alternatePhone || "",
        address: profile?.address || "",
        stateOfResidence: profile?.stateOfResidence || "Lagos",
        lgaOfResidence: profile?.lgaOfResidence || "",
        emergencyName: profile?.emergencyContact?.name || "",
        emergencyRelationship: profile?.emergencyContact?.relationship || "",
        emergencyPhone: profile?.emergencyContact?.phone || "",
      });
    }
  }, [profile, meData, resetContact]);

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSaveContact = async (data: ContactFormData) => {
    setProfileSuccessMsg(null);
    setProfileErrorMsg(null);

    try {
      await updateProfileMutation.mutateAsync({
        phone: data.phone,
        alternatePhone: data.alternatePhone,
        address: data.address,
        stateOfResidence: data.stateOfResidence,
        lgaOfResidence: data.lgaOfResidence,
        emergencyContact: {
          name: data.emergencyName,
          relationship: data.emergencyRelationship,
          phone: data.emergencyPhone,
        },
      });
      setProfileSuccessMsg("Contact details updated successfully!");
      setTimeout(() => setProfileSuccessMsg(null), 5000);
    } catch (err: any) {
      setProfileErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to update profile details"
      );
    }
  };

  const onSavePassword = async (data: PasswordFormData) => {
    setPasswordSuccessMsg(null);
    setPasswordErrorMsg(null);

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPasswordSuccessMsg("Password changed successfully!");
      resetPassword();
      setTimeout(() => setPasswordSuccessMsg(null), 5000);
    } catch (err: any) {
      setPasswordErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to change password"
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          My Profile & Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your institutional record, update your residential contact details, and secure your account.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Identity Overview Sidebar Card */}
        <Card className="p-6 space-y-5 flex flex-col items-center text-center h-fit">
          <div className="h-24 w-24 rounded-full bg-linear-to-tr from-emerald-700 to-emerald-500 text-white flex items-center justify-center font-bold text-3xl shadow-md">
            {profile?.firstName?.[0] || user?.firstName?.[0] || "B"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {profile?.firstName || user?.firstName}{" "}
              {profile?.lastName || user?.lastName}
            </h2>
            {profile?.beneficiaryCode && (
              <span className="font-mono text-xs text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20 mt-1 inline-block dark:bg-primary/15">
                {profile.beneficiaryCode}
              </span>
            )}
          </div>

          <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">{profile?.email || user?.email}</span>
            </div>
            {profile?.phone && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile?.stateOfResidence && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{profile.stateOfResidence}, Nigeria</span>
              </div>
            )}
          </div>

          <div className="w-full rounded-xl bg-primary/10 border border-primary/20 p-3 text-primary text-xs flex items-center gap-2 dark:bg-primary/15 dark:border-primary/20">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>Biometric Identity Verified</span>
          </div>
        </Card>

        {/* Tabbed Profile Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="record" className="w-full space-y-4">
            <TabsList className="grid grid-cols-3 w-full bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              <TabsTrigger value="record" className="text-xs font-semibold gap-1.5 py-2">
                <FileBadge className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Institutional</span> Record
              </TabsTrigger>
              <TabsTrigger value="edit" className="text-xs font-semibold gap-1.5 py-2">
                <Edit3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Edit</span> Contact
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs font-semibold gap-1.5 py-2">
                <Lock className="h-3.5 w-3.5" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Institutional Record */}
            <TabsContent value="record" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Institutional & Demographic Record</CardTitle>
                  <CardDescription className="text-xs">
                    Verified records linked with training centres and National Board for Technical Education accreditations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Gender", value: profile?.gender },
                      { label: "Date of Birth", value: formatDate(profile?.dateOfBirth) },
                      { label: "Highest Education", value: profile?.highestEducation },
                      {
                        label: "State / LGA of Origin",
                        value:
                          profile?.stateOfOrigin && profile?.lgaOfOrigin
                            ? `${profile.stateOfOrigin} / ${profile.lgaOfOrigin}`
                            : profile?.stateOfOrigin,
                      },
                      { label: "Employment Status", value: profile?.employmentStatus },
                      { label: "ID Document", value: profile?.identificationType || "NIN" },
                      { label: "ID Number", value: profile?.identificationNumber ? `••••${profile.identificationNumber.slice(-4)}` : "Verified" },
                    ].map(({ label, value }) =>
                      value ? (
                        <div key={label}>
                          <span className="text-slate-400 block uppercase font-semibold text-[10px]">
                            {label}
                          </span>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{value}</p>
                        </div>
                      ) : null
                    )}
                  </div>

                  {/* Emergency Contact Summary */}
                  {profile?.emergencyContact && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Emergency Contact Person
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-600 dark:text-slate-400">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Name</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-200">
                            {profile.emergencyContact.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Relationship</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-200">
                            {profile.emergencyContact.relationship}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Phone</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-200">
                            {profile.emergencyContact.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Edit Contact & Address */}
            <TabsContent value="edit" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Update Contact & Residence Details</CardTitle>
                  <CardDescription className="text-xs">
                    Keep your active phone number, address, and emergency contact up to date for official SMS alerts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit(onSaveContact)} className="space-y-4">
                    {profileSuccessMsg && (
                      <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{profileSuccessMsg}</span>
                      </div>
                    )}
                    {profileErrorMsg && (
                      <div className="p-3 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{profileErrorMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Primary Phone Number</Label>
                        <Input
                          {...registerContact("phone")}
                          placeholder="08012345678"
                          className="text-xs h-9"
                        />
                        {contactErrors.phone && (
                          <p className="text-[11px] text-rose-500">{contactErrors.phone.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">Alternate Phone Number (Optional)</Label>
                        <Input
                          {...registerContact("alternatePhone")}
                          placeholder="08087654321"
                          className="text-xs h-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Residential Address</Label>
                      <Input
                        {...registerContact("address")}
                        placeholder="12 Adele Street, Lekki Phase 1"
                        className="text-xs h-9"
                      />
                      {contactErrors.address && (
                        <p className="text-[11px] text-rose-500">{contactErrors.address.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs">State of Residence</Label>
                        <Input
                          {...registerContact("stateOfResidence")}
                          placeholder="e.g. Lagos"
                          className="text-xs h-9"
                        />
                        {contactErrors.stateOfResidence && (
                          <p className="text-[11px] text-rose-500">
                            {contactErrors.stateOfResidence.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">LGA of Residence</Label>
                        <Input
                          {...registerContact("lgaOfResidence")}
                          placeholder="e.g. Eti-Osa"
                          className="text-xs h-9"
                        />
                        {contactErrors.lgaOfResidence && (
                          <p className="text-[11px] text-rose-500">
                            {contactErrors.lgaOfResidence.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Emergency Contact Fields */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Emergency Contact Person
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-[11px]">Full Name</Label>
                          <Input
                            {...registerContact("emergencyName")}
                            placeholder="Next of Kin Name"
                            className="text-xs h-9"
                          />
                          {contactErrors.emergencyName && (
                            <p className="text-[11px] text-rose-500">
                              {contactErrors.emergencyName.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[11px]">Relationship</Label>
                          <Input
                            {...registerContact("emergencyRelationship")}
                            placeholder="e.g. Parent, Sibling"
                            className="text-xs h-9"
                          />
                          {contactErrors.emergencyRelationship && (
                            <p className="text-[11px] text-rose-500">
                              {contactErrors.emergencyRelationship.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[11px]">Emergency Phone</Label>
                          <Input
                            {...registerContact("emergencyPhone")}
                            placeholder="080XXXXXXXX"
                            className="text-xs h-9"
                          />
                          {contactErrors.emergencyPhone && (
                            <p className="text-[11px] text-rose-500">
                              {contactErrors.emergencyPhone.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        type="submit"
                        size="sm"
                        disabled={updateProfileMutation.isPending}
                        className="text-xs font-semibold gap-1.5"
                      >
                        {updateProfileMutation.isPending ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Saving Changes...</span>
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

            {/* Tab 3: Security & Password */}
            <TabsContent value="security" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Account Security & Password</CardTitle>
                  <CardDescription className="text-xs">
                    Change your password to keep your trainee credentials and certificate wallet secure.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit(onSavePassword)} className="space-y-4 max-w-md">
                    {passwordSuccessMsg && (
                      <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{passwordSuccessMsg}</span>
                      </div>
                    )}
                    {passwordErrorMsg && (
                      <div className="p-3 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{passwordErrorMsg}</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label className="text-xs">Current Password</Label>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          {...registerPassword("currentPassword")}
                          placeholder="••••••••"
                          className="text-xs h-9 pr-9"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword((prev) => !prev)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="text-[11px] text-rose-500">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">New Password</Label>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          {...registerPassword("newPassword")}
                          placeholder="At least 8 characters"
                          className="text-xs h-9 pr-9"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-[11px] text-rose-500">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          {...registerPassword("confirmPassword")}
                          placeholder="Repeat new password"
                          className="text-xs h-9 pr-9"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="text-[11px] text-rose-500">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        size="sm"
                        disabled={changePasswordMutation.isPending}
                        className="text-xs font-semibold gap-1.5"
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
