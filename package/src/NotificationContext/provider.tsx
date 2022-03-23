import { chainIdToNetwork, useLayer2 } from "layer2";
import React, { ReactNode, useCallback, useEffect, useReducer } from "react";
import {
  AddNotificationPayload,
  NotificationType,
} from "./notifications.models";
import { notificationReducer } from "./reducer";
import { NotificationContext } from "./context";
import { nanoid } from "nanoid";
import { useTransactionContext } from "../TransactionContext/hooks";

interface Props {
  children: ReactNode;
}

const DEFAULT_TIMEOUT = 5000; //ms

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
      dispatch({
        type: "ADD_NOTIFICATION",
        notification: {
          type: NotificationType.Info,
          id: nanoid(),
          message: "Network Changed.",
        },
      });
    }
  }, [chainId]);

  useEffect(() => {
    if (chainId) {
      dispatch({
        type: "ADD_NOTIFICATION",
        notification: {
          type: NotificationType.Info,
          id: nanoid(),
          message: "Network Changed.",
        },
      });
    }
  }, [chainId]);

  const addNotification = useCallback(
    ({ message, type }: AddNotificationPayload) => {
      dispatch({
        type: "ADD_NOTIFICATION",
        notification: { message, type, id: nanoid() },
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

  return (
    <NotificationContext.Provider
      value={{ addNotification, notifications, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
