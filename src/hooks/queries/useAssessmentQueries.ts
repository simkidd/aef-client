import { useQuery } from '@tanstack/react-query';
import { assessmentApi } from '@/lib/api/assessment.api';
import { Assessment } from '@/interfaces';

export function useAssessmentsQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['admin-assessments', params],
    queryFn: async () => {
      const response = await assessmentApi.getAll(params);
      return (response?.data || []) as Assessment[];
    },
  });
}

export function useAssessmentsListQuery(params?: Record<string, any>) {
  return useAssessmentsQuery(params);
}

export function useAssessmentResultsQuery(assessmentId?: string) {
  return useQuery({
    queryKey: ['admin-assessment-results', assessmentId],
    queryFn: async () => {
      if (!assessmentId) return [];
      const response = await assessmentApi.getMyGrades();
      return (response?.data || []) as any[];
    },
    enabled: !!assessmentId,
  });
}
