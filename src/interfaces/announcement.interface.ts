export interface Announcement {
  _id: string;
  title: string;
  content: string;
  scopeType: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  publishedBy: any;
  publishedAt: string;
}

export interface Notification {
  _id: string;
  recipientUserId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  actionUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

