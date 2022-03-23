import { chainIDToNetworkInfo, useLayer2 } from "layer2";
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

const checkInterval = 1000; //ms
const expirationPeriod = 5000; //ms

function getExpiredNotifications(
  notifications: Notifications,
  expirationPeriod: number
) {
  const timeFromCreation = (creationTime: number) => Date.now() - creationTime;

  return notifications.filter(
    (notification) =>
      notification.shouldExpire &&
      timeFromCreation(notification.submittedAt) >= expirationPeriod
  );
}

export function NotificationProvider({ children }: Props) {
  const [notifications, dispatch] = useReducer(notificationReducer, []);
  const { chainId, account, active } = useLayer2();
  const { tokenIn, tokenOut } = useTransactionContext();

  const tokenChain =
    chainIDToNetworkInfo.find((c) => c.chainId === tokenIn.chainId) ?? null;

  useEffect(() => {
    if (active && account && chainId) {
      const pleaseConnectId =
        notifications.find((n) => n.message.includes("Please open Metamask"))
          ?.id ?? undefined;
      if (pleaseConnectId) {
        dispatch({
          type: "REMOVE_NOTIFICATION",
          id: pleaseConnectId,
        });
      }
      dispatch({
        type: "ADD_NOTIFICATION",
        notification: {
          submittedAt: Date.now(),
          type: NotificationType.Success,
          id: nanoid(),
          message: "Wallet Connected",
          shouldExpire: true,
        },
      });
    } else {
      if (previouslyConnected) {
        dispatch({
          type: "ADD_NOTIFICATION",
          notification: {
            submittedAt: Date.now(),
            type: NotificationType.Info,
            id: nanoid(),
            message: "Disconnected",
            shouldExpire: true,
          },
        });
      }
    }
    //eslint-disable-next-line
  }, [account, active, chainId]);

  useEffect(() => {
    if (chainId && account) {
      if (tokenIn.chainId !== tokenOut.chainId) {
        dispatch({
          type: "ADD_NOTIFICATION",
          notification: {
            submittedAt: Date.now(),
            type: NotificationType.Error,
            id: nanoid(),
            message: "Tokens are on incompatible networks",
            shouldExpire: false,
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
                tokenChain?.name ?? "unknown"
              }`,
              shouldExpire: false,
            },
          });
        }
        if (tokenIn.chainId === chainId) {
          const chainErrorNotificationId =
            notifications.find((n) => n.message.includes("incorrect network"))
              ?.id ?? undefined;
          if (chainErrorNotificationId) {
            dispatch({
              type: "REMOVE_NOTIFICATION",
              id: chainErrorNotificationId,
            });
          }
        }
      }
    }
    //eslint-disable-next-line
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
            message: `Network Changed. You are on ${
              chainIDToNetworkInfo.find((chain) => chain.chainId === chainId)
                ?.name ?? "an unknown network"
            }`,
            shouldExpire: true,
          },
        });
      }
    }
    //eslint-disable-next-line
  }, [chainId]);

  const addNotification = useCallback(
    ({ message, type, shouldExpire }: AddNotificationPayload) => {
      dispatch({
        type: "ADD_NOTIFICATION",
        notification: {
          submittedAt: Date.now(),
          message,
          type,
          id: nanoid(),
          shouldExpire,
        },
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
  const previouslyConnected = usePrevious<boolean>(active);

  return (
    <NotificationContext.Provider
      value={{ addNotification, notifications, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
