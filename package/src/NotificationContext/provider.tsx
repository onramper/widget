import { chainIdToNetwork, useLayer2 } from "layer2";
import React, { ReactNode, useCallback, useEffect, useReducer } from "react";
import {
  AddNotificationPayload,
  Notifications,
  NotificationType,
} from "./notifications.models";
import { notificationReducer } from "./reducer";
import { NotificationContext } from "./context";
import { nanoid } from "nanoid";
import { useTransactionContext } from "../TransactionContext/hooks";
import { useInterval, usePrevious } from "../hooks";

interface Props {
  children: ReactNode;
}

const checkInterval = 5000; //ms
const expirationPeriod = 10000; //ms

function getExpiredNotifications(
  notifications: Notifications,
  expirationPeriod: number
) {
  const timeFromCreation = (creationTime: number) => Date.now() - creationTime;

  return notifications.filter(
    (notification) =>
      timeFromCreation(notification.submittedAt) >= expirationPeriod
  );
}

export function NotificationProvider({ children }: Props) {
  const [notifications, dispatch] = useReducer(notificationReducer, []);
  const { chainId, account } = useLayer2();
  const { tokenIn, tokenOut } = useTransactionContext();

  useEffect(() => {
    if (chainId && account) {
      if (tokenIn.chainId !== tokenOut.chainId) {
        dispatch({
          type: "ADD_NOTIFICATION",
          notification: {
            submittedAt: Date.now(),
            type: NotificationType.Warning,
            id: nanoid(),
            message: "Tokens are on incompatible networks",
          },
        });
      } else {
        if (tokenIn.chainId !== chainId) {
          dispatch({
            type: "ADD_NOTIFICATION",
            notification: {
              submittedAt: Date.now(),
              type: NotificationType.Warning,
              id: nanoid(),
              message: `You are on an incorrect Network, please switch to ${
                chainIdToNetwork[tokenIn.chainId]
              }`,
            },
          });
        }
      }
    }
  }, [tokenIn, tokenOut, chainId, account]);

  useEffect(() => {
    if (chainId) {
      if (previousChainId !== undefined && chainId !== previousChainId) {
        dispatch({
          type: "ADD_NOTIFICATION",
          notification: {
            submittedAt: Date.now(),
            type: NotificationType.Info,
            id: nanoid(),
            message: "Network Changed.",
          },
        });
      }
    }
    //eslint-disable-next-line
  }, [chainId]);

  const addNotification = useCallback(
    ({ message, type }: AddNotificationPayload) => {
      dispatch({
        type: "ADD_NOTIFICATION",
        notification: { submittedAt: Date.now(), message, type, id: nanoid() },
      });
    },
    [dispatch]
  );

  const removeNotification = useCallback(
    (id: string) => {
      dispatch({
        type: "REMOVE_NOTIFICATION",
        id,
      });
    },
    [dispatch]
  );

  useInterval(() => {
    const expiredNotification = getExpiredNotifications(
      notifications,
      expirationPeriod
    );
    for (const notification of expiredNotification) {
      removeNotification(notification.id);
    }
  }, checkInterval);

  const previousChainId = usePrevious<number | undefined>(chainId);

  return (
    <NotificationContext.Provider
      value={{ addNotification, notifications, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
