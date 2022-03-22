import { useLayer2 } from "layer2";
import React, { ReactNode, useCallback, useReducer } from "react";
import { Notification } from "./notifications.models";
import { notificationReducer } from "./reducer";
import { NotificationContext } from "./context";
import { nanoid } from "nanoid";

interface Props {
  children: ReactNode;
}

const DEFAULT_TIMEOUT = 5000; //ms

export function NotificationProvider({ children }: Props) {
  const [notifications, dispatch] = useReducer(notificationReducer, []);
  const { chainId, account } = useLayer2();

  // useEffect(() => {
  //   if (account && chainId) {
  //     dispatch({
  //       type: 'ADD_NOTIFICATION',
  //       chainId: chainId,
  //       notification: {
  //         type: 'walletConnected',
  //         id: nanoid(),
  //         submittedAt: Date.now(),
  //         address: account,
  //       },
  //     })
  //   }
  // }, [account, chainId])

  const addNotification = useCallback(
    ({ message, type }: Notification) => {
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
