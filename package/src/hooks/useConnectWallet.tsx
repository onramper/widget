import { isMetamaskEnabled } from "layer2";
import { useLayer2 } from "../web3/config";
import { useCallback, useEffect, useState } from "react";
import {
  NotificationType,
  useWidgetNotifications,
} from "../NotificationContext";
import { isErrorWithMessage } from "../ApiContext/api";

interface ConnectWallet {
  disconnect: () => void;
  connect: () => void;
  connectionPending: boolean;
  error: Error | null;
}

export interface MetamaskError extends Error {
  code: number;
}

function isMetaMaskError(error: unknown): error is MetamaskError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string" &&
    "code" in error &&
    typeof (error as Record<string, unknown>).code === "number"
  );
}
export const useConnectWallet = (): ConnectWallet => {
  const { account, active, activateBrowserWallet, deactivate, error } =
    useLayer2();
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

  const handleError = useCallback(
    (error: MetamaskError) => {
      // here we can add custom wallet connection errors
      setConnectionError(error);

      if (
        error.message.includes("wallet_requestPermissions") ||
        error.message.includes("requestAccounts")
      ) {
        setConnectionPending(true);
        addNotification({
          type: NotificationType.Info,
          message: "Please open Metamask and Connect",
          shouldExpire: true,
        });
      } else {
        setConnectionPending(false);
        addNotification({
          type: NotificationType.Error,
          message: error.message,
          shouldExpire: true,
        });
      }
    },
    [addNotification]
  );

  useEffect(() => {
    if (error && isMetaMaskError(error)) {
      handleError(error);
    }
  }, [error, handleError]);

  const connect = useCallback(() => {
    if (isMetamaskEnabled()) {
      try {
        addNotification({
          type: NotificationType.Info,
          message: "Please open Metamask and Connect",
          shouldExpire: true,
        });
        setConnectionError(null);
        setConnectionPending(true);
        activateBrowserWallet();
      } catch (e) {
        if (isErrorWithMessage(e)) {
          setConnectionError(e as Error);
          if (e.message.includes("eth_requestAccounts")) {
            addNotification({
              type: NotificationType.Info,
              message: "Please open Metamask and Connect",
              shouldExpire: true,
            });
          }
        }
      }
    } else {
      addNotification({
        type: NotificationType.Error,
        message: "No wallet found on browser",
        shouldExpire: true,
      });
      setConnectionError(new Error("Metamask not enabled!"));
      setConnectionPending(false);
    }
  }, [activateBrowserWallet, addNotification]);

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
