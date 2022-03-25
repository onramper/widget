import { Notification, Notifications } from "./notifications.models";

export interface AddNotification {
  type: "ADD_NOTIFICATION";
  notification: Notification;
}

export interface RemoveNotification {
  type: "REMOVE_NOTIFICATION";
  id: string;
}

type Action = AddNotification | RemoveNotification;

export function notificationReducer(
  state: Notifications,
  action: Action
): Notifications {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return [...state, action.notification];

    case "REMOVE_NOTIFICATION":
      return state.filter((n) => n.id !== action.id);

    default:
      return state;
  }
}
