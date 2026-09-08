"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  BookOpen,
  Building2,
  Clock,
  Award,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Check,
  MapPin,
  AlertCircle,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import {
  usePublishedProgramQuery,
  useCentresQuery,
  useSubmitApplicationMutation,
  useMyApplicationsQuery,
} from "@/hooks";

const applySchema = z.object({
  preferredSkillAreaId: z.string().min(1, "Please select a skill track"),
  preferredCentreId: z.string().min(1, "Please select a training centre"),
  statementOfPurpose: z.string().optional(),
  previousExperience: z.string().optional(),
});

type ApplyFormData = z.infer<typeof applySchema>;

export function PortalProgramDetailView({ programId }: { programId: string }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  const { data, isLoading, error } = usePublishedProgramQuery(programId);
  const { data: centres } = useCentresQuery();
  const { data: myApplications } = useMyApplicationsQuery();

  const program = data?.program;
  const cohorts = data?.cohorts || [];

  const submitMutation = useSubmitApplicationMutation({
    onSuccess: () => setApplySuccess(true),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      preferredSkillAreaId: "",
      preferredCentreId: "",
      statementOfPurpose: "",
      previousExperience: "",
    },
  });

  // Check if user has applied for this program
  const userApplication = useMemo(() => {
    if (!myApplications || !Array.isArray(myApplications)) return null;
    return myApplications.find((app: any) => {
      const pId =
        typeof app.programId === "object" ? app.programId?._id : app.programId;
      return pId === programId;
    });
  }, [myApplications, programId]);

  const handleOpenApply = () => {
    if (!program) return;
    setApplySuccess(false);
    reset({
      preferredSkillAreaId: program.skillAreaIds?.[0]?._id ?? "",
      preferredCentreId: (centres as any[])?.[0]?._id ?? "",
      statementOfPurpose: "",
      previousExperience: "",
    });
    setIsModalOpen(true);
  };

  const onSubmit = (formData: ApplyFormData) => {
    if (!program) return;
    submitMutation.mutate({
      programId: program._id,
      ...formData,
    } as any);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-2">
        <Skeleton className="h-6 w-32 rounded-md" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-3/4 rounded-lg" />
          <Skeleton className="h-5 w-1/2 rounded-md" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Program Not Found
        </h2>
        <p className="text-xs text-slate-500">
          This program may no longer be published or active.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/portal/programs")}
          className="text-xs"
        >
          &larr; Back to Programs
        </Button>
      </div>
    );
  }

  const isDeadlinePassed =
    program.applicationDeadline &&
    new Date(program.applicationDeadline) < new Date();

  return (
    <div className="space-y-6 pb-12">
      {/* Back Link */}
      <Link
        href="/portal/programs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to all programs
      </Link>

      {/* Program Hero Header */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary dark:bg-primary/15">
              <Sparkles className="h-3.5 w-3.5" />
              {program.organizerName || "Adele Empowerment Foundation"}
            </span>
            {program.status && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                Active & Open
              </span>
            )}
          </div>

          {program.applicationDeadline && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-medium">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>
                Application Deadline:{" "}
                <strong>{formatDate(program.applicationDeadline)}</strong>
              </span>
            </div>
          )}
        </div>

        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-heading">
          {program.title}
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {program.description}
        </p>
      </div>

      {/* Two Column Layout: Main Details + Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skill Tracks, Eligibility, Centres */}
        <div className="lg:col-span-2 space-y-6">
          {/* Available Skill Tracks */}
          <Card className="border-slate-200/80 dark:border-slate-800 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <BookOpen className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-bold">
                  Available Skill Tracks
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Specialized vocational and digital tracks offered under this
                program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {program.skillAreaIds && program.skillAreaIds.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {program.skillAreaIds.map((skill: any) => (
                    <div
                      key={skill._id || skill}
                      className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {skill.name || skill}
                        </h4>
                        {skill.category && (
                          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 shrink-0">
                            {skill.category}
                          </span>
                        )}
                      </div>
                      {skill.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {skill.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 font-medium">
                        {skill.defaultDurationWeeks && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {skill.defaultDurationWeeks} Weeks
                          </span>
                        )}
                        {skill.certificationType && (
                          <span className="flex items-center gap-1">
                            <Award className="h-3 w-3 text-slate-400" />
                            {skill.certificationType}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  General Empowerment Track
                </p>
              )}
            </CardContent>
          </Card>

          {/* Eligibility Criteria */}
          {program.eligibilityCriteria &&
            program.eligibilityCriteria.length > 0 && (
              <Card className="border-slate-200/80 dark:border-slate-800 shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base font-bold">
                      Eligibility & Requirements
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {program.eligibilityCriteria.map(
                      (criterion: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{criterion}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}

          {/* Available Training Centers / Locations */}
          {cohorts.length > 0 && (
            <Card className="border-slate-200/80 dark:border-slate-800 shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Building2 className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base font-bold">
                    Participating Centres
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Physical training and practical lab locations for this program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cohorts.map((cohort: any) => {
                    const centre = cohort.centreId;
                    if (!centre) return null;
                    return (
                      <div
                        key={cohort._id}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-start gap-2.5"
                      >
                        <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {centre.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {centre.lga ? `${centre.lga}, ` : ""}
                            {centre.state}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Enrollment Action Card */}
        <div className="space-y-4">
          <Card className="border-slate-200/80 dark:border-slate-800 shadow-xs sticky top-20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Enrollment Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Initiative</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {program.organizerName || "Adele Foundation"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Application Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Open for Admission
                </span>
              </div>
              {program.applicationDeadline && (
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Closing Date</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatDate(program.applicationDeadline)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Tuition / Cost</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  100% Sponsored / Free
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                {userApplication ? (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <p>Application Submitted</p>
                        <p className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400">
                          Status: {userApplication.status}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/portal/applications")}
                      className="w-full text-xs font-semibold"
                    >
                      View in My Applications
                    </Button>
                  </div>
                ) : isDeadlinePassed ? (
                  <Button
                    disabled
                    variant="outline"
                    className="w-full text-xs font-semibold text-slate-400"
                  >
                    Applications Closed
                  </Button>
                ) : (
                  <Button
                    onClick={handleOpenApply}
                    className="w-full text-xs font-semibold gap-1.5 shadow-sm"
                  >
                    Apply for this Program
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Apply Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Program Application
            </DialogTitle>
            <DialogDescription className="text-xs">
              Apply for <strong>{program.title}</strong>
            </DialogDescription>
          </DialogHeader>

          {applySuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Application Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your application has been received and is currently under review
                by our admissions team.
              </p>
              <div className="pt-3 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    router.push("/portal/applications");
                  }}
                  className="text-xs font-semibold"
                >
                  View My Applications
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 py-2 text-xs"
            >
              <FieldGroup>
                {/* Preferred Skill Track */}
                <Field>
                  <FieldLabel
                    htmlFor="preferredSkillAreaId"
                    className="text-xs font-semibold"
                  >
                    Preferred Skill Track *
                  </FieldLabel>
                  <Controller
                    name="preferredSkillAreaId"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        id="preferredSkillAreaId"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      >
                        <option value="">Select a track…</option>
                        {program.skillAreaIds?.map((skill: any) => (
                          <option
                            key={skill._id || skill}
                            value={skill._id || skill}
                          >
                            {skill.name || skill}{" "}
                            {skill.category ? `(${skill.category})` : ""}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <FieldDescription className="text-[11px]">
                    Choose the specific vocational track you want to train in
                  </FieldDescription>
                  {errors.preferredSkillAreaId && (
                    <FieldError className="text-xs">
                      {errors.preferredSkillAreaId.message}
                    </FieldError>
                  )}
                </Field>

                {/* Preferred Training Centre */}
                <Field>
                  <FieldLabel
                    htmlFor="preferredCentreId"
                    className="text-xs font-semibold"
                  >
                    Preferred Training Centre *
                  </FieldLabel>
                  <Controller
                    name="preferredCentreId"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        id="preferredCentreId"
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      >
                        <option value="">Select a centre…</option>
                        {(centres as any[])?.map((c: any) => (
                          <option key={c._id} value={c._id}>
                            {c.name} ({c.state})
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <FieldDescription className="text-[11px]">
                    Location for physical practical workshops
                  </FieldDescription>
                  {errors.preferredCentreId && (
                    <FieldError className="text-xs">
                      {errors.preferredCentreId.message}
                    </FieldError>
                  )}
                </Field>

                {/* Statement of Purpose */}
                <Field>
                  <FieldLabel
                    htmlFor="statementOfPurpose"
                    className="text-xs font-semibold"
                  >
                    Statement of Purpose{" "}
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </FieldLabel>
                  <Textarea
                    id="statementOfPurpose"
                    rows={3}
                    placeholder="Briefly explain your motivation for joining this program..."
                    {...register("statementOfPurpose")}
                    className="text-xs"
                  />
                </Field>

                {/* Previous Experience */}
                <Field>
                  <FieldLabel
                    htmlFor="previousExperience"
                    className="text-xs font-semibold"
                  >
                    Previous Experience{" "}
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </FieldLabel>
                  <Textarea
                    id="previousExperience"
                    rows={2}
                    placeholder="Any relevant background or skills in this field..."
                    {...register("previousExperience")}
                    className="text-xs"
                  />
                </Field>
              </FieldGroup>

              <DialogFooter className="gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="text-xs font-semibold"
                >
                  {submitMutation.isPending
                    ? "Submitting Application…"
                    : "Submit Application"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
