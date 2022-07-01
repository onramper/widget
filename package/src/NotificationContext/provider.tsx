import { lifiChains } from "layer2";
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
import { useLayer2 } from "../web3/config";
import { getDexFromGateway } from "../utils";

interface Props {
  children: ReactNode;
}

export interface MetamaskError extends Error {
  code: number;
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
  const { tokenIn, tokenOut, customerGateway } = useTransactionContext();

  const dex = getDexFromGateway(customerGateway);

  const addNotification = useCallback(
    ({ message, type, shouldExpire, id }: AddNotificationPayload) => {
      dispatch({
        type: "ADD_NOTIFICATION",
        notification: {
          submittedAt: Date.now(),
          message,
          type,
          id: id ?? nanoid(),
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

  useEffect(() => {
    if (active && account && chainId) {
      if (!previouslyConnected) {
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
        return;
      }
      if (previousChainId !== undefined && chainId !== previousChainId) {
        dispatch({
          type: "ADD_NOTIFICATION",
          notification: {
            submittedAt: Date.now(),
            type: NotificationType.Info,
            id: nanoid(),
            message: `Network Changed. You are on ${
              lifiChains.find((chain) => chain.chainId === chainId)?.name ??
              "an unknown network"
            }`,
            shouldExpire: true,
          },
        });
      }
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
      if (dex === "UNISWAP" && tokenIn.chainId !== tokenOut.chainId) {
        // Uniswap can not bridge over chains
        dispatch({
          type: "ADD_NOTIFICATION",
          notification: {
            submittedAt: Date.now(),
            type: NotificationType.Error,
            id: nanoid(),
            message: "Tokens are on incompatible networks",
            shouldExpire: true,
          },
        });
      } else {
        if (tokenIn.chainId !== chainId) {
          const tokenChain = lifiChains.find(
            (c) => c.chainId === tokenIn.chainId
          );
          if (tokenChain) {
            dispatch({
              type: "ADD_NOTIFICATION",
              notification: {
                submittedAt: Date.now(),
                type: NotificationType.Warning,
                id: nanoid(),
                message: `You are on an incorrect Network, please switch to ${
                  tokenChain?.name ?? "unknown"
                }`,
                shouldExpire: true,
              },
            });
          } else {
            dispatch({
              type: "ADD_NOTIFICATION",
              notification: {
                submittedAt: Date.now(),
                type: NotificationType.Warning,
                id: nanoid(),
                message: "This network is not currently supported by LiFi",
                shouldExpire: true,
              },
            });
          }
        }
      }
    }
    //eslint-disable-next-line
  }, [tokenIn, tokenOut, chainId, account]);

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
