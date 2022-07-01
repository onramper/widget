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
  shouldExpire: boolean;
  externalId?: string;
}

export type Notifications = Notification[];

export interface AddNotificationPayload {
  id?: string;
  message: string;
  type: NotificationType;
  shouldExpire: boolean;
}
