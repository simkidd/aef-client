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

export const addFacilitySchema = z.object({
  name: z.string().min(2, 'Facility / Room name must be at least 2 characters'),
  code: z
    .string()
    .min(2, 'Room code must be at least 2 characters')
    .max(10, 'Room code cannot exceed 10 characters')
    .transform((val) => val.toUpperCase()),
  type: z.enum(['Computer Lab', 'Workshop / Practical Studio', 'Lecture Hall', 'Seminar Room']),
  centreName: z.string().min(1, 'Please select an accredited centre'),
  capacity: z.coerce.number().min(1, 'Seat capacity must be at least 1'),
  features: z.string().optional(),
});

export type AddFacilityFormData = z.infer<typeof addFacilitySchema>;

interface AddFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  centres: TrainingCentre[];
  onAddFacility: (data: AddFacilityFormData) => void;
}

export function AddFacilityModal({
  isOpen,
  onClose,
  centres,
  onAddFacility,
}: AddFacilityModalProps) {
  const defaultCentre = centres?.[0]?.name || 'Main Hub - Ikeja';

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddFacilityFormData>({
    resolver: zodResolver(addFacilitySchema) as any,
    defaultValues: {
      name: '',
      code: '',
      type: 'Computer Lab',
      centreName: defaultCentre,
      capacity: 30,
      features: '',
    },
  });

  const selectedType = watch('type');
  const selectedCentre = watch('centreName');

  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        code: '',
        type: 'Computer Lab',
        centreName: defaultCentre,
        capacity: 30,
        features: '',
      });
    }
  }, [isOpen, reset, defaultCentre]);

  const onSubmit = (data: AddFacilityFormData) => {
    onAddFacility(data);
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
            Add Training Facility / Room
          </DialogTitle>
          <DialogDescription>
            Configure a new workshop, computer lab, or lecture hall.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <FieldSet>
            <FieldGroup className="gap-3">
              <Field data-invalid={!!errors.name}>
                <FieldLabel className="text-xs font-semibold text-foreground">
                  Facility / Room Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...register('name')}
                  placeholder="e.g. Alan Turing Cyber Lab"
                  className="h-9 text-xs"
                />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field data-invalid={!!errors.code}>
                  <FieldLabel className="text-xs font-semibold text-foreground">
                    Room Code <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...register('code')}
                    placeholder="e.g. LAB-104"
                    className="h-9 text-xs font-mono uppercase"
                  />
                  {errors.code && <FieldError>{errors.code.message}</FieldError>}
                </Field>

                <Field data-invalid={!!errors.capacity}>
                  <FieldLabel className="text-xs font-semibold text-foreground">
                    Seat Capacity <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    {...register('capacity')}
                    placeholder="30"
                    className="h-9 text-xs font-mono"
                  />
                  {errors.capacity && (
                    <FieldError>{errors.capacity.message}</FieldError>
                  )}
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field data-invalid={!!errors.type}>
                  <FieldLabel className="text-xs font-semibold text-foreground">
                    Facility Type <span className="text-destructive">*</span>
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
                          <SelectItem value="Computer Lab">Computer Lab</SelectItem>
                          <SelectItem value="Workshop / Practical Studio">Workshop Studio</SelectItem>
                          <SelectItem value="Lecture Hall">Lecture Hall</SelectItem>
                          <SelectItem value="Seminar Room">Seminar Room</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.type && <FieldError>{errors.type.message}</FieldError>}
                </Field>

                <Field data-invalid={!!errors.centreName}>
                  <FieldLabel className="text-xs font-semibold text-foreground">
                    Training Centre <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="centreName"
                    render={({ field }) => (
                      <Select
                        value={field.value || undefined}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full h-9 text-xs">
                          <SelectValue placeholder="Select centre">
                            {selectedCentre || 'Select centre'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {centres.map((c) => (
                            <SelectItem key={c._id} value={c.name}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.centreName && (
                    <FieldError>{errors.centreName.message}</FieldError>
                  )}
                </Field>
              </div>

              <Field data-invalid={!!errors.features}>
                <FieldLabel className="text-xs font-semibold text-foreground">
                  Equipment & Features (Comma-separated)
                </FieldLabel>
                <Input
                  {...register('features')}
                  placeholder="e.g. 30x PCs, Projector, High-speed Fiber, AC"
                  className="h-9 text-xs"
                />
                {errors.features && (
                  <FieldError>{errors.features.message}</FieldError>
                )}
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
              Save Facility
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
