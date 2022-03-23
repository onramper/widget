export enum NotificationType {
  Warning,
  Success,
  Info,
  Error,
}

export interface Notification {
  submittedAt: number;
  id: string;
  message: string;
  type: NotificationType;
  shouldExpire: boolean;
}

export type Notifications = Notification[];

export type AddNotificationPayload = Omit<Notification, "id" | "submittedAt">;
