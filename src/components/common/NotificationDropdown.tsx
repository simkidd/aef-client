'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCircle2,
  Info,
  AlertTriangle,
  ShieldAlert,
  CheckCheck,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useNotificationsQuery } from '@/hooks/queries/useNotificationQueries';
import { useMarkNotificationReadMutation } from '@/hooks/mutations/useNotificationMutations';
import { Notification } from '@/interfaces';
import { formatDistanceToNow } from 'date-fns';

export function NotificationDropdown() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useNotificationsQuery();
  const markReadMutation = useMarkNotificationReadMutation();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount ?? notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.isRead) {
      await markReadMutation.mutateAsync(notif._id);
    }
    if (notif.actionUrl) {
      setOpen(false);
      router.push(notif.actionUrl);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    for (const notif of unread) {
      markReadMutation.mutate(notif._id);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />;
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />;
      case 'ALERT':
        return <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />;
      case 'INFO':
      default:
        return <Info className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-label="Notifications"
        className="relative inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200/80 bg-white/50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:border-slate-800/80 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-0 shadow-xl border border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="h-7 px-2 text-[11px] font-medium text-slate-500 hover:text-primary gap-1"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {isLoading ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 px-4 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                You&apos;re all caught up!
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                No recent announcements or notifications
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const timeAgo = notif.createdAt
                ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })
                : '';

              return (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex items-start gap-3 p-3.5 text-left transition-colors cursor-pointer ${
                    notif.isRead
                      ? 'hover:bg-slate-50/80 dark:hover:bg-slate-900/50 opacity-75'
                      : 'bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15'
                  }`}
                >
                  {getIcon(notif.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                      <span>{timeAgo}</span>
                      {notif.actionUrl && (
                        <span className="inline-flex items-center gap-0.5 text-primary font-medium hover:underline">
                          View details <ExternalLink className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
