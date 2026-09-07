'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldSet,
} from '@/components/ui/field';

export const addPartnerSchema = z.object({
  name: z.string().min(2, 'Partner organization name must be at least 2 characters'),
  type: z.enum(['Corporate', 'NGO / Foundation', 'Government Agency', 'Academic Partner']),
  tier: z.enum(['Strategic', 'Grantor', 'Equipment Donor', 'Hiring Partner']),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Please enter a valid official email address'),
  phone: z.string().min(7, 'Please enter a valid contact phone number'),
  contribution: z.string().min(3, 'Please describe partnership contribution / mandate'),
  website: z.string().optional(),
});

export type AddPartnerFormData = z.infer<typeof addPartnerSchema>;

interface AddPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPartner: (data: AddPartnerFormData) => void;
}

export function AddPartnerModal({
  isOpen,
  onClose,
  onAddPartner,
}: AddPartnerModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddPartnerFormData>({
    resolver: zodResolver(addPartnerSchema) as any,
    defaultValues: {
      name: '',
      type: 'Corporate',
      tier: 'Strategic',
      contactPerson: '',
      email: '',
      phone: '',
      contribution: '',
      website: '',
    },
  });

  const selectedType = watch('type');
  const selectedTier = watch('tier');

  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        type: 'Corporate',
        tier: 'Strategic',
        contactPerson: '',
        email: '',
        phone: '',
        contribution: '',
        website: '',
      });
    }
  }, [isOpen, reset]);

  const onSubmit = (data: AddPartnerFormData) => {
    onAddPartner(data);
    reset();
    onClose();
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
      <DialogContent className="sm:max-w-lg flex flex-col gap-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-bold font-heading">
            Add Partner / Sponsor
          </DialogTitle>
          <DialogDescription>
            Register a corporate sponsor, grantor, or hiring partner.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-0 flex-1 flex flex-col pt-1"
        >
          <ScrollArea className="h-[360px] sm:h-[400px] py-2">
            <FieldSet className="px-4 py-2">
              <FieldGroup className="gap-3">
                <Field data-invalid={!!errors.name}>
                  <FieldLabel className="text-xs font-semibold text-foreground">
                    Organization / Company Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...register('name')}
                    placeholder="e.g. Lagos State Employment Trust Fund"
                    className="h-9 text-xs"
                  />
                  {errors.name && <FieldError>{errors.name.message}</FieldError>}
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field data-invalid={!!errors.type}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Partner Type <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="type"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full h-9 text-xs">
                            <SelectValue placeholder="Select type">
                              {selectedType}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Corporate">Corporate</SelectItem>
                            <SelectItem value="Government Agency">Government Agency</SelectItem>
                            <SelectItem value="NGO / Foundation">NGO / Foundation</SelectItem>
                            <SelectItem value="Academic Partner">Academic Partner</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.type && <FieldError>{errors.type.message}</FieldError>}
                  </Field>

                  <Field data-invalid={!!errors.tier}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Partnership Tier <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="tier"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full h-9 text-xs">
                            <SelectValue placeholder="Select tier">
                              {selectedTier}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Strategic">Strategic</SelectItem>
                            <SelectItem value="Grantor">Grantor</SelectItem>
                            <SelectItem value="Equipment Donor">Equipment Donor</SelectItem>
                            <SelectItem value="Hiring Partner">Hiring Partner</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.tier && <FieldError>{errors.tier.message}</FieldError>}
                  </Field>
                </div>

                <Field data-invalid={!!errors.contactPerson}>
                  <FieldLabel className="text-xs font-semibold text-foreground">
                    Lead Contact Person <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...register('contactPerson')}
                    placeholder="e.g. Engr. Babatunde Jinadu"
                    className="h-9 text-xs"
                  />
                  {errors.contactPerson && (
                    <FieldError>{errors.contactPerson.message}</FieldError>
                  )}
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field data-invalid={!!errors.email}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Official Email <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      type="email"
                      {...register('email')}
                      placeholder="contact@partner.org"
                      className="h-9 text-xs"
                    />
                    {errors.email && <FieldError>{errors.email.message}</FieldError>}
                  </Field>

                  <Field data-invalid={!!errors.phone}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Phone Number <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...register('phone')}
                      placeholder="+234 1 888 0000"
                      className="h-9 text-xs font-mono"
                    />
                    {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
                  </Field>
                </div>

                <Field data-invalid={!!errors.contribution}>
                  <FieldLabel className="text-xs font-semibold text-foreground">
                    Contribution / Alliance Scope <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...register('contribution')}
                    placeholder="e.g. Scholarships, solar equipment donation, graduate recruitment"
                    className="h-9 text-xs"
                  />
                  {errors.contribution && (
                    <FieldError>{errors.contribution.message}</FieldError>
                  )}
                </Field>

                <Field data-invalid={!!errors.website}>
                  <FieldLabel className="text-xs font-semibold text-foreground">
                    Website URL
                  </FieldLabel>
                  <Input
                    {...register('website')}
                    placeholder="https://partner.org"
                    className="h-9 text-xs"
                  />
                  {errors.website && <FieldError>{errors.website.message}</FieldError>}
                </Field>
              </FieldGroup>
            </FieldSet>
          </ScrollArea>

          <DialogFooter className="gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2 font-semibold">
              Save Partner
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
