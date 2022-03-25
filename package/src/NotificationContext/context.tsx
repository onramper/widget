import { createContext, useContext } from "react";
import { AddNotificationPayload, Notifications } from "./notifications.models";

export const NotificationContext = createContext<{
  notifications: Notifications;
  addNotification: (payload: AddNotificationPayload) => void;
  removeNotification: (id: string) => void;
}>({
  notifications: [],
  addNotification: () => undefined,
  removeNotification: () => undefined,
});

export function useWidgetNotifications() {
  return useContext(NotificationContext);
}
