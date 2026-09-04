export interface Announcement {
  _id: string;
  title: string;
  content: string;
  scopeType: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  publishedBy: any;
  publishedAt: string;
}
