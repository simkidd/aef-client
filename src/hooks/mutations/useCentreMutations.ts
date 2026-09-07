import { useMutation, useQueryClient } from '@tanstack/react-query';
import { centreApi } from '@/lib/api/centre.api';
import {
  TrainingCentre,
  RoomFacility,
  Asset,
  DocumentRecord,
} from '@/interfaces';
import { toast } from '@/components/ui/toast';

export function useCreateCentreMutation(options?: {
  onSuccess?: (data?: TrainingCentre) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<TrainingCentre>) => {
      const res = await centreApi.create(data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['centres'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Centre Created',
        description: `"${data?.name || 'Training Centre'}" registered successfully.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to create centre',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to register training centre.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useUpdateCentreMutation(options?: {
  onSuccess?: (data?: TrainingCentre) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TrainingCentre> }) => {
      const res = await centreApi.update(id, data);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['centres'] });
      queryClient.invalidateQueries({ queryKey: ['centre', variables.id] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Centre Updated',
        description: `"${data?.name || 'Training Centre'}" updated successfully.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to update centre',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to update training centre.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useCreateRoomMutation(options?: {
  onSuccess?: (data?: RoomFacility) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<RoomFacility>) => {
      const res = await centreApi.createRoom(data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Facility Room Added',
        description: `"${data?.name}" registered successfully.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to add facility',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to add facility room.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useCreateAssetMutation(options?: {
  onSuccess?: (data?: Asset) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Asset>) => {
      const res = await centreApi.createAsset(data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Asset Logged',
        description: `"${data?.name}" registered successfully.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Failed to log asset',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to log asset.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}

export function useCreateDocumentMutation(options?: {
  onSuccess?: (data?: DocumentRecord) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<DocumentRecord>) => {
      const res = await centreApi.createDocument(data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      options?.onSuccess?.(data);
      toast.add({
        title: 'Document Uploaded',
        description: `"${data?.title}" logged to repository.`,
        type: 'success',
      });
    },
    onError: (err: any) => {
      toast.add({
        title: 'Upload Failed',
        description:
          err?.response?.data?.message ||
          err?.message ||
          'Unable to upload document.',
        type: 'error',
      });
      options?.onError?.(err);
    },
  });
}
