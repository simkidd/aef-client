import { useQuery } from '@tanstack/react-query';
import { enrollmentApi } from '@/lib/api/enrollment.api';
import { Enrollment } from '@/interfaces';

export function useEnrollmentsQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['enrollments', params],
    queryFn: async () => {
      const response = await enrollmentApi.getAll(params);
      return (response?.data || []) as Enrollment[];
    },
  });
}

export function useEnrollmentQueueQuery(params?: {
  status?: string;
  search?: string;
  skillArea?: string;
  centreId?: string;
  programId?: string;
  cohortId?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}) {
  return useQuery({
    queryKey: ['enrollment-queue', params],
    queryFn: async () => {
      const response = await enrollmentApi.getQueue(params);
      return {
        docs: (response?.data || []) as Enrollment[],
        pagination: response?.pagination,
      };
    },
  });
}

export function useMyTrainingQuery() {
  return useQuery({
    queryKey: ['enrollments', 'my-training'],
    queryFn: async () => {
      const response = await enrollmentApi.getMyActiveTraining();
      return response?.data as Enrollment;
    },
  });
}

// Portal: returns {active, history} shape from /enrollments/my-training
export function useMyTrainingJourneyQuery() {
  return useQuery({
    queryKey: ['enrollments', 'my-training-journey'],
    queryFn: async () => {
      const response = await enrollmentApi.getMyActiveTraining();
      return response?.data as unknown as { active?: Enrollment; history: Enrollment[] };
    },
  });
}

export function useEnrollmentQuery(id: string) {
  return useQuery({
    queryKey: ['enrollment', id],
    queryFn: async () => {
      const response = await enrollmentApi.getById(id);
      return response?.data as Enrollment;
    },
    enabled: !!id,
  });
}
