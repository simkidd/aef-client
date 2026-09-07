import { useQuery } from '@tanstack/react-query';
import { announcementApi } from '@/lib/api/announcement.api';
import { useAuthStore } from '@/stores';

export function useNotificationsQuery() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['notifications', 'my'],
    queryFn: async () => {
      const response = await announcementApi.getMyNotifications();
      return response.data;
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // Poll every 30s
  });
}

export function useAnnouncementsQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['announcements', params],
    queryFn: async () => {
      const response = await announcementApi.getAll(params);
      return response.data;
    },
    staleTime: 60000,
  });
}
