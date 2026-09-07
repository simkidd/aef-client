import { useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementApi } from '@/lib/api/announcement.api';
import { Announcement } from '@/interfaces';

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => announcementApi.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'my'] });
    },
  });
}

export function useCreateAnnouncementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Announcement>) => announcementApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'my'] });
    },
  });
}
