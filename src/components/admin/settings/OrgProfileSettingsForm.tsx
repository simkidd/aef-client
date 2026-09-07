"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Building2,
  Save,
  Loader2,
  MapPin,
  Mail,
  Phone,
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
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import { useOrgInfoQuery } from "@/hooks/queries/useOrgQueries";
import { useUpdateOrgInfoMutation } from "@/hooks/mutations/useOrgMutations";

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

export function OrgProfileSettingsForm() {
  const { data: orgInfo, isLoading: isOrgLoading } = useOrgInfoQuery();
  const updateOrgMutation = useUpdateOrgInfoMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
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
      reset({
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
  }, [orgInfo, reset]);

  const onSubmit = (data: OrgInfoFormValues) => {
    updateOrgMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="overflow-hidden py-0 gap-0 border-border bg-card shadow-2xs">
        <CardHeader className="p-4 sm:p-5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold font-heading text-foreground">
              Foundation Master Profile
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Official identity, registration acronym, communication channels, and headquarters location.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <FieldSet className="space-y-5 text-xs">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field className="md:col-span-2">
                <FieldLabel className="text-xs font-semibold">
                  Foundation Full Legal Name *
                </FieldLabel>
                <Input
                  {...register("name")}
                  placeholder="Adele Empowerment Foundation"
                  className="text-xs h-9 min-h-9"
                  disabled={isOrgLoading}
                />
                {errors.name && (
                  <FieldError className="text-xs">{errors.name.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel className="text-xs font-semibold">
                  Acronym / Code *
                </FieldLabel>
                <Input
                  {...register("code")}
                  placeholder="AEF"
                  className="text-xs h-9 min-h-9 font-mono uppercase"
                  disabled={isOrgLoading}
                />
                {errors.code && (
                  <FieldError className="text-xs">{errors.code.message}</FieldError>
                )}
              </Field>
            </FieldGroup>

            <Field>
              <FieldLabel className="text-xs font-semibold">
                Organization Tagline / Motto
              </FieldLabel>
              <Input
                {...register("tagline")}
                placeholder="Building Skills, Empowering Lives"
                className="text-xs h-9 min-h-9"
                disabled={isOrgLoading}
              />
              {errors.tagline && (
                <FieldError className="text-xs">{errors.tagline.message}</FieldError>
              )}
            </Field>

            <div className="pt-3 border-t border-border">
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
                    {...register("email")}
                    placeholder="info@adelefoundation.org"
                    className="text-xs h-9 min-h-9"
                    disabled={isOrgLoading}
                  />
                  {errors.email && (
                    <FieldError className="text-xs">{errors.email.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel className="text-xs font-semibold flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    Primary Contact Phone *
                  </FieldLabel>
                  <Input
                    {...register("phone")}
                    placeholder="+234 800 ADELE FDN"
                    className="text-xs h-9 min-h-9 font-mono"
                    disabled={isOrgLoading}
                  />
                  {errors.phone && (
                    <FieldError className="text-xs">{errors.phone.message}</FieldError>
                  )}
                </Field>
              </FieldGroup>
            </div>

            <div className="pt-3 border-t border-border">
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
                    {...register("address")}
                    placeholder="Plot 104, Adele Empowerment Crescent, Central Business District"
                    className="text-xs h-9 min-h-9"
                    disabled={isOrgLoading}
                  />
                  {errors.address && (
                    <FieldError className="text-xs">{errors.address.message}</FieldError>
                  )}
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Field>
                    <FieldLabel className="text-xs font-semibold">State *</FieldLabel>
                    <Input
                      {...register("state")}
                      placeholder="Lagos"
                      className="text-xs h-9 min-h-9"
                      disabled={isOrgLoading}
                    />
                    {errors.state && (
                      <FieldError className="text-xs">{errors.state.message}</FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel className="text-xs font-semibold">L.G.A. *</FieldLabel>
                    <Input
                      {...register("lga")}
                      placeholder="Ikeja"
                      className="text-xs h-9 min-h-9"
                      disabled={isOrgLoading}
                    />
                    {errors.lga && (
                      <FieldError className="text-xs">{errors.lga.message}</FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel className="text-xs font-semibold">Country *</FieldLabel>
                    <Input
                      {...register("country")}
                      placeholder="Nigeria"
                      className="text-xs h-9 min-h-9"
                      disabled={isOrgLoading}
                    />
                    {errors.country && (
                      <FieldError className="text-xs">{errors.country.message}</FieldError>
                    )}
                  </Field>
                </div>
              </FieldGroup>
            </div>
          </FieldSet>
        </CardContent>

        <CardFooter className="bg-muted/20 border-t border-border flex justify-end gap-3 p-4">
          <Button
            type="submit"
            disabled={updateOrgMutation.isPending || isOrgLoading}
            className="gap-2 text-xs font-semibold h-9 min-h-9 shadow-2xs"
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
  );
}
