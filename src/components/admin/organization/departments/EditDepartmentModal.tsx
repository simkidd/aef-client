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
import { Checkbox } from '@/components/ui/checkbox';
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
import { useUpdateDepartmentMutation } from '@/hooks/mutations/useOrgMutations';
import { Department, Staff } from '@/interfaces';

export const editDepartmentSchema = z.object({
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

export type EditDepartmentFormData = z.infer<typeof editDepartmentSchema>;

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
  staffList: Staff[];
}

export function EditDepartmentModal({
  isOpen,
  onClose,
  department,
  staffList,
}: EditDepartmentModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditDepartmentFormData>({
    resolver: zodResolver(editDepartmentSchema) as any,
    defaultValues: {
      name: '',
      code: '',
      headOfDepartmentId: '',
      description: '',
      isActive: true,
    },
  });

  const updateMutation = useUpdateDepartmentMutation({
    onSuccess: () => {
      onClose();
    },
  });

  const selectedHeadId = watch('headOfDepartmentId');
  const selectedHead = staffList.find((st) => st._id === selectedHeadId);

  useEffect(() => {
    if (department && isOpen) {
      const headId =
        typeof department.headOfDepartmentId === 'object'
          ? department.headOfDepartmentId?._id || ''
          : department.headOfDepartmentId || '';

      reset({
        name: department.name || '',
        code: department.code || '',
        headOfDepartmentId: headId,
        description: department.description || '',
        isActive: department.isActive ?? true,
      });
    }
  }, [department, isOpen, reset]);

  const onSubmit = (data: EditDepartmentFormData) => {
    if (!department) return;
    updateMutation.mutate({
      id: department._id,
      data: {
        name: data.name.trim(),
        code: data.code.trim().toUpperCase(),
        description: data.description?.trim() || undefined,
        headOfDepartmentId: data.headOfDepartmentId || undefined,
        isActive: data.isActive,
      },
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
            Edit Department
          </DialogTitle>
          <DialogDescription>
            Update department configuration and operational status.
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
                        <SelectValue placeholder="-- Select Staff Member --">
                          {selectedHead
                            ? `${selectedHead.firstName} ${selectedHead.lastName} (${selectedHead.position || selectedHead.staffCode})`
                            : 'Unassigned'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Unassigned</SelectItem>
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
                  Description
                </FieldLabel>
                <Textarea
                  {...register('description')}
                  placeholder="Brief overview of the department responsibilities..."
                  rows={3}
                  className="text-xs resize-none"
                />
                {errors.description && (
                  <FieldError>{errors.description.message}</FieldError>
                )}
              </Field>

              <Field orientation="horizontal" className="pt-1">
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="edit-dept-active"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="edit-dept-active"
                        className="text-xs font-medium text-foreground cursor-pointer"
                      >
                        Active operational unit
                      </label>
                    </div>
                  )}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              type="button"
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
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
