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
import { TrainingCentre } from '@/interfaces';

export const addVolunteerSchema = z.object({
  name: z.string().min(2, 'Volunteer full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  role: z.string().min(2, 'Volunteer focus role is required'),
  centre: z.string().min(1, 'Please select an assigned centre'),
  skills: z.string().optional(),
});

export type AddVolunteerFormData = z.infer<typeof addVolunteerSchema>;

interface AddVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  centres: TrainingCentre[];
  onAddVolunteer: (data: AddVolunteerFormData) => void;
}

export function AddVolunteerModal({
  isOpen,
  onClose,
  centres,
  onAddVolunteer,
}: AddVolunteerModalProps) {
  const defaultCentre = centres?.[0]?.name || 'Main Hub - Ikeja';

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddVolunteerFormData>({
    resolver: zodResolver(addVolunteerSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: '',
      centre: defaultCentre,
      skills: '',
    },
  });

  const selectedCentre = watch('centre');

  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        email: '',
        phone: '',
        role: '',
        centre: defaultCentre,
        skills: '',
      });
    }
  }, [isOpen, reset, defaultCentre]);

  const onSubmit = (data: AddVolunteerFormData) => {
    onAddVolunteer(data);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold font-heading">
            Register New Volunteer
          </DialogTitle>
          <DialogDescription>
            Add community volunteers and mentors to the foundation network.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <FieldSet>
            <FieldGroup className="gap-3">
              <Field data-invalid={!!errors.name}>
                <FieldLabel className="text-xs font-semibold text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...register('name')}
                  placeholder="e.g. Samuel Adeleke"
                  className="h-9 text-xs"
                />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field data-invalid={!!errors.email}>
                  <FieldLabel className="text-xs font-semibold text-foreground">
                    Email Address <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    type="email"
                    {...register('email')}
                    placeholder="samuel@example.com"
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
                    placeholder="+234 800 000 0000"
                    className="h-9 text-xs font-mono"
                  />
                  {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
                </Field>
              </div>

              <Field data-invalid={!!errors.role}>
                <FieldLabel className="text-xs font-semibold text-foreground">
                  Volunteer Focus / Assignment <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...register('role')}
                  placeholder="e.g. Solar Lab Assistant, Coding Mentor"
                  className="h-9 text-xs"
                />
                {errors.role && <FieldError>{errors.role.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.centre}>
                <FieldLabel className="text-xs font-semibold text-foreground">
                  Assigned Centre <span className="text-destructive">*</span>
                </FieldLabel>
                <Controller
                  control={control}
                  name="centre"
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="-- Select Centre --">
                          {selectedCentre || '-- Select Centre --'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {centres.map((c) => (
                          <SelectItem key={c._id} value={c.name}>
                            {c.name} ({c.state})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.centre && <FieldError>{errors.centre.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.skills}>
                <FieldLabel className="text-xs font-semibold text-foreground">
                  Skills & Domains (Comma-separated)
                </FieldLabel>
                <Input
                  {...register('skills')}
                  placeholder="e.g. PV Wiring, React, Event Logistics"
                  className="h-9 text-xs"
                />
                {errors.skills && <FieldError>{errors.skills.message}</FieldError>}
              </Field>
            </FieldGroup>
          </FieldSet>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2 font-semibold">
              Register Volunteer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
