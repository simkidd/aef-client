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
import { TrainingCentre } from '@/interfaces';

export const addAssetSchema = z.object({
  name: z.string().min(2, 'Asset name & specs is required'),
  tag: z.string().min(2, 'Asset tag is required').transform((val) => val.toUpperCase()),
  category: z.enum(['IT Equipment', 'Solar Workshop Gear', 'Esthetics Tools', 'Biometric Hardware']),
  serialNumber: z.string().min(2, 'Serial number is required'),
  centreName: z.string().min(1, 'Please select a centre'),
  roomName: z.string().min(1, 'Room / Location is required'),
  condition: z.enum(['Excellent', 'Good', 'Needs Repair', 'Retired']),
  assignedTo: z.string().optional(),
});

export type AddAssetFormData = z.infer<typeof addAssetSchema>;

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  centres: TrainingCentre[];
  suggestedTag?: string;
  onAddAsset: (data: AddAssetFormData) => void;
}

export function AddAssetModal({
  isOpen,
  onClose,
  centres,
  suggestedTag,
  onAddAsset,
}: AddAssetModalProps) {
  const defaultCentre = centres?.[0]?.name || 'Main Hub - Ikeja';

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddAssetFormData>({
    resolver: zodResolver(addAssetSchema) as any,
    defaultValues: {
      name: '',
      tag: suggestedTag || '',
      category: 'IT Equipment',
      serialNumber: '',
      centreName: defaultCentre,
      roomName: '',
      condition: 'Excellent',
      assignedTo: '',
    },
  });

  const selectedCategory = watch('category');
  const selectedCondition = watch('condition');
  const selectedCentre = watch('centreName');

  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        tag: suggestedTag || '',
        category: 'IT Equipment',
        serialNumber: '',
        centreName: defaultCentre,
        roomName: '',
        condition: 'Excellent',
        assignedTo: '',
      });
    }
  }, [isOpen, reset, suggestedTag, defaultCentre]);

  const onSubmit = (data: AddAssetFormData) => {
    onAddAsset(data);
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
            Log New Physical Asset
          </DialogTitle>
          <DialogDescription>
            Register hardware equipment and assign barcode inventory tag.
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
                    Asset Name & Specifications <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...register('name')}
                    placeholder="e.g. Dell OptiPlex 7090 Desktop (i7, 32GB RAM)"
                    className="h-9 text-xs"
                  />
                  {errors.name && <FieldError>{errors.name.message}</FieldError>}
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field data-invalid={!!errors.tag}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Asset Tag / Code <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...register('tag')}
                      placeholder="e.g. AEF-AST-0106"
                      className="h-9 text-xs font-mono uppercase"
                    />
                    {errors.tag && <FieldError>{errors.tag.message}</FieldError>}
                  </Field>

                  <Field data-invalid={!!errors.category}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Category <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="category"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full h-9 text-xs">
                            <SelectValue placeholder="Select category">
                              {selectedCategory}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                            <SelectItem value="Solar Workshop Gear">Solar Workshop Gear</SelectItem>
                            <SelectItem value="Esthetics Tools">Esthetics Tools</SelectItem>
                            <SelectItem value="Biometric Hardware">Biometric Hardware</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.category && <FieldError>{errors.category.message}</FieldError>}
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field data-invalid={!!errors.serialNumber}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Serial Number <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...register('serialNumber')}
                      placeholder="SN-DLL-8823901"
                      className="h-9 text-xs font-mono"
                    />
                    {errors.serialNumber && (
                      <FieldError>{errors.serialNumber.message}</FieldError>
                    )}
                  </Field>

                  <Field data-invalid={!!errors.centreName}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Centre Location <span className="text-destructive">*</span>
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

                <div className="grid grid-cols-2 gap-3">
                  <Field data-invalid={!!errors.roomName}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Room / Lab Location <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...register('roomName')}
                      placeholder="e.g. LAB-101"
                      className="h-9 text-xs"
                    />
                    {errors.roomName && (
                      <FieldError>{errors.roomName.message}</FieldError>
                    )}
                  </Field>

                  <Field data-invalid={!!errors.condition}>
                    <FieldLabel className="text-xs font-semibold text-foreground">
                      Physical Condition <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="condition"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full h-9 text-xs">
                            <SelectValue placeholder="Select condition">
                              {selectedCondition}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Needs Repair">Needs Repair</SelectItem>
                            <SelectItem value="Retired">Retired</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.condition && (
                      <FieldError>{errors.condition.message}</FieldError>
                    )}
                  </Field>
                </div>

                <Field data-invalid={!!errors.assignedTo}>
                  <FieldLabel className="text-xs font-semibold text-foreground">
                    Assigned Workstation / User
                  </FieldLabel>
                  <Input
                    {...register('assignedTo')}
                    placeholder="e.g. Workstation 12 or Trainer Desk"
                    className="h-9 text-xs"
                  />
                  {errors.assignedTo && (
                    <FieldError>{errors.assignedTo.message}</FieldError>
                  )}
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
              Save Asset Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
