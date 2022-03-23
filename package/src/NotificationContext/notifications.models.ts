export enum NotificationType {
  Warning = "Warning",
  Success = "Success",
  Info = "Info",
  Error = "Error",
}

export interface Notification {
  submittedAt: number;
  id: string;
  message: string;
  type: NotificationType;
}

export type Notifications = Notification[];

export type AddNotificationPayload = Omit<Notification, "id" | "submittedAt">;
