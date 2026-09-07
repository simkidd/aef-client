'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldSet,
} from '@/components/ui/field';
import { Loader2 } from 'lucide-react';
import { useUpdateOrgInfoMutation } from '@/hooks/mutations/useOrgMutations';
import { Organization } from '@/interfaces';

export const editOrgInfoSchema = z.object({
  name: z.string().min(3, 'Organization name must be at least 3 characters'),
  code: z
    .string()
    .min(2, 'Code must be at least 2 characters')
    .max(10, 'Code cannot exceed 10 characters')
    .transform((val) => val.toUpperCase()),
  tagline: z.string().optional(),
  description: z.string().optional(),
  email: z.string().email('Please enter a valid official email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Physical address is required'),
  state: z.string().min(2, 'State is required'),
  lga: z.string().min(2, 'LGA / District is required'),
  website: z.string().optional(),
});

export type EditOrgInfoFormData = z.infer<typeof editOrgInfoSchema>;

interface EditOrgInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgInfo?: Organization;
}

export function EditOrgInfoModal({
  isOpen,
  onClose,
  orgInfo,
}: EditOrgInfoModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditOrgInfoFormData>({
    resolver: zodResolver(editOrgInfoSchema) as any,
    defaultValues: {
      name: '',
      code: '',
      tagline: '',
      description: '',
      email: '',
      phone: '',
      address: '',
      state: '',
      lga: '',
      website: '',
    },
  });

  const updateMutation = useUpdateOrgInfoMutation({
    onSuccess: () => {
      onClose();
    },
  });

  useEffect(() => {
    if (orgInfo && isOpen) {
      reset({
        name: orgInfo.name || '',
        code: orgInfo.code || '',
        tagline: orgInfo.tagline || '',
        description: orgInfo.description || '',
        email: orgInfo.email || '',
        phone: orgInfo.phone || '',
        address: orgInfo.address || '',
        state: orgInfo.state || '',
        lga: orgInfo.lga || '',
        website: orgInfo.website || '',
      });
    }
  }, [orgInfo, isOpen, reset]);

  const onSubmit = (data: EditOrgInfoFormData) => {
    updateMutation.mutate({
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      tagline: data.tagline?.trim() || undefined,
      description: data.description?.trim() || undefined,
      email: data.email.trim(),
      phone: data.phone.trim(),
      address: data.address.trim(),
      state: data.state.trim(),
      lga: data.lga.trim(),
      website: data.website?.trim() || undefined,
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      disablePointerDismissal
      onOpenChange={(open, eventDetails) => {
        if (!open && eventDetails?.reason !== 'outside-press') {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-xl flex flex-col gap-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-bold font-heading">
            Organization Profile Settings
          </DialogTitle>
          <DialogDescription>
            Update core organization identity, contact credentials, and headquarters address.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-0 flex-1 flex flex-col pt-1"
        >
          <ScrollArea className="h-[380px] sm:h-[420px] py-2">
            <FieldSet className="px-4 py-2">
              <FieldGroup className="gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field data-invalid={!!errors.name} className="sm:col-span-2">
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Organization Legal Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...register('name')}
                      placeholder="e.g. Adele Empowerment Foundation"
                      className="h-9 text-xs"
                    />
                    {errors.name && <FieldError>{errors.name.message}</FieldError>}
                  </Field>

                  <Field data-invalid={!!errors.code}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Org Code / Acronym <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...register('code')}
                      placeholder="e.g. AEF"
                      className="h-9 text-xs font-mono uppercase"
                    />
                    {errors.code && <FieldError>{errors.code.message}</FieldError>}
                  </Field>

                  <Field data-invalid={!!errors.tagline}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Motto / Tagline
                    </FieldLabel>
                    <Input
                      {...register('tagline')}
                      placeholder="e.g. Building Skills, Empowering Lives"
                      className="h-9 text-xs"
                    />
                    {errors.tagline && <FieldError>{errors.tagline.message}</FieldError>}
                  </Field>

                  <Field data-invalid={!!errors.email}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Official Contact Email <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      type="email"
                      {...register('email')}
                      placeholder="info@adelefoundation.org"
                      className="h-9 text-xs"
                    />
                    {errors.email && <FieldError>{errors.email.message}</FieldError>}
                  </Field>

                  <Field data-invalid={!!errors.phone}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Contact Phone <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...register('phone')}
                      placeholder="+234 800 ADELE FDN"
                      className="h-9 text-xs font-mono"
                    />
                    {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
                  </Field>

                  <Field data-invalid={!!errors.address} className="sm:col-span-2">
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Headquarters Address <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...register('address')}
                      placeholder="Plot 104, Adele Empowerment Crescent, CBD"
                      className="h-9 text-xs"
                    />
                    {errors.address && <FieldError>{errors.address.message}</FieldError>}
                  </Field>

                  <Field data-invalid={!!errors.state}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      State <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...register('state')}
                      placeholder="e.g. Lagos"
                      className="h-9 text-xs"
                    />
                    {errors.state && <FieldError>{errors.state.message}</FieldError>}
                  </Field>

                  <Field data-invalid={!!errors.lga}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      LGA / District <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...register('lga')}
                      placeholder="e.g. Ikeja"
                      className="h-9 text-xs"
                    />
                    {errors.lga && <FieldError>{errors.lga.message}</FieldError>}
                  </Field>

                  <Field data-invalid={!!errors.website} className="sm:col-span-2">
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Website URL
                    </FieldLabel>
                    <Input
                      {...register('website')}
                      placeholder="https://adelefoundation.org"
                      className="h-9 text-xs"
                    />
                    {errors.website && <FieldError>{errors.website.message}</FieldError>}
                  </Field>

                  <Field data-invalid={!!errors.description} className="sm:col-span-2">
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Organization Mission & Mandate
                    </FieldLabel>
                    <Textarea
                      {...register('description')}
                      placeholder="Official mandate, mission, and scope of operations..."
                      rows={3}
                      className="text-xs resize-none"
                    />
                    {errors.description && <FieldError>{errors.description.message}</FieldError>}
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>
          </ScrollArea>

          <DialogFooter className="gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="gap-2 font-semibold"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                'Save Profile'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
