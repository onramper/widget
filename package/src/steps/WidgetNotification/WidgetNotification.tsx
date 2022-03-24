import React from "react";
import classes from "./WidgetNotification.module.css";
import {
  useWidgetNotifications,
  NotificationType,
} from "../../NotificationContext";
import { WidgetNotificationProps } from "./WidgetNotification.models";
import { Error, Warning, Success, Info } from "./icons";

const typeToIcon = {
  [NotificationType.Warning]: Warning,
  [NotificationType.Info]: Info,
  [NotificationType.Success]: Success,
  [NotificationType.Error]: Error,
};

export const WidgetNotification = ({ className }: WidgetNotificationProps) => {
  const { notifications } = useWidgetNotifications();

  const notificationToRender =
    notifications.length > 0 ? notifications[notifications.length - 1] : null;

  const Icon = notificationToRender && typeToIcon[notificationToRender?.type];
  const colorClass = notificationToRender?.type
    ? classes[notificationToRender?.type.toLowerCase()]
    : undefined;

  return (
    <div className={`${classes.WidgetNotification} ${colorClass} ${className}`}>
      {Icon && <Icon />}
      <div className={classes.message}>{notificationToRender?.message}</div>
    </div>
  );
};
