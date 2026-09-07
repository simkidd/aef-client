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

export const addDocumentSchema = z.object({
  title: z.string().min(2, 'Document title is required'),
  category: z.enum(['Policy & Governance', 'Training Curriculum', 'Legal & Compliance', 'Forms & Templates']),
  fileType: z.enum(['PDF', 'DOCX', 'XLSX']),
  accessLevel: z.enum(['Staff Only', 'Public', 'Executive / Admin']),
});

export type AddDocumentFormData = z.infer<typeof addDocumentSchema>;

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDoc: (data: AddDocumentFormData) => void;
}

export function AddDocumentModal({
  isOpen,
  onClose,
  onAddDoc,
}: AddDocumentModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddDocumentFormData>({
    resolver: zodResolver(addDocumentSchema) as any,
    defaultValues: {
      title: '',
      category: 'Policy & Governance',
      fileType: 'PDF',
      accessLevel: 'Staff Only',
    },
  });

  const selectedCategory = watch('category');
  const selectedFileType = watch('fileType');
  const selectedAccess = watch('accessLevel');

  useEffect(() => {
    if (isOpen) {
      reset({
        title: '',
        category: 'Policy & Governance',
        fileType: 'PDF',
        accessLevel: 'Staff Only',
      });
    }
  }, [isOpen, reset]);

  const onSubmit = (data: AddDocumentFormData) => {
    onAddDoc(data);
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
            Upload Policy / Resource Document
          </DialogTitle>
          <DialogDescription>
            Publish a governance policy, training syllabus, or standard form.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <FieldSet>
            <FieldGroup className="gap-3">
              <Field data-invalid={!!errors.title}>
                <FieldLabel className="text-xs font-semibold text-foreground">
                  Document Title <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...register('title')}
                  placeholder="e.g. Vocational Training Accreditation Standards 2026"
                  className="h-9 text-xs"
                />
                {errors.title && <FieldError>{errors.title.message}</FieldError>}
              </Field>

              <div className="grid grid-cols-2 gap-3">
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
                          <SelectItem value="Policy & Governance">Policy & Governance</SelectItem>
                          <SelectItem value="Training Curriculum">Training Curriculum</SelectItem>
                          <SelectItem value="Legal & Compliance">Legal & Compliance</SelectItem>
                          <SelectItem value="Forms & Templates">Forms & Templates</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && <FieldError>{errors.category.message}</FieldError>}
                </Field>

                <Field data-invalid={!!errors.fileType}>
                  <FieldLabel className="text-xs font-semibold text-foreground">
                    File Format <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="fileType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full h-9 text-xs">
                          <SelectValue placeholder="Select format">
                            {selectedFileType}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PDF">PDF Document</SelectItem>
                          <SelectItem value="DOCX">Word Document</SelectItem>
                          <SelectItem value="XLSX">Excel Spreadsheet</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.fileType && <FieldError>{errors.fileType.message}</FieldError>}
                </Field>
              </div>

              <Field data-invalid={!!errors.accessLevel}>
                <FieldLabel className="text-xs font-semibold text-foreground">
                  Security Classification <span className="text-destructive">*</span>
                </FieldLabel>
                <Controller
                  control={control}
                  name="accessLevel"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Select access level">
                          {selectedAccess}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Staff Only">Staff Only</SelectItem>
                        <SelectItem value="Public">Public (All Trainees & Staff)</SelectItem>
                        <SelectItem value="Executive / Admin">Executive / Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.accessLevel && <FieldError>{errors.accessLevel.message}</FieldError>}
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
              Upload Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
