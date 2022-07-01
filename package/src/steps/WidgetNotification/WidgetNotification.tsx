import React from "react";
import classes from "./WidgetNotification.module.css";
import {
  useWidgetNotifications,
  NotificationType,
  Notification,
} from "../../NotificationContext";
import { WidgetNotificationProps } from "./WidgetNotification.models";
import { Error, Warning, Success, Info } from "./icons";

const typeToIcon = {
  [NotificationType.Warning]: Warning,
  [NotificationType.Info]: Info,
  [NotificationType.Success]: Success,
  [NotificationType.Error]: Error,
};

interface SingleNotificationProps {
  notification: Omit<Notification, "submittedAt" | "id" | "shouldExpire">;
  className?: string;
}

export const SingleNotification = ({
  notification,
  className,
}: SingleNotificationProps) => {
  const Icon = typeToIcon[notification.type];

  const colorClass = classes[notification.type.toLowerCase()];

  return (
    <div className={`${classes.WidgetNotification} ${colorClass} ${className}`}>
      {Icon && <Icon />}
      <div className={classes.message}>{notification?.message}</div>
    </div>
  );
};

export const WidgetNotification = ({ className }: WidgetNotificationProps) => {
  const { notifications } = useWidgetNotifications();

  const notificationToRender =
    notifications.length > 0 ? notifications.at(-1) : null;

  return (
    <div className={classes.notificationContainer}>
      {notificationToRender && (
        <SingleNotification
          className={className}
          notification={notificationToRender}
        />
      )}
    </div>
  );
};
