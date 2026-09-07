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
import { Textarea } from '@/components/ui/textarea';
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
import { Loader2 } from 'lucide-react';
import { useCreateDepartmentMutation } from '@/hooks/mutations/useOrgMutations';
import { Staff } from '@/interfaces';

export const addDepartmentSchema = z.object({
  name: z.string().min(2, 'Department name must be at least 2 characters'),
  code: z
    .string()
    .min(2, 'Code must be at least 2 characters')
    .max(10, 'Code cannot exceed 10 characters')
    .transform((val) => val.toUpperCase()),
  headOfDepartmentId: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type AddDepartmentFormData = z.infer<typeof addDepartmentSchema>;

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: Staff[];
}

export function AddDepartmentModal({
  isOpen,
  onClose,
  staffList,
}: AddDepartmentModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddDepartmentFormData>({
    resolver: zodResolver(addDepartmentSchema) as any,
    defaultValues: {
      name: '',
      code: '',
      headOfDepartmentId: '',
      description: '',
      isActive: true,
    },
  });

  const createMutation = useCreateDepartmentMutation({
    onSuccess: () => {
      reset();
      onClose();
    },
  });

  const selectedHeadId = watch('headOfDepartmentId');
  const selectedHead = staffList.find((st) => st._id === selectedHeadId);

  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        code: '',
        headOfDepartmentId: '',
        description: '',
        isActive: true,
      });
    }
  }, [isOpen, reset]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('name', val, { shouldValidate: true });
    const currentCode = watch('code');
    if (!currentCode || currentCode === watch('name')?.slice(0, 4).toUpperCase()) {
      const generated = val
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 5);
      setValue('code', generated);
    }
  };

  const onSubmit = (data: AddDepartmentFormData) => {
    createMutation.mutate({
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      description: data.description?.trim() || undefined,
      headOfDepartmentId: data.headOfDepartmentId || undefined,
      isActive: true,
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold font-heading">
            Add New Department
          </DialogTitle>
          <DialogDescription>
            Define an organizational unit and assign department leadership.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <FieldSet>
            <FieldGroup className="gap-3">
              <Field data-invalid={!!errors.name}>
                <FieldLabel className="text-xs font-semibold text-foreground">
                  Department Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...register('name')}
                  onChange={handleNameChange}
                  placeholder="e.g. Vocational Training Operations"
                  className="h-9 text-xs"
                />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.code}>
                <FieldLabel className="text-xs font-semibold text-foreground">
                  Department Code <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...register('code')}
                  placeholder="e.g. VTO"
                  className="h-9 text-xs font-mono uppercase"
                />
                {errors.code && <FieldError>{errors.code.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.headOfDepartmentId}>
                <FieldLabel className="text-xs font-semibold text-foreground">
                  Head of Department (HOD)
                </FieldLabel>
                <Controller
                  control={control}
                  name="headOfDepartmentId"
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={(val) =>
                        field.onChange(val === 'none' ? '' : val)
                      }
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="-- Select Staff Member (Optional) --">
                          {selectedHead
                            ? `${selectedHead.firstName} ${selectedHead.lastName} (${selectedHead.position || selectedHead.staffCode})`
                            : 'No HOD assigned'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No HOD assigned</SelectItem>
                        {staffList.map((st) => (
                          <SelectItem key={st._id} value={st._id}>
                            {st.firstName} {st.lastName} ({st.position || st.staffCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.headOfDepartmentId && (
                  <FieldError>{errors.headOfDepartmentId.message}</FieldError>
                )}
              </Field>

              <Field data-invalid={!!errors.description}>
                <FieldLabel className="text-xs font-semibold text-foreground">
                  Description / Mandate
                </FieldLabel>
                <Textarea
                  {...register('description')}
                  placeholder="Provide a brief overview of the department responsibilities..."
                  rows={3}
                  className="text-xs resize-none"
                />
                {errors.description && (
                  <FieldError>{errors.description.message}</FieldError>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="gap-2 font-semibold"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                'Create Department'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
