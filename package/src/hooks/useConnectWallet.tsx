import { isMetamaskEnabled, useEthers } from "layer2";
import { useEffect, useState } from "react";
import {
  NotificationType,
  useWidgetNotifications,
} from "../NotificationContext";

interface ConnectWallet {
  disconnect: () => void;
  connect: () => void;
  connectionPending: boolean;
  error: Error | null;
}

export interface MetamaskError extends Error {
  code: number;
}

export const useConnectWallet = (): ConnectWallet => {
  const { account, active, activateBrowserWallet, deactivate, error } =
    useEthers();
  const [connectionError, setConnectionError] = useState<
    MetamaskError | Error | null
  >(null);

  const [connectionPending, setConnectionPending] = useState(false);
  const { addNotification } = useWidgetNotifications();

  useEffect(() => {
    if (active && account) {
      setConnectionPending(false);
    }
  }, [active, account]);

  useEffect(() => {
    if (error) {
      // here we can add custom wallet connection errors
      const metamaskError = error as MetamaskError;
      setConnectionError(metamaskError);
      setConnectionPending(false);
      addNotification({
        type: NotificationType.Error,
        message: metamaskError.message,
        shouldExpire: true,
      });
    }
  }, [addNotification, error]);

  const connect = () => {
    if (isMetamaskEnabled()) {
      addNotification({
        type: NotificationType.Info,
        message: "Please open Metamask and Connect",
        shouldExpire: true,
      });
      setConnectionError(null);
      setConnectionPending(true);
      activateBrowserWallet();
    } else {
      setConnectionError(new Error("Metamask not enabled!"));
      setConnectionPending(false);
    }
  };

  const disconnect = () => {
    setConnectionError(null);
    setConnectionPending(false);
    deactivate();
    addNotification({
      type: NotificationType.Info,
      message: "Wallet disconnected",
      shouldExpire: true,
    });
  };

  return {
    disconnect,
    connect,
    connectionPending,
    error: connectionError,
  };
};
