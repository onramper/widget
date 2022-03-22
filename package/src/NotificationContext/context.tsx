import { createContext, useContext } from "react";
import { Notification, Notifications } from "./notifications.models";

export const NotificationContext = createContext<{
  notifications: Notifications;
  addNotification: (payload: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
}>({
  notifications: [],
  addNotification: () => undefined,
  removeNotification: () => undefined,
});

export function useWidgetNotifications() {
  return useContext(NotificationContext);
}
